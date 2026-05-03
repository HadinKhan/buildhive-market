import { useState, useEffect, useCallback } from 'react';

export interface WishlistItem {
  productId: string;
  addedAt: Date;
  category: string;
  productName: string;
  image: string;
  price: number;
}

const WISHLIST_KEY = 'buildhive_wishlist';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
      } catch (error) {
        console.error('Failed to save wishlist:', error);
      }
    }
  }, [wishlist, isLoading]);

  const addToWishlist = useCallback(
    (item: WishlistItem) => {
      setWishlist((prev) => {
        const exists = prev.find((w) => w.productId === item.productId);
        if (exists) return prev;
        return [...prev, { ...item, addedAt: new Date() }];
      });
    },
    []
  );

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((w) => w.productId !== productId));
  }, []);

  const toggleWishlist = useCallback(
    (item: WishlistItem) => {
      const exists = wishlist.some((w) => w.productId === item.productId);
      if (exists) {
        removeFromWishlist(item.productId);
      } else {
        addToWishlist(item);
      }
    },
    [wishlist, addToWishlist, removeFromWishlist]
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((w) => w.productId === productId),
    [wishlist]
  );

  const getWishlistByCategory = useCallback(
    (category: string) => wishlist.filter((w) => w.category === category),
    [wishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  return {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistByCategory,
    clearWishlist,
    wishlistCount: wishlist.length,
  };
};
