const BASE_URL = import.meta.env.VITE_BASE_URL;

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const getLiveTv = async () => {
  const response = await fetch(`${BASE_URL}/api/live-tv`, {
    method: "GET",
    headers: authHeaders(),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch Live TV");
  }
  return result;
};

export const upsertLiveTv = async (payload) => {
  const response = await fetch(`${BASE_URL}/api/live-tv`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.message || "Failed to update Live TV");
  }
  return result;
};

export const setLiveTvOffline = async () => {
  const response = await fetch(`${BASE_URL}/api/live-tv/offline`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.message || "Failed to set Live TV offline");
  }
  return result;
};
