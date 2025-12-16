import axios from "axios";

const api = axios.create({
    // baseURL: process.env.REACT_APP_API_URL || "/api" // works with CRA proxy
    baseURL: "https://supply-chain-dashboard-sqlv.onrender.com",
});

export default api;
