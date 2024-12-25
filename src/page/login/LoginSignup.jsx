import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './index.scoped.scss';

const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const LoginSignup = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleLoginSuccess = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', data.roleId.toString());
    localStorage.setItem('staffId', data.userId);
    navigate(data.roleId === 1 ? '/dashboard/overview' : '/');
  };

  const handleRegisetrSuccess = (data) => {
    toast.success(data.message);
    setFormValues({ email: '', password: '', confirmPassword: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formValues;

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    const url = isLogin ? '/auth/login' : '/auth/register';
    try {
      const res = await axios.post(`${baseUrl}${url}`, { email, password });
      if (res?.data?.success) {
        if (isLogin) {
          handleLoginSuccess(res.data);
        } else {
          handleRegisetrSuccess(res.data);
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message || (isLogin ? 'Login failed' : 'Registration failed');
      toast.error(message);
    }
  };

  const handleToggle = () => {
    setIsLogin((prev) => !prev);
    setFormValues({ email: '', password: '', confirmPassword: '' });
    setError('');
  };

  return (
    <div className="login-signup m-auto w-50">
      <div className="form__container d-flex flex-column w-75 justify-content-center">
        <h1 className="fw-bold">
          {isLogin ? 'Welcome to the Personal Profile Management System' : 'Register an Account'}
        </h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corporis alias harum ipsam
          labore numquam vitae ullam incidunt voluptatum, nisi, consequatur assumenda totam ab magni
          omnis distinctio, vero corrupti possimus facilis!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 w-75">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              className="form-control"
              id="email"
              onChange={handleChange}
              required
              value={formValues.email}
            />
            <div className="form-text">
              {!isLogin && 'We will never share your email with anyone else.'}
            </div>
          </div>

          <div className="mb-3 w-75">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="form-control"
              id="password"
              onChange={handleChange}
              required
              value={formValues.password}
            />
          </div>

          {isLogin && (
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="rememberPassword" />
              <label className="form-check-label" htmlFor="rememberPassword">
                Remember Password
              </label>
            </div>
          )}

          {!isLogin && (
            <>
              <div className="mb-3">
                <label htmlFor="confirm__password" className="form-label">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  className="form-control"
                  id="confirm__password"
                  onChange={handleChange}
                  required
                  value={formValues.confirmPassword}
                />
                {error && <p className="mt-2 error">{error}</p>}
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="termsCheck" required />
                <label className="form-check-label" htmlFor="termsCheck">
                  By creating an account, I agree to the Terms of Use and Privacy Policy.
                </label>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary mb-3">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p>
          {isLogin ? "You don't have an account yet?" : 'You already have an account?'}
          <a onClick={handleToggle} href="#">
            {isLogin ? ' Sign Up' : ' Login'}
          </a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginSignup;
