// src/lib/api/client.ts
type FetchOptions = RequestInit & {
  token?: string;
};

class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message: string
  ) {
    super(message);
  }
}

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, headers, ...rest } = options;
  console.log("API Fetch called with path:", path, "and options:", options, "{process.env.API_BASE_URL}", process.env.API_BASE_URL);
  const response = await fetch(`${process.env.API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
  console.log("API Fetch response status:", response.status, "for path:", path);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body, `API error: ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return response.json();
}

// Para respostas binárias (ex.: arquivo Excel): devolve o Response cru, sem converter para JSON.
async function apiFetchRaw(path: string, options: FetchOptions = {}): Promise<Response> {
  const { token, headers, ...rest } = options;
  const response = await fetch(`${process.env.API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body, `API error: ${response.status}`);
  }
  return response;
}

export const apiClient = {
  get: <T>(path: string, options?: FetchOptions) =>
    apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body: unknown, options?: FetchOptions) =>
    apiFetch<T>(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  delete: <T>(path: string, options?: FetchOptions) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
  download: (path: string, options?: FetchOptions) =>
    apiFetchRaw(path, { ...options, method: "GET" }),
  // put, delete...
};

export { ApiError };