// providers/WishlistProvider.tsx
"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { SanityProduct } from '../lib/sanity';

// Wishlist item interface
export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  mainImage: SanityProduct['mainImage'];
  slug: SanityProduct['slug'];
  inStock: boolean;
  addedAt: string;
}

// Wishlist state interface
interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
}

// Wishlist actions
type WishlistAction = 
  | { type: 'ADD_ITEM'; payload: Omit<WishlistItem, 'addedAt'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] };

// Wishlist context interface
interface WishlistContextType extends WishlistState {
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
}

// Cookie utilities (same as cart)
const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Wishlist reducer
const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Check if item already exists
      const existingItem = state.items.find(item => item._id === action.payload._id);
      
      if (existingItem) {
        return state; // Item already in wishlist
      }

      const newItem: WishlistItem = {
        ...action.payload,
        addedAt: new Date().toISOString()
      };

      const newItems = [newItem, ...state.items]; // Add to beginning for recent first
      
      return {
        items: newItems,
        totalItems: newItems.length
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item._id !== action.payload);
      
      return {
        items: newItems,
        totalItems: newItems.length
      };
    }

    case 'CLEAR_WISHLIST':
      return {
        items: [],
        totalItems: 0
      };

    case 'LOAD_WISHLIST': {
      return {
        items: action.payload,
        totalItems: action.payload.length
      };
    }

    default:
      return state;
  }
};

// Initial state
const initialState: WishlistState = {
  items: [],
  totalItems: 0
};

// Create context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Wishlist provider component
export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from cookies on mount
  useEffect(() => {
    const savedWishlist = getCookie('aleebansparks_wishlist');
    if (savedWishlist) {
      try {
        const wishlistItems = JSON.parse(savedWishlist);
        dispatch({ type: 'LOAD_WISHLIST', payload: wishlistItems });
      } catch (error) {
        console.error('Error loading wishlist from cookies:', error);
      }
    }
  }, []);

  // Save wishlist to cookies whenever state changes
  useEffect(() => {
    if (state.items.length > 0) {
      setCookie('aleebansparks_wishlist', JSON.stringify(state.items), 30);
    } else {
      deleteCookie('aleebansparks_wishlist');
    }
  }, [state.items]);

  // Wishlist actions
  const addToWishlist = (item: Omit<WishlistItem, 'addedAt'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeFromWishlist = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const isInWishlist = (productId: string): boolean => {
    return state.items.some(item => item._id === productId);
  };

  const toggleWishlist = (item: Omit<WishlistItem, 'addedAt'>) => {
    if (isInWishlist(item._id)) {
      removeFromWishlist(item._id);
    } else {
      addToWishlist(item);
    }
  };

  const contextValue: WishlistContextType = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    toggleWishlist
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use wishlist context
export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};