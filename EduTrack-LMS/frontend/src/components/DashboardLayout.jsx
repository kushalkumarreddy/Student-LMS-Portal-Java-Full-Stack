
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';

function DashboardLayout({ title, email, role, children }) {
  const navigate = useNavigate();
  const isAdmin = role === 'ADMIN';

  const handleLogout = () => {
    logoutUser();
    navigate('/', { replace: true });
  };

  const menuItems = isAdmin
    ? [
        { label: 'Dashboard', href: '#top', icon: '⌂' },
        { label: 'Students', href: '#students', icon: '♙' },
        { label: 'Courses', href: '#courses', icon: '▤' },
        { label: 'Lessons', href: '#lessons', icon: '▣' }
      ]
    : [
        { label: 'Dashboard', href: '#top', icon: '⌂' },
        { label: 'My Courses', href: '#my-courses', icon: '▤' },
        { label: 'Explore Courses', href: '#course-catalog', icon: '▣' }
      ];

  return (
    <div className="min-vh-100" style={{ background: '#f4f7fb' }}>
      <div className="d-flex min-vh-100">

        <aside
          className="text-white d-none d-md-flex flex-column"
          style={{
            width: '250px',
            minWidth: '250px',
            background: '#102a43'
          }}
        >
          <div className="p-4 border-bottom border-secondary">
            <h3 className="fw-bold mb-0">EduTrack</h3>
            <small className="text-white-50">
              Learning Management System
            </small>
          </div>

          <div className="px-3 py-4">
            <small className="text-white-50 text-uppercase fw-semibold">
              Main Menu
            </small>

            <nav className="mt-3">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="d-flex align-items-center gap-3 text-decoration-none text-white rounded-3 px-3 py-3 mb-2"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-3 border-top border-secondary">
            <div className="small text-white-50 mb-2">
              Signed in as
            </div>
            <div className="text-break small mb-3">{email}</div>
            <button
              className="btn btn-outline-light w-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-grow-1" id="top">
          <header className="bg-white shadow-sm px-3 px-md-4 py-3 d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-bold mb-0" style={{ color: '#102a43' }}>
                {title}
              </h4>
              <small className="text-muted">Welcome to EduTrack</small>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="text-end d-none d-sm-block">
                <div className="fw-semibold small">{email}</div>
                <small className="text-muted">{role}</small>
              </div>

              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </header>

          <div className="container-fluid p-3 p-md-4">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;
