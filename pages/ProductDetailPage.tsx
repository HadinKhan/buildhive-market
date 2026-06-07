import React, { useEffect, useMemo, useState } from "react";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { Product } from "../types";
import api from "../src/services/api";
import { productService } from "../src/services/productService";
import { useNavigate } from "react-router-dom";
import {
  getMarketplaceInitials,
  resolveMarketplaceImageSrc,
} from "../src/utils/marketplaceImage";

interface ProductReview {
  id: string;
  rating: number;
  title?: string;
  body?: string;
  comment?: string;
  reviewer_name?: string;
  reviewerName?: string;
  user_name?: string;
  name?: string;
  created_at?: string;
  createdAt?: string;
  verified_purchase?: boolean;
  seller_response?: string;
  responses?: Array<{ response_text?: string; response_type?: string }>;
}

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onMessageSeller?: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onNavigate,
  onAddToCart,
  onMessageSeller,
}) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const gallerySource = [
    ...(((product as any).product_images || []) as any[]),
    ...(((product as any).images || []) as any[]),
  ];

  const galleryImages = useMemo(
    () =>
      Array.from(
        new Set(
          gallerySource
            .sort((a, b) => Number(a?.display_order || 0) - Number(b?.display_order || 0))
            .map((img) =>
              resolveMarketplaceImageSrc(img) ||
              img?.image_url ||
              img?.imageUrl ||
              img?.url ||
              (typeof img === "string" ? img : ""),
            )
            .filter(Boolean),
        ),
      ),
    [gallerySource],
  );
  const productReviews = ((product as any).reviews || (product as any).product_reviews || []) as ProductReview[];
  const productQuestions = ((product as any).questions || (product as any).q_and_a || []) as any[];
  const productTimeline = ((product as any).timeline || (product as any).timeline_events || []) as any[];
  const productTags = Array.isArray((product as any).tags)
    ? (product as any).tags
    : String((product as any).tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
  const activeImage =
    galleryImages[selectedImage] ||
    galleryImages[0] ||
    (product as any).image ||
    "";
  const activeImageSrc = resolveMarketplaceImageSrc({ image: activeImage });
  const productInitials = getMarketplaceInitials(product.name);
  const isOutOfStock = product.quantity === 0;

  useEffect(() => {
    setImageFailed(false);
  }, [activeImageSrc]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewsError(null);
        const data = await productService.getProductReviews(product.id);
        setReviews(data.length ? data : productReviews);
      } catch (error) {
        console.error("Failed to load reviews:", error);
        setReviewsError("Failed to load reviews.");
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [product.id]);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, index) => (
      <Icons.Star
        key={index}
        className={`h-4 w-4 ${index < rating ? "fill-current text-yellow-400" : "text-gray-300"}`}
      />
    ));

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity);
    onNavigate("checkout");
  };

  const handleMessageSeller = async () => {
    console.log("CHAT START:", (product as any).business);

    const participantId =
      (product as any).business?.user_id ||
      (product as any).business?.userId ||
      product.seller_id;

    if (!participantId) {
      console.log(
        "MISSING PARTICIPANT_ID for product.business",
        (product as any).business,
      );
      return;
    }

    navigate(`/messages?participantId=${encodeURIComponent(participantId)}`);
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-6">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <span
            className="cursor-pointer hover:text-primary"
            onClick={() => onNavigate("home")}
          >
            Shop
          </span>
          <Icons.ChevronRight className="h-4 w-4" />
          <span
            className="cursor-pointer hover:text-primary"
            onClick={() => onNavigate("products")}
          >
            Products
          </span>
          <Icons.ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900 truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Images */}
          <div className="flex flex-col gap-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-gray-100">
              {activeImageSrc && !imageFailed ? (
                <img
                  src={activeImageSrc}
                  alt={product.title}
                  className="h-full w-full object-cover transition-all duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    setImageFailed(true);
                  }}
                />
              ) : null}
              {!activeImageSrc || imageFailed ? (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300 text-xl font-bold text-gray-600">
                    {productInitials}
                  </div>
                </div>
              ) : null}
              <button
                aria-label="Add to wishlist"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-500 backdrop-blur-sm transition-colors hover:text-red-500"
              >
                <Icons.Heart className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  aria-label={`View image ${idx + 1}`}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition-all ${
                    selectedImage === idx
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  {img ? (
                    <>
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-gray-600">
                          {productInitials}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-gray-600">
                        {productInitials}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <div className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-500">
              Construction Material
            </div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="text-sm text-gray-500">
                Seller:{" "}
                <span className="font-semibold text-gray-900">
                  {product.author || "BuildHive Seller"}
                </span>
              </div>
              <Button
                variant="outline"
                className="border-violet-200 text-violet-700 hover:border-violet-300 hover:bg-violet-50"
                size="sm"
                onClick={handleMessageSeller}
              >
                <Icons.Message className="mr-2 h-4 w-4" /> Message Seller
              </Button>
            </div>

            <div className="mb-6 flex items-center gap-2">
              <div className="flex text-yellow-400">
                <Icons.Star className="h-4 w-4 fill-current" />
                <span className="ml-1 font-bold text-gray-900">
                  {product.rating || 0}
                </span>
              </div>
              <span className="text-gray-400">
                ({(product as any).total_reviews || (product as any).review_count || reviews.length || product.sales || 0} reviews)
              </span>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              {[
                ["SKU", (product as any).sku || "N/A"],
                ["Barcode", (product as any).barcode || "N/A"],
                ["Status", (product as any).status || "N/A"],
                ["Featured", (product as any).is_featured ? "Yes" : "No"],
                ["Low Stock", (product as any).low_stock_threshold ?? "N/A"],
                ["Weight", (product as any).weight ? `${(product as any).weight} ${(product as any).weight_unit || ""}` : "N/A"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                  <div className="text-xs font-bold uppercase text-gray-400">{label}</div>
                  <div className="mt-1 font-semibold text-gray-900">{String(value)}</div>
                </div>
              ))}
            </div>

            <div className="mb-8 text-3xl font-bold text-gray-900">
              PKR {product.price.toLocaleString()}
              {product.compare_at_price && (
                <span className="ml-3 text-lg font-medium text-gray-400 line-through">
                  PKR {product.compare_at_price.toLocaleString()}
                </span>
              )}
            </div>

            <p className="mb-8 text-base leading-relaxed text-gray-500">
              {product.description ||
                "Designed for professional durability and performance, this construction essential meets all safety standards. Ideal for heavy-duty applications, providing reliability when you need it most."}
            </p>

            <Button
              className="mb-8 w-full bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30 sm:w-auto"
              size="lg"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <Icons.Cart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>

            {/* Stock Status */}
            <div className="mb-8">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-green-500"}`}
                ></div>
                <span
                  className={`text-sm ${isOutOfStock ? "text-red-600" : "text-gray-600"}`}
                >
                  {product.quantity} items in stock
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <div className="mb-3 text-sm font-medium text-gray-900">
                Quantity
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-white hover:text-primary hover:shadow-sm"
                  >
                    <Icons.Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-white hover:text-primary hover:shadow-sm"
                  >
                    <Icons.Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {product.stock || 50} pieces available
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex gap-2 rounded-full bg-gray-100 p-1">
                {["Overview", "Specs", "Guide", "Reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === tab
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                {activeTab === "Overview" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900">
                      About this product
                    </h3>
                    <p className="text-sm text-gray-500">
                      The {product.title} is designed with industry
                      professionals in mind. Whether you are managing a
                      large-scale commercial project or a home renovation, this
                      tool provides the efficiency and safety you expect.
                    </p>
                    <h3 className="font-bold text-gray-900">
                      Feature Highlights
                    </h3>
                    <ul className="list-inside list-disc space-y-2 text-sm text-gray-500">
                      <li>Industrial grade durability</li>
                      <li>Certified safety standards (ISO 9001)</li>
                      <li>High efficiency performance</li>
                      <li>All-weather protection</li>
                      <li>1 Year Manufacturer Warranty</li>
                    </ul>
                    {productTags.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900">Tags</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {productTags.map((tag) => (
                            <span key={String(tag)} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                              {String(tag)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "Specs" && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      ["SKU", (product as any).sku || "N/A"],
                      ["Barcode", (product as any).barcode || "N/A"],
                      ["Weight", (product as any).weight ? `${(product as any).weight} ${(product as any).weight_unit || ""}` : "N/A"],
                      ["Cost Price", (product as any).cost_per_item ? `PKR ${Number((product as any).cost_per_item).toLocaleString()}` : "N/A"],
                      ["Compare At", (product as any).compare_at_price ? `PKR ${Number((product as any).compare_at_price).toLocaleString()}` : "N/A"],
                      ["Low Stock Threshold", (product as any).low_stock_threshold ?? "N/A"],
                      ["Track Quantity", (product as any).track_quantity ? "Yes" : "No"],
                      ["Requires Shipping", (product as any).requires_shipping ? "Yes" : "No"],
                      ["Created", (product as any).created_at ? new Date((product as any).created_at).toLocaleDateString() : "N/A"],
                      ["Updated", (product as any).updated_at ? new Date((product as any).updated_at).toLocaleDateString() : "N/A"],
                    ].map(([label, value]) => (
                      <React.Fragment key={label}>
                        <div className="font-medium text-gray-900">{label}</div>
                        <div className="text-gray-500">{String(value)}</div>
                      </React.Fragment>
                    ))}
                  </div>
                )}
                {activeTab === "Guide" && (
                  <div className="space-y-5 text-sm text-gray-500">
                    <p>User manuals and safety guides are available for download after purchase.</p>
                    <div>
                      <h3 className="font-bold text-gray-900">Q&A</h3>
                      {productQuestions.length === 0 ? (
                        <p className="mt-2">No questions yet.</p>
                      ) : (
                        productQuestions.map((item, index) => (
                          <div key={item.id || index} className="mt-3 rounded-2xl border border-gray-100 p-4">
                            <p className="font-semibold text-gray-900">{item.question}</p>
                            <p>{item.answer || "No answer yet."}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Timeline</h3>
                      {productTimeline.length === 0 ? (
                        <p className="mt-2">No timeline entries yet.</p>
                      ) : (
                        productTimeline.map((item, index) => (
                          <div key={item.id || index} className="mt-3 rounded-2xl border border-gray-100 p-4">
                            <p className="font-semibold text-gray-900">{item.title || item.event_type || "Event"}</p>
                            <p>{item.description || ""}</p>
                            <p className="mt-1 text-xs text-gray-400">
                              {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                {activeTab === "Reviews" && (
                  <div className="space-y-4">
                    {reviewsLoading ? (
                      <p className="text-sm text-gray-500">
                        Loading reviews...
                      </p>
                    ) : reviewsError ? (
                      <p className="text-sm text-red-500">{reviewsError}</p>
                    ) : reviews.length === 0 ? (
                      <p className="text-sm text-gray-500">No reviews yet.</p>
                    ) : (
                      reviews.map((review) => {
                        const reviewerName =
                          review.reviewer_name ||
                          review.reviewerName ||
                          review.user_name ||
                          review.name ||
                          "Verified buyer";
                        const comment =
                          review.comment || review.body || review.title || "";
                        const sellerResponse =
                          review.seller_response ||
                          review.responses?.find((response) =>
                            ["seller", "admin"].includes(String(response.response_type || "")),
                          )?.response_text ||
                          review.responses?.[0]?.response_text;

                        return (
                          <div
                            key={review.id}
                            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-1">
                                  {renderStars(Number(review.rating || 0))}
                                </div>
                                <p className="mt-2 font-semibold text-gray-900">
                                  {review.title || "Review"}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  {reviewerName}
                                </p>
                              </div>
                              <div className="text-sm font-semibold text-gray-900">
                                {Number(review.rating || 0).toFixed(1)}
                              </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                              <span>
                                {review.created_at || review.createdAt
                                  ? new Date(review.created_at || review.createdAt || "").toLocaleDateString()
                                  : "Recent review"}
                              </span>
                              {review.verified_purchase && (
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                                  Verified purchase
                                </span>
                              )}
                            </div>
                            {comment && (
                              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                                {comment}
                              </p>
                            )}
                            {sellerResponse && (
                              <div className="mt-3 rounded-xl bg-violet-50 p-3 text-sm text-violet-800">
                                <span className="font-bold">Seller response: </span>
                                {sellerResponse}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                className="flex-1 bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30"
                size="lg"
                onClick={handleAddToCart}
              >
                <Icons.Cart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-300 hover:border-gray-900 hover:bg-gray-50"
                size="lg"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
