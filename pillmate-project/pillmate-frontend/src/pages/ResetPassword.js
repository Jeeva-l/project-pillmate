import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';
import './Login.css';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const presetEmail = searchParams.get('email') || '';
    const navigate = useNavigate();

    const [email, setEmail] = useState(presetEmail);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const response = await resetPassword({
                email,
                otp,
                newPassword
            });
            setMessage(response.data.message || 'Password reset successful.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
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
                    <h2 className="modern-auth-title">Reset Password</h2>
                    <p className="modern-auth-subtitle">Enter your email, the 6-digit OTP, and your new password.</p>

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

                        <div className="modern-form-group">
                            <label htmlFor="reset-otp">6-Digit OTP</label>
                            <input
                                id="reset-otp"
                                type="text"
                                className="modern-input"
                                placeholder="123456"
                                value={otp}
                                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                inputMode="numeric"
                                maxLength={6}
                                required
                            />
                        </div>

                        <div className="modern-form-group">
                            <label htmlFor="new-password">New Password</label>
                            <input
                                id="new-password"
                                type="password"
                                className="modern-input"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="modern-form-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input
                                id="confirm-password"
                                type="password"
                                className="modern-input"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="modern-btn-primary"
                            disabled={loading || !!message}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>

                    <div className="modern-auth-footer">
                        Need a new OTP?{' '}
                        <Link to="/forgot-password">Request it here</Link>
                    </div>

                    <div className="modern-auth-footer">
                        Remember your password?{' '}
                        <Link to="/login">Sign in here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
