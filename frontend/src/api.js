import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});
//before every request api sends, it checks localStorage for a saved token and attaches it as an Authorization header automatically.
// This means you won't need to manually add the header in every component that calls a protected route — it's handled centrally, once.

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
