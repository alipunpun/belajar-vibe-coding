import { Elysia, t } from "elysia";
import { registerUser, loginUser } from "../services/users-services";

export const usersRoute = new Elysia({ prefix: "/api/users" })
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const result = await registerUser(body);
        return result;
      } catch (error: any) {
        if (error.message === "email sudah terdaftar") {
          set.status = 400;
          return { error: "email sudah terdaftar" };
        }
        set.status = 500;
        return { error: error.message || "Terjadi kesalahan internal server" };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, set }) => {
      try {
        const result = await loginUser(body);
        return result;
      } catch (error: any) {
        if (error.message === "email atau password salah") {
          set.status = 400;
          return { error: "email atau password salah" };
        }
        set.status = 500;
        return { error: error.message || "Terjadi kesalahan internal server" };
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  );
