const API_BASE_URL = "http://127.0.0.1:8000";


// ============================================================
// GENERIC API REQUEST
// ============================================================

async function apiRequest(
  endpoint,
  options = {}
) {
  const token = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {

    const message =
      data?.detail ||
      data?.message ||
      "Something went wrong.";

    throw new Error(message);
  }

  return data;
}


// ============================================================
// GET
// ============================================================

export function apiGet(endpoint) {

  return apiRequest(
    endpoint,
    {
      method: "GET",
    }
  );
}


// ============================================================
// POST
// ============================================================

export function apiPost(
  endpoint,
  body
) {

  return apiRequest(
    endpoint,
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
}


// ============================================================
// PATCH
// ============================================================

export function apiPatch(
  endpoint,
  body
) {

  return apiRequest(
    endpoint,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    }
  );
}


// ============================================================
// PUT
// ============================================================

export function apiPut(
  endpoint,
  body
) {

  return apiRequest(
    endpoint,
    {
      method: "PUT",
      body: JSON.stringify(body),
    }
  );
}


// ============================================================
// DELETE
// ============================================================

export function apiDelete(endpoint) {

  return apiRequest(
    endpoint,
    {
      method: "DELETE",
    }
  );
}