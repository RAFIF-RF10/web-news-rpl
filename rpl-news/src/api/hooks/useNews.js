import { useState, useEffect, useCallback } from "react";
import axiosClient from "../axiosClient";

// =====================================================================================
// 🔹 Hook utama: untuk admin & umum
// =====================================================================================
const useNews = (isAdmin = false) => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = isAdmin ? "/api/news/list?all=true" : "/api/news/list";
      const response = await axiosClient.get(url);
      let data = response.data.data || [];

      if (!isAdmin) {
        data = data.filter((n) => n.status === "published");
      }

      setNewsData(data);
    } catch (err) {
      setError(err);
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // 🔹 Create news
  const createNews = useCallback(
    async (newsItem) => {
      try {
        setActionLoading(true);
        setError(null);
        const response = await axiosClient.post("/api/news/create", newsItem, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        await fetchNews();
        
        return { success: true, data: response.data.data };
      } catch (err) {
        setError(err);
        console.error("Error creating news:", err);
        return { success: false, error: err };
      } finally {
        setActionLoading(false);
      }
    },
    [fetchNews]
  );

  // 🔹 Update news
  const updateNews = useCallback(async (id, newsItem, isFormData = false) => {
    try {
      setActionLoading(true);
      setError(null);
      const response = await axiosClient.post(
        `/api/news/update/${id}`,
        newsItem,
        // isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {}
      );
      const updatedItem = response.data.data;
      
      setNewsData((prev) => 
        prev.map((item) => item.id === id ? updatedItem : item)
      );
      
      return { success: true, data: updatedItem };
    } catch (err) {
      setError(err);
      console.error("Error updating news:", err);
      return { success: false, error: err };
    } finally {
      setActionLoading(false);
    }
  }, []);

  // 🔹 Approve / Reject news
  const approveNews = useCallback(async (id, status = "published") => {
    try {
      setActionLoading(true);
      setError(null);
      
      if (status === "published") {
        await axiosClient.patch(`/api/news/approve/${id}`);
      } else {
        await axiosClient.patch(`/api/news/reject/${id}`);
      }
      
      setNewsData((prev) =>
        prev.map((item) => item.id === id ? { ...item, status } : item)
      );
      
      return { success: true };
    } catch (err) {
      setError(err);
      console.error("Error approving news:", err);
      return { success: false, error: err };
    } finally {
      setActionLoading(false);
    }
  }, []);

  // 🔹 Delete news
  const deleteNews = useCallback(async (id) => {
    try {
      setActionLoading(true);
      setError(null);
      await axiosClient.post(`/api/news/delete/${id}`);
      
      setNewsData((prev) => prev.filter((item) => item.id !== id));
      
      return { success: true };
    } catch (err) {
      setError(err);
      console.error("Error deleting news:", err);
      return { success: false, error: err };
    } finally {
      setActionLoading(false);
    }
  }, []);

  // 🔹 Get news by ID
  const getNewsById = useCallback(async (id) => {
    try {
      setActionLoading(true);
      setError(null);
      const response = await axiosClient.get(`/api/news/detail/${id}`);
      return { success: true, data: response.data.data };
    } catch (err) {
      setError(err);
      console.error("Error fetching news by id:", err);
      return { success: false, error: err };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    newsData,
    loading,
    error,
    actionLoading,
    createNews,
    updateNews,
    approveNews,
    deleteNews,
    getNewsById,
    refetch,
  };
};

// =====================================================================================
// 🔹 Hook khusus author
// =====================================================================================
export const useAuthorNews = (userId) => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNews = useCallback(
    async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        const url = "/api/news/list?all=true";
        const response = await axiosClient.get(url);
        const data = (response.data.data || []).filter(
          (n) => n.user_id === userId
        );

        setNewsData(data);
      } catch (err) {
        setError(err);
        console.error("Error fetching author news:", err);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const refetch = useCallback(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    newsData,
    loading,
    error,
    actionLoading,
    refetch,
  };
};

export default useNews;