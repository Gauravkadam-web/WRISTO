'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/services/apiClient';
import { authService } from '@/services/authService';

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
    async function initWishlist() {
      // If authenticated, try fetching user's live wishlist from backend
      if (authService.isAuthenticated()) {
        try {
          const res = await apiClient.get<any>('/wishlist', 3000);
          if (res.data) {
            const serverList = Array.isArray(res.data)
              ? res.data.map((item: any) => (typeof item === 'string' ? item : item.productId || item.id))
              : (res.data.items || []).map((item: any) => item.productId || item.id);
            if (serverList.length > 0) {
              setWishlist(serverList);
              localStorage.setItem('wristo_wishlist', JSON.stringify(serverList));
              setIsLoaded(true);
              return;
            }
          }
        } catch {
          // Fall back to local storage
        }
      }

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
    }

    initWishlist();
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
    const exists = wishlist.includes(productId);

    if (exists) {
      added = false;
      setWishlist(prev => prev.filter(id => id !== productId));
      if (authService.isAuthenticated()) {
        apiClient.delete(`/wishlist/${encodeURIComponent(productId)}`).catch(() => {});
      }
    } else {
      added = true;
      setWishlist(prev => [...prev, productId]);
      if (authService.isAuthenticated()) {
        apiClient.post(`/wishlist/${encodeURIComponent(productId)}`).catch(() => {});
      }
    }
    return added;
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.includes(productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    if (authService.isAuthenticated()) {
      apiClient.delete('/wishlist').catch(() => {});
    }
  };

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
