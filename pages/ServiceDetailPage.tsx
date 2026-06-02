import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icons } from "../components/Icons";
import { useAuth } from "../src/context/AuthContext";
import { serviceMarketplaceService } from "../src/services/serviceMarketplaceService";

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
  const { isAuthenticated } = useAuth();

  const [service, setService] = React.useState<any | null>(null);
  const [reviews, setReviews] = React.useState<ServiceReview[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTier, setSelectedTier] = React.useState<string>("base");

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [serviceData, reviewData] = await Promise.all([
          serviceMarketplaceService.getServiceById(id),
          serviceMarketplaceService.getServiceReviews(id),
        ]);

        if (cancelled) return;
        setService(serviceData || null);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
      } catch (error) {
        console.error("Failed to load service detail:", error);
        if (!cancelled) {
          setService(null);
          setReviews([]);
        }
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
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <section className="rounded-2xl border border-gray-200 p-6">
              <h1 className="text-3xl font-bold">
                {service.name || service.title || "Service"}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {service.category?.name || service.category || "Other"}
                </span>
                <div className="flex items-center gap-2 text-amber-500">
                  <Icons.Star className="h-4 w-4 fill-current" />
                  <span className="font-medium text-gray-800">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                    {String(creatorName).slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold">{creatorName}</div>
                    <div className="text-sm text-gray-500">
                      Member since{" "}
                      {String(
                        service.created_at || service.createdAt || "",
                      ).slice(0, 4) || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                    {String(creatorRole).toLowerCase() === "contractor"
                      ? "Contractor"
                      : "Seller"}
                  </span>
                  {String(creatorRole).toLowerCase() === "contractor" &&
                  creatorId ? (
                    <button
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                      onClick={() => navigate(`/contractors/${creatorId}`)}
                    >
                      View Profile
                    </button>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold">Service Description</h2>
              <p className="mt-3 text-gray-700 leading-7">
                {service.description || "No description provided."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold">Packages</h2>
              {normalizedPackages.length > 0 ? (
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {normalizedPackages.map((pkg) => (
                    <div
                      key={pkg.key}
                      className={`rounded-xl border p-4 ${selectedTier === pkg.key ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}
                    >
                      <h3 className="font-semibold">{pkg.label}</h3>
                      <div className="mt-2 text-2xl font-bold">
                        PKR {pkg.price.toLocaleString()}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        Delivered in {pkg.deliveryDays || 0} days
                      </div>
                      <p className="mt-3 text-sm text-gray-600">
                        {pkg.description || "No package description."}
                      </p>
                      <button
                        className="mt-4 w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white"
                        onClick={() => setSelectedTier(pkg.key)}
                      >
                        Select {pkg.label}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-gray-50 p-4">
                  <div className="text-2xl font-bold">
                    PKR {basePrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Delivered in {baseDeliveryDays || 0} days
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold">Reviews</h2>
              <div className="mt-4 space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-500">
                    Be the first to review this service
                  </p>
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
                        className="rounded-xl border border-gray-200 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">{firstName}</div>
                          <div className="text-xs text-gray-500">
                            {created
                              ? new Date(created).toLocaleDateString()
                              : ""}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-amber-500">
                          <Icons.Star className="h-4 w-4 fill-current" />
                          <span className="text-sm text-gray-800">
                            {Number(review.rating || 0).toFixed(1)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">
                          {review.comment || review.review || ""}
                        </p>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold">Order Now</h3>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Selected</span>
                  <span className="font-semibold">
                    {selectedPackage?.label || "Base"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Price</span>
                  <span className="font-semibold">
                    PKR {Number(priceToShow).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery</span>
                  <span className="font-semibold">
                    {deliveryToShow || 0} days
                  </span>
                </div>
              </div>
              <button
                className="mt-6 w-full rounded-lg bg-yellow-500 px-4 py-3 font-semibold text-white hover:bg-yellow-600"
                onClick={handleOrderNow}
              >
                Order Now
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
