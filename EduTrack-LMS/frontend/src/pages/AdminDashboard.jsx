
import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StudentManagement from '../components/StudentManagement';
import CourseManagement from '../components/CourseManagement';
import LessonManagement from '../components/LessonManagement';
import { getCurrentUser } from '../services/authService';

function AdminDashboard() {
  const user = getCurrentUser();
  const email = user?.email || 'admin@edutrack.com';

  const [courseVersion, setCourseVersion] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);

  const handleCoursesUpdated = () => {
    setCourseVersion((prev) => prev + 1);
  };

  return (
    <DashboardLayout
      title="Admin Dashboard"
      email={email}
      role="ADMIN"
    >
      {/* Welcome Banner */}
      <div
        className="rounded-4 p-4 p-md-5 mb-4 text-white shadow-sm position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #102a43 0%, #176b87 100%)'
        }}
      >
        <div className="position-relative" style={{ zIndex: 1 }}>
          <span className="badge bg-danger mb-2 px-3 py-2 fw-semibold">LMS Administrator</span>
          <h2 className="fw-bold mb-2">Welcome to Admin Portal</h2>
          <p className="text-white-50 mb-0 fs-6" style={{ maxWidth: '650px' }}>
            Comprehensive LMS control center. Manage enrolled students, publish courses,
            organize curriculum lessons, and monitor educational operations.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="row g-3 mb-5">
        <div className="col-sm-6 col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center text-primary"
                style={{ width: '56px', height: '56px', background: '#e0f2fe', fontSize: '26px' }}
              >
                👥
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '11px' }}>
                  Registered Students
                </div>
                <h3 className="fw-bold mb-0 text-dark">{studentCount}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center text-success"
                style={{ width: '56px', height: '56px', background: '#dcfce7', fontSize: '26px' }}
              >
                📚
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '11px' }}>
                  Published Courses
                </div>
                <h3 className="fw-bold mb-0 text-dark">{courseCount}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-12 col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center text-danger"
                style={{ width: '56px', height: '56px', background: '#fee2e2', fontSize: '26px' }}
              >
                🛡️
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '11px' }}>
                  Admin Authorization
                </div>
                <h6 className="fw-bold mb-0 text-danger">Full Control Active</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Section */}
      <section id="students" className="mb-5">
        <StudentManagement onCountChange={setStudentCount} />
      </section>

      <hr className="my-5 opacity-25" />

      {/* Courses Section */}
      <section id="courses" className="mb-5">
        <CourseManagement
          onCoursesUpdated={handleCoursesUpdated}
          onCountChange={setCourseCount}
        />
      </section>

      <hr className="my-5 opacity-25" />

      {/* Lessons Section */}
      <section id="lessons" className="mb-5">
        <LessonManagement courseVersion={courseVersion} />
      </section>
    </DashboardLayout>
  );
}

export default AdminDashboard;
