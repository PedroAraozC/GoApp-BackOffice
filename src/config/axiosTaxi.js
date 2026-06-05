import axiosOriginal from "axios";

const axiosTaxi = axiosOriginal.create({
  //   baseURL: "http://186.123.85.22:3000",
  baseURL: import.meta.env.VITE_APP_RUTA,
  timeout: 10000,
});

axiosTaxi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosTaxi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosTaxi;
