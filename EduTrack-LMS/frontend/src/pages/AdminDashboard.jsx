
import DashboardLayout from '../components/DashboardLayout';
import StudentManagement from '../components/StudentManagement';
import CourseManagement from '../components/CourseManagement';
import LessonManagement from '../components/LessonManagement';
import { getCurrentUser } from '../services/authService';

function AdminDashboard() {
  const user = getCurrentUser();
  const email = user?.email || 'admin@edutrack.com';

  return (
    <DashboardLayout
      title="Admin Dashboard"
      email={email}
      role="ADMIN"
    >
      <div className="dashboard-card mb-4">
        <h4 className="fw-bold">Welcome, Admin!</h4>
        <p className="text-muted mb-0">
          Manage students, courses, and lessons from one place.
        </p>
      </div>

      <section id="students" className="mb-5">
        <StudentManagement />
      </section>

      <hr className="my-5" />

      <section id="courses" className="mb-5">
        <CourseManagement />
      </section>

      <hr className="my-5" />

      <section id="lessons" className="mb-5">
        <LessonManagement />
      </section>
    </DashboardLayout>
  );
}

export default AdminDashboard;
