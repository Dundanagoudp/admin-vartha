const LLM_URL = import.meta.env.VITE_LLM_API_URL;
const RAW_BASE = import.meta.env.VITE_BASE_URL || "";
const BASE_URL = String(RAW_BASE).replace(/\/+$/, "");

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Create New Article (existing digi9 flow — unchanged for now)
export const createNewArticle = async (data) => {
  try {
    const response = await fetch(`${LLM_URL}/api/newarticles/create`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating new article:", error);
    throw error;
  }
};

/**
 * List Our Services — same GET as public website:
 * GET {VITE_BASE_URL}/api/newarticles/list
 * → { success, data: { newarticles: [...] } }
 */
export const listNewArticles = async (page = 1, page_size = 20) => {
  if (!BASE_URL) {
    throw new Error("VITE_BASE_URL is not set");
  }

  const response = await fetch(`${BASE_URL}/api/newarticles/list`, {
    method: "GET",
    headers: authHeaders(),
  });

  let result = null;
  try {
    result = await response.json();
  } catch (_) {
    result = null;
  }

  if (!response.ok) {
    throw new Error(result?.message || result?.error || "Failed to list services");
  }

  const newarticles = Array.isArray(result?.data?.newarticles)
    ? result.data.newarticles
    : [];

  // Keep shape NotificationServes already understands
  return {
    success: true,
    data: { newarticles },
    total: newarticles.length,
    page,
    page_size,
  };
};

// Get New Article by ID (existing digi9 flow — unchanged for now)
export const getNewArticleById = async (newarticle_id) => {
  try {
    const response = await fetch(
      `${LLM_URL}/api/newarticles/${newarticle_id}`,
      {
        method: "GET",
        headers: authHeaders(),
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error getting new article by ID:", error);
    throw error;
  }
};

// Update New Article (existing digi9 flow — unchanged for now)
export const updateNewArticle = async (newarticle_id, data) => {
  try {
    const response = await fetch(
      `${LLM_URL}/api/newarticles/${newarticle_id}`,
      {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating new article:", error);
    throw error;
  }
};

// Delete New Article — use same backend as website list
export const deleteNewArticle = async (newarticle_id) => {
  if (!BASE_URL) {
    throw new Error("VITE_BASE_URL is not set");
  }

  const response = await fetch(
    `${BASE_URL}/api/newarticles/${newarticle_id}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
  );

  let result = null;
  try {
    result = await response.json();
  } catch (_) {
    result = null;
  }

  if (!response.ok) {
    throw new Error(result?.message || result?.error || "Failed to delete service");
  }

  return result;
};
