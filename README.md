# 📋 Task Management System

Aplikasi manajemen tugas fullstack dengan React + Express + MongoDB.

## 🚀 Tech Stack

**Frontend:** React 19, React Router v7, Bootstrap 5, Axios  
**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT

## ⚙️ Setup

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Environment Variables

```bash
# Salin .env.example ke .env di folder backend
cp .env.example backend/.env
```

Isi file `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/task_manager
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 3. Jalankan Aplikasi

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000

## 📡 API Endpoints

| Method | Endpoint | Keterangan | Auth |
|--------|----------|------------|------|
| POST | /api/auth/register | Daftar akun | ❌ |
| POST | /api/auth/login | Login | ❌ |
| GET | /api/tasks/data | Semua tugas | ✅ |
| POST | /api/tasks/data | Buat tugas | ✅ |
| GET | /api/tasks/data/:id | Detail tugas | ✅ |
| PUT | /api/tasks/data/:id | Edit tugas | ✅ |
| DELETE | /api/tasks/data/:id | Hapus tugas | ✅ |
| GET | /api/tasks/stats | Statistik | ✅ |

## 👤 Role

- **Admin** — dapat melihat & kelola semua tugas
- **User** — hanya dapat mengelola tugas milik sendiri

## 📁 Struktur

```
task-manager/
├── backend/
│   └── src/
│       ├── config/         # Koneksi DB
│       ├── controllers/    # Logic request
│       ├── middlewares/    # Auth, validasi, error
│       ├── models/         # Schema MongoDB
│       ├── repositories/   # Query database
│       └── routes/         # Definisi endpoint
└── frontend/
    └── src/
        ├── components/     # Komponen reusable
        ├── hooks/          # Custom hooks
        ├── layouts/        # Layout halaman
        ├── pages/          # Halaman utama
        ├── services/       # Axios API calls
        └── utils/          # Helper & OOP class
```
