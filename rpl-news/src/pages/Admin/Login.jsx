import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axiosClient from "../../api/axiosClient";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosClient.post("/api/auth/login", credentials);
      console.log("Response login:", res.data);

      const token = res.data.data?.token || res.data.token || res.data.data?.access_token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      if (!token) {
        throw new Error("Token tidak ditemukan di response API!");
      }
      console.log(res);
      if(res.data.data && res.data.data.role === 'admin') {
        navigate("/admin");
      } else if(res.data.data && res.data.data.role === 'author') {
        navigate("/author");
        console.log('author');
        
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login gagal");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="w-full max-w-5xl flex rounded-2xl shadow-xl overflow-hidden m-4 md:m-8 lg:m-12">
        {/* Kontainer Form (Kiri) */}
        <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Admin Login
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
            </button>
          </form>
        </div>

        <div className="hidden md:block w-1/2 bg-blue-800">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop"
            alt="Admin Dashboard"
            className="w-full h-full object-cover rounded-tr-2xl rounded-br-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;