
import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import CourseCatalog from '../components/CourseCatalog';
import MyCourses from '../components/MyCourses';
import { getCurrentUser } from '../services/authService';

function StudentDashboard() {
  const user = getCurrentUser();

  const email = user?.email || 'Student';
  const studentId = user?.id;

  const [refreshEnrollmentKey, setRefreshEnrollmentKey] = useState(0);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [totalCoursesCount, setTotalCoursesCount] = useState(0);

  const handleEnrolled = () => {
    setRefreshEnrollmentKey((prev) => prev + 1);
  };

  return (
    <DashboardLayout
      title="Student Dashboard"
      email={email}
      role="STUDENT"
    >
      {/* Welcome Banner */}
      <div
        className="rounded-4 p-4 p-md-5 mb-4 text-white shadow-sm position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #102a43 0%, #176b87 100%)'
        }}
      >
        <div className="position-relative" style={{ zIndex: 1 }}>
          <span className="badge bg-white text-dark mb-2 px-3 py-2 fw-semibold">Student Portal</span>
          <h2 className="fw-bold mb-2">Welcome back, {email.split('@')[0]}!</h2>
          <p className="text-white-50 mb-0 fs-6" style={{ maxWidth: '650px' }}>
            Continue expanding your skills. Explore available courses, enroll with a single click,
            and study at your own pace.
          </p>
        </div>
      </div>

      {/* Dashboard Summary Metric Cards */}
      <div className="row g-3 mb-5">
        <div className="col-sm-6 col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center text-primary"
                style={{ width: '56px', height: '56px', background: '#e0f2fe', fontSize: '26px' }}
              >
                🎓
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '11px' }}>
                  My Enrolled Courses
                </div>
                <h3 className="fw-bold mb-0 text-dark">{enrolledCount}</h3>
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
                  Available in Catalog
                </div>
                <h3 className="fw-bold mb-0 text-dark">{totalCoursesCount}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-12 col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center text-warning"
                style={{ width: '56px', height: '56px', background: '#fef3c7', fontSize: '26px' }}
              >
                ⚡
              </div>
              <div>
                <div className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '11px' }}>
                  Active Status
                </div>
                <h6 className="fw-bold mb-0 text-success">Active & Learning</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <section id="my-courses" className="mb-5">
        <MyCourses
          studentId={studentId}
          email={email}
          refreshKey={refreshEnrollmentKey}
          onCountChange={setEnrolledCount}
        />
      </section>

      <hr className="my-5 opacity-25" />

      {/* Course Catalog Section */}
      <section id="course-catalog" className="mb-5">
        <CourseCatalog
          studentId={studentId}
          onEnrolled={handleEnrolled}
          onCountChange={setTotalCoursesCount}
        />
      </section>
    </DashboardLayout>
  );
}

export default StudentDashboard;
