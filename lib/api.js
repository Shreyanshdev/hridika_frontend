import api from "./axios";

// ---- PRODUCTS ----
export const getProductsDash = () => api.get("/products");
export const getProducts = () => api.get("/api/products");
export const getProductById = (id) => api.get(`/products/${id}`);
export const getCategories = () => api.get("/categories");
export const getProductsByCategory = (category) => api.get(`/products/category/${category}`);

// ---- AUTH ----
export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/register", data);
export const getProfile = () => api.get("/profile");
export const googleLogin = (token) => api.post("/auth/google-login", { token });
export const googleVerify = (token) => api.post("/auth/google-verify", { token });
export const requestEmailOtp = (email) => api.post("/auth/request-email-otp", { email });
export const verifyEmailOtp = (email, otp) => api.post("/auth/verify-email-otp", { email, otp });
export const requestPhoneOtp = (phone) => api.post("/auth/request-phone-otp", { phone });
export const verifyPhoneOtp = (phone, otp, sessionToken) => api.post("/auth/verify-phone-otp", { phone, otp, sessionToken });
export const getFullProfile = () => api.get("/auth/profile/full");
export const updateProfile = (data) => api.put("/auth/update-profile", data);

// ---- CART ----
export const getCart = () => api.get("/cart");
export const addToCart = (data) => api.post("/cart", data);
export const removeFromCart = (productId) => api.delete(`/cart/${productId}`);

// ---- ORDERS ----
export const getOrders = () => api.get("/orders");
export const createOrder = (data) => api.post("/orders", data);

// ---- CONTACT & NEWSLETTER ----
export const submitContact = (data) => api.post("/api/contact", data);
export const subscribeNewsletter = (email) => api.post("/api/newsletter/subscribe", { email });

export default api;
