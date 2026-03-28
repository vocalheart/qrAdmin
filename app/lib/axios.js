import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, //  Cookie ke liye ZARURI hai
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;