import axiosOriginal from "axios";

const axiosTaxi = axiosOriginal.create({
//   baseURL: "http://186.123.85.22:3000",
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

export default axiosTaxi;
