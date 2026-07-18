import { message } from "antd";

const BASE_URL = import.meta.env.VITE_BASE_URL;
// ArticleService.js
const LLM_URL = import.meta.env.VITE_LLM_API_URL;  // <- not LLM_API_URL

const NEWS_TYPES = ["statenews", "districtnews", "specialnews", "articles"];

/**
 * Fast list for Manage Articles — uses paginated news-new APIs (already on our backend).
 * GET /api/news-new/getNewsByNewsType/:newsType?page=&limit=
 * Merges all types, newest first. POST create still uses digi9 (unchanged).
 */
export const getArticles = async (page = 1, limit = 50) => {
  try {
    if (!BASE_URL) {
      throw new Error("VITE_BASE_URL is not set");
    }

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 50);

    const results = await Promise.all(
      NEWS_TYPES.map(async (newsType) => {
        try {
          const response = await fetch(
            `${BASE_URL}/api/news-new/getNewsByNewsType/${newsType}?page=${safePage}&limit=${safeLimit}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );
          const json = await response.json();
          return Array.isArray(json?.data) ? json.data : [];
        } catch (err) {
          console.error(`getArticles ${newsType} error:`, err);
          return [];
        }
      })
    );

    const byId = new Map();
    results.flat().forEach((item) => {
      if (!item?._id) return;
      byId.set(String(item._id), item);
    });

    const data = Array.from(byId.values()).sort((a, b) => {
      const da = new Date(a.createdTime || a.publishedAt || a.createdAt || 0).getTime();
      const db = new Date(b.createdTime || b.publishedAt || b.createdAt || 0).getTime();
      return db - da;
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};

export const deleteArticle = async (articleId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/news/${articleId}`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`

       },  
    });

    return await response.json();
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};

export const createArticle = async (articleData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(articleData),
    });
    return await response.json();

  } catch (error) {
    message.error("Error creating article.");
    throw error;
  }
};

export const getArticleById = async (articleId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/news/${articleId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};


export const updateArticle = async (articleId, articleData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${LLM_URL}/api/${articleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(articleData),
    });
    return await response.json();
  } catch (error) {
    message.error("Error updating article.");
    throw error;
  }
};


export const approveNews = async (articleId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/news/approveNews/${articleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

      },
    });
    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-undef
    message.error("Error approving article.");
    throw error;
  }
};

export const getHistoryById = async (articleId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/news/getNewsHistory/${articleId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};

export const revertNewsByVersionNumber = async (articleId, currentVersion) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/news/revertNews/${articleId}/revert/${currentVersion}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error reverting and deleting:", error);
    throw error;
  }
};


export const deleteVersion = async (articleId, versionNumber) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/news/deleteVersion/${articleId}/delete/${versionNumber}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error deleting version:", error);
    throw error;
  }
};
