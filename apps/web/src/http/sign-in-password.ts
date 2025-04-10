import { api } from "./api-client";

interface SignInPasswordRequest {
  email: string;
  password: string;
}

interface SignInPaswwordResponse {
  token: string;
}

export async function signInWithPassword({
  email,
  password,
}: SignInPasswordRequest) {
  const response = await api
    .post("auth/sign-in", {
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .json<SignInPaswwordResponse>();

  return response;
}
