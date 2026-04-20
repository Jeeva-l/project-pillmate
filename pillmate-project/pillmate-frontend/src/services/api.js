import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json', 
    },
});

// Attach JWT token to every request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('pillmate_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401/403 globally (session expired)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("Session expired or unauthorized. Logging out...");
            localStorage.removeItem('pillmate_token');
            localStorage.removeItem('pillmate_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ---- Auth ----
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);

// ---- Medicines ----
export const getMedicines = (userId) => API.get('/medicines', { params: { userId, _t: Date.now() } });
export const getMedicine = (id) => API.get(`/medicines/${id}`, { params: { _t: Date.now() } });
export const createMedicine = (data) => API.post('/medicines', data);
export const updateMedicine = (id, data) => API.put(`/medicines/${id}`, data);
export const deleteMedicine = (id) => API.delete(`/medicines/${id}`);
export const getActiveMedicines = (userId) => API.get('/medicines/active', { params: { userId, _t: Date.now() } });

// ---- History ----
export const getHistory = (userId) => API.get('/history', { params: { userId, _t: Date.now() } });
export const logIntake = (data) => API.post('/history', data);
export const getStats = (userId) => API.get('/history/stats', { params: { userId, _t: Date.now() } });

// ---- Prescriptions ----
export const getPrescriptions = (userId) => API.get('/prescriptions', { params: { userId } });
export const createPrescription = (data) => API.post('/prescriptions', data);
export const updatePrescription = (id, data) => API.put(`/prescriptions/${id}`, data);
export const deletePrescription = (id) => API.delete(`/prescriptions/${id}`);

// ---- Users (Admin) ----
export const getUsers = () => API.get('/users');
export const getUser = (id) => API.get(`/users/${id}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// ---- Pharmacies ----
export const getPharmacies = (location) => API.get('/pharmacies', { params: { location } });

// ---- Email ----
export const sendReminderEmail = (email, medicine, time) => {
    return API.post('/email/send-reminder', new URLSearchParams({ email, medicine, time }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
};

// ---- Browser Push Notifications ----
export const registerPushToken = (userId, token) => API.post('/notifications/register-token', { userId, token });

export default API;
