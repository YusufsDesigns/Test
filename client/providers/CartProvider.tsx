// components/providers/CartProvider.tsx
"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { SanityProduct } from "../lib/sanity";

// Cart item interface
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  mainImage: SanityProduct["mainImage"];
  slug: SanityProduct["slug"];
  inStock: boolean;
  size?: string;
  color?: string;
  quantity: number;
}

// Cart state interface
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
}

// Cart actions
type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

// Cart context interface
interface CartContextType extends CartState {
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemCount: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  getUniqueItemId: (item: Partial<CartItem>) => string;
}

// Generate unique ID for cart items (including variants)
const generateUniqueItemId = (item: Partial<CartItem>): string => {
  const parts = [item._id];
  if (item.size) parts.push(`size:${item.size}`);
  if (item.color) parts.push(`color:${item.color}`);
  return parts.join("-");
};

// Improved cookie utilities with error handling
const setCookie = (name: string, value: string, days: number = 30): boolean => {
  try {
    if (typeof document === "undefined") return false;
    
    const encoded = encodeURIComponent(value);
    if (encoded.length > 4000) {
      console.warn(`Cookie ${name} is too large (${encoded.length} chars). Consider using localStorage.`);
      return false;
    }
    
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encoded}; expires=${expires}; path=/; SameSite=Lax`;
    return true;
  } catch (error) {
    console.error(`Error setting cookie ${name}:`, error);
    return false;
  }
};

const getCookie = (name: string): string | null => {
  try {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(";").shift();
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    return null;
  } catch (error) {
    console.error(`Error reading cookie ${name}:`, error);
    return null;
  }
};

const deleteCookie = (name: string): void => {
  try {
    if (typeof document !== "undefined") {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  } catch (error) {
    console.error(`Error deleting cookie ${name}:`, error);
  }
};

// Cart reducer with improved ID handling
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
      
    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "ADD_ITEM": {
      try {
        const uniqueId = generateUniqueItemId(action.payload);
        const existingItemIndex = state.items.findIndex(
          (item) => generateUniqueItemId(item) === uniqueId
        );

        let newItems: CartItem[];

        if (existingItemIndex >= 0) {
          newItems = state.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          );
        } else {
          newItems = [...state.items, action.payload as CartItem];
        }

        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return { 
          ...state, 
          items: newItems, 
          totalItems, 
          totalPrice,
          error: null 
        };
      } catch (error) {
        console.error('Error adding item to cart:', error);
        return { 
          ...state, 
          error: 'Failed to add item to cart' 
        };
      }
    }

    case "REMOVE_ITEM": {
      try {
        const newItems = state.items.filter(
          (item) => generateUniqueItemId(item) !== action.payload
        );

        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return { 
          ...state, 
          items: newItems, 
          totalItems, 
          totalPrice,
          error: null 
        };
      } catch (error) {
        console.error('Error removing item from cart:', error);
        return { 
          ...state, 
          error: 'Failed to remove item from cart' 
        };
      }
    }

    case "UPDATE_QUANTITY": {
      try {
        if (action.payload.quantity <= 0) {
          return cartReducer(state, {
            type: "REMOVE_ITEM",
            payload: action.payload.id,
          });
        }

        const newItems = state.items.map((item) =>
          generateUniqueItemId(item) === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );

        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return { 
          ...state, 
          items: newItems, 
          totalItems, 
          totalPrice,
          error: null 
        };
      } catch (error) {
        console.error('Error updating quantity:', error);
        return { 
          ...state, 
          error: 'Failed to update item quantity' 
        };
      }
    }

    case "CLEAR_CART":
      return { 
        ...state, 
        items: [], 
        totalItems: 0, 
        totalPrice: 0,
        error: null 
      };

    case "LOAD_CART": {
      try {
        const totalItems = action.payload.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const totalPrice = action.payload.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return { 
          ...state, 
          items: action.payload, 
          totalItems, 
          totalPrice,
          isLoading: false,
          error: null 
        };
      } catch (error) {
        console.error('Error loading cart:', error);
        return { 
          ...state, 
          isLoading: false,
          error: 'Failed to load cart data' 
        };
      }
    }

    default:
      return state;
  }
};

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: true,
  error: null,
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from cookies on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadCart = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        
        const savedCart = getCookie("aleebansparks_cart");
        if (savedCart && isMounted) {
          const cartItems = JSON.parse(savedCart);
          // Validate cart items structure
          if (Array.isArray(cartItems)) {
            dispatch({ type: "LOAD_CART", payload: cartItems });
          } else {
            throw new Error('Invalid cart data structure');
          }
        } else if (isMounted) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Error loading cart from cookies:", error);
        if (isMounted) {
          dispatch({ type: "SET_ERROR", payload: "Failed to load cart" });
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    loadCart();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save cart to cookies whenever items change
  useEffect(() => {
    if (!state.isLoading && !state.error) {
      if (state.items.length > 0) {
        const success = setCookie("aleebansparks_cart", JSON.stringify(state.items), 30);
        if (!success) {
          dispatch({ type: "SET_ERROR", payload: "Cart is too large to save" });
        }
      } else {
        deleteCookie("aleebansparks_cart");
      }
    }
  }, [state.items, state.isLoading, state.error]);

  // Memoized cart actions
  const addToCart = useCallback((item: Omit<CartItem, "quantity"> & { quantity: number }) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
    deleteCookie("aleebansparks_cart");
  }, []);

  const getCartItemCount = useCallback((productId: string): number => {
    return state.items
      .filter((item) => item._id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);

  const isInCart = useCallback((productId: string): boolean => {
    return state.items.some((item) => item._id === productId);
  }, [state.items]);

  const getUniqueItemId = useCallback((item: Partial<CartItem>): string => {
    return generateUniqueItemId(item);
  }, []);

  const contextValue: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    isInCart,
    getUniqueItemId,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};