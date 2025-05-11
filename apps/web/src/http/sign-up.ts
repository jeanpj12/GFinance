import { api } from "./api-client";

interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

type SignUpResponse = void;

export async function signUp({
  firstName,
  lastName,
  email,
  password,
}: SignUpRequest): Promise<SignUpResponse> {
  await api.post("auth/create", {
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
