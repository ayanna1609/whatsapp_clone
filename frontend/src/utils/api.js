// src/utils/api.js

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; // Backend base URL

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};
