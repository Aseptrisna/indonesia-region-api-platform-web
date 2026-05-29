# Indonesia Region API Platform — Frontend App

Frontend web app untuk **Indonesia Region API Platform** by **Logic Frame Indonesia**.  
Dibangun dengan React 19 + TypeScript + Vite.

---

## Tech Stack

| Layer | Library |
|---|---|
| UI Framework | React 19.2 |
| Language | TypeScript 6 |
| Build Tool | Vite 8 |
| Routing | React Router DOM 7 |
| HTTP Client | Axios |
| Auth Decode | jwt-decode |

---

## Fitur

### Auth
- Login / Register (firstName, lastName, email, password)
- Verifikasi email (request token → konfirmasi)
- Lupa password / Reset password via token
- Auto-logout saat token expired (401 interceptor)

### User Dashboard
- Lihat semua API Key milik sendiri (Aktif / Menunggu / Nonaktif)
- Request API Key baru dengan alasan penggunaan
- Renew API Key (perpanjang +30 hari)
- Hapus API Key milik sendiri

### Admin Dashboard (`super_admin`)
- Manajemen User: create, update role, reset password, deactivate, delete
- Manajemen API Key: approve/tolak request, revoke key aktif
- Quick link ke Swagger UI

### Profil
- Edit profil (firstName, lastName, phone, company, website)
- Ubah password (strength indicator, show/hide toggle, konfirmasi)

---

## Struktur Folder

```
src/
├── pages/
│   ├── Landing.tsx          # Halaman publik
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── VerifyEmail.tsx
│   ├── ForgotPassword.tsx
│   ├── ResetPassword.tsx
│   ├── UserDashboard.tsx    # Dashboard user biasa
│   ├── AdminDashboard.tsx   # Dashboard super_admin
│   ├── AdminUsers.tsx       # Manajemen user
│   ├── AdminApiKeys.tsx     # Manajemen API key
│   ├── RequestApiKey.tsx    # Form request API key
│   ├── Profile.tsx          # Manajemen profil
│   ├── PaymentUpload.tsx    # (Disabled – belum ready)
│   └── AdminPayments.tsx    # (Disabled – belum ready)
├── components/
│   └── DashboardLayout.tsx  # Sidebar + layout wrapper
├── services/
│   ├── api.ts               # Axios instance + interceptors
│   ├── auth.ts              # Login, register, verify, reset password
│   ├── users.ts             # User CRUD + profile management
│   ├── apiKeys.ts           # API key management (user + admin)
│   └── payments.ts          # (Reserved – belum digunakan)
└── utils/
    └── inlineCss.ts
```

---

## Setup & Jalankan

### 1. Install dependencies
```bash
npm install
```

### 2. Konfigurasi environment
```bash
cp .env.example .env
```
Isi `VITE_API_BASE` dengan URL backend yang berjalan.

### 3. Jalankan dev server
```bash
npm run dev
```

### 4. Build production
```bash
npm run build
```

---

## Environment Variables

| Variable | Contoh | Keterangan |
|---|---|---|
| `VITE_API_BASE` | `http://localhost:3000/api/v1` | Base URL backend API |
| `VITE_SWAGGER_URL` | `http://localhost:3000/api/docs` | URL Swagger UI (admin quick link) |

> Semua env variable **wajib** diawali `VITE_` agar bisa dibaca oleh Vite di browser.

---

## Role & Akses

| Role | Akses |
|---|---|
| `super_admin` | Admin Dashboard, User Management, API Key Management, Profil |
| `admin` | Profil (akses terbatas, dikembangkan) |
| `developer` | User Dashboard, Request API Key, Profil |
| `business` | User Dashboard, Request API Key, Profil |
| `user` | User Dashboard, Request API Key, Profil |

---

## Backend

Repo backend: NestJS 11 + MongoDB + Passport JWT  
Dokumentasi API: `VITE_SWAGGER_URL` (default: `http://localhost:3000/api/docs`)

---

## Developer

**Logic Frame Indonesia**  
Kontak: logic.frame.indonesia@gmail.com
