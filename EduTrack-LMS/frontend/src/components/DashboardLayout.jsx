
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../services/authService';

function DashboardLayout({ title, email, role, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = role === 'ADMIN';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
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

  const handleMenuItemClick = (e, item) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const targetDashboard = isAdmin ? '/admin-dashboard' : '/student-dashboard';

    if (location.pathname !== targetDashboard) {
      navigate(`${targetDashboard}${item.href}`);
    } else {
      if (item.href === '#top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#f4f7fb' }}>
      <div className="d-flex flex-grow-1">
        {/* Desktop Sidebar */}
        <aside
          className="text-white d-none d-md-flex flex-column shadow-sm"
          style={{
            width: '260px',
            minWidth: '260px',
            background: 'linear-gradient(180deg, #102a43 0%, #0d1e2d 100%)',
            position: 'sticky',
            top: 0,
            height: '100vh',
            zIndex: 1000
          }}
        >
          <div className="p-4 border-bottom border-secondary border-opacity-25">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary fs-5 px-2 py-1 rounded-3">ET</span>
              <div>
                <h4 className="fw-bold mb-0 text-white">EduTrack</h4>
                <small className="text-white-50" style={{ fontSize: '11px' }}>
                  LMS PORTAL
                </small>
              </div>
            </div>
          </div>

          <div className="px-3 py-4 flex-grow-1 overflow-auto">
            <small className="text-white-50 text-uppercase fw-semibold px-2" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
              Main Navigation
            </small>

            <nav className="mt-3">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleMenuItemClick(e, item)}
                  className="d-flex align-items-center gap-3 text-decoration-none text-white rounded-3 px-3 py-2 mb-2 transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="p-3 border-top border-secondary border-opacity-25">
            <div className="d-flex align-items-center gap-2 mb-3 px-1">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                style={{ width: '36px', height: '36px', background: '#176b87', fontSize: '14px' }}
              >
                {email ? email.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <div className="text-truncate small fw-semibold text-white">{email}</div>
                <span className={`badge ${isAdmin ? 'bg-danger' : 'bg-success'}`} style={{ fontSize: '10px' }}>
                  {role}
                </span>
              </div>
            </div>

            <button
              className="btn btn-outline-light btn-sm w-100"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <div className="flex-grow-1 d-flex flex-column min-w-0" id="top">
          {/* Top Header */}
          <header className="bg-white shadow-sm px-3 px-md-4 py-3 d-flex justify-content-between align-items-center sticky-top">
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm btn-outline-secondary d-md-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation"
              >
                ☰
              </button>
              <div>
                <h5 className="fw-bold mb-0" style={{ color: '#102a43' }}>
                  {title}
                </h5>
                <small className="text-muted d-none d-sm-inline">
                  EduTrack Learning Management System
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="text-end d-none d-sm-block">
                <div className="fw-semibold small text-truncate" style={{ maxWidth: '200px' }}>
                  {email}
                </div>
                <span className={`badge ${isAdmin ? 'bg-danger-subtle text-danger border border-danger-subtle' : 'bg-primary-subtle text-primary border border-primary-subtle'}`}>
                  {role}
                </span>
              </div>

              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </header>

          {/* Mobile Collapsible Navigation Menu */}
          {mobileMenuOpen && (
            <div className="d-md-none bg-dark text-white p-3 border-bottom shadow">
              <div className="small text-white-50 mb-2">Navigation Menu</div>
              <div className="d-flex flex-column gap-2">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={(e) => handleMenuItemClick(e, item)}
                    className="btn btn-sm btn-outline-light text-start d-flex align-items-center gap-2"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Content Viewport */}
          <main className="container-fluid p-3 p-md-4 flex-grow-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
