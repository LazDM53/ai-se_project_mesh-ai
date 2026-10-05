import type { CurrentUser } from "../types";

const BASE_URL = "/api";

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: { message: string } | null;
};

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("auth-token") ?? "";

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const body = await res.json().catch(() => null);
    const message = body?.error?.message || "Invalid credentials";

    if (localStorage.getItem("auth-token")) {
      localStorage.removeItem("auth-token");
      window.location.href = "/login";
    }

    throw new Error(message);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "Request failed");
  }

  if (res.status === 204) {
    return {
      success: true,
      data: null,
      error: null,
    };
  }

  return res.json();
}

export type KnowledgeDoc = {
  _id: string;
  title: string;
  fileName: string;
  userId: string;
  createdAt: string;
};

export type Chat = {
  _id: string;
  title: string;
  userId: string;
  createdAt: string;
};

export type Message = {
  _id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

/* Documents */

export const getDocuments = (): Promise<ApiResponse<KnowledgeDoc[]>> => {
  return request<KnowledgeDoc[]>("/documents");
};

export const uploadDocument = async (
  file: File,
): Promise<ApiResponse<KnowledgeDoc>> => {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("auth-token") ?? "";

  const res = await fetch(`${BASE_URL}/documents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (res.status === 401) {
    const body = await res.json().catch(() => null);
    const message = body?.error?.message || "Invalid credentials";

    if (localStorage.getItem("auth-token")) {
      localStorage.removeItem("auth-token");
      window.location.href = "/login";
    }

    throw new Error(message);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "Request failed");
  }

  if (res.status === 204) {
    return {
      success: true,
      data: null,
      error: null,
    };
  }

  return res.json();
};

export const deleteDocument = (
  id: string,
): Promise<ApiResponse<null>> => {
  return request<null>(`/documents/${id}`, {
    method: "DELETE",
  });
};

/* Chats */

export const getChats = (): Promise<ApiResponse<Chat[]>> => {
  return request<Chat[]>("/chats");
};

export const createChat = (
  title: string,
): Promise<ApiResponse<Chat>> => {
  return request<Chat>("/chats", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
};

export const getChat = (
  id: string,
): Promise<ApiResponse<{ chat: Chat; messages: Message[] }>> => {
  return request<{ chat: Chat; messages: Message[] }>(`/chats/${id}`);
};

export const sendMessage = (
  chatId: string,
  question: string,
): Promise<ApiResponse<Message[]>> => {
  return request<Message[]>(`/chats/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
};

/* Authentication */

export function getCurrentUser() {
  return request<CurrentUser>("/users/me");
}

export function registerUser(
  name: string,
  email: string,
  password: string,
) {
  return request<{ token: string; user: CurrentUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function loginUser(email: string, password: string) {
  return request<{ token: string; user: CurrentUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
