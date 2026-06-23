// Lightweight fetch wrapper that handles JSON + errors + relative URLs.

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  let data: unknown = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json();
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : null) ?? `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, init?: RequestInit) =>
    apiFetch<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    apiFetch<T>(path, {
      ...init,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    apiFetch<T>(path, {
      ...init,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    apiFetch<T>(path, {
      ...init,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string, init?: RequestInit) =>
    apiFetch<T>(path, { ...init, method: "DELETE" }),
};
