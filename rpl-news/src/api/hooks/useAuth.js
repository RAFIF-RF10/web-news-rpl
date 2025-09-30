// Cache untuk daftar user (admin)
const USERS_CACHE_KEY = "users_cache";
const USERS_CACHE_DURATION = 2 * 60 * 1000; // 2 menit

const getUsersCache = () => {
  const cached = localStorage.getItem(USERS_CACHE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < USERS_CACHE_DURATION) {
      return parsed.data;
    }
  }
  return null;
};

const setUsersCache = (data) => {
  localStorage.setItem(
    USERS_CACHE_KEY,
    JSON.stringify({ data, timestamp: Date.now() })
  );
};

const clearUsersCache = () => {
  localStorage.removeItem(USERS_CACHE_KEY);
};
import { useState, useEffect, useCallback } from "react";
import axiosClient from "../axiosClient";


// User cache config
const USER_CACHE_KEY = "user_cache";
const USER_CACHE_DURATION = 5 * 60 * 1000; // 5 menit

const getUserCache = () => {
  const cached = localStorage.getItem(USER_CACHE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < USER_CACHE_DURATION) {
      return parsed.data;
    }
  }
  return null;
};

const setUserCache = (data) => {
  localStorage.setItem(
    USER_CACHE_KEY,
    JSON.stringify({ data, timestamp: Date.now() })
  );
};

const clearUserCache = () => {
  localStorage.removeItem(USER_CACHE_KEY);
};

export const useAuth = () => {
  const [user, setUser] = useState(() => getUserCache());
  const [isAuthenticated, setIsAuthenticated] = useState(!!getUserCache());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount
  // const checkAuth = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setLoading(false);
  //       return;
  //     }
  //     axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //     const response = await axiosClient.get("/api/auth/me");
  //     if (response.data.success) {
  //       setUser(response.data.data);
  //       setIsAuthenticated(true);
  //     } else {
  //       // Jika backend mengembalikan success: false, jangan langsung logout, biarkan user tetap login
  //       setUser(null);
  //       setIsAuthenticated(false);
  //     }
  //   } catch (err) {
  //     if (err.response && err.response.status === 401) {
  //       localStorage.removeItem("token");
  //       delete axiosClient.defaults.headers.common["Authorization"];
  //       setUser(null);
  //       setIsAuthenticated(false);
  //     } else {
  //       console.error("Auth check failed:", err);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  const login = useCallback(async (credentials) => {
    try {
      setActionLoading(true);
        const cached = getUsersCache();
        if (cached) {
          return { success: true, data: cached, fromCache: true };
        }
      setError(null);

      const response = await axiosClient.post("/api/auth/login", credentials);

      if (response.data.success) {
        const { token, user: userData } = response.data.data;

        // Simpan token ke localStorage
        localStorage.setItem("token", token);

        // Set authorization header untuk request selanjutnya
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        // Update state & cache
        setUser(userData);
        setUserCache(userData);
        setIsAuthenticated(true);

        return { success: true, data: userData };
      } else {
        throw new Error(response.data.message || "Login gagal");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login gagal";
      setError(errorMessage);
      console.error("Login error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
  try {
    setActionLoading(true);
    setError(null);

    const response = await axiosClient.post("/api/auth/register", userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      const { token, user: newUser } = response.data.data;

      if (token) {
        localStorage.setItem("token", token);
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(newUser);
        setUserCache(newUser);
        setIsAuthenticated(true);
      }

      return { success: true, data: newUser };
    } else {
      throw new Error(response.data.message || "Registrasi gagal");
    }
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Registrasi gagal";
    setError(errorMessage);
    console.error("Register error:", err);
    return { success: false, error: errorMessage };
  } finally {
    setActionLoading(false);
  }
}, []);


  // Logout function
  const logout = useCallback(async () => {
    try {
      setActionLoading(true);

      try {
        await axiosClient.post("/api/auth/logout");
      } catch (err) {
        // Ignore logout endpoint errors
        console.warn("Logout endpoint error:", err);
      }

      localStorage.removeItem("token");
      clearUserCache();
      delete axiosClient.defaults.headers.common["Authorization"];
      setUser(null);
      setIsAuthenticated(false);

      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      return { success: false, error: err.message };
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (id, profileData, isFormData = false) => {
  try {
    setActionLoading(true);
    setError(null);

    const response = await axiosClient.post(
      `/api/auth/update-user/${id}`,
      profileData,
      // isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {}
    );

    const updatedUser = response.data.data;

    return { success: true, data: updatedUser };
  } catch (err) {
    setError(err.response?.data?.message || err.message);
    console.error("Error updating profile:", err);
    return { success: false, error: err.response?.data?.message || err.message };
  } finally {
    setActionLoading(false);
  }
}, []);


  // Change password
  const changePassword = useCallback(async (old_password, new_password) => {
    try {
      setActionLoading(true);
      setError(null);
      const response = await axiosClient.post("/api/auth/change-password", {
        old_password,
        new_password,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return {
        success: false,
        error: err.response?.data?.message || err.message,
      };
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Forgot password
  const forgotPassword = useCallback(async (email) => {
    try {
      setActionLoading(true);
      setError(null);

      const response = await axiosClient.post("/api/auth/forgot-password", {
        email,
      });

      if (response.data.success) {
        return { success: true, message: "Email reset password telah dikirim" };
      } else {
        throw new Error(response.data.message || "Gagal mengirim email reset");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal mengirim email reset";
      setError(errorMessage);
      console.error("Forgot password error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const registerUser = useCallback(async (userData) => {
    try {
      setActionLoading(true);
      setError(null);
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const response = await axiosClient.post("/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return {
        success: false,
        error: err.response?.data?.message || err.message,
      };
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Admin edit user
  const updateUser = useCallback(async (id, profileData, isFormData = false) => {
    console.log(id)
  try {
    setActionLoading(true);
    setError(null);

    const response = await axiosClient.post(
      `/api/auth/update-profile/${id}`,
      profileData,
      // isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {}
    );

    const updatedUser = response.data.data;

    return { success: true, data: updatedUser };
  } catch (err) {
    setError(err.response?.data?.message || err.message);
    console.error("Error updating profile:", err);
    return { success: false, error: err.response?.data?.message || err.message };
  } finally {
    setActionLoading(false);
  }
}, []);


  const getUser = useCallback(async (id) => {
    try {
      setActionLoading(true);
      setError(null);
      const response = await axiosClient.get("api/auth/user/");
      return response.data;
    } catch (err) {
      setError(err.responsee?.data?.message || err.message);
      return {
        success: false,
        error: err.response?.data?.message || err.message,
      };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const getAllUsers = useCallback(async () => {
    try {
      setActionLoading(true);
      setError(null);
      const response = await axiosClient.get("api/auth/allUsers");
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return {
        success: false,
        error: err.response?.data?.message || err.message,
      };
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Admin delete user
  const deleteUser = useCallback(async (id) => {
    try {
      setActionLoading(true);
      setError(null);
      const response = await axiosClient.post(`/api/auth/delete-user/${id}`);
        clearUsersCache(); // Hapus cache agar data baru diambil
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return {
        success: false,
        error: err.response?.data?.message || err.message,
      };
    } finally {
      setActionLoading(false);
    }
  }, []);
  // Reset password
  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      setActionLoading(true);
      setError(null);

      const response = await axiosClient.post("/api/auth/reset-password", {
        token,
        password: newPassword,
      });

      if (response.data.success) {
        return { success: true, message: "Password berhasil direset" };
      } else {
        throw new Error(response.data.message || "Gagal reset password");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Gagal reset password";
      setError(errorMessage);
      console.error("Reset password error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check authentication on mount
  // useEffect(() => {
  //   checkAuth();
  // }, [checkAuth]);

  // Axios interceptor untuk handle token expiration
  useEffect(() => {
    const interceptor = axiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired atau tidak valid
          localStorage.removeItem("token");
          clearUserCache();
          delete axiosClient.defaults.headers.common["Authorization"];
          setUser(null);
          setIsAuthenticated(false);
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor
    return () => {
      axiosClient.interceptors.response.eject(interceptor);
    };
  }, []);

  return {
    // State
    user,
    isAuthenticated,
    loading,
    actionLoading,
    error,

    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    // checkAuth,
    clearError,
    registerUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
  };
};
