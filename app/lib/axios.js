import axios from "axios";

const api = axios.create({
  baseURL: "https://qrapi.vocalheart.com/api",
  withCredentials: true, // 🔥 Cookie ke liye ZARURI hai
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;