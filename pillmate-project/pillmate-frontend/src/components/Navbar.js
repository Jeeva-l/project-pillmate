import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { to: '/dashboard', icon: <i className="bi bi-house-door"></i>, label: 'Dashboard' },
    { to: '/medicines/add', icon: <i className="bi bi-capsule"></i>, label: 'Add Medicine' },
    { to: '/history', icon: <i className="bi bi-clipboard2-pulse"></i>, label: 'History' },
    { to: '/prescriptions', icon: <i className="bi bi-file-earmark-text"></i>, label: 'Prescriptions' },
    { to: '/pharmacy', icon: <i className="bi bi-map"></i>, label: 'Pharmacy' },
];

function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); };

    const allItems = isAdmin
        ? [...navItems, { to: '/users', icon: <i className="bi bi-people"></i>, label: 'Users' }]
        : navItems;

    return (
        <>
            {/* ---- Desktop Sidebar ---- */}
            <aside className="sidebar" style={{
                position: 'fixed', top: 0, left: 0, height: '100vh',
                width: 'var(--sidebar-width)', background: 'white',
                borderRight: '1px solid var(--border)', display: 'flex',
                flexDirection: 'column', zIndex: 200,
                boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
                transform: 'translateX(-100%)',
            }} id="sidebar">
                {/* Logo */}
                <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '1.8rem', color: 'var(--primary)' }}><i className="bi bi-capsule"></i></span>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>PillMate</span>
                    </div>
                </div>
                {/* Nav */}
                <nav style={{ flex: 1, padding: '16px 12px', overflow: 'auto' }}>
                    {allItems.map(item => (
                        <NavLink key={item.to} to={item.to}
                            style={({ isActive }) => ({
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                                textDecoration: 'none',
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? 'var(--primary)' : 'var(--text)',
                                background: isActive ? 'rgba(79,70,229,0.08)' : 'transparent',
                                marginBottom: 4, fontSize: '0.9rem',
                                transition: 'all 0.15s',
                            })}>
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                {/* User + Logout */}
                <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                        Signed in as <strong style={{ color: 'var(--text)' }}>{user?.name}</strong>
                    </div>
                    <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}
                        onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i> Sign Out
                    </button>
                </div>
            </aside>

            {/* ---- Mobile Top Navbar ---- */}
            <header style={{
                position: 'fixed', top: 0, left: 0, right: 0, height: 'var(--navbar-h)',
                background: 'white', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 16px', zIndex: 300,
                boxShadow: 'var(--shadow)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button id="mobile-menu-btn"
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: 'var(--text)' }}
                        onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
                        {mobileOpen ? <i className="bi bi-x-lg"></i> : <i className="bi bi-list"></i>}
                    </button>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>
                        <i className="bi bi-capsule" style={{ color: 'var(--primary)' }}></i> PillMate
                    </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><i className="bi bi-person-circle"></i> {user?.name}</div>
            </header>

            {/* ---- Mobile Drawer ---- */}
            {mobileOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 250,
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }}
                        onClick={() => setMobileOpen(false)} />
                    <div style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0, width: 260,
                        background: 'white', display: 'flex', flexDirection: 'column',
                        boxShadow: 'var(--shadow-lg)',
                    }}>
                        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', paddingTop: 'calc(var(--navbar-h) + 8px)' }}>
                            <strong>Menu</strong>
                        </div>
                        <nav style={{ flex: 1, padding: '12px', overflow: 'auto' }}>
                            {allItems.map(item => (
                                <NavLink key={item.to} to={item.to}
                                    onClick={() => setMobileOpen(false)}
                                    style={({ isActive }) => ({
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '11px 14px', borderRadius: 'var(--radius-sm)',
                                        textDecoration: 'none', fontWeight: isActive ? 600 : 400,
                                        color: isActive ? 'var(--primary)' : 'var(--text)',
                                        background: isActive ? 'rgba(79,70,229,0.08)' : 'transparent',
                                        marginBottom: 4,
                                    })}>
                                    {item.icon} {item.label}
                                </NavLink>
                            ))}
                        </nav>
                        <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
                            <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}
                                onClick={handleLogout}><i className="bi bi-box-arrow-right"></i> Sign Out</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar & Mobile CSS overrides */}
            <style>{`
        @media (min-width: 768px) {
          #sidebar { transform: translateX(0) !important; }
          header { display: none !important; }
        }
        @media (max-width: 768px) {
          header > div:last-child { display: none !important; }
        }
      `}</style>
        </>
    );
}

export default Navbar;
