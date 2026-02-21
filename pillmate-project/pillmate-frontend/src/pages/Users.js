import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../services/api';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        getUsers().then(res => setUsers(res.data)).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user? This action cannot be undone.')) return;
        await deleteUser(id);
        load();
    };

    const fmt = (dt) => dt ? new Date(dt).toLocaleDateString('en-IN') : '—';

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">👥 Users (Admin)</h1>
                <span className="badge badge-info">{users.length} Users</span>
            </div>

            {loading ? <div className="loading-overlay"><div className="spinner"></div></div>
                : users.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">👥</div>
                        <h3>No users found</h3>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td><strong>{u.name}</strong></td>
                                        <td>{u.email}</td>
                                        <td>{u.phone || '—'}</td>
                                        <td>
                                            <span className={`badge ${u.role === 'ADMIN' ? 'badge-info' : 'badge-success'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>{fmt(u.createdAt)}</td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>🗑️ Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
        </div>
    );
}

export default Users;
