
import DashboardLayout from '../components/DashboardLayout';
import CourseCatalog from '../components/CourseCatalog';
import MyCourses from '../components/MyCourses';
import { getCurrentUser } from '../services/authService';

function StudentDashboard() {
  const user = getCurrentUser();

  const email = user?.email || 'Student';
  const studentId = user?.id;

  return (
    <DashboardLayout
      title="Student Dashboard"
      email={email}
      role="STUDENT"
    >
      <div className="dashboard-card mb-4">
        <h4 className="fw-bold">Welcome, Student!</h4>
        <p className="text-muted mb-0">
          Explore available courses, enroll in courses, and manage
          your learning journey.
        </p>
      </div>

      <section id="my-courses" className="mb-5">
        <MyCourses
          studentId={studentId}
          email={email}
        />
      </section>

      <hr className="my-5" />

      <section id="course-catalog" className="mb-5">
        <CourseCatalog studentId={studentId} />
      </section>
    </DashboardLayout>
  );
}

export default StudentDashboard;
