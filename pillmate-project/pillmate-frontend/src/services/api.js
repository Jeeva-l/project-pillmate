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

// Handle 401 globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
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

// ---- Medicines ----
export const getMedicines = (userId) => API.get('/medicines', { params: { userId } });
export const getMedicine = (id) => API.get(`/medicines/${id}`);
export const createMedicine = (data) => API.post('/medicines', data);
export const updateMedicine = (id, data) => API.put(`/medicines/${id}`, data);
export const deleteMedicine = (id) => API.delete(`/medicines/${id}`);
export const getActiveMedicines = (userId) => API.get('/medicines/active', { params: { userId } });

// ---- History ----
export const getHistory = (userId) => API.get('/history', { params: { userId } });
export const logIntake = (data) => API.post('/history', data);
export const getStats = (userId) => API.get('/history/stats', { params: { userId } });

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

export default API;
