const LLM_URL = import.meta.env.VITE_LLM_API_URL;
const RAW_BASE = import.meta.env.VITE_BASE_URL || "";
const BASE_URL = String(RAW_BASE).replace(/\/+$/, "");

/** GET list from our backend: /api/districts-new/list */
export const getDistricts = async () => {
  try {
    if (!BASE_URL) {
      throw new Error("VITE_BASE_URL is not set");
    }
    const response = await fetch(`${BASE_URL}/api/districts-new/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading districts:", error);
    throw error;
  }
};

/** GET by id — resolve from backend list (no digi9) */
export const getDistrictById = async (id) => {
  try {
    const list = await getDistricts();
    const districts = list?.data?.districts || [];
    const found = districts.find((d) => {
      const did =
        typeof d._id === "object" && d._id?.$oid ? d._id.$oid : String(d._id);
      return did === String(id);
    });
    if (!found) {
      return { success: false, message: "District not found" };
    }
    return { success: true, data: found };
  } catch (error) {
    console.error("Error loading district:", error);
    throw error;
  }
};

export const createDistrict = async (districtData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/districts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(districtData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating district:", error);
    throw error;
  }
};

export const deleteDistrict = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/districts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting district:", error);
    throw error;
  }
};

export const updateDistrict = async (id, districtData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/districts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(districtData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating district:", error);
    throw error;
  }
};
