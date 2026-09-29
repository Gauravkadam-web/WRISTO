'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface WishlistContextType {
  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wristo_wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      } else {
        setWishlist(['WRT-001', 'WRT-005', 'WRT-031']); // Default curated sample items
      }
    } catch {
      // Ignore
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('wristo_wishlist', JSON.stringify(wishlist));
      } catch {
        // Ignore
      }
    }
  }, [wishlist, isLoaded]);

  const toggleWishlist = (productId: string): boolean => {
    let added = false;
    setWishlist(prev => {
      if (prev.includes(productId)) {
        added = false;
        return prev.filter(id => id !== productId);
      } else {
        added = true;
        return [...prev, productId];
      }
    });
    return added;
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.includes(productId);
  };

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
