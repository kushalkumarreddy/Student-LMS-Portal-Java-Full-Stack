
import { useEffect, useState } from 'react';
import {
  getAllStudents,
  deleteStudent
} from '../services/studentService';

function StudentManagement({ onCountChange }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAllStudents();
      const list = data || [];
      setStudents(list);
      if (onCountChange) {
        onCountChange(list.length);
      }
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === 'string'
          ? data
          : data?.message || 'Unable to load students. Check whether the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleDelete = async (id, email) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete student account "${email}"? This will also remove their enrollment records.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError('');
      setMessage('');

      await deleteStudent(id);
      setMessage(`Student "${email}" deleted successfully.`);

      const updated = students.filter((student) => student.id !== id);
      setStudents(updated);
      if (onCountChange) {
        onCountChange(updated.length);
      }
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === 'string'
          ? data
          : data?.message || 'Unable to delete student.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
      <div className="card-header bg-white p-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h5 className="fw-bold mb-1" style={{ color: '#102a43' }}>
            Registered Students
          </h5>
          <p className="text-muted small mb-0">
            View and manage active student accounts across the LMS platform.
          </p>
        </div>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={loadStudents}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      <div className="p-4">
        {message && (
          <div className="alert alert-success shadow-sm alert-dismissible fade show" role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')} />
          </div>
        )}

        {error && (
          <div className="alert alert-danger shadow-sm alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')} />
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="text-muted mt-3">Loading student records...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div className="fs-1 mb-2">👥</div>
            <h6>No registered students yet</h6>
            <p className="small mb-0">New students who register through the login page will appear here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Student Email</th>
                  <th>Role</th>
                  <th className="text-end" style={{ width: '120px' }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary font-monospace">
                        #{student.id}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-primary bg-primary-subtle fw-bold"
                          style={{ width: '32px', height: '32px', fontSize: '13px' }}
                        >
                          {student.email ? student.email.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <strong className="text-dark">{student.email}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                        {student.role}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(student.id, student.email)}
                        disabled={deletingId === student.id}
                      >
                        {deletingId === student.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentManagement;
