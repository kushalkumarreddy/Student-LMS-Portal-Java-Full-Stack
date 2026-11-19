
import { useEffect, useState } from 'react';
import {
  getAllStudents,
  deleteStudent
} from '../services/studentService';

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      setError('Unable to load students. Check whether the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleDelete = async (id, email) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${email}?`
    );

    if (!confirmed) return;

    try {
      await deleteStudent(id);
      setMessage('Student deleted successfully.');
      setStudents((previous) =>
        previous.filter((student) => student.id !== id)
      );
    } catch (err) {
      setError('Unable to delete student.');
    }
  };

  return (
    <div className="dashboard-card student-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4>Student Management</h4>
          <p>View and manage registered students.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={loadStudents}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students registered yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.email}</td>
                  <td>
                    <span className="badge bg-success">
                      {student.role}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        handleDelete(student.id, student.email)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentManagement;
