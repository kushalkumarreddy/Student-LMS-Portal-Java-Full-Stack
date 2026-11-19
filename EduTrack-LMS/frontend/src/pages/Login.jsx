
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerStudent } from '../services/authService';

function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (isRegister && password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        await registerStudent(email.trim(), password);

        setSuccess('Registration successful. You can now sign in.');
        setIsRegister(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        const data = await loginUser(email.trim(), password);

        if (data.role === 'ADMIN') {
          navigate('/admin-dashboard', {
            replace: true,
            state: {
              id: data.id,
              email: data.email
            }
          });
        } else if (data.role === 'STUDENT') {
          navigate('/student-dashboard', {
            replace: true,
            state: {
              id: data.id,
              email: data.email
            }
          });
        } else {
          setError('Your account does not have a valid role.');
        }
      }
    } catch (err) {
      const message = err.response?.data;
      setError(
        typeof message === 'string'
          ? message
          : message?.message || 'Unable to process your request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        background: 'linear-gradient(135deg, #102a43, #176b87, #64ccc5)'
      }}
    >
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div className="row shadow-lg rounded-4 overflow-hidden bg-white">

          <div
            className="col-lg-6 d-none d-lg-flex flex-column justify-content-center text-white p-5"
            style={{
              background: 'linear-gradient(145deg, #102a43, #176b87)'
            }}
          >
            <h1 className="fw-bold mb-3">EduTrack</h1>

            <h2 className="fw-semibold mb-3">
              Learn. Grow. Succeed.
            </h2>

            <p className="fs-5 text-white-50">
              Your learning journey starts here. Access courses,
              track your progress and achieve your academic goals.
            </p>

            <div className="mt-4">
              <div className="mb-3">
                <span className="me-2">✓</span>
                Easy course access
              </div>

              <div className="mb-3">
                <span className="me-2">✓</span>
                Manage your learning
              </div>

              <div>
                <span className="me-2">✓</span>
                Learn at your own pace
              </div>
            </div>

            <div className="mt-auto pt-5 text-white-50 small">
              Education Management Portal
            </div>
          </div>

          <div className="col-lg-6 p-4 p-md-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold" style={{ color: '#102a43' }}>
                {isRegister ? 'Create Account' : 'Welcome Back!'}
              </h2>

              <p className="text-muted">
                {isRegister
                  ? 'Register as a student to start learning'
                  : 'Sign in to continue to EduTrack LMS'}
              </p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Email Address
                </label>

                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {isRegister && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-lg w-100 text-white fw-semibold mt-3"
                disabled={loading}
                style={{ backgroundColor: '#176b87' }}
              >
                {loading
                  ? 'Please wait...'
                  : isRegister
                    ? 'Create Account'
                    : 'Sign In'}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted">
                {isRegister
                  ? 'Already have an account? '
                  : "Don't have an account? "}
              </span>

              <button
                type="button"
                className="btn btn-link p-0 fw-semibold text-decoration-none"
                onClick={switchMode}
                style={{ color: '#176b87' }}
              >
                {isRegister ? 'Sign In' : 'Register'}
              </button>
            </div>

            {!isRegister && (
              <div className="text-center mt-4">
                <small className="text-muted">
                  Contact your administrator if you need help
                  accessing your account.
                </small>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
