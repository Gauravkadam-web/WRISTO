'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface ToggleResult {
  success: boolean;
  added: boolean;
  message: string;
}

interface ComparisonContextType {
  comparison: string[];
  comparisonCount: number;
  maxItems: number;
  addToComparison: (productId: string) => { success: boolean; message: string };
  removeFromComparison: (productId: string) => void;
  toggleComparison: (productId: string) => ToggleResult;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
  toastMessage: string | null;
  dismissToast: () => void;
  isDockOpen: boolean;
  setIsDockOpen: (open: boolean) => void;
}

const MAX_COMPARISON_ITEMS = 4;
const STORAGE_KEY = 'wristo_comparison';

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [comparison, setComparison] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimer, setToastTimer] = useState<NodeJS.Timeout | null>(null);
  const [isDockOpen, setIsDockOpen] = useState(true);

  const showToast = useCallback((msg: string) => {
    if (toastTimer) clearTimeout(toastTimer);
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
    setToastTimer(timer);
  }, [toastTimer]);

  const dismissToast = useCallback(() => {
    if (toastTimer) clearTimeout(toastTimer);
    setToastMessage(null);
  }, [toastTimer]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setComparison(parsed.slice(0, MAX_COMPARISON_ITEMS));
        }
      } else {
        // Seed initial sample pair for rich discovery
        setComparison(['WRT-001', 'WRT-005']);
      }
    } catch {
      // Ignore
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(comparison));
      } catch {
        // Ignore
      }
    }
  }, [comparison, isLoaded]);

  const addToComparison = useCallback((productId: string) => {
    if (comparison.includes(productId)) {
      showToast('This timepiece is already in your comparison matrix.');
      return { success: false, message: 'Already in comparison' };
    }

    if (comparison.length >= MAX_COMPARISON_ITEMS) {
      showToast('Maximum 4 watches can be compared side-by-side.');
      return { success: false, message: 'Maximum 4 watches limit reached' };
    }

    setComparison(prev => [...prev, productId]);
    setIsDockOpen(true);
    showToast('Added to comparison matrix');
    return { success: true, message: 'Added to comparison' };
  }, [comparison, showToast]);

  const removeFromComparison = useCallback((productId: string) => {
    setComparison(prev => prev.filter(id => id !== productId));
    showToast('Removed from comparison');
  }, [showToast]);

  const toggleComparison = useCallback((productId: string): ToggleResult => {
    if (comparison.includes(productId)) {
      setComparison(prev => prev.filter(id => id !== productId));
      showToast('Removed from comparison');
      return { success: true, added: false, message: 'Removed from comparison' };
    }

    if (comparison.length >= MAX_COMPARISON_ITEMS) {
      showToast('Maximum 4 watches can be compared side-by-side.');
      return { success: false, added: false, message: 'Maximum 4 watches limit reached' };
    }

    setComparison(prev => [...prev, productId]);
    setIsDockOpen(true);
    showToast('Added to comparison matrix');
    return { success: true, added: true, message: 'Added to comparison matrix' };
  }, [comparison, showToast]);

  const clearComparison = useCallback(() => {
    setComparison([]);
    showToast('Comparison matrix cleared');
  }, [showToast]);

  const isInComparison = useCallback((productId: string): boolean => {
    return comparison.includes(productId);
  }, [comparison]);

  return (
    <ComparisonContext.Provider
      value={{
        comparison,
        comparisonCount: comparison.length,
        maxItems: MAX_COMPARISON_ITEMS,
        addToComparison,
        removeFromComparison,
        toggleComparison,
        clearComparison,
        isInComparison,
        toastMessage,
        dismissToast,
        isDockOpen,
        setIsDockOpen,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
