import axiosOriginal from "axios";

const axiosTaxi = axiosOriginal.create({
  //   baseURL: "http://186.123.85.22:3000",
  baseURL: import.meta.env.VITE_APP_RUTA,
  timeout: 10000,
});

export default axiosTaxi;
