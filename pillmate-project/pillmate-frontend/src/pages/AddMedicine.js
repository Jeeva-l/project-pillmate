import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createMedicine, getMedicine, updateMedicine } from '../services/api';

function AddMedicine() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        name: '', dosage: '', frequency: 'Daily', category: '',
        startDate: '', endDate: '', notes: '', intakeTimes: ['08:00'],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            getMedicine(id).then(res => {
                const m = res.data;
                setForm({
                    name: m.name || '', dosage: m.dosage || '', frequency: m.frequency || 'Daily',
                    category: m.category || '', startDate: m.startDate || '', endDate: m.endDate || '',
                    notes: m.notes || '', intakeTimes: m.intakeTimes?.length ? m.intakeTimes : ['08:00'],
                });
            }).catch(() => navigate('/dashboard'));
        }
    }, [isEdit, id, navigate]);

    const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const addTime = () => setForm(f => ({ ...f, intakeTimes: [...f.intakeTimes, '08:00'] }));
    const removeTime = (i) => setForm(f => ({ ...f, intakeTimes: f.intakeTimes.filter((_, idx) => idx !== i) }));
    const updateTime = (i, val) => setForm(f => {
        const t = [...f.intakeTimes]; t[i] = val; return { ...f, intakeTimes: t };
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = { ...form, userId: user.id, active: true };
            if (isEdit) await updateMedicine(id, payload);
            else await createMedicine(payload);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save medicine.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">💊 {isEdit ? 'Edit Medicine' : 'Add Medicine'}</h1>
                <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>← Back</button>
            </div>

            <div className="card" style={{ maxWidth: 600 }}>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                        <div className="form-group" style={{ gridColumn: '1/-1' }}>
                            <label className="form-label">Medicine Name *</label>
                            <input id="med-name" type="text" className="form-control" placeholder="e.g. Amoxicillin"
                                value={form.name} onChange={e => setField('name', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Dosage</label>
                            <input id="med-dosage" type="text" className="form-control" placeholder="e.g. 500mg"
                                value={form.dosage} onChange={e => setField('dosage', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <input id="med-category" type="text" className="form-control" placeholder="e.g. Antibiotic"
                                value={form.category} onChange={e => setField('category', e.target.value)} />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1/-1' }}>
                            <label className="form-label">Frequency</label>
                            <select id="med-frequency" className="form-control" value={form.frequency}
                                onChange={e => setField('frequency', e.target.value)}>
                                {['Once daily', 'Twice daily', 'Three times daily', 'Every 8 hours', 'Weekly', 'As needed'].map(f => (
                                    <option key={f}>{f}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input id="med-start" type="date" className="form-control"
                                value={form.startDate} onChange={e => setField('startDate', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input id="med-end" type="date" className="form-control"
                                value={form.endDate} onChange={e => setField('endDate', e.target.value)} />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1/-1' }}>
                            <label className="form-label">Intake Times</label>
                            {form.intakeTimes.map((t, i) => (
                                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                    <input type="time" className="form-control" value={t}
                                        onChange={e => updateTime(i, e.target.value)} />
                                    {form.intakeTimes.length > 1 &&
                                        <button type="button" className="btn btn-danger btn-sm btn-icon" onClick={() => removeTime(i)}>✕</button>}
                                </div>
                            ))}
                            <button type="button" className="btn btn-secondary btn-sm" onClick={addTime}>+ Add Time</button>
                        </div>
                        <div className="form-group" style={{ gridColumn: '1/-1' }}>
                            <label className="form-label">Notes</label>
                            <textarea id="med-notes" className="form-control" rows={3} placeholder="e.g. Take after meals"
                                value={form.notes} onChange={e => setField('notes', e.target.value)} style={{ resize: 'vertical' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                        <button id="med-submit" type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : isEdit ? '💾 Update Medicine' : '+ Add Medicine'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddMedicine;
