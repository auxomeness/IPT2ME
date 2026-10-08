const API_BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(status, responseBody) {
    super(`API request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_URL is not configured.");
  }

  if (typeof path !== "string" || path.trim() === "") {
    throw new TypeError("An API path is required.");
  }

  const { body, headers, ...fetchOptions } = options;
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const baseUrl = `${API_BASE_URL.replace(/\/+$/, "")}/`;
  const requestUrl = new URL(path.replace(/^\/+/, ""), baseUrl);
  const response = await fetch(requestUrl, {
    ...fetchOptions,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type") || "";
  const responseBody =
    response.status === 204
      ? null
      : contentType.includes("application/json")
        ? await response.json()
        : await response.text();

  if (!response.ok) {
    throw new ApiError(response.status, responseBody);
  }

  return responseBody;
}
