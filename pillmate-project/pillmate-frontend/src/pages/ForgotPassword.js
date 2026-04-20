import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import './Login.css'; // Reuse login styles

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const response = await forgotPassword({ email });
            setMessage(response.data.message || 'OTP sent to your email.');
            setTimeout(() => {
                navigate(`/reset-password?email=${encodeURIComponent(email)}`);
            }, 800);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="split-login-container">
            <div className="login-image-pane" />
            <div className="login-form-pane">
                <div className="modern-auth-card">
                    <img src="/images/pillmate-logo.png" alt="PillMate Logo" className="mobile-logo" />
                    <h2 className="modern-auth-title">Forgot Password</h2>
                    <p className="modern-auth-subtitle">Enter your email to receive a 6-digit OTP.</p>

                    {error && <div className="modern-error-msg">{error}</div>}
                    {message && <div className="modern-error-msg" style={{ backgroundColor: '#f0fff4', color: '#2f855a', borderColor: '#c6f6d5' }}>{message}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="modern-form-group">
                            <label htmlFor="reset-email">Email Address</label>
                            <input
                                id="reset-email"
                                type="email"
                                className="modern-input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="modern-btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>

                    <div className="modern-auth-footer">
                        Remember your password?{' '}
                        <Link to="/login">Sign in here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
