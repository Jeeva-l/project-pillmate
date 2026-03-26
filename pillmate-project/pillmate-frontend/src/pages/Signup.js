import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, form.phone);
            setSuccess('Account created! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1800);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-logo">
                    <span className="logo-icon text-primary"><i className="bi bi-capsule"></i></span>
                    <h1>PillMate</h1>
                    <p>Smart Medication Reminder</p>
                </div>
                <h2 className="auth-title">Create Account</h2>
                {error && <div className="error-msg">{error}</div>}
                {success && <div className="success-msg">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input id="signup-name" type="text" className="form-control" placeholder="John Doe"
                            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input id="signup-email" type="email" className="form-control" placeholder="you@example.com"
                            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone (Optional)</label>
                        <input id="signup-phone" type="tel" className="form-control" placeholder="+91 9876543210"
                            value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input id="signup-password" type="password" className="form-control" placeholder="Min. 6 characters"
                            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                    </div>
                    <button id="signup-submit" type="submit" className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
