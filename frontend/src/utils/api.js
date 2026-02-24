// src/utils/api.js

// In production (Vercel), REACT_APP_API_URL must be set to the backend URL (e.g. https://your-app.onrender.com)
// In development, it falls back to localhost:5000
export const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");
console.log("Using API_URL:", API_URL);

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const registerUser = async (name, email, password) => {
  const res = await fetch(`${API_URL}/api/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};
