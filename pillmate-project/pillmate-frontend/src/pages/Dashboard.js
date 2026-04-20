import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // ✅ added useLocation
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getActiveMedicines, getStats, logIntake } from '../services/api';
import {
    getBrowserNotificationPermission,
    registerBrowserPushNotificationsWithOptions,
} from '../services/pushNotifications';

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // ✅ NEW

    const [medicines, setMedicines] = useState([]);
    const [stats, setStats] = useState({ taken: 0, missed: 0, skipped: 0 });
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState([]);
    const [notificationPermission, setNotificationPermission] = useState(getBrowserNotificationPermission());
    const [notificationLoading, setNotificationLoading] = useState(false);

    const addToast = (msg, type = 'success') => {
        const id = Date.now();
        setToasts(t => [...t, { id, msg, type }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
    };

    // ✅ REUSABLE LOAD FUNCTION (NEW)
    const loadData = async () => {
        if (!user) return;
        try {
            const [medsRes, statsRes] = await Promise.all([
                getActiveMedicines(user.id),
                getStats(user.id),
            ]);
            setMedicines(medsRes.data);
            setStats(statsRes.data);
        } catch {
            addToast("Failed to load data", "error");
        } finally {
            setLoading(false);
        }
    };

    // ✅ UPDATED useEffect (KEY FIX)
    useEffect(() => {
        loadData();
    }, [user, location.state]); // 🔥 refresh on navigation

    useEffect(() => {
        setNotificationPermission(getBrowserNotificationPermission());
    }, []);

    const handleMark = async (medicine, status) => {
        try {
            await logIntake({
                userId: user.id,
                medicineId: medicine.id,
                medicineName: medicine.name,
                status,
                takenAt: new Date().toISOString(),
            });
            addToast(`${medicine.name} marked as ${status}`, status === 'TAKEN' ? 'success' : 'warning');

            // refresh stats
            const statsRes = await getStats(user.id);
            setStats(statsRes.data);

        } catch {
            addToast('Could not log intake.', 'error');
        }
    };

    const handleEnableNotifications = async () => {
        if (!user?.id) {
            return;
        }

        setNotificationLoading(true);

        try {
            const token = await registerBrowserPushNotificationsWithOptions(user.id, { requestPermission: true });
            const permission = getBrowserNotificationPermission();
            setNotificationPermission(permission);

            if (token) {
                addToast('Browser notifications enabled successfully.');
                return;
            }

            if (permission === 'denied') {
                addToast('Notifications are blocked for this site. Please enable them in browser settings.', 'warning');
                return;
            }

            addToast('Notification permission was not granted.', 'warning');
        } catch {
            addToast('Could not enable notifications.', 'error');
        } finally {
            setNotificationLoading(false);
        }
    };

    const chartData = [
        { name: 'Taken', value: Number(stats.taken) || 0 },
        { name: 'Missed', value: Number(stats.missed) || 0 },
        { name: 'Skipped', value: Number(stats.skipped) || 0 },
    ].filter(d => d.value > 0);

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="page-container">
            {/* Toasts */}
            <div className="toast-container">
                {toasts.map(t => (
                    <div key={t.id} className={`toast ${t.type}`}>
                        <span>
                            {t.type === 'success'
                                ? <i className="bi bi-check-circle-fill text-success"></i>
                                : t.type === 'warning'
                                    ? <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                                    : <i className="bi bi-x-circle-fill text-danger"></i>}
                        </span>
                        <span>{t.msg}</span>
                    </div>
                ))}
            </div>

            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <i className="bi bi-hand-wave-fill text-warning"></i> Hello, {user?.name?.split(' ')[0]}!
                    </h1>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>{today}</p>
                </div>
                <Link to="/medicines/add" className="btn btn-primary">+ Add Medicine</Link>
            </div>

            {notificationPermission !== 'granted' && (
                <div className="notification-banner">
                    <div>
                        <div className="notification-banner-title">Enable browser reminders</div>
                        <div className="notification-banner-text">
                            Turn on notifications to receive PillMate reminders in this browser.
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleEnableNotifications}
                        disabled={notificationLoading}
                    >
                        <i className="bi bi-bell-fill"></i>
                        {notificationLoading ? 'Enabling...' : 'Enable Notifications'}
                    </button>
                </div>
            )}

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#dbeafe', color: 'var(--primary)' }}>
                        <i className="bi bi-capsule"></i>
                    </div>
                    <div className="stat-value" style={{ color: 'var(--primary)' }}>{medicines.length}</div>
                    <div className="stat-label">Active Medicines</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#d1fae5', color: 'var(--success)' }}>
                        <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.taken}</div>
                    <div className="stat-label">Taken Today</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fee2e2', color: 'var(--danger)' }}>
                        <i className="bi bi-x-circle-fill"></i>
                    </div>
                    <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats.missed}</div>
                    <div className="stat-label">Missed</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fef3c7', color: 'var(--warning)' }}>
                        <i className="bi bi-skip-forward-fill"></i>
                    </div>
                    <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats.skipped}</div>
                    <div className="stat-label">Skipped</div>
                </div>
            </div>

            <div className="chart-section">
                {/* Medicines */}
                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>
                        Today's Medications
                    </h3>

                    {loading ? (
                        <div className="loading-overlay"><div className="spinner"></div></div>
                    ) : medicines.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon text-primary"><i className="bi bi-capsule"></i></div>
                            <h3>No medicines yet</h3>
                            <p>Add your first medication to get started</p>
                            <Link to="/medicines/add" className="btn btn-primary">Add Medicine</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {medicines.map(med => (
                                <div key={med.id} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '12px 16px', background: 'var(--bg)',
                                    borderRadius: 'var(--radius-sm)', flexWrap: 'wrap', gap: 8
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{med.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {med.dosage} · {med.frequency}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button className="btn btn-success btn-sm"
                                            onClick={() => handleMark(med, 'TAKEN')}>
                                            Taken
                                        </button>
                                        <button className="btn btn-secondary btn-sm"
                                            onClick={() => handleMark(med, 'SKIPPED')}>
                                            Skip
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Chart */}
                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Adherence Overview</h3>
                    {chartData.length === 0 ? (
                        <p>No data yet</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={chartData} dataKey="value">
                                    {chartData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
