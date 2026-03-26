import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHistory } from '../services/api';

function History() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        if (!user) return;
        getHistory(user.id)
            .then(res => setHistory(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [user]);

    const displayed = filter === 'ALL' ? history : history.filter(h => h.status === filter);

    const statusBadge = (status) => {
        const map = { TAKEN: 'badge-success', MISSED: 'badge-danger', SKIPPED: 'badge-warning' };
        return <span className={`badge ${map[status] || ''}`}>{status}</span>;
    };

    const fmt = (dt) => {
        if (!dt) return '-';
        return new Date(dt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title"><i className="bi bi-clipboard2-pulse text-primary"></i> Intake History</h1>
                <select className="form-control" style={{ width: 'auto' }} value={filter}
                    onChange={e => setFilter(e.target.value)}>
                    <option value="ALL">All</option>
                    <option value="TAKEN">Taken</option>
                    <option value="MISSED">Missed</option>
                    <option value="SKIPPED">Skipped</option>
                </select>
            </div>

            {loading ? (
                <div className="loading-overlay"><div className="spinner"></div></div>
            ) : displayed.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon text-muted"><i className="bi bi-clipboard2-pulse"></i></div>
                    <h3>No records found</h3>
                    <p>Your intake history will appear here.</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Medicine</th>
                                <th>Status</th>
                                <th>Date &amp; Time</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayed.map((h, i) => (
                                <tr key={h.id}>
                                    <td>{i + 1}</td>
                                    <td><strong>{h.medicineName || '—'}</strong></td>
                                    <td>{statusBadge(h.status)}</td>
                                    <td>{fmt(h.takenAt)}</td>
                                    <td>{h.notes || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default History;
