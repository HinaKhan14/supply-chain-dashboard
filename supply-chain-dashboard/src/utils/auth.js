// src/utils/auth.js
// Lightweight token utilities: read token, check expiry, parse payload

export const getToken = () => {
    try {
        return localStorage.getItem("token");
    } catch {
        return null;
    }
};

// decode base64url safely
const base64UrlDecode = (str) => {
    if (!str) return null;
    // base64url -> base64
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    // pad with =
    while (str.length % 4) str += "=";
    try {
        return atob(str);
    } catch {
        return null;
    }
};

export const getTokenPayload = (token) => {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = base64UrlDecode(parts[1]);
    if (!payload) return null;
    try {
        return JSON.parse(payload);
    } catch {
        return null;
    }
};

export const isTokenValid = (token) => {
    if (!token) return false;
    const payload = getTokenPayload(token);
    if (!payload) return false;
    // exp is in seconds since epoch
    if (payload.exp && typeof payload.exp === "number") {
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
    }
    // if no exp claim, consider token valid (optional) — we'll treat as invalid for safety
    return false;
};

export const logout = () => {
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    } catch { }
};
