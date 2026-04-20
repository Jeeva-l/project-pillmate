import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Login.css';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="split-login-container">
            {/* LEFT SIDE: Full Image Panel */}
            <div className="login-image-pane" />

            {/* RIGHT SIDE: Application Login Form */}
            <div className="login-form-pane">
                <div className="modern-auth-card">
                    <img src="/images/pillmate-logo.png" alt="PillMate Logo" className="mobile-logo" />
                    <h2 className="modern-auth-title">Welcome Back</h2>
                    <p className="modern-auth-subtitle">Please enter your details to sign in.</p>

                    {error && <div className="modern-error-msg">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="modern-form-group">
                            <label htmlFor="login-email">Email Address</label>
                            <input
                                id="login-email"
                                type="email"
                                className="modern-input"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="modern-form-group">
                            <label htmlFor="login-password">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="modern-input"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    required
                                />
                                <span
                                    className="password-toggle-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </span>
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '8px' }}>
                                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#3182ce', textDecoration: 'none', fontWeight: '500' }}>Forgot Password?</Link>
                            </div>
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            className="modern-btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="modern-auth-footer">
                        Don't have an account?{' '}
                        <Link to="/signup">Create one here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
