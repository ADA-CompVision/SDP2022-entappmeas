import defaultAxios from "axios";
import { stringify } from "qs";

const axios = defaultAxios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  paramsSerializer: {
    encode: (params) => stringify(params, { arrayFormat: "repeat" }),
  },
});

axios.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "An error occurred",
    ),
);

export default axios;
