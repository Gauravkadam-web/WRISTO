'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types/product';
import { AppliedCoupon, OrderCartItem, OrderTotals } from '@/types/order';
import { calculateOrderTotals, validateCoupon, validateCouponAsync } from '@/services/orderService';

export interface CartItem {
  id: string;
  quantity: number;
}

export interface CartProductItem extends OrderCartItem {
  product: Product;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartProducts: CartProductItem[];
  appliedCoupon: AppliedCoupon | null;
  totals: OrderTotals;
  isGiftWrapped: boolean;
  giftMessage: string;
  isCartDrawerOpen: boolean;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  setIsGiftWrapped: (val: boolean) => void;
  setGiftMessage: (msg: string) => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Restore cart and coupon from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('wristo_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem('wristo_coupon');
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
      const savedGift = localStorage.getItem('wristo_gift');
      if (savedGift) {
        const parsed = JSON.parse(savedGift);
        setIsGiftWrapped(parsed.isGiftWrapped || false);
        setGiftMessage(parsed.giftMessage || '');
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsLoaded(true);
  }, []);

  // Save cart changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('wristo_cart', JSON.stringify(cart));
      } catch {
        // Ignore
      }
    }
  }, [cart, isLoaded]);

  // Save coupon changes
  useEffect(() => {
    if (isLoaded) {
      try {
        if (appliedCoupon) {
          localStorage.setItem('wristo_coupon', JSON.stringify(appliedCoupon));
        } else {
          localStorage.removeItem('wristo_coupon');
        }
      } catch {
        // Ignore
      }
    }
  }, [appliedCoupon, isLoaded]);

  // Save gift wrap preferences
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(
          'wristo_gift',
          JSON.stringify({ isGiftWrapped, giftMessage })
        );
      } catch {
        // Ignore
      }
    }
  }, [isGiftWrapped, giftMessage, isLoaded]);

  // Join cart with full product data
  const cartProducts = useMemo<CartProductItem[]>(() => {
    return cart
      .map(item => {
        const product = PRODUCTS.find(p => p.id === item.id);
        if (!product) return null;
        return {
          productId: product.id,
          model: product.model,
          brand: product.brand,
          price: product.price,
          quantity: item.quantity,
          image: product.image,
          product
        };
      })
      .filter((item): item is CartProductItem => item !== null);
  }, [cart]);

  // Re-evaluate applied coupon validity against current subtotal
  const rawSubtotal = useMemo(() => {
    return cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartProducts]);

  useEffect(() => {
    if (appliedCoupon && rawSubtotal > 0) {
      const revalidated = validateCoupon(appliedCoupon.code, rawSubtotal);
      if (revalidated.valid && revalidated.coupon) {
        setAppliedCoupon(revalidated.coupon);
      } else {
        setAppliedCoupon(null);
      }
    } else if (rawSubtotal === 0 && appliedCoupon) {
      setAppliedCoupon(null);
    }
  }, [rawSubtotal, appliedCoupon]);

  // Memoized order totals
  const totals = useMemo<OrderTotals>(() => {
    return calculateOrderTotals(cartProducts, appliedCoupon || undefined);
  }, [cartProducts, appliedCoupon]);

  const addToCart = (productId: string, quantity: number = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === productId);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      }
      return [...prev, { id: productId, quantity }];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setIsGiftWrapped(false);
    setGiftMessage('');
    try {
      localStorage.removeItem('wristo_cart');
      localStorage.removeItem('wristo_coupon');
      localStorage.removeItem('wristo_gift');
    } catch {
      // Ignore
    }
  };

  const applyCoupon = async (code: string) => {
    const res = await validateCouponAsync(code, rawSubtotal);
    if (res.valid && res.coupon) {
      setAppliedCoupon(res.coupon);
      return { success: true, message: `Coupon "${res.coupon.code}" applied successfully!` };
    }
    return { success: false, message: res.message || 'Invalid coupon code.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartProducts,
        appliedCoupon,
        totals,
        isGiftWrapped,
        giftMessage,
        isCartDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        setIsGiftWrapped,
        setGiftMessage,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
