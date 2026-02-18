"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const storedWishlist = localStorage.getItem("wishlist");
        if (storedWishlist) {
            try {
                setWishlist(JSON.parse(storedWishlist));
            } catch (error) {
                console.error("Failed to parse wishlist:", error);
                localStorage.removeItem("wishlist");
            }
        }
    }, []);

    const addToWishlist = (product) => {
        setWishlist((prev) => {
            if (prev.find((item) => item.id === product.id)) return prev;
            const updated = [...prev, product];
            localStorage.setItem("wishlist", JSON.stringify(updated));
            return updated;
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlist((prev) => {
            const updated = prev.filter((item) => item.id !== productId);
            localStorage.setItem("wishlist", JSON.stringify(updated));
            return updated;
        });
    };

    const isInWishlist = (productId) => {
        return wishlist.some((item) => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
