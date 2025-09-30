import { useState, useEffect, useCallback } from "react";
import axiosClient from "../axiosClient";

const CACHE_KEY = "gallery_cache"; // ✅ diganti biar gak tabrakan sama news
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

const getCache = () => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
      return parsed.data;
    }
  }
  return null;
};

const setCache = (data) => {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ data, timestamp: Date.now() })
  );
};

const useGallery = () => {
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ cek cache dulu
      const cached = getCache();
      if (cached) {
        setGalleryData(cached);
        setLoading(false);
        return;
      }

      // ✅ ambil dari API
      const response = await axiosClient.get("/api/gallery/list");
      const data = response.data.data || [];

      setGalleryData(data);
      setCache(data); // simpan ke cache
    } catch (err) {
      setError(err);
      console.error("Error Fetching Gallery:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    localStorage.removeItem(CACHE_KEY); // hapus cache biar fresh
    fetchGallery();
  }, [fetchGallery]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const addGallery = async (data) => {
    try {
      setActionLoading(true);
      setError(null);
      await axiosClient.post("/api/gallery/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refetch();
      return { success: true };
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || err);
      console.error("Error adding gallery:", err);
      return { success: false, error: err };
    } finally {
      setActionLoading(false);
    }
  };

  const show = async (id) => {
    try {
      setActionLoading(true);
      setError(null);
      const response = await axiosClient.get(`/api/gallery/show/${id}`);
      return { success: true, data: response.data.data };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setActionLoading(false);
    }
  };

  const updateGallery = async (id, data) => {
    try {
      setActionLoading(true);
      setError(null);
      await axiosClient.post(`/api/gallery/${id}`, data);
      await refetch();
      return { success: true };
    } catch (err) {
      setError(err);
      console.error("Error updating gallery:", err);
      return { success: false, error: err };
    } finally {
      setActionLoading(false);
    }
  };

  const deleteGallery = async (id) => {
    try {
      setActionLoading(true);
      setError(null);
      await axiosClient.post(`/api/gallery/delete/${id}`);
      await refetch();
      return { success: true };
    } catch (err) {
      setError(err);
      console.error("Error deleting gallery:", err);
      return { success: false, error: err };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    // Data
    galleryData,
    loading,
    error,
    actionLoading,
    show,

    // Actions
    addGallery,
    updateGallery,
    deleteGallery,
    refetch,
  };
};

export default useGallery;
