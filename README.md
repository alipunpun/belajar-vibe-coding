# Belajar Vibe Coding - Backend API

Proyek backend modern yang dibangun menggunakan **Bun**, **ElysiaJS**, **Drizzle ORM**, dan **MySQL**.

## 🛠️ Tech Stack
- **Runtime:** [Bun](https://bun.sh)
- **Web Framework:** [ElysiaJS](https://elysiajs.com)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **Database:** MySQL

---

## 🚀 Memulai

### 1. Install Dependensi
```bash
bun install
```

### 2. Konfigurasi Environment
Salin file `.env.example` menjadi `.env` dan sesuaikan koneksi database MySQL Anda:
```bash
cp .env.example .env
```

Contoh isi `.env`:
```env
DATABASE_URL=mysql://root:password@localhost:3306/belajar_vibe
PORT=3000
```

### 3. Migrasi Database (Drizzle Kit)
Untuk menyinkronkan skema ke database MySQL:
```bash
bun run db:push
```

Untuk generate migrasi SQL:
```bash
bun run db:generate
```

### 4. Menjalankan Server
Mode Development (auto-reload):
```bash
bun run dev
```

Mode Production:
```bash
bun run start
```

Server akan berjalan secara default di `http://localhost:3000`.

---

## 📌 Endpoint API Tersedia
- `GET /`: Health check (mengembalikan `"Hello World"`)
- `POST /api/users`: Registrasi user baru (Body: `{ "name": "...", "email": "...", "password": "..." }`)
- `POST /api/users/login`: Login user (Body: `{ "email": "...", "password": "..." }`, Response: `{ "data": "token_uuid" }`)
- `GET /users`: Mengambil daftar user dari tabel database

---

## 🧪 Menjalankan Pengujian
```bash
bun test
```
