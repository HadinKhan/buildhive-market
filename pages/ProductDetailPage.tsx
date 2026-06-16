import React, { useEffect, useMemo, useState } from "react";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { Product } from "../types";
import api from "../src/services/api";
import { productService } from "../src/services/productService";
import { useWishlist } from "../src/hooks/useWishlist";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../src/context/AuthContext";
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
  const { isAuthenticated, user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const moq = useMemo(() => {
    const val = parseInt(String((product as any).minimum_order_quantity ?? (product as any).minimumOrderQuantity ?? 1), 10);
    return isNaN(val) || val < 1 ? 1 : val;
  }, [product]);

  const [quantity, setQuantity] = useState(moq);

  useEffect(() => {
    setQuantity(moq);
  }, [moq]);

  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);
  const [reportTarget, setReportTarget] = useState<null | {
    type: "product" | "review";
    reviewId?: string;
  }>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

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
  const productQuestions = questions.length
    ? questions
    : (((product as any).questions || (product as any).q_and_a || []) as any[]);
  const productTimeline = timeline.length
    ? timeline
    : (((product as any).timeline || (product as any).timeline_events || []) as any[]);
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
    "/productsplaceholder.png";
  const activeImageSrc = resolveMarketplaceImageSrc({ image: activeImage }) || "/productsplaceholder.png";
  const productInitials = getMarketplaceInitials(product.name);
  const isOutOfStock = product.quantity === 0;
  const isBuyer = String(user?.role || "").toLowerCase() === "buyer";

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
        setReviewsError("Failed to load reviews.");
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [product.id]);

  useEffect(() => {
    let cancelled = false;
    const loadQuestions = async () => {
      try {
        const data = await productService.getProductQuestions(product.id);
        if (!cancelled) setQuestions(data);
      } catch {
        if (!cancelled) setQuestions([]);
      }
    };
    void loadQuestions();
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  useEffect(() => {
    let cancelled = false;
    const loadTimeline = async () => {
      try {
        const data = await productService.getProductTimeline(product.id);
        if (!cancelled) setTimeline(data);
      } catch {
        if (!cancelled) setTimeline([]);
      }
    };
    void loadTimeline();
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, index) => (
      <Icons.Star
        key={index}
        className={`h-4 w-4 ${index < rating ? "fill-current text-yellow-400" : "text-slate-600"}`}
      />
    ));

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  const handleWishlistToggle = async () => {
    await toggleWishlist({
      productId: product.id,
      addedAt: new Date(),
      category: (product as any).category_id || (product as any).category || "products",
      productName: product.name,
      image: activeImageSrc || "",
      price: product.price,
    });
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity);
    onNavigate("checkout");
  };

  const handleMessageSeller = async () => {
    const participantId =
      (product as any).business?.user_id ||
      (product as any).business?.userId ||
      product.seller_id;

    if (!participantId) {
      toast.error("Seller information is unavailable right now.");
      return;
    }

    navigate(`/account?tab=messages&participantId=${encodeURIComponent(participantId)}`);
  };

  const requireAuth = () => {
    if (isAuthenticated) return true;
    navigate(
      `/signin?returnUrl=${encodeURIComponent(
        `${window.location.pathname}${window.location.search}`,
      )}`,
    );
    return false;
  };

  const submitQuestion = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!requireAuth()) return;
    if (questionText.trim().length < 5) {
      toast.error("Question must be at least 5 characters.");
      return;
    }
    setQuestionLoading(true);
    try {
      await productService.askProductQuestion(product.id, questionText.trim());
      setQuestionText("");
      setQuestions(await productService.getProductQuestions(product.id));
      toast.success("Question submitted.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit question.");
    } finally {
      setQuestionLoading(false);
    }
  };

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!requireAuth()) return;
    if (!isBuyer) {
      toast.error("Only buyers can review products.");
      return;
    }
    if (reviewRating < 1 || reviewRating > 5) {
      toast.error("Select a rating from 1 to 5 stars.");
      return;
    }
    if (reviewComment.trim().length < 5) {
      toast.error("Review must be at least 5 characters.");
      return;
    }

    setReviewSubmitting(true);
    try {
      await productService.createReview(product.id, {
        rating: reviewRating,
        body: reviewComment.trim(),
      });
      setReviewComment("");
      setReviewRating(5);
      setReviews(await productService.getProductReviews(product.id));
      toast.success("Review submitted.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const submitReport = async () => {
    if (!reportTarget || !reportReason) return;
    setReportSubmitting(true);
    try {
      if (reportTarget.type === "product") {
        await productService.reportProduct(product.id, reportReason);
      } else if (reportTarget.reviewId) {
        await productService.reportReview(product.id, reportTarget.reviewId, reportReason);
      }
      toast.success("Report submitted.");
      setReportTarget(null);
      setReportReason("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit report.");
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-6" style={{background:"#0a0a1a"}}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
          <span
            className="cursor-pointer hover:text-primary"
            onClick={() => onNavigate("home")}
          >
            Home
          </span>
          <Icons.ChevronRight className="h-4 w-4" />
          <span
            className="cursor-pointer hover:text-primary"
            onClick={() => onNavigate("products")}
          >
            Products
          </span>
          <Icons.ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-200 truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Images */}
          <div className="flex flex-col gap-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl" style={{background:"#1e1e35"}}>
              {activeImageSrc && !imageFailed ? (
                <img
                  src={activeImageSrc}
                  alt={product.name}
                  className="h-full w-full object-cover transition-all duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/productsplaceholder.png";
                  }}
                />
              ) : null}
              {!activeImageSrc || imageFailed ? (
                <div className="flex h-full w-full items-center justify-center text-slate-500" style={{background:"#1e1e35"}}>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold text-slate-400" style={{background:"#2a2a45"}}>
                    {productInitials}
                  </div>
                </div>
              ) : null}
              <button
                aria-label="Add to wishlist"
                onClick={() => void handleWishlistToggle()}
                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-colors hover:text-red-500 bg-[#16162a]/80 ${
                  isInWishlist(product.id) ? "text-red-500" : "text-slate-400"
                }`}
              >
                <Icons.Heart
                  className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-current" : ""}`}
                />
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
                      : "border-transparent hover:border-slate-600"
                  }`}
                >
                  {img ? (
                    <>
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/productsplaceholder.png";
                        }}
                      />
                      <div className="hidden h-full w-full items-center justify-center text-slate-500" style={{background:"#1e1e35"}}>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-slate-400" style={{background:"#2a2a45"}}>
                          {productInitials}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-500" style={{background:"#1e1e35"}}>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-slate-400" style={{background:"#2a2a45"}}>
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
            <div className="mb-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              Construction Material
            </div>
            <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              {product.name}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="text-sm text-slate-400">
                Seller:{" "}
                <span className="font-semibold text-white">
                  {product.author || "BuildHive Seller"}
                </span>
              </div>
              <Button
                variant="outline"
                className="border-violet-500 text-violet-400 hover:border-violet-400 hover:bg-violet-900/20"
                size="sm"
                onClick={handleMessageSeller}
              >
                <Icons.Message className="mr-2 h-4 w-4" /> Message Seller
              </Button>
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => setReportTarget({ type: "product" })}
                  className="text-sm font-semibold text-red-600 hover:underline"
                >
                  Report Product
                </button>
              )}
            </div>

            <div className="mb-6 flex items-center gap-2">
              <div className="flex text-yellow-400">
                <Icons.Star className="h-4 w-4 fill-current" />
                <span className="ml-1 font-bold text-white">
                  {product.rating || 0}
                </span>
              </div>
              <span className="text-slate-500">
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
                <div key={label} className="rounded-2xl border p-3" style={{background:"#16162a",borderColor:"#2a2a45"}}>
                  <div className="text-xs font-bold uppercase text-slate-500">{label}</div>
                  <div className="mt-1 font-semibold text-slate-200">{String(value)}</div>
                </div>
              ))}
            </div>

            <div className="mb-8 text-3xl font-bold text-white">
              PKR {product.price.toLocaleString()}
              {product.compare_at_price && (
                <span className="ml-3 text-lg font-medium text-slate-600 line-through">
                  PKR {product.compare_at_price.toLocaleString()}
                </span>
              )}
            </div>

            <p className="mb-8 text-base leading-relaxed text-slate-400 break-all overflow-hidden">
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
                  className={`text-sm ${isOutOfStock ? "text-red-400" : "text-slate-400"}`}
                >
                  {product.quantity} items in stock
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <div className="mb-3 flex items-center gap-3 text-sm font-medium text-slate-200">
                <span>Quantity</span>
                {moq > 1 && (
                  <span className="rounded-full bg-violet-900/40 border border-violet-500/30 px-2.5 py-0.5 text-[11px] text-violet-300 font-semibold">
                    Minimum order: {moq} units
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-full px-2 py-1" style={{border:"1px solid #2a2a45",background:"#16162a"}}>
                  <button
                    onClick={() => setQuantity(Math.max(moq, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-violet-900/30 hover:text-violet-400"
                  >
                    <Icons.Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-violet-900/30 hover:text-violet-400"
                  >
                    <Icons.Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-sm text-slate-400">
                   {product.quantity || 50} pieces available
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex gap-2 rounded-full p-1" style={{background:"#1a1a2e"}}>
                {["Overview", "Specs", "Reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === tab
                        ? "bg-[#2a2a45] text-white shadow-sm"
                        : "text-slate-500 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                {activeTab === "Overview" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-white">
                      About this product
                    </h3>
                    <p className="text-sm text-slate-400">
                      The {product.name} is designed with industry
                      professionals in mind. Whether you are managing a
                      large-scale commercial project or a home renovation, this
                      tool provides the efficiency and safety you expect.
                    </p>
                    <h3 className="font-bold text-white">
                      Feature Highlights
                    </h3>
                    <ul className="list-inside list-disc space-y-2 text-sm text-slate-400">
                      <li>Industrial grade durability</li>
                      <li>Certified safety standards (ISO 9001)</li>
                      <li>High efficiency performance</li>
                      <li>All-weather protection</li>
                      <li>1 Year Manufacturer Warranty</li>
                    </ul>
                    {productTags.length > 0 && (
                      <div>
                        <h3 className="font-bold text-white">Tags</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {productTags.map((tag: any) => (
                            <button
                              key={String(tag)}
                              type="button"
                              onClick={() =>
                                navigate(`/products?tag=${encodeURIComponent(String(tag))}`)
                              }
                              className="rounded-full px-3 py-1 text-xs font-semibold text-slate-400 hover:text-violet-400" style={{background:"#1e1e35"}}
                            >
                              {String(tag)}
                            </button>
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
                        <div className="font-medium text-slate-200">{label}</div>
                        <div className="text-slate-400">{String(value)}</div>
                      </React.Fragment>
                    ))}
                  </div>
                )}
                                {activeTab === "Reviews" && (
                  <div className="space-y-4">
                    {isAuthenticated && isBuyer ? (
                      <form
                        onSubmit={submitReview}
                        className="rounded-2xl p-5" style={{border:"1px solid rgba(124,58,237,0.25)",background:"rgba(124,58,237,0.08)"}}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-white">
                              Write a Review
                            </h3>
                            <p className="mt-1 text-sm text-slate-400">
                              Share your experience with this product.
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, index) => {
                              const value = index + 1;
                              return (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => setReviewRating(value)}
                                  aria-label={`${value} star rating`}
                                  className="rounded-full p-1 transition hover:scale-110"
                                >
                                  <Icons.Star
                                    className={`h-6 w-6 ${
                                      value <= reviewRating
                                        ? "fill-current text-yellow-400"
                                        : "text-slate-600"
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <textarea
                          value={reviewComment}
                          onChange={(event) => setReviewComment(event.target.value)}
                          rows={4}
                          placeholder="Write your review..."
                          className="mt-4 w-full rounded-2xl px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-violet-500" style={{background:"#16162a",border:"1px solid #2a2a45",colorScheme:"dark"}}
                        />
                        <div className="mt-4 flex justify-end">
                          <Button type="submit" disabled={reviewSubmitting}>
                            {reviewSubmitting ? "Submitting..." : "Submit Review"}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="rounded-2xl p-4 text-sm text-slate-400" style={{border:"1px solid #2a2a45",background:"#16162a"}}>
                        {isAuthenticated
                          ? "Only buyer accounts can write product reviews."
                          : "Sign in as a buyer to write a review."}
                      </div>
                    )}

                    {reviewsLoading ? (
                      <p className="text-sm text-slate-400">
                        Loading reviews...
                      </p>
                    ) : reviewsError ? (
                      <p className="text-sm text-red-500">{reviewsError}</p>
                    ) : reviews.length === 0 ? (
                      <p className="text-sm text-slate-400">No reviews yet.</p>
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
                            className="rounded-2xl p-5" style={{border:"1px solid #2a2a45",background:"#16162a"}}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-1">
                                  {renderStars(Number(review.rating || 0))}
                                </div>
                                <p className="mt-2 font-semibold text-white">
                                  {review.title || "Review"}
                                </p>
                                <p className="mt-1 text-sm text-slate-400">
                                  {reviewerName}
                                </p>
                              </div>
                              <div className="text-sm font-semibold text-white">
                                {Number(review.rating || 0).toFixed(1)}
                              </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                              <span>
                                {review.created_at || review.createdAt
                                  ? new Date(review.created_at || review.createdAt || "").toLocaleDateString()
                                  : "Recent review"}
                              </span>
                              {review.verified_purchase && (
                                <span className="rounded-full px-2 py-0.5 font-semibold text-emerald-400" style={{background:"rgba(16,185,129,0.12)"}}>
                                  Verified Purchase
                                </span>
                              )}
                              {isAuthenticated && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setReportTarget({
                                      type: "review",
                                      reviewId: review.id,
                                    })
                                  }
                                  className="font-semibold text-red-500 hover:underline"
                                >
                                  Report
                                </button>
                              )}
                            </div>
                            {comment && (
                              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                                {comment}
                              </p>
                            )}
                            {sellerResponse && (
                              <div className="mt-3 rounded-xl p-3 text-sm text-violet-300" style={{background:"rgba(124,58,237,0.12)"}}>
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
                className="flex-1 border-slate-600 text-slate-300 hover:border-slate-400 hover:bg-slate-800/40"
                size="lg"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      {reportTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl p-6 shadow-xl" style={{background:"#16162a",border:"1px solid #2a2a45"}}>
            <h2 className="text-xl font-bold text-white">
              Report {reportTarget.type === "product" ? "Product" : "Review"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Choose the reason that best describes the issue.
            </p>
            <select
              value={reportReason}
              onChange={(event) => setReportReason(event.target.value)}
              className="mt-4 w-full rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-red-400" style={{background:"#0a0a1a",border:"1px solid #2a2a45",colorScheme:"dark"}}
            >
              <option value="">Select a reason</option>
              <option value="Spam or misleading">Spam or misleading</option>
              <option value="Inappropriate content">Inappropriate content</option>
              <option value="Fraud or scam">Fraud or scam</option>
              <option value="Wrong product information">Wrong product information</option>
              <option value="Other policy violation">Other policy violation</option>
            </select>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setReportTarget(null);
                  setReportReason("");
                }}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-400 hover:bg-slate-700/40"
              >
                Cancel
              </button>
              <button
                onClick={() => void submitReport()}
                disabled={!reportReason || reportSubmitting}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {reportSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
