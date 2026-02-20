"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../lib/api";
import api from "../lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const token = localStorage.getItem("access_token");
            const refreshToken = localStorage.getItem("refresh_token");
            const storedUser = localStorage.getItem("user");

            if (token && storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error("Session restore failed", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await loginUser({ email, password });
        const { access_token, refresh_token, user } = res.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        return user;
    };

    const loginset = (user, access_token, refresh_token) => {
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        return user;
    };

    const register = async (username, email, password, phone) => {
        const res = await registerUser({
            user_id: username,
            username,
            email,
            password,
            phone,
        });
        const { access_token, refresh_token, user } = res.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        return user;
    };

    const loginWithGoogle = async (token) => {
        try {
            const res = await api.post("/auth/google-login", { token });
            const { access_token, refresh_token, user } = res.data;

            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
            return user;
        } catch (error) {
            console.error("Google Login Error:", error);
            throw error;
        }
    };

    const verifyWithGoogle = async (token) => {
        try {
            const res = await api.post("/auth/google-verify", { token });
            return res.data; // { email, name, email_verified }
        } catch (error) {
            console.error("Google Verify Error:", error);
            throw error;
        }
    };

    const requestEmailVerify = async (email) => {
        return api.post("/auth/request-email-otp", { email });
    };

    const confirmEmailVerify = async (email, otp) => {
        return api.post("/auth/verify-email-otp", { email, otp });
    };

    const requestPhoneVerify = async (phone) => {
        return api.post("/auth/request-phone-otp", { phone });
    };

    const confirmPhoneVerify = async (phone, otp, sessionToken) => {
        return api.post("/auth/verify-phone-otp", { phone, otp, sessionToken });
    };

    const updateUser = (updatedUser) => {
        const newUser = { ...user, ...updatedUser };
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, loginset, register, logout, updateUser, loginWithGoogle, verifyWithGoogle, requestEmailVerify, confirmEmailVerify, requestPhoneVerify, confirmPhoneVerify }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
