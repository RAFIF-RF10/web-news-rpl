import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
  headers: {
    // "Content-Type": "application/json"   ,
    "Accept": "application/json"
  }
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization; 
  }
  return config;
});

export default axiosClient;
