
import { useEffect, useState } from 'react';

import { getAllCourses } from '../services/courseService';

import {
  getLessonsByCourse,
  addLesson,
  updateLesson,
  deleteLesson
} from '../services/lessonService';

function LessonManagement() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const [lessons, setLessons] = useState([]);

  const [lessonId, setLessonId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [lessonOrder, setLessonOrder] = useState(1);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadLessons(selectedCourseId);
    } else {
      setLessons([]);
    }
  }, [selectedCourseId]);

  const loadCourses = async () => {
    try {
      setError('');

      const data = await getAllCourses();

      setCourses(data);

      if (data.length > 0) {
        setSelectedCourseId(String(data[0].id));
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load courses. Please check the backend.'
      );
    }
  };

  const loadLessons = async (courseId) => {
    try {
      setLoading(true);
      setError('');

      const data = await getLessonsByCourse(courseId);

      setLessons(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load lessons.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLessonId(null);
    setTitle('');
    setContent('');
    setLessonOrder(lessons.length + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!selectedCourseId) {
      setError('Please select a course.');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a lesson title.');
      return;
    }

    const lessonData = {
      title: title.trim(),
      content: content.trim(),
      lessonOrder: Number(lessonOrder),
      courseId: Number(selectedCourseId)
    };

    try {
      setSaving(true);

      if (lessonId) {
        await updateLesson(lessonId, lessonData);
        setSuccess('Lesson updated successfully.');
      } else {
        await addLesson(lessonData);
        setSuccess('Lesson added successfully.');
      }

      resetForm();
      await loadLessons(selectedCourseId);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to save lesson. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (lesson) => {
    setLessonId(lesson.id);
    setTitle(lesson.title || '');
    setContent(lesson.content || '');
    setLessonOrder(lesson.lessonOrder || 1);

    setError('');
    setSuccess('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this lesson?'
    );

    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');

      await deleteLesson(id);

      setSuccess('Lesson deleted successfully.');

      if (lessonId === id) {
        resetForm();
      }

      await loadLessons(selectedCourseId);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to delete lesson.'
      );
    }
  };

  return (
    <div className="container-fluid px-0">

      <div className="mb-4">
        <h3 className="fw-bold">Lesson Management</h3>
        <p className="text-muted">
          Create and manage lessons for your courses.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="alert alert-info">
          No courses are available. Please create a course first.
        </div>
      ) : (
        <>
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">

              <h5 className="fw-bold mb-3">
                {lessonId ? 'Edit Lesson' : 'Add New Lesson'}
              </h5>

              <form onSubmit={handleSubmit}>

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Select Course
                    </label>

                    <select
                      className="form-select"
                      value={selectedCourseId}
                      onChange={(e) => {
                        setSelectedCourseId(e.target.value);
                        resetForm();
                        setSuccess('');
                        setError('');
                      }}
                      required
                    >
                      {courses.map((course) => (
                        <option
                          key={course.id}
                          value={course.id}
                        >
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Lesson Title
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter lesson title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Lesson Order
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={lessonOrder}
                      onChange={(e) => setLessonOrder(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">
                      Lesson Content
                    </label>

                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Enter lesson content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>

                </div>

                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : lessonId
                      ? 'Update Lesson'
                      : 'Add Lesson'}
                </button>

                {lessonId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}

              </form>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <h5 className="fw-bold mb-0">
                  Course Lessons
                </h5>

                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => loadLessons(selectedCourseId)}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" />
                  <p className="mt-2 text-muted">
                    Loading lessons...
                  </p>
                </div>
              ) : lessons.length === 0 ? (
                <div className="text-center py-4">
                  <h6>No lessons found</h6>
                  <p className="text-muted mb-0">
                    Add the first lesson for this course.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">

                    <thead className="table-light">
                      <tr>
                        <th>Order</th>
                        <th>Lesson Title</th>
                        <th>Content</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {lessons.map((lesson) => (
                        <tr key={lesson.id}>

                          <td>{lesson.lessonOrder}</td>

                          <td className="fw-semibold">
                            {lesson.title}
                          </td>

                          <td>
                            <span className="text-muted">
                              {lesson.content
                                ? lesson.content.length > 70
                                  ? `${lesson.content.substring(0, 70)}...`
                                  : lesson.content
                                : 'No content'}
                            </span>
                          </td>

                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-2 mb-1"
                              onClick={() => handleEdit(lesson)}
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger mb-1"
                              onClick={() => handleDelete(lesson.id)}
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
          </div>
        </>
      )}

    </div>
  );
}

export default LessonManagement;
