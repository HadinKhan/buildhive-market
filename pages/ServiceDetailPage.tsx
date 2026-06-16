import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icons } from "../components/Icons";
import { useAuth } from "../src/context/AuthContext";
import { serviceMarketplaceService } from "../src/services/serviceMarketplaceService";
import { toast } from "react-toastify";

type ServicePackage = {
  id?: string;
  tier?: string;
  name?: string;
  title?: string;
  description?: string;
  price?: number;
  deliveryDays?: number;
  delivery_days?: number;
};

type ServiceReview = {
  id: string;
  rating?: number;
  comment?: string;
  review?: string;
  created_at?: string;
  createdAt?: string;
  reviewer_name?: string;
  reviewerName?: string;
  user_name?: string;
};

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [service, setService] = React.useState<any | null>(null);
  const [reviews, setReviews] = React.useState<ServiceReview[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTier, setSelectedTier] = React.useState<string>("base");

  const [ratingInput, setRatingInput] = React.useState<number>(5);
  const [commentInput, setCommentInput] = React.useState<string>("");
  const [submittingReview, setSubmittingReview] = React.useState<boolean>(false);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let serviceData = null;
        try {
          serviceData = await serviceMarketplaceService.getServiceById(id);
        } catch (error) {
          console.error("Failed to load service details:", error);
        }

        let reviewData = [];
        try {
          reviewData = await serviceMarketplaceService.getServiceReviews(id);
        } catch (error) {
          console.error("Failed to load service reviews:", error);
        }

        if (cancelled) return;
        setService(serviceData || null);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
      } catch (error) {
        console.error("Unexpected error in service detail page load:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const packages: ServicePackage[] = React.useMemo(() => {
    if (!service) return [];
    const raw =
      service.packages ||
      service.service_packages ||
      service.pricing_packages ||
      [];
    return Array.isArray(raw) ? raw : [];
  }, [service]);

  const normalizedPackages = React.useMemo(() => {
    if (packages.length === 0) return [];

    return packages.map((pkg, index) => {
      const tier =
        String(pkg.tier || pkg.name || pkg.title || "").toLowerCase() ||
        ["basic", "standard", "premium"][index] ||
        `tier-${index + 1}`;
      return {
        key: tier,
        label:
          pkg.name || pkg.title || tier.charAt(0).toUpperCase() + tier.slice(1),
        price: Number(pkg.price || 0),
        deliveryDays: Number(pkg.deliveryDays || pkg.delivery_days || 0),
        description: pkg.description || "",
      };
    });
  }, [packages]);

  React.useEffect(() => {
    if (normalizedPackages.length > 0) {
      setSelectedTier(normalizedPackages[0].key);
    }
  }, [normalizedPackages]);

  const selectedPackage =
    normalizedPackages.find((pkg) => pkg.key === selectedTier) ||
    normalizedPackages[0] ||
    null;

  const creatorName =
    service?.creator?.full_name ||
    service?.creator?.name ||
    service?.business?.business_name ||
    service?.contractor?.business_name ||
    service?.provider?.name ||
    "BuildHive Creator";

  const creatorRole =
    service?.creator_role ||
    service?.creator?.role ||
    (service?.contractor || service?.contractor_id ? "contractor" : "seller");

  const creatorId =
    service?.creator_id ||
    service?.contractor_id ||
    service?.contractor?.id ||
    service?.business_id ||
    service?.creator?.id ||
    "";

  const rating = Number(service?.average_rating || service?.rating || 0);
  const reviewCount = Number(
    service?.total_reviews || service?.review_count || reviews.length || 0,
  );

  const basePrice = Number(service?.price || 0);
  const baseDeliveryDays = Number(
    service?.delivery_days || service?.deliveryDays || 0,
  );

  const priceToShow = selectedPackage?.price ?? basePrice;
  const deliveryToShow = selectedPackage?.deliveryDays ?? baseDeliveryDays;

  const tags = Array.isArray(service?.tags)
    ? service.tags
    : Array.isArray(service?.skills)
      ? service.skills
      : [];

  const handleOrderNow = () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    const tier = selectedPackage?.key || "base";
    navigate(
      `/checkout?serviceId=${encodeURIComponent(service?.id || id || "")}`,
      {
        state: {
          serviceId: service?.id || id,
          packageTier: tier,
        },
      },
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      toast.error("Please enter a review comment.");
      return;
    }

    setSubmittingReview(true);
    try {
      const newReview = await serviceMarketplaceService.createReview({
        serviceId: service?.id || id || "",
        rating: ratingInput,
        comment: commentInput.trim(),
        contractorId: creatorId,
      });

      toast.success("Review posted!");

      const reviewToAdd: ServiceReview = {
        id: newReview?.id || String(Date.now()),
        rating: ratingInput,
        comment: commentInput.trim(),
        reviewerName: user?.full_name || user?.fullName || "You",
        reviewer_name: user?.full_name || user?.fullName || "You",
        created_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      setReviews((prev) => [reviewToAdd, ...prev]);

      setCommentInput("");
      setRatingInput(5);
    } catch (error: any) {
      console.error("Failed to post review:", error);
      const errMsg = error?.response?.data?.message || error?.message || "Failed to post review. Please try again.";
      toast.error(errMsg);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading service...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Service not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070b] text-slate-100 relative overflow-hidden">
      {/* Decorative ambient radial gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-[#0f0f15]/80 backdrop-blur-sm">
              <img
                src={service.image || service.image_url || service.imageUrl || "/productsplaceholder.png"}
                alt={service.name || service.title}
                className="w-full h-80 object-cover transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/productsplaceholder.png";
                }}
              />
            </div>
            
            <section className="bg-[#11111d]/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/[0.08] p-6">
              <h1 className="text-2xl font-bold text-white">
                {service.name || service.title || "Service"}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold px-3 py-1">
                  {service.category?.name || service.category || "Other"}
                </span>
                <div className="flex items-center gap-2 text-amber-500">
                  <Icons.Star className="h-4 w-4 fill-current" />
                  <span className="font-medium text-slate-200">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-400">
                    ({reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between bg-[#161625] border border-white/[0.05] rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white shadow-md shadow-violet-600/20">
                    {String(creatorName).slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{creatorName}</div>
                    <div className="text-sm text-slate-400">
                      Member since{" "}
                      {String(
                        service.created_at || service.createdAt || "",
                      ).slice(0, 4) || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 px-3 py-1 text-xs font-semibold">
                    {String(creatorRole).toLowerCase() === "contractor"
                      ? "Contractor"
                      : "Seller"}
                  </span>
                  {String(creatorRole).toLowerCase() === "contractor" &&
                  creatorId ? (
                    <button
                      className="text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                      onClick={() => navigate(`/contractors/${creatorId}`)}
                    >
                      View Profile
                    </button>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="bg-[#11111d]/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/[0.08] p-6">
              <h2 className="text-lg font-bold text-white mb-3">Service Description</h2>
              <p className="mt-3 text-slate-300 leading-relaxed">
                {service.description || "No description provided."}
              </p>
              {tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/[0.06] border border-white/[0.08] px-3 py-1 text-xs font-medium text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-[#11111d]/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/[0.08] p-6">
              <h2 className="text-lg font-bold text-white mb-3">Packages</h2>
              {normalizedPackages.length > 0 ? (
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {normalizedPackages.map((pkg) => (
                    <div
                      key={pkg.key}
                      className={`rounded-xl p-4 border transition-all ${
                        selectedTier === pkg.key
                          ? "bg-violet-950/20 border-violet-500 ring-2 ring-violet-500/20"
                          : "bg-white/[0.02] border-white/10 hover:border-violet-500/40 hover:bg-white/[0.04]"
                      }`}
                    >
                      <h3 className="font-bold text-white">{pkg.label}</h3>
                      <div className="mt-2 text-2xl font-bold text-violet-400">
                        PKR {pkg.price.toLocaleString()}
                      </div>
                      <div className="mt-1 text-sm text-slate-400">
                        Delivered in {pkg.deliveryDays || 0} days
                      </div>
                      <p className="mt-3 text-xs text-slate-300 line-clamp-3">
                        {pkg.description || "No package description."}
                      </p>
                      <button
                        className={`mt-4 w-full rounded-lg py-2 text-xs font-semibold transition-colors ${
                          selectedTier === pkg.key
                            ? "bg-violet-600 text-white"
                            : "bg-transparent border border-white/10 text-slate-300 hover:bg-white/5"
                        }`}
                        onClick={() => setSelectedTier(pkg.key)}
                      >
                        {selectedTier === pkg.key ? "Selected" : `Select ${pkg.label}`}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-[#161625] border border-white/[0.05] p-4">
                  <div className="text-2xl font-bold text-white">
                    PKR {basePrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400">
                    Delivered in {baseDeliveryDays || 0} days
                  </div>
                </div>
              )}
            </section>

            <section className="bg-[#11111d]/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/[0.08] p-6">
              <h2 className="text-lg font-bold text-white mb-3">Reviews</h2>
              <div className="space-y-4 mb-6">
                {reviews.length === 0 ? (
                  <div className="text-slate-500 text-center py-8 flex flex-col items-center justify-center gap-2">
                    <Icons.Star className="h-8 w-8 text-slate-600" />
                    <p className="text-sm font-medium">Be the first to review this service</p>
                  </div>
                ) : (
                  reviews.map((review) => {
                    const reviewer =
                      review.reviewer_name ||
                      review.reviewerName ||
                      review.user_name ||
                      "Anonymous";
                    const firstName = reviewer.split(" ")[0] || reviewer;
                    const created = review.created_at || review.createdAt || "";
                    return (
                      <article
                        key={review.id}
                        className="rounded-xl border border-white/[0.06] p-4 bg-white/[0.02]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-white">{firstName}</div>
                          <div className="text-xs text-slate-400">
                            {created
                              ? new Date(created).toLocaleDateString()
                              : ""}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-amber-500">
                          <Icons.Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium text-slate-200">
                            {Number(review.rating || 0).toFixed(1)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">
                          {review.comment || review.review || ""}
                        </p>
                      </article>
                    );
                  })
                )}
              </div>

              {/* Review submit form */}
              {isAuthenticated ? (
                user?.role === "buyer" ? (
                  <form onSubmit={handleSubmitReview} className="border-t border-white/[0.08] pt-6 space-y-4">
                    <h3 className="text-sm font-semibold text-white">Write a Review</h3>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Rating
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRatingInput(star)}
                            className="focus:outline-none transition-transform active:scale-95"
                          >
                            <Icons.Star
                              className={`h-6 w-6 ${
                                star <= ratingInput
                                  ? "fill-current text-amber-500"
                                  : "text-slate-600 hover:text-amber-400"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Share your experience...
                      </label>
                      <textarea
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        rows={3}
                        required
                        placeholder="Write your review here..."
                        className="w-full rounded-xl border border-white/10 bg-[#161625] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 placeholder-slate-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2.5 text-sm transition-colors disabled:opacity-50 shadow-lg shadow-violet-600/25"
                    >
                      {submittingReview ? "Posting..." : "Post Review"}
                    </button>
                  </form>
                ) : null
              ) : (
                <div className="border-t border-white/[0.08] pt-6 text-center">
                  <p className="text-sm text-slate-400">
                    <button
                      type="button"
                      onClick={() => navigate("/signin")}
                      className="font-semibold text-violet-400 hover:text-violet-300 hover:underline"
                    >
                      Sign in
                    </button>{" "}
                    to leave a review
                  </p>
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-gradient-to-b from-[#16162a] to-[#0f0f1e] text-white rounded-2xl p-6 shadow-2xl border border-white/[0.08]">
              <h3 className="text-lg font-bold text-white mb-4">Hire Now</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                  <span>Selected Package</span>
                  <span className="font-semibold text-white">
                    {selectedPackage?.label || "Base"}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                  <span>Price</span>
                  <span className="font-semibold text-amber-400">
                    PKR {Number(priceToShow).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery Time</span>
                  <span className="font-semibold text-white">
                    {deliveryToShow || 0} days
                  </span>
                </div>
              </div>
              <button
                className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl py-3 text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/20"
                onClick={handleOrderNow}
              >
                Hire Now
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
