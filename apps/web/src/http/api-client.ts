import { CookiesFn, getCookie } from "cookies-next";
import ky from "ky";

export const api = ky.create({
  prefixUrl: "http://localhost:3333",
  hooks: {
    beforeRequest: [
      async (request) => {
        try {
          let token: string | undefined;

          if (typeof window === "undefined") {
            // Server side
            const { cookies } = await import("next/headers");
            token = (await cookies()).get("token")?.value;
          } else {
            // Client side
            token = await getCookie("token");
          }

          if (token) {
            request.headers.set("Authorization", `Bearer ${token.trim()}`);
          }
        } catch (error) {
          console.error("Error getting token:", error);
        }
      },
    ],
  },
});
