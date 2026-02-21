# 💊 PillMate Frontend

A responsive ReactJS application for managing medications, prescriptions, and pharmacy locations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

App runs at **http://localhost:3000**

## ⚙️ Configuration

The backend URL is configured in `src/services/api.js`:
```js
baseURL: 'http://localhost:8080/api'
```

## 📁 Structure

```
src/
├── components/   Navbar (responsive sidebar/hamburger)
├── context/      AuthContext (JWT auth state)
├── pages/        Login, Signup, Dashboard, AddMedicine,
│                 History, Prescription, PharmacyLocator, Users
├── services/     api.js (Axios + all endpoint functions)
├── App.js        Router + Protected routes
└── App.css       Global styles (mobile-first)
```

## 🌐 Pages

| Page | Route | Description |
|---|---|---|
| Login | `/login` | JWT authentication |
| Signup | `/signup` | User registration |
| Dashboard | `/dashboard` | Today's meds + PieChart |
| Add Medicine | `/medicines/add` | Add/edit medications |
| History | `/history` | Intake history table |
| Prescriptions | `/prescriptions` | Prescription cards |
| Pharmacy | `/pharmacy` | Google Maps + list |
| Users | `/users` | Admin user management |

## 🗺️ Google Maps Setup

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps Embed API**
3. Replace `YOUR_GOOGLE_MAPS_API_KEY` in `src/pages/PharmacyLocator.js`

## 🛠️ Tech Stack

- ReactJS 18
- React Router v6
- Axios
- Recharts (PieChart)
- React Icons
- Vanilla CSS (mobile-first)
