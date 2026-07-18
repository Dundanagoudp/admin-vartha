const RAW_BASE = import.meta.env.VITE_BASE_URL || "";
const BASE_URL = String(RAW_BASE).replace(/\/+$/, "");

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseJsonResponse(response, fallbackMessage) {
  let result = null;
  try {
    result = await response.json();
  } catch (_) {
    result = null;
  }
  if (!response.ok) {
    throw new Error(result?.message || fallbackMessage);
  }
  return result;
}

/** GET current Live TV (existing URL + online status) */
export const getLiveTv = async () => {
  if (!BASE_URL) {
    throw new Error("VITE_BASE_URL is not set");
  }
  const response = await fetch(`${BASE_URL}/api/live-tv`, {
    method: "GET",
    headers: authHeaders(),
  });
  return parseJsonResponse(response, "Failed to fetch Live TV");
};

/** POST create/update Live TV (replace URL and set online) */
export const upsertLiveTv = async (payload) => {
  if (!BASE_URL) {
    throw new Error("VITE_BASE_URL is not set");
  }
  const response = await fetch(`${BASE_URL}/api/live-tv`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return parseJsonResponse(response, "Failed to update Live TV");
};

/** POST go offline (keeps saved URL for next go-live) */
export const setLiveTvOffline = async () => {
  if (!BASE_URL) {
    throw new Error("VITE_BASE_URL is not set");
  }
  const response = await fetch(`${BASE_URL}/api/live-tv/offline`, {
    method: "POST",
    headers: authHeaders(),
  });
  return parseJsonResponse(response, "Failed to set Live TV offline");
};
