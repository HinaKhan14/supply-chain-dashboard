import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "/api" // works with CRA proxy
});

export default api;
