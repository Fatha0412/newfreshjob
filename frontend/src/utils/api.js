
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("JOBS@RSR_user");
    let token = null;
    if (userData) {
      try {
        token = JSON.parse(userData).token;
      } catch (e) {
        token = null;
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Do NOT set Content-Type for FormData; let Axios handle it
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("JOBS@RSR_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;