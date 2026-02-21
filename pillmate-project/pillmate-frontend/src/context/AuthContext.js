import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, register as registerApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('pillmate_user');
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await loginApi({ email, password });
        const { token, id, name, role } = res.data;
        const userData = { id, name, email, role, token };
        localStorage.setItem('pillmate_token', token);
        localStorage.setItem('pillmate_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const register = async (name, email, password, phone) => {
        return registerApi({ name, email, password, phone });
    };

    const logout = () => {
        localStorage.removeItem('pillmate_token');
        localStorage.removeItem('pillmate_user');
        setUser(null);
    };

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'ROLE_ADMIN';

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export default AuthContext;
