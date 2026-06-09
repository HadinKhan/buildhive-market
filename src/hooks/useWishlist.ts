import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";

export interface WishlistItem {
  productId: string;
  addedAt: Date;
  category: string;
  productName: string;
  image: string;
  price: number;
}

const mapWishlistItem = (item: any): WishlistItem => {
  const product = item.product || item.products || item;
  return {
    productId: item.product_id || product.id,
    addedAt: item.created_at ? new Date(item.created_at) : new Date(),
    category:
      product.categories?.slug ||
      product.categories?.name ||
      product.category_id ||
      product.category ||
      "products",
    productName: product.name || item.product_name || "Product",
    image:
      product.product_images?.[0]?.image_url ||
      product.images?.[0]?.image_url ||
      product.image_url ||
      product.image ||
      "",
    price: Number(product.price || item.price || 0),
  };
};

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const requireAuth = useCallback(() => {
    if (isAuthenticated) return true;
    const returnUrl = `${location.pathname}${location.search}`;
    navigate(`/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
    return false;
  }, [isAuthenticated, location.pathname, location.search, navigate]);

  const reloadWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const items = await userService.getWishlist();
      setWishlist(items.map(mapWishlistItem));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void reloadWishlist();
  }, [reloadWishlist]);

  const addToWishlist = useCallback(
    async (item: WishlistItem) => {
      if (!requireAuth()) return;
      await userService.addToWishlist(item.productId);
      await reloadWishlist();
    },
    [reloadWishlist, requireAuth],
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      if (!requireAuth()) return;
      await userService.removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((w) => w.productId !== productId));
    },
    [requireAuth],
  );

  const toggleWishlist = useCallback(
    async (item: WishlistItem) => {
      const exists = wishlist.some((w) => w.productId === item.productId);
      if (exists) {
        await removeFromWishlist(item.productId);
      } else {
        await addToWishlist(item);
      }
    },
    [addToWishlist, removeFromWishlist, wishlist],
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((w) => w.productId === productId),
    [wishlist],
  );

  const getWishlistByCategory = useCallback(
    (category: string) => wishlist.filter((w) => w.category === category),
    [wishlist],
  );

  return {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistByCategory,
    clearWishlist: () => setWishlist([]),
    wishlistCount: wishlist.length,
    reloadWishlist,
  };
};
