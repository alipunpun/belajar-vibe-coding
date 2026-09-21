import { Elysia, t } from "elysia";
import { db } from "./db";
import { users } from "./db/schema";

import { usersRoute } from "./routes/users-route";

export const app = new Elysia()
  // Modular Routes
  .use(usersRoute)
  // Health Check route
  .get("/", () => "Hello World")

  // Database route: ambil daftar users
  .get("/users", async () => {
    try {
      const allUsers = await db.select().from(users);
      return {
        success: true,
        data: allUsers,
      };
    } catch (error: any) {
      return {
        success: false,
        error: "Gagal mengambil data user atau database belum terhubung",
        details: error.message,
      };
    }
  })

  // Database route: buat user baru
  .post(
    "/users",
    async ({ body, set }) => {
      try {
        const result = await db.insert(users).values(body);
        set.status = 201;
        return {
          success: true,
          message: "User berhasil ditambahkan",
          result,
        };
      } catch (error: any) {
        set.status = 500;
        return {
          success: false,
          error: "Gagal menambahkan user",
          details: error.message,
        };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
      }),
    }
  )
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia server is running at http://${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
