"use client";

import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginGoogleButton({ onSuccess, text = "signin_with" }) {
    const { loginWithGoogle } = useAuth();
    const router = useRouter();

    const handleSuccess = async (credentialResponse) => {
        if (onSuccess) {
            await onSuccess(credentialResponse);
            return;
        }

        try {
            const { credential } = credentialResponse;
            const user = await loginWithGoogle(credential);
            window.location.href = user.role === "admin" ? "/admin" : "/products-dashboard";
        } catch (error) {
            console.error("Google Login Failed", error);
        }
    };

    const handleError = () => {
        console.error("Google Login Failed");
    };

    return (
        <div className="w-full flex justify-center">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
                theme="outline"
                size="large"
                width="350"
                text={text}
                shape="rectangular"
            />
        </div>
    );
}
