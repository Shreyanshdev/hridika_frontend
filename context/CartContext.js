"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCart } from "../lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const refreshCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            setCartCount(0);
            setLoading(false);
            return;
        }

        try {
            const res = await getCart();
            const items = (res.data || []).map(item => ({
                ...item,
                size: item.size || ""
            }));
            setCartItems(items);
            // Calculate total quantity
            const count = items.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(count);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
            // On error, we keep the previous items but maybe we should show an error state
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const updateLocalItem = useCallback((productId, updates) => {
        setCartItems(prev => prev.map(item =>
            item.product_id === productId ? { ...item, ...updates } : item
        ));
    }, []);

    return (
        <CartContext.Provider value={{ cartItems, cartCount, refreshCart, updateLocalItem, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
