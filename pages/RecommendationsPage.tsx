import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icons } from "../components/Icons";
import { aiService } from "../src/services/aiService";

const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad"];
const qualities = ["Standard", "Premium", "Luxury"];

const asArray = (payload: any): any[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.results)) return payload.data.results;
  if (Array.isArray(payload?.data?.products)) return payload.data.products;
  const categories = payload?.categories || payload?.recommendations || payload?.data?.categories || payload?.data?.recommendations;
  if (categories && typeof categories === "object") {
    return Object.entries(categories).flatMap(([category, items]) =>
      Array.isArray(items)
        ? items.map((item) => ({ ...item, category_name: item?.category_name || category }))
        : [],
    );
  }
  return [];
};

const readText = (item: any, keys: string[], fallback: string) => {
  for (const key of keys) {
    const value = item?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return fallback;
};

const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("Lahore");
  const [quality, setQuality] = useState("Standard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const normalizedResults = useMemo(
    () =>
      results.map((item, index) => {
        const name = readText(
          item,
          ["item_name", "name", "product_name", "title", "material", "item"],
          `Recommended Material ${index + 1}`,
        );
        return {
          id: item.id || item.product_id || item.material_id || `${name}-${index}`,
          rank: index + 1,
          name,
          category: readText(item, ["category", "category_name", "type"], "Construction Material"),
          reason: readText(
            item,
            ["reason", "reasoning", "why", "description", "summary", "phase"],
            `A strong match for ${quality.toLowerCase()} projects in ${city}.`,
          ),
          productId: item.id || item.product_id || item.productId || "",
          price: item.final_price_pkr || item.market_price_pkr || null,
          availability: item.availability || "",
          score: item.recommendation_score || null,
        };
      }),
    [city, quality, results],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!description.trim()) {
      setError("Describe your project or material need first.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const payload = await aiService.getRecommendations({
        description: description.trim(),
        city,
        quality,
        area: description.trim(),
        limit: 8,
      });
      if (payload?.status === "error") {
        setResults([]);
        setError(payload?.message || "No recommendations returned.");
        return;
      }
      setResults(asArray(payload));
    } catch {
      setResults([]);
      setError("AI service temporarily unavailable. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bh-bg)] px-4 py-12 text-[var(--bh-text)] sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B5CF6]">
            AI Recommendations
          </span>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Find the right materials for your build
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--bh-muted)]">
            Describe what you are building and BuildHive AI will rank material
            matches you can search in the marketplace.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[30px] border border-[var(--bh-border)] bg-[var(--bh-card)] p-6 shadow-2xl shadow-purple-950/10 sm:p-8"
        >
          <label className="block">
            <span className="text-sm font-bold">Describe your project or material need</span>
            <textarea
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="e.g. 5 marla grey structure in Lahore, need cement, steel, and pipes"
              className="mt-2 w-full rounded-2xl border border-[var(--bh-border)] bg-[var(--bh-surface)] px-4 py-3 text-sm outline-none transition focus:border-[#8B5CF6]"
            />
          </label>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold">City</span>
              <select
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[var(--bh-border)] bg-[var(--bh-surface)] px-4 py-3 text-sm outline-none transition focus:border-[#8B5CF6]"
              >
                {cities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-bold">Quality</span>
              <select
                value={quality}
                onChange={(event) => setQuality(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[var(--bh-border)] bg-[var(--bh-surface)] px-4 py-3 text-sm outline-none transition focus:border-[#8B5CF6]"
              >
                {qualities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6C3BD5] px-6 py-4 font-bold text-white transition-all duration-200 hover:scale-[1.01] hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                Getting recommendations...
              </>
            ) : (
              <>
                <Icons.Sparkles className="h-5 w-5" />
                Get Recommendations
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
            {error}
          </div>
        )}

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-44 animate-pulse rounded-3xl bg-white/10" />
            ))}
          {!loading &&
            normalizedResults.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-[var(--bh-border)] bg-[var(--bh-card)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="rounded-full bg-[#6C3BD5]/15 px-3 py-1 text-xs font-bold text-[#8B5CF6]">
                      Rank #{item.rank}
                    </span>
                    <h2 className="mt-4 text-xl font-black">{item.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-[#10B981]">
                      {item.category}
                    </p>
                  </div>
                  <Icons.Package className="h-6 w-6 text-[#8B5CF6]" />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[var(--bh-muted)]">
                  {item.reason}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                  {item.price && (
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-400">
                      Rs. {Number(item.price).toLocaleString("en-PK")}
                    </span>
                  )}
                  {item.availability && (
                    <span className="rounded-full bg-slate-500/10 px-3 py-1 text-slate-300">
                      {item.availability}
                    </span>
                  )}
                  {item.score && (
                    <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-300">
                      {Number(item.score).toFixed(1)}% match
                    </span>
                  )}
                </div>
                
              </article>
            ))}
          {!loading && !error && normalizedResults.length === 0 && (
            <div className="rounded-3xl border border-[var(--bh-border)] bg-[var(--bh-card)] p-6 text-sm text-[var(--bh-muted)] md:col-span-2">
              No recommendations yet. Describe a project and submit the form.
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default RecommendationsPage;
