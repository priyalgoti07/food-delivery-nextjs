import axios from "axios";

const isServer = typeof window === "undefined";

const DEFAULT_BASE_URL = isServer
    ? process.env.NEXT_PUBLIC_API_BASE_URL // Server (Vercel or local)
    : process.env.NEXT_PUBLIC_API_BASE_URL; // Client browser

// If nothing found → fallback to localhost (dev only)
const FINAL_BASE_URL = DEFAULT_BASE_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: FINAL_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

const formatError = (error) => {
    if (error.response) {
        const { status, data } = error.response;
        const message =
            data?.message || data?.error || `Request failed with status ${status}`;
        return { message, status, data };
    }

    if (error.request) {
        return { message: "No response received from server", status: null, data: null };
    }

    return { message: error.message || "Unexpected error", status: null, data: null };
};

api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("authToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(formatError(error))
);

api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(formatError(error))
);

const handleRequest = async (promise) => {
    try {
        const response = await promise;
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const request = {
    get: (url, config = {}) => handleRequest(api.get(url, config)),
    post: (url, data, config = {}) => handleRequest(api.post(url, data, config)),
    put: (url, data, config = {}) => handleRequest(api.put(url, data, config)),
    patch: (url, data, config = {}) => handleRequest(api.patch(url, data, config)),
    delete: (url, config = {}) => handleRequest(api.delete(url, config)),
};

export default api;

