import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Refresh state — prevents multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response interceptor for silent refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const requestUrl = originalRequest?.url || '';

        // Don't try to refresh for auth endpoints — their 401s are intentional (wrong password, etc.)
        const isAuthEndpoint = requestUrl.includes('/auth/login') ||
            requestUrl.includes('/auth/register') ||
            requestUrl.includes('/auth/refresh') ||
            requestUrl.includes('/auth/google');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refresh_token");

            if (refreshToken) {
                try {
                    // Use raw axios (not the api instance) to avoid interceptor loop
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
                        headers: { Authorization: `Bearer ${refreshToken}` }
                    });

                    const { access_token } = response.data;
                    localStorage.setItem("access_token", access_token);

                    // Process queued requests with new token
                    processQueue(null, access_token);

                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError.response?.data || refreshError.message);
                    processQueue(refreshError, null);

                    // Clear auth and redirect to login
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("user");
                    if (typeof window !== "undefined") {
                        window.location.href = "/login";
                    }
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                // No refresh token — clear and redirect
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
