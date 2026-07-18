const LLM_URL = import.meta.env.VITE_LLM_API_URL;
const RAW_BASE = import.meta.env.VITE_BASE_URL || "";
const BASE_URL = String(RAW_BASE).replace(/\/+$/, "");

/** GET list from our backend — normalize to { data: { photo_categories } } for admin tables */
export const getPhotoCategories = async () => {
  try {
    if (!BASE_URL) {
      throw new Error("VITE_BASE_URL is not set");
    }
    const response = await fetch(`${BASE_URL}/api/photo-category/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data?.success && Array.isArray(data.data)) {
      return { success: true, data: { photo_categories: data.data } };
    }
    if (data?.data?.photo_categories) {
      return data;
    }
    return data;
  } catch (error) {
    console.error("Error loading photo categories:", error);
    throw error;
  }
};

export const getPhotoCategoryById = async (id) => {
  try {
    const list = await getPhotoCategories();
    const categories = list?.data?.photo_categories || [];
    const found = categories.find((c) => {
      const cid =
        typeof c._id === "object" && c._id?.$oid ? c._id.$oid : String(c._id);
      return cid === String(id);
    });
    if (!found) {
      return { success: false, message: "Photo category not found" };
    }
    return { success: true, data: found };
  } catch (error) {
    console.error("Error loading photo category:", error);
    throw error;
  }
};

export const createPhotoCategory = async (categoryData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/photo-category/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating photo category:", error);
    throw error;
  }
};

export const deletePhotoCategory = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/photo-category/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting photo category:", error);
    throw error;
  }
};

export const updatePhotoCategory = async (id, categoryData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/photo-category/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating photo category:", error);
    throw error;
  }
};
