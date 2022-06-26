import axios from "axios";
import env from "../../env.json";

const baseApi = axios.create({
  baseURL: env.server.path,
});
baseApi.interceptors.response.use(function ({ data }) {
  return data;
});

export const cmsApi = axios.create({
  baseURL: env.cms.path,
  headers: {
    Authorization: `Bearer ${env.cms.token}`,
  },
});
cmsApi.interceptors.response.use(function ({ data }) {
  return data;
});

export default baseApi;
