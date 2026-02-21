import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getActiveMedicines, getStats, logIntake } from '../services/api';

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState([]);
    const [stats, setStats] = useState({ taken: 0, missed: 0, skipped: 0 });
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState([]);

    const addToast = (msg, type = 'success') => {
        const id = Date.now();
        setToasts(t => [...t, { id, msg, type }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
    };

    useEffect(() => {
        if (!user) return;
        const load = async () => {
            try {
                const [medsRes, statsRes] = await Promise.all([
                    getActiveMedicines(user.id),
                    getStats(user.id),
                ]);
                setMedicines(medsRes.data);
                setStats(statsRes.data);
            } catch { /* ignore */ }
            finally { setLoading(false); }
        };
        load();
    }, [user]);

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
            const statsRes = await getStats(user.id);
            setStats(statsRes.data);
        } catch {
            addToast('Could not log intake.', 'error');
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
                        <span>{t.type === 'success' ? '✅' : t.type === 'warning' ? '⚠️' : '❌'}</span>
                        <span>{t.msg}</span>
                    </div>
                ))}
            </div>

            <div className="page-header">
                <div>
                    <h1 className="page-title">👋 Hello, {user?.name?.split(' ')[0]}!</h1>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>{today}</p>
                </div>
                <Link to="/medicines/add" className="btn btn-primary">+ Add Medicine</Link>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#dbeafe' }}>💊</div>
                    <div className="stat-value" style={{ color: 'var(--primary)' }}>{medicines.length}</div>
                    <div className="stat-label">Active Medicines</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#d1fae5' }}>✅</div>
                    <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.taken}</div>
                    <div className="stat-label">Taken Today</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fee2e2' }}>❌</div>
                    <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats.missed}</div>
                    <div className="stat-label">Missed</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fef3c7' }}>⏭️</div>
                    <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats.skipped}</div>
                    <div className="stat-label">Skipped</div>
                </div>
            </div>

            <div className="chart-section">
                {/* Today's Medicines */}
                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Today's Medications</h3>
                    {loading ? <div className="loading-overlay"><div className="spinner"></div></div>
                        : medicines.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">💊</div>
                                <h3>No medicines yet</h3>
                                <p>Add your first medication to get started</p>
                                <Link to="/medicines/add" className="btn btn-primary">Add Medicine</Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {medicines.map(med => (
                                    <div key={med.id} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)',
                                        flexWrap: 'wrap', gap: 8
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{med.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {med.dosage} · {med.frequency}
                                                {med.intakeTimes?.length > 0 && ` · ${med.intakeTimes.join(', ')}`}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn btn-success btn-sm" onClick={() => handleMark(med, 'TAKEN')}>✓ Taken</button>
                                            <button className="btn btn-secondary btn-sm" onClick={() => handleMark(med, 'SKIPPED')}>Skip</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>

                {/* Pie Chart */}
                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Adherence Overview</h3>
                    {chartData.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📊</div>
                            <p>No data yet. Start logging your medicines!</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={4}
                              dataKey="value"
                              label={false}  
                            >
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

            {/* Quick Links */}
            <div className="card-grid" style={{ marginTop: 20 }}>
                {[
                    { icon: '📋', label: 'View History', to: '/history', color: '#dbeafe' },
                    { icon: '📄', label: 'Prescriptions', to: '/prescriptions', color: '#d1fae5' },
                    { icon: '🗺️', label: 'Find Pharmacy', to: '/pharmacy', color: '#fef3c7' },
                ].map(q => (
                    <div key={q.to} className="card" onClick={() => navigate(q.to)}
                        style={{ cursor: 'pointer', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 8 }}>{q.icon}</div>
                        <div style={{ fontWeight: 600 }}>{q.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
