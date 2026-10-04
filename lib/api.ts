import axios from "axios";

const baseURL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "https://stford-alternator-app.vercel.app/api";

const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export type User = {
  name: string;
  email?: string;
};

export type EngineDetails = {
  model: string;
  engine_name: string;
  location: string;
};

type ApiReply = {
  success: boolean;
  msg?: string;
  token?: string;
  user?: User;
  engine?: EngineDetails;
};

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ msg?: string }>(error)) {
    const message = error.response?.data?.msg;
    if (message) return message;
    if (error.code === "ECONNABORTED") {
      return "The server took too long to respond. Please try again.";
    }
    if (!error.response) {
      return "Unable to reach the server. Check your connection and try again.";
    }
  }

  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export async function login(email: string, password: string): Promise<ApiReply> {
  const response = await api.post<ApiReply>("/v1/user/login", {
    email,
    password,
  });
  return response.data;
}

export async function registerAccount(input: {
  name: string;
  email: string;
  phoneNo: string;
  password: string;
}): Promise<ApiReply> {
  const response = await api.post<ApiReply>("/v1/user/register", input);
  return response.data;
}

export async function getCurrentUser(token: string): Promise<ApiReply> {
  const response = await api.post<ApiReply>(
    "/v1/user/me",
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
}

export async function validateAlternator(
  serialNumber: string,
  token: string,
): Promise<ApiReply> {
  const response = await api.get<ApiReply>(
    `/v2/engine/${encodeURIComponent(serialNumber)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response?.data;
}
