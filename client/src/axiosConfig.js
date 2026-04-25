// import axios from "axios";

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "http://localhost:5000";

// export default axios;

import axios from "axios";

const API = import.meta.env.VITE_API_URL;

if (!API) {
  throw new Error("VITE_API_URL is not defined");
}

const instance = axios.create({
  baseURL: API,
  withCredentials: true
});

export default instance;