import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPrescriptions, createPrescription, updatePrescription, deletePrescription } from '../services/api';

const empty = { doctorName: '', medicineName: '', dosage: '', instructions: '', issuedDate: '', expiryDate: '', imageUrl: '' };

function Prescription() {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [saving, setSaving] = useState(false);

    const load = () => {
        if (!user) return;
        getPrescriptions(user.id).then(res => setPrescriptions(res.data)).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [user]); // eslint-disable-line

    const openAdd = () => { setForm(empty); setEditing(null); setShowModal(true); };
    const openEdit = (p) => { setForm({ ...p }); setEditing(p.id); setShowModal(true); };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing) await updatePrescription(editing, { ...form, userId: user.id });
            else await createPrescription({ ...form, userId: user.id });
            setShowModal(false);
            load();
        } catch { /* ignore */ }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this prescription?')) return;
        await deletePrescription(id);
        load();
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">📄 Prescriptions</h1>
                <button className="btn btn-primary" onClick={openAdd}>+ Add Prescription</button>
            </div>

            {loading ? <div className="loading-overlay"><div className="spinner"></div></div>
                : prescriptions.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📄</div>
                        <h3>No prescriptions yet</h3>
                        <p>Add your doctor's prescription to keep track.</p>
                        <button className="btn btn-primary" onClick={openAdd}>Add Prescription</button>
                    </div>
                ) : (
                    <div className="card-grid">
                        {prescriptions.map(p => (
                            <div key={p.id} className="card" style={{ position: 'relative' }}>
                                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{p.medicineName || 'Prescription'}</div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                                    <div>👨‍⚕️ Dr. {p.doctorName || '—'}</div>
                                    <div>💊 {p.dosage || '—'}</div>
                                    {p.issuedDate && <div>📅 Issued: {p.issuedDate}</div>}
                                    {p.expiryDate && <div>⏰ Expires: {p.expiryDate}</div>}
                                    {p.instructions && <div style={{ marginTop: 6, color: 'var(--text)' }}>{p.instructions}</div>}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">{editing ? 'Edit Prescription' : 'Add Prescription'}</span>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSave}>
                            {[
                                { id: 'rx-doc', label: "Doctor's Name", key: 'doctorName', type: 'text' },
                                { id: 'rx-med', label: 'Medicine Name', key: 'medicineName', type: 'text', required: true },
                                { id: 'rx-dos', label: 'Dosage', key: 'dosage', type: 'text' },
                                { id: 'rx-iss', label: 'Issued Date', key: 'issuedDate', type: 'date' },
                                { id: 'rx-exp', label: 'Expiry Date', key: 'expiryDate', type: 'date' },
                                { id: 'rx-img', label: 'Image URL', key: 'imageUrl', type: 'url' },
                            ].map(f => (
                                <div className="form-group" key={f.key}>
                                    <label className="form-label">{f.label}</label>
                                    <input id={f.id} type={f.type} className="form-control" required={f.required}
                                        value={form[f.key] || ''} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))} />
                                </div>
                            ))}
                            <div className="form-group">
                                <label className="form-label">Instructions</label>
                                <textarea id="rx-inst" className="form-control" rows={3}
                                    value={form.instructions || ''} onChange={e => setForm(x => ({ ...x, instructions: e.target.value }))} />
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button id="rx-submit" type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Prescription;
