# OAKU Backend API

ระบบจัดการกิจกรรมนิสิต มหาวิทยาลัยเกษตรศาสตร์ (OAKU)

---

## 📦 Project Structure

```
oaku_backend/
├── configs/           # Database & Passport config
├── controllers/       # API logic
├── middlewares/       # Auth middlewares
├── prisma/            # Prisma schema & seed
├── routes/            # API routes
├── types/             # TypeScript types
├── utils/             # JWT & helpers
├── Dockerfile         # Docker build
├── docker-compose.yml # Docker compose
├── .env               # Environment variables
└── README.md
```

---

## 🚀 Quick Start

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. สร้างไฟล์ `.env` 

### 3. รัน Database (Postgres) ด้วย Docker

```bash
npm run docker:up
```

### 4. รัน Prisma migration & seed (optional)

```bash
npx prisma db push
npx prisma db seed
```

### 5. รัน Backend (Dev mode)

```bash
npm run dev
```

### 6. รัน Backend (Production build)

```bash
npm run build
npm start
```

---

## 🐳 Docker Compose (Database + Backend)

```bash
npm run docker:up:all
```

---

## 🔗 API Path Overview

| Method | Path                    | Description             |
| ------ | ----------------------- | ----------------------- |
| GET    | /health                 | Health check            |
| GET    | /api                    | API info                |
| GET    | /auth/                  | Auth API info           |
| GET    | /auth/google            | Google OAuth login      |
| GET    | /auth/google/callback   | Google OAuth callback   |
| POST   | /auth/refresh           | Refresh access token    |
| POST   | /auth/logout            | Logout user             |
| GET    | /auth/profile           | Get user profile        |


---

## 🧪 Token Generation (Dev/Test)

```bash
npx tsx generate-test-token.ts
```

Copy token ที่ได้ไปใส่ใน Postman หรือ header:

```
Authorization: Bearer <token>
```

---

## 🛠️ Useful Commands

- **Start DB only:**
  ```bash
  npm run docker:up
  ```
- **Start Backend only (dev):**
  ```bash
  npm run dev
  ```
- **Build & Start Backend (prod):**
  ```bash
  npm run build && npm start
  ```
- **Reset DB:**
  ```bash
  npx prisma migrate reset
  ```
- **Open Prisma Studio:**
  ```bash
  npm run db:studio
  ```

---

## 📬 Contact

- [Your Name/Team]
- [your@email.com]
# oaku_backend
