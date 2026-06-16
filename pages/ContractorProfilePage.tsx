import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import { Icons } from "../components/Icons";
import { useAuth } from "../src/context/AuthContext";
import contractorService from "../src/services/contractorService";
import api from "../src/services/api";
import type {
  ContractorPortfolioEntry,
  ContractorProfile,
  ContractorReviewEntry,
  ContractorServiceOffer,
} from "../types";

interface HireFormState {
  title: string;
  description: string;
  budget: string;
  startDate: string;
  deadline: string;
}

const emptyHireForm: HireFormState = {
  title: "",
  description: "",
  budget: "",
  startDate: "",
  deadline: "",
};

const formatPrice = (value?: number): string => {
  if (!value || value <= 0) {
    return "PKR 0";
  }

  return `PKR ${value.toLocaleString()}`;
};

const firstNameOnly = (name: string): string => {
  const firstName = name.trim().split(/\s+/)[0];
  return firstName || name || "Anonymous";
};

const renderStars = (rating: number) =>
  Array.from({ length: 5 }).map((_, index) => (
    <Icons.Star
      key={index}
      className={`h-4 w-4 ${index < Math.round(rating) ? "fill-current text-amber-300" : "text-slate-600"}`}
    />
  ));

const PortfolioLightbox: React.FC<{
  item: ContractorPortfolioEntry;
  onClose: () => void;
}> = ({ item, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
    <div
      className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-[#10131c] shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
        <div>
          <h3 className="text-lg font-black text-white">{item.title}</h3>
          <div className="mt-2 flex flex-col gap-1.5">
            {item.category && (
              <div className="text-xs text-slate-400">
                Category: <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">{item.category}</span>
              </div>
            )}
            {item.projectBudget !== undefined && item.projectBudget > 0 && (
              <div className="text-xs text-slate-400">
                Budget: <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">{formatPrice(item.projectBudget)}</span>
              </div>
            )}
            {item.description && (
              <div className="text-xs text-slate-400">
                Description: <p className="text-sm text-slate-300 mt-2">{item.description}</p>
              </div>
            )}
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close portfolio preview" title="Close portfolio preview" className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200">
          <Icons.Close className="h-5 w-5" />
        </button>
      </div>
      {item.image && <img src={item.image} alt={item.title} className="max-h-[70vh] w-full object-cover" />}
    </div>
  </div>
);

const HireModal: React.FC<{
  contractor: ContractorProfile;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ contractor, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState<HireFormState>(emptyHireForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof HireFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitProject = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate(`/signin?returnUrl=${encodeURIComponent(`/contractors/${contractor.businessId || contractor.id}`)}`);
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/projects", {
        contractorId: contractor.userId || contractor.id,
        title: form.title,
        description: form.description,
        budget: Number(form.budget),
        startDate: form.startDate || undefined,
        deadline: form.deadline || undefined,
      });
      toast.success("Project posted! The contractor has been notified.");
      onSuccess();
      onClose();
    } catch {
      toast.error("Unable to post the project right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-[#10131c] shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200">Hire Contractor</p>
            <h3 className="mt-1 text-lg font-black text-white">Post a Project</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close hire modal" title="Close hire modal" className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200">
            <Icons.Close className="h-5 w-5" />
          </button>
        </div>

        <form className="grid gap-4 px-6 py-6" onSubmit={submitProject}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-200">
              Project title
              <input
                className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-white outline-none focus:border-violet-300/40"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Kitchen renovation"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-200">
              Budget (PKR)
              <input
                className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-white outline-none focus:border-violet-300/40"
                value={form.budget}
                onChange={(event) => updateField("budget", event.target.value)}
                placeholder="250000"
                type="number"
                min="0"
                required
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-slate-200">
            Project description
            <textarea
              className="min-h-28 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-white outline-none focus:border-violet-300/40"
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Describe the scope, location, and expectations."
              required
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-200">
              Start date
              <input
                className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-white outline-none focus:border-violet-300/40"
                value={form.startDate}
                onChange={(event) => updateField("startDate", event.target.value)}
                type="date"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-200">
              Deadline
              <input
                className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-white outline-none focus:border-violet-300/40"
                value={form.deadline}
                onChange={(event) => updateField("deadline", event.target.value)}
                type="date"
              />
            </label>
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StarRatingSelector: React.FC<{
  rating: number;
  hoverRating: number | null;
  onRatingChange: (rating: number) => void;
  onHoverChange: (rating: number | null) => void;
}> = ({ rating, hoverRating, onRatingChange, onHoverChange }) => {
  return (
    <div className="flex items-center gap-1.5 py-2">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = hoverRating !== null ? starValue <= hoverRating : starValue <= rating;
        return (
          <button
            key={index}
            type="button"
            className="focus:outline-none transition-transform duration-100 active:scale-90"
            onClick={() => onRatingChange(starValue)}
            onMouseEnter={() => onHoverChange(starValue)}
            onMouseLeave={() => onHoverChange(null)}
          >
            <Icons.Star
              className={`h-8 w-8 cursor-pointer ${isFilled ? "fill-current text-amber-400" : "text-slate-600"}`}
            />
          </button>
        );
      })}
    </div>
  );
};

export const ContractorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [profile, setProfile] = useState<ContractorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<ContractorPortfolioEntry | null>(null);
  const [showHireModal, setShowHireModal] = useState(false);

  const [existingReviews, setExistingReviews] = useState<ContractorReviewEntry[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const loadReviews = useCallback(async () => {
    if (!id) return;
    setIsLoadingReviews(true);
    try {
      const fetchedReviews = await contractorService.getContractorReviews(id);
      setExistingReviews(fetchedReviews);
    } catch (err) {
      console.error("Failed to load contractor reviews:", err);
    } finally {
      setIsLoadingReviews(false);
    }
  }, [id]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile) return;

    setIsSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(false);

    const serviceId = profile.services && profile.services.length > 0 ? profile.services[0].id : null;
    const contractorUserId = profile.userId || profile.id;

    try {
      await api.post("/reviews", {
        serviceId,
        contractorId: contractorUserId,
        rating: selectedRating,
        comment: reviewText,
      });
      setReviewSuccess(true);
      setReviewText("");
      setSelectedRating(5);
      // Refresh reviews list
      const fetchedReviews = await contractorService.getContractorReviews(contractorUserId);
      setExistingReviews(fetchedReviews);
    } catch (err: any) {
      console.error("Failed to submit review:", err);
      const errMsg = err?.response?.data?.message || err?.message || "Failed to submit review. Please try again.";
      setReviewError(errMsg);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const contractor = await contractorService.getContractorById(id);
        if (!cancelled) {
          setProfile(contractor);
        }
      } catch {
        if (!cancelled) {
          setProfile(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const shareProfile = async () => {
    if (!id || typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied to clipboard.");
  };

  const handleMessage = () => {
    if (!profile) {
      return;
    }

    if (!isAuthenticated) {
      navigate(`/signin?returnUrl=${encodeURIComponent(`/contractors/${profile.userId || profile.id}`)}`);
      return;
    }

    const participantId = profile.userId;
    if (!participantId) {
      console.error("No contractor user ID found on profile:", profile);
      toast.error("Cannot message this contractor right now");
      return;
    }

    void api
      .post("/chat/conversations", {
        participantId: participantId,
      })
      .then((response) => {
        const conversationId =
          response.data?.data?.conversationId ||
          response.data?.data?.id ||
          response.data?.conversationId ||
          response.data?.id;
        navigate(`/account?tab=messages${conversationId ? `&conversationId=${encodeURIComponent(conversationId)}` : ""}`);
      })
      .catch(() => {
        toast.error("Unable to start the conversation right now.");
      });
  };

  const orderService = (service: ContractorServiceOffer) => {
    navigate(`/checkout?serviceId=${encodeURIComponent(service.id)}`);
  };

  const profileSkills = useMemo(() => profile?.skills || [], [profile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f12] px-4 py-20 text-white">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-72 rounded-[28px] bg-slate-800/70" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-72 rounded-[24px] bg-slate-800/70" />
            <div className="h-72 rounded-[24px] bg-slate-800/70" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0b0f12] px-4 py-20 text-white">
        <div className="mx-auto max-w-2xl rounded-[28px] border border-white/8 bg-white/4 px-6 py-16 text-center">
          <h1 className="text-3xl font-black">Contractor profile not found</h1>
          <p className="mt-3 text-slate-300">The requested contractor could not be loaded. Try browsing the full contractor list instead.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Button variant="outline" onClick={() => navigate("/contractors")}>Back to Contractors</Button>
            <Button variant="primary" onClick={() => navigate("/contractors")}>Browse Contractors</Button>
          </div>
        </div>
      </div>
    );
  }

  const heroImage = profile.image || profile.avatar || "";
  const portfolio = profile.portfolio || [];
  const services = profile.services || [];
  const reviews = profile.reviews || [];

  return (
    <div className="min-h-screen bg-[#0b0f12] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] border border-white/8 bg-gradient-to-br from-[#111827] via-[#171222] to-[#1b1328] shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8 lg:py-10">
            <div className="flex items-center justify-center">
              <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-violet-500 to-fuchsia-600 text-5xl font-black text-white shadow-[0_25px_55px_rgba(124,58,237,0.28)]">
                {heroImage ? <img src={heroImage} alt={profile.name} className="h-full w-full object-cover" /> : <span>{profile.name.charAt(0).toUpperCase()}</span>}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-black text-white sm:text-4xl">{profile.name}</h1>
                  {profile.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                      <Icons.Check className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
                  <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 font-bold text-violet-100">{profile.trade}</span>
                  <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1">{profile.location || "Location available on request"}</span>
                  {profile.memberSince && <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1">Member since {new Date(profile.memberSince).getFullYear()}</span>}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1 text-amber-300">{renderStars(profile.rating)}</div>
                  <span className="text-sm font-semibold text-slate-300">{profile.rating.toFixed(1)} · {profile.reviewCount} reviews</span>
                  {profile.responseRate && <span className="text-sm text-slate-400">Response rate: {profile.responseRate}</span>}
                  {profile.avgResponseTime && <span className="text-sm text-slate-400">Avg response time: {profile.avgResponseTime}</span>}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={() => setShowHireModal(true)}>Hire This Contractor</Button>
                <Button variant="outline" onClick={handleMessage}>Send Message</Button>
                <Button variant="ghost" onClick={shareProfile}>
                  <Icons.Share className="h-4 w-4" />
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Business Info Strip */}
        {Boolean(profile.businessName || profile.phone || profile.location || profile.city) && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-6 mt-6">
            {profile.businessName && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">🏢</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Business</p>
                  <p className="text-sm font-semibold text-gray-800">{profile.businessName}</p>
                </div>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📞</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-semibold text-gray-800">{profile.phone}</p>
                </div>
              </div>
            )}
            {(profile.location || profile.city) && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📍</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                  <p className="text-sm font-semibold text-gray-800">{profile.location || profile.city}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8">
          <section className="rounded-[24px] border border-white/8 bg-white/4 p-6">
            <h2 className="text-xl font-black text-white">Quick Facts</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Services Offered</p>
                <p className="mt-2 text-2xl font-black text-white">{services.length}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Portfolio Items</p>
                <p className="mt-2 text-2xl font-black text-white">{portfolio.length}</p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-[24px] border border-white/8 bg-white/4 p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">Services Offered</h2>
              <p className="mt-2 text-sm text-slate-400">Available services with pricing and delivery details.</p>
            </div>
          </div>

          {services.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">This contractor has not listed any services yet.</p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service: ContractorServiceOffer) => (
                <article key={service.id} className="rounded-[22px] border border-white/8 bg-[#10151f] p-5 max-w-full overflow-hidden">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-black text-white truncate">{service.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300 overflow-hidden break-words line-clamp-2" style={{ wordBreak: 'break-word', overflow: 'hidden' }}>{service.description || "Professional contractor service."}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-300">
                    <span className="font-extrabold text-white">{formatPrice(service.price)}</span>
                    <span className="inline-flex items-center gap-1 text-amber-300">
                      <Icons.Star className="h-4 w-4 fill-current" />
                      {service.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="mt-3 text-sm text-slate-400">{service.deliveryTime || "Delivery time on request"}</div>
                  <div className="mt-4 text-sm text-slate-400">{service.reviewCount} reviews</div>

                  <Button className="mt-5 w-full justify-center" variant="outline" onClick={() => orderService(service)}>
                    Order Service
                  </Button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-[24px] border border-white/8 bg-white/4 p-6">
          <h2 className="text-xl font-black text-white">Portfolio</h2>
          {portfolio.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">This contractor hasn't added portfolio items yet.</p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {portfolio.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedPortfolioItem(item)}
                  className="overflow-hidden rounded-[20px] border border-white/8 bg-[#10151f] text-left w-full"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-800">
                    {item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" /> : <div className="flex h-full items-center justify-center text-slate-400">No image</div>}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-white truncate flex-1">{item.title}</h3>
                      {item.projectBudget !== undefined && item.projectBudget > 0 && (
                        <span className="text-xs text-emerald-400 font-semibold shrink-0">
                          {formatPrice(item.projectBudget)}
                        </span>
                      )}
                    </div>
                    {item.description && <p className="text-xs text-slate-400 truncate mt-1">{item.description}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Reviews & Leave Review Section */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Existing Reviews List */}
          <section className="rounded-[24px] border border-white/8 bg-white/4 p-6 flex flex-col h-full">
            <h2 className="text-xl font-black text-white">Client Reviews</h2>
            
            {isLoadingReviews ? (
              <p className="mt-4 text-sm text-slate-400">Loading reviews...</p>
            ) : existingReviews.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">No reviews yet for this contractor.</p>
            ) : (
              <div className="mt-6 space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {existingReviews.map((review) => (
                  <article key={review.id} className="rounded-2xl border border-white/8 bg-[#10151f] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-bold text-white text-sm">{review.reviewerName}</p>
                      {review.createdAt && (
                        <span className="text-[11px] text-slate-400 font-semibold">
                          {new Date(review.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-amber-300 mt-1">
                      {renderStars(review.rating)}
                    </div>
                    <p className="mt-2 text-sm text-slate-300 break-words overflow-hidden leading-relaxed">
                      {review.comment}
                    </p>
                    {review.response && (
                      <div className="mt-3 rounded-xl bg-white/5 border border-white/5 p-3">
                        <p className="text-xs font-semibold text-amber-400">Contractor response:</p>
                        <p className="text-xs text-slate-300 mt-1 break-words overflow-hidden">{review.response}</p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Leave a Review Form */}
          <section className="rounded-[24px] border border-white/8 bg-white/4 p-6 flex flex-col h-full justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Leave a Review</h2>
              <p className="mt-2 text-sm text-slate-400">Share your experience working with this contractor</p>
              
              {isAuthenticated && user?.role === 'buyer' ? (
                <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-1">
                      Rating
                    </label>
                    <StarRatingSelector
                      rating={selectedRating}
                      hoverRating={hoveredRating}
                      onRatingChange={setSelectedRating}
                      onHoverChange={setHoveredRating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Review Details
                    </label>
                    <textarea
                      rows={4}
                      className="w-full rounded-2xl border border-white/8 bg-[#10151f] px-4 py-3 text-white outline-none focus:border-amber-400/40 text-sm placeholder-slate-500"
                      placeholder="Describe your experience..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                    />
                  </div>

                  {reviewError && (
                    <p className="text-sm font-semibold text-rose-400 mt-2">{reviewError}</p>
                  )}
                  {reviewSuccess && (
                    <p className="text-sm font-semibold text-emerald-400 mt-2">Review posted!</p>
                  )}

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full justify-center mt-2 bg-amber-500 hover:bg-amber-600 text-slate-900 border-none font-bold py-3 text-sm rounded-xl"
                  >
                    {isSubmittingReview ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-slate-900" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Posting...
                      </span>
                    ) : (
                      "Post Review"
                    )}
                  </Button>
                </form>
              ) : !isAuthenticated ? (
                <div className="mt-8 text-center py-6">
                  <button
                    onClick={() => navigate('/signin')}
                    className="text-amber-400 hover:text-amber-300 font-bold underline text-sm"
                  >
                    Sign in to leave a review
                  </button>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>

      {showHireModal && profile && (
        <HireModal
          contractor={profile}
          onClose={() => setShowHireModal(false)}
          onSuccess={() => setShowHireModal(false)}
        />
      )}

      {selectedPortfolioItem && (
        <PortfolioLightbox item={selectedPortfolioItem} onClose={() => setSelectedPortfolioItem(null)} />
      )}
    </div>
  );
};

export default ContractorProfilePage;
