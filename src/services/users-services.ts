import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, sessions } from "../db/schema";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserPayload {
  email: string;
  password: string;
}

export async function registerUser(payload: RegisterUserPayload) {
  // 1. Cek apakah email sudah terdaftar
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, payload.email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("email sudah terdaftar");
  }

  // 2. Hash password menggunakan bcrypt bawaan Bun
  const hashedPassword = await Bun.password.hash(payload.password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  // 3. Simpan user baru ke database
  await db.insert(users).values({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
  });

  return { data: "OK" };
}

export async function loginUser(payload: LoginUserPayload) {
  // 1. Cari user berdasarkan email
  const foundUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, payload.email))
    .limit(1);

  if (foundUsers.length === 0) {
    throw new Error("email atau password salah");
  }

  const user = foundUsers[0];

  // 2. Verifikasi kecocokan password bcrypt
  const isMatch = await Bun.password.verify(payload.password, user.password);
  if (!isMatch) {
    throw new Error("email atau password salah");
  }

  // 3. Generate UUID token unik
  const token = crypto.randomUUID();

  // 4. Simpan sesi ke tabel sessions
  await db.insert(sessions).values({
    token,
    userId: user.id,
    password: user.password,
  });

  return { data: token };
}
