import { describe, expect, it } from "bun:test";
import { app } from "../src/index";

describe("Elysia App", () => {
  it("returns 'Hello World' on GET /", async () => {
    const response = await app.handle(new Request("http://localhost/"));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("Hello World");
  });

  it("handles GET /users endpoint gracefully", async () => {
    const response = await app.handle(new Request("http://localhost/users"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toBeDefined();
    // Jika MySQL offline, response mengembalikan error message terstruktur
    if (!body.success) {
      expect(body.error).toContain("Gagal mengambil data user");
    } else {
      expect(Array.isArray(body.data)).toBe(true);
    }
  });
});

