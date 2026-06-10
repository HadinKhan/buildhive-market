import React from "react";
import { Icons } from "./Icons";
import { Product } from "../types";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import {
  getMarketplaceInitials,
  resolveMarketplaceImageSrc,
} from "../src/utils/marketplaceImage";

interface ProductCardProps {
  product: Product;
  variant?: "light" | "dark" | "grid";
  showPlaceholder?: boolean;
  onNavigate?: (page: string, productId?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = "light",
  showPlaceholder = false,
  onNavigate,
}) => {
  const navigate = useNavigate();
  const isDark = variant === "dark";
  const isGrid = variant === "grid";
  const ratingValue = Math.max(
    0,
    Number.parseFloat(String(product.rating ?? 0)) || 0,
  );
  const reviewCount = product.review_count || 0;
  const stockBadge =
    product.quantity === 0
      ? {
          label: "Out of Stock",
          className: "bg-red-500 text-white",
        }
      : product.quantity < 10
        ? {
            label: "Low Stock",
            className: "bg-orange-500 text-white",
          }
        : null;

  const imgSrc = resolveMarketplaceImageSrc(product as any);
  const initials = getMarketplaceInitials(product.name);

  const handleExplore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate("product-detail", product.id);
    }
  };

  const handleContactSeller = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const participantId =
      (product as any).business?.user_id ||
      (product as any).business?.userId ||
      product.seller_id;

    if (!participantId) {
      return;
    }

    navigate(`/account?tab=messages&participantId=${encodeURIComponent(participantId)}`);
  };

  const renderStar = (index: number) => {
    const wholeStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue > wholeStars;

    if (index < wholeStars) {
      return <Icons.Star className="h-4 w-4 fill-current text-yellow-400" />;
    }

    if (index === wholeStars && hasHalfStar) {
      return (
        <span className="relative inline-flex h-4 w-4">
          <Icons.Star className="h-4 w-4 text-gray-300" />
          <Icons.Star
            className="absolute inset-0 h-4 w-4 fill-current text-yellow-400"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </span>
      );
    }

    return <Icons.Star className="h-4 w-4 text-gray-300" />;
  };

  const renderRatingRow = () => {
    if (ratingValue <= 0) {
      return <span className="text-sm text-gray-400">No reviews yet</span>;
    }

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index}>{renderStar(index)}</span>
          ))}
        </div>
        <span className="text-sm font-medium text-gray-500">
          ({reviewCount} reviews)
        </span>
      </div>
    );
  };

  // Specific style for the All Products Grid
  if (isGrid) {
    return (
      <div
        onClick={() => onNavigate && onNavigate("product-detail", product.id)}
        className="group cursor-pointer rounded-xl bg-slate-100/50 p-3 transition-all hover:bg-white hover:shadow-lg"
      >
        {/* Image Area */}
        <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-gray-300">
          {stockBadge && (
            <span
              className={`absolute left-2 top-2 z-10 rounded-full px-2.5 py-1 text-[11px] font-bold ${stockBadge.className}`}
            >
              {stockBadge.label}
            </span>
          )}
          {showPlaceholder || !imgSrc ? (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-300 text-sm font-bold text-gray-600">
                {initials}
              </div>
            </div>
          ) : (
            <>
              <img
                src={imgSrc}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const placeholder = e.currentTarget
                    .nextElementSibling as HTMLElement | null;
                  if (placeholder) {
                    placeholder.style.display = "flex";
                  }
                }}
              />
              <div className="hidden h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-300 text-sm font-bold text-gray-600">
                  {initials}
                </div>
              </div>
            </>
          )}
          <button
            aria-label="Add to wishlist"
            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
          >
            <Icons.Heart className="h-4 w-4 fill-current" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2 px-1">
          <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">by {product.author}</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">
                PKR {product.price.toLocaleString()}
              </span>
              {product.compare_at_price && (
                <span className="text-xs text-gray-400 line-through">
                  PKR {product.compare_at_price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="pt-1">{renderRatingRow()}</div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">
                {product.sales || 0} Sales
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs bg-white hover:bg-gray-50"
                onClick={handleContactSeller}
              >
                Contact
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs bg-white hover:bg-gray-50"
                onClick={handleExplore}
              >
                Explore
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default / Dark variants
  return (
    <div
      onClick={() => onNavigate && onNavigate("product-detail", product.id)}
      className={`group relative cursor-pointer rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-gray-100 hover:border-gray-200"
      }`}
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-gray-100">
        {stockBadge && (
          <span
            className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-bold ${stockBadge.className}`}
          >
            {stockBadge.label}
          </span>
        )}
        {imgSrc ? (
          <>
            <img
              src={imgSrc}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const placeholder = e.currentTarget
                  .nextElementSibling as HTMLElement | null;
                if (placeholder) {
                  placeholder.style.display = "flex";
                }
              }}
            />
            <div className="hidden h-full w-full items-center justify-center bg-gray-200 text-gray-500">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-base font-bold text-gray-600">
                {initials}
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-base font-bold text-gray-600">
              {initials}
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 p-1.5 text-gray-500 shadow-sm backdrop-blur-sm transition-colors hover:text-red-500"
        >
          <Icons.Heart className="h-full w-full" />
        </button>

        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <Button size="sm" variant="gradient" onClick={handleExplore}>
            Explore
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className={`mb-1 text-lg font-bold line-clamp-1 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {product.name}
        </h3>
        <p
          className={`mb-3 text-sm ${
            isDark ? "text-slate-400" : "text-gray-500"
          }`}
        >
          by{" "}
          <span
            className={`${
              isDark ? "text-slate-300" : "text-gray-700"
            } font-medium`}
          >
            {product.author}
          </span>
        </p>

        {/* Price Row */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-end gap-2">
            <span
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              PKR {product.price.toLocaleString()}
            </span>
            {product.compare_at_price && (
              <span className="mb-1 text-xs text-gray-400 line-through">
                PKR {product.compare_at_price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="mb-3">{renderRatingRow()}</div>

        {/* Footer Row */}
        <div
          className={`flex items-center justify-between border-t pt-3 ${
            isDark ? "border-slate-700" : "border-gray-100"
          }`}
        >
          <span
            className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}
          >
            {product.sales || 0} Sales
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 text-xs"
            onClick={handleContactSeller}
          >
            <Icons.Message className="h-4 w-4 mr-1" /> Contact
          </Button>
        </div>
      </div>
    </div>
  );
};
