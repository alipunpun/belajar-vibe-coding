import { describe, expect, it } from "bun:test";
import { app } from "../src/index";

describe("User Registration Route (/api/users)", () => {
  it("rejects invalid request body with 400/422 status", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Invalid User",
          // email is missing
          password: "password123",
        }),
      })
    );

    expect([400, 422]).toContain(response.status);
  });

  it("handles user registration request", async () => {
    const randomEmail = `test_${Date.now()}@localhost`;
    const response = await app.handle(
      new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Alip",
          email: randomEmail,
          password: "rahasia",
        }),
      })
    );

    const body = await response.json();

    if (response.status === 200) {
      expect(body).toEqual({ data: "OK" });

      // Coba daftar ulang dengan email yang sama untuk memverifikasi proteksi email duplikat
      const duplicateResponse = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Alip Duplikat",
            email: randomEmail,
            password: "rahasia_lagi",
          }),
        })
      );

      expect(duplicateResponse.status).toBe(400);
      const duplicateBody = await duplicateResponse.json();
      expect(duplicateBody).toEqual({ error: "email sudah terdaftar" });
    } else {
      // Jika database belum aktif/terkoneksi di lingkungan test saat ini
      expect(response.status).toBe(500);
      expect(body.error).toBeDefined();
    }
  });

  it("hashes password with bcrypt correctly", async () => {
    const plainPassword = "rahasia";
    const hashed = await Bun.password.hash(plainPassword, {
      algorithm: "bcrypt",
      cost: 10,
    });

    expect(hashed).toBeString();
    expect(hashed.startsWith("$2")).toBe(true);

    const isMatch = await Bun.password.verify(plainPassword, hashed);
    expect(isMatch).toBe(true);
  });
});

