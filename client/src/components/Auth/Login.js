import React, { useState } from 'react';
import './Auth.css';

const Login = ({ onLogin, switchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', formData.email);
        onLogin(data.token);
      } else {
        setError(data || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <h1 className="company-name">Frigga Cloud Labs</h1>
        </div>
        <p className="company-tagline">Knowledge Base Platform</p>
      </div>
      
      <div className="auth-card">
        <div className="auth-card-header">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon"></span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
                className="auth-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon"></span>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="auth-input"
              />
            </div>
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <span className="button-content">
                <span className="spinner"></span>
                Signing in....
              </span>
            ) : (
              <span className="button-content">
                <span className="button-icon">🚀</span>
                Sign In
              </span>
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <div className="divider">
            <span>or</span>
          </div>
          <p className="switch-text">
            Don't have an account?{' '}
            <button type="button" onClick={switchToRegister} className="link-button">
              Create one now
            </button>
          </p>
        </div>
      </div>
      
      <div className="auth-footer-bottom">
        <p>&copy; 2024 Frigga Cloud Labs. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login; 