import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

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
    let cancelled = false;
    try {
      userService
        .getWishlist()
        .then((items) => {
          if (cancelled) return;
          setWishlist(
            items.map((item: any) => {
              const product = item.product || item.products || item;
              return {
                productId: item.product_id || product.id,
                addedAt: item.created_at ? new Date(item.created_at) : new Date(),
                category: product.category_id || product.category || "products",
                productName: product.name || item.product_name || "Product",
                image: product.product_images?.[0]?.image_url || product.images?.[0]?.image_url || product.image || "",
                price: product.price || item.price || 0,
              };
            })
          );
        })
        .catch(() => {
          const stored = localStorage.getItem(WISHLIST_KEY);
          if (stored && !cancelled) {
            setWishlist(JSON.parse(stored));
          }
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
    return () => {
      cancelled = true;
    };
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
        userService.addToWishlist(item.productId).catch((error) => {
          console.error('Failed to add wishlist item:', error);
        });
        return [...prev, { ...item, addedAt: new Date() }];
      });
    },
    []
  );

  const removeFromWishlist = useCallback((productId: string) => {
    userService.removeFromWishlist(productId).catch((error) => {
      console.error('Failed to remove wishlist item:', error);
    });
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
