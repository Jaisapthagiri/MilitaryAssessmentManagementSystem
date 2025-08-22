import React, { useState } from "react";
import api from "../services/api";

function SafeSideImage() {

  const SOURCES = [
    "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=80", 
    "https://images.unsplash.com/photo-1584382296080-61a8ef9f97f6?auto=format&fit=crop&w=1200&q=80", 

    `data:image/svg+xml;utf8,
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1600'>
        <defs>
          <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
            <stop stop-color='%2322c55e' offset='0'/>
            <stop stop-color='%23165f3d' offset='1'/>
          </linearGradient>
        </defs>
        <rect width='100%' height='100%' fill='url(%23g)'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='34' fill='white' font-family='sans-serif'>
          Military Asset Management
        </text>
      </svg>`
  ];

  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    setLoaded(false);
    setIdx((i) => (i < SOURCES.length - 1 ? i + 1 : i));
  };

  return (
    <div className="hidden md:flex w-1/2 bg-gray-200 relative">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-300" />}
      <img
        key={idx}
        src={SOURCES[idx]}
        alt="Military assets"
        className="w-full h-full object-cover"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        referrerPolicy="no-referrer"
        decoding="async"
      />
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      if (data.baseId) localStorage.setItem("baseId", data.baseId);
      window.location.href = "/";
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">

        <SafeSideImage />

        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center">
            Military Asset Management System
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Secure access to manage military assets effectively.
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                className="w-full mt-1 border rounded-xl p-3 focus:ring-2 focus:ring-green-600 focus:outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full mt-1 border rounded-xl p-3 focus:ring-2 focus:ring-green-600 focus:outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {err && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                {err}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-green-700 text-white font-semibold shadow hover:bg-green-800 transform hover:-translate-y-0.5 transition-all"
            >
              Login
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-6 text-center">
            Try credentials:
            <br />
            <span className="font-mono">admin@mil.gov</span> / <span className="font-mono">Admin@123</span>
            <br />
            <span className="font-mono">alpha.log@mil.gov</span> / <span className="font-mono">Alpha@123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
