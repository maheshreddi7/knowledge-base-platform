import React, { useState } from 'react';
import './Auth.css';

const Register = ({ onLogin, switchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', formData.email);
        onLogin(data.token);
      } else {
        setError(data || 'Registration failed. Please try again.');
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
          <div className="logo-icon" style={{ background: '#e3f0ff', borderRadius: '50%', padding: 0, width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src="/figga-logo.png.webp" alt="Frigga Logo" style={{ height: '24px', width: '24px', background: 'transparent', borderRadius: '50%' }} />
          </div>
          <h1 className="company-name">Frigga Cloud Labs</h1>
        </div>
        <p className="company-tagline">Knowledge Base Platform</p>
      </div>
      
      <div className="auth-card">
        <div className="auth-card-header">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join our knowledge base platform today</p>
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
                placeholder="Create a strong password"
                minLength="6"
                className="auth-input"
              />
            </div>
            <small className="password-hint">Minimum 6 characters</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon"></span>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                minLength="6"
                className="auth-input"
              />
            </div>
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <span className="button-content">
                <span className="spinner"></span>
                Creating account...
              </span>
            ) : (
              <span className="button-content">
                <span className="button-icon">✨</span>
                Create Account
              </span>
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <div className="divider">
            <span>or</span>
          </div>
          <p className="switch-text">
            Already have an account?{' '}
            <button type="button" onClick={switchToLogin} className="link-button">
              Sign in here
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

export default Register; 