import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icons } from "../components/Icons";
import { aiService } from "../src/services/aiService";

type EstimateFormState = {
  city: string;
  projectType: string;
  marla: string;
  sqft: string;
  floors: string;
  quality: string;
  bedrooms: string;
  washrooms: string;
};

type PhaseItem = {
  phase_number: number;
  name: string;
  categories: string[];
};

type ComparisonRow = {
  quality: string;
  totalCost: number | null;
  costPerSqft: number | null;
  difference: string | null;
};

type BreakdownRow = {
  label: string;
  percentage: number;
  amount: number | null;
};

type ItemizedRow = {
  item: string;
  qty: string;
  unit: string;
  rate: number | null;
  total: number | null;
};

const cityOptions = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
];
const projectTypeOptions = [
  "Full Construction",
  "Grey Structure",
  "Renovation",
];
const qualityOptions = [
  { value: "Economy", description: "Basic finishes, functional" },
  { value: "Standard", description: "Mid-range, most popular" },
  { value: "Premium", description: "High-end finishes" },
];
const floorOptions = [1, 2, 3, 4];
const bedroomOptions = [2, 3, 4, 5, 6];
const washroomOptions = [1, 2, 3, 4];
const defaultPhases: PhaseItem[] = [
  {
    phase_number: 1,
    name: "Site Preparation & Foundation",
    categories: ["Excavation", "Footings", "Plinth"],
  },
  {
    phase_number: 2,
    name: "Grey Structure",
    categories: ["Structure", "Columns", "Slab"],
  },
  {
    phase_number: 3,
    name: "Masonry & Roofing",
    categories: ["Brickwork", "Roofing", "Lintels"],
  },
  {
    phase_number: 4,
    name: "Plumbing & Electrical Rough-in",
    categories: ["Conduits", "Wiring", "Piping"],
  },
  {
    phase_number: 5,
    name: "Plastering & Screeding",
    categories: ["Interior plaster", "Exterior plaster", "Floor leveling"],
  },
  {
    phase_number: 6,
    name: "Windows & Doors",
    categories: ["Frames", "Shutters", "Glass"],
  },
  {
    phase_number: 7,
    name: "Flooring & Tiling",
    categories: ["Tiles", "Marble", "Skirting"],
  },
  {
    phase_number: 8,
    name: "Paint & Finishes",
    categories: ["Primer", "Paint", "Texture"],
  },
  {
    phase_number: 9,
    name: "Fixtures & Fittings",
    categories: ["Sanitary", "Electrical fittings", "Hardware"],
  },
  {
    phase_number: 10,
    name: "Final Testing & Handover",
    categories: ["Inspection", "Punch list", "Handover"],
  },
];

const moneyFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

const getValue = (source: any, path: string) =>
  path.split(".").reduce((current, key) => current?.[key], source);

const readNumber = (source: any, paths: string[]) => {
  for (const path of paths) {
    const value = Number(getValue(source, path));
    if (Number.isFinite(value)) return value;
  }
  return null;
};

const readString = (source: any, paths: string[]) => {
  for (const path of paths) {
    const value = getValue(source, path);
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
};

const formatPKR = (value: number | null) => {
  if (value === null) return "—";
  if (value >= 10000000) {
    return `PKR ${(value / 10000000).toFixed(2)} Crore`;
  }
  if (value >= 100000) {
    return `PKR ${(value / 100000).toFixed(1)} Lakh`;
  }
  return `PKR ${moneyFormatter.format(Math.round(value))}`;
};

const formatCompactPKR = (value: number | null) => {
  if (value === null) return "—";
  if (value >= 10000000) return `PKR ${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `PKR ${(value / 100000).toFixed(1)} Lakh`;
  if (value >= 1000) return `PKR ${(value / 1000).toFixed(1)}k`;
  return `PKR ${moneyFormatter.format(Math.round(value))}`;
};

const widthClassForPercent = (percent: number) => {
  if (percent >= 95) return "w-full";
  if (percent >= 85) return "w-11/12";
  if (percent >= 75) return "w-10/12";
  if (percent >= 65) return "w-3/4";
  if (percent >= 55) return "w-2/3";
  if (percent >= 45) return "w-1/2";
  if (percent >= 35) return "w-5/12";
  if (percent >= 25) return "w-1/3";
  if (percent >= 18) return "w-1/4";
  if (percent >= 10) return "w-1/5";
  return "w-1/12";
};

const normalizePhases = (payload: any): PhaseItem[] => {
  const raw =
    (Array.isArray(payload?.phases) && payload.phases) ||
    (Array.isArray(payload?.data?.phases) && payload.data.phases) ||
    (Array.isArray(payload?.data) && payload.data) ||
    (Array.isArray(payload) && payload) ||
    defaultPhases;

  return raw.map((phase: any, index: number) => {
    const categories = Array.isArray(phase.categories)
      ? phase.categories
      : Array.isArray(phase.items)
        ? phase.items
        : typeof phase.categories === "string"
          ? phase.categories
              .split(",")
              .map((item: string) => item.trim())
              .filter(Boolean)
          : [];

    return {
      phase_number: Number(
        phase.phase_number ?? phase.phase ?? phase.number ?? index + 1,
      ),
      name: phase.name ?? phase.title ?? `Phase ${index + 1}`,
      categories: categories.length > 0 ? categories : ["Construction work"],
    };
  });
};

const normalizeBreakdown = (payload: any): BreakdownRow[] => {
  const candidates =
    (Array.isArray(payload?.category_breakdown) &&
      payload.category_breakdown) ||
    (Array.isArray(payload?.breakdown?.categories) &&
      payload.breakdown.categories) ||
    (Array.isArray(payload?.cost_breakdown) && payload.cost_breakdown) ||
    (Array.isArray(payload?.breakdown) && payload.breakdown) ||
    [];

  return candidates.map((entry: any) => ({
    label: entry.label ?? entry.category ?? entry.name ?? "Category",
    percentage: Number(entry.percentage ?? entry.percent ?? 0),
    amount: readNumber(entry, ["amount", "cost", "total", "value"]),
  }));
};

const normalizeItemizedBreakdown = (payload: any): ItemizedRow[] => {
  const candidates =
    (Array.isArray(payload?.itemized_breakdown) &&
      payload.itemized_breakdown) ||
    (Array.isArray(payload?.breakdown?.items) && payload.breakdown.items) ||
    (Array.isArray(payload?.items) && payload.items) ||
    [];

  return candidates.map((entry: any) => ({
    item: entry.item ?? entry.name ?? entry.description ?? "Item",
    qty: String(entry.qty ?? entry.quantity ?? entry.count ?? "—"),
    unit: String(entry.unit ?? entry.uom ?? entry.measure ?? "—"),
    rate: readNumber(entry, ["rate", "unit_rate", "price"]),
    total: readNumber(entry, ["total", "amount", "cost", "value"]),
  }));
};

const normalizeComparison = (payload: any): ComparisonRow[] => {
  const rowsFromArray =
    (Array.isArray(payload?.qualities) && payload.qualities) ||
    (Array.isArray(payload?.results) && payload.results) ||
    (Array.isArray(payload?.data?.qualities) && payload.data.qualities) ||
    (Array.isArray(payload?.data) && payload.data) ||
    [];

  if (Array.isArray(rowsFromArray) && rowsFromArray.length > 0) {
    return rowsFromArray.map((entry: any) => ({
      quality: entry.quality ?? entry.name ?? entry.label ?? "Quality",
      totalCost: readNumber(entry, [
        "total_cost",
        "totalCost",
        "cost",
        "amount",
      ]),
      costPerSqft: readNumber(entry, [
        "cost_per_sqft",
        "costPerSqft",
        "per_sqft",
      ]),
      difference: readString(entry, ["difference", "delta", "note"]),
    }));
  }

  return ["Economy", "Standard", "Premium"].map((quality) => {
    const key = quality.toLowerCase();
    const entry =
      getValue(payload, key) ||
      getValue(payload, quality) ||
      getValue(payload, `${key}.data`) ||
      getValue(payload, `data.${key}`);

    return {
      quality,
      totalCost: readNumber(entry, [
        "total_cost",
        "totalCost",
        "cost",
        "amount",
      ]),
      costPerSqft: readNumber(entry, [
        "cost_per_sqft",
        "costPerSqft",
        "per_sqft",
      ]),
      difference: readString(entry, ["difference", "delta", "note"]),
    };
  });
};

export const CostEstimatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<EstimateFormState>({
    city: "Lahore",
    projectType: "Full Construction",
    marla: "5",
    sqft: String(5 * 272),
    floors: "2",
    quality: "Standard",
    bedrooms: "3",
    washrooms: "2",
  });
  const [estimate, setEstimate] = useState<any>(null);
  const [comparison, setComparison] = useState<ComparisonRow[]>([]);
  const [phases, setPhases] = useState<PhaseItem[]>(defaultPhases);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadPhases = async () => {
      try {
        const data = await aiService.getPhases();
        if (mounted) {
          setPhases(normalizePhases(data));
        }
      } catch (fetchError) {
        if (mounted) {
          setPhases(defaultPhases);
        }
      }
    };

    void loadPhases();

    return () => {
      mounted = false;
    };
  }, []);

  const totalSqft = useMemo(() => {
    const sqft = Number(form.sqft);
    if (Number.isFinite(sqft) && sqft > 0) {
      return sqft;
    }

    const marla = Number(form.marla);
    if (Number.isFinite(marla) && marla > 0) {
      return Math.round(marla * 272);
    }

    return 0;
  }, [form.marla, form.sqft]);

  const summary = useMemo(() => {
    return {
      totalCost:
        readNumber(estimate, [
          "total_cost",
          "totalCost",
          "estimated_cost",
          "project_cost",
          "data.total_cost",
        ]) ?? null,
      costPerSqft:
        readNumber(estimate, [
          "cost_per_sqft",
          "costPerSqft",
          "per_sqft",
          "data.cost_per_sqft",
        ]) ?? null,
      totalArea:
        readNumber(estimate, [
          "total_area",
          "totalArea",
          "sqft",
          "data.total_area",
        ]) ?? (totalSqft > 0 ? totalSqft : null),
      timeline:
        readString(estimate, [
          "timeline",
          "estimated_timeline",
          "project_timeline",
          "data.timeline",
        ]) ?? "~8-12 months",
    };
  }, [estimate, totalSqft]);

  const breakdownRows = useMemo(() => normalizeBreakdown(estimate), [estimate]);
  const itemizedRows = useMemo(
    () => normalizeItemizedBreakdown(estimate),
    [estimate],
  );
  const tips = useMemo(() => {
    const raw =
      estimate?.cost_reduction_tips ||
      estimate?.tips ||
      estimate?.data?.cost_reduction_tips ||
      [];
    return Array.isArray(raw) ? raw : [];
  }, [estimate]);
  const comparisonRows = useMemo(
    () => normalizeComparison(comparison),
    [comparison],
  );

  const handleMarlaChange = (value: string) => {
    setForm((current) => ({
      ...current,
      marla: value,
      sqft: value ? String(Math.round(Number(value) * 272)) : current.sqft,
    }));
  };

  const handleSqftChange = (value: string) => {
    setForm((current) => ({
      ...current,
      sqft: value,
      marla: value ? "" : current.marla,
    }));
  };

  const handleCalculate = async () => {
    if (loading) return;

    const sqftValue = totalSqft;
    if (!sqftValue) {
      setError("Could not calculate. Check your inputs and try again.");
      return;
    }

    setLoading(true);
    setError(null);
    setSaveMessage(null);

    try {
      const params = {
        sqft: sqftValue,
        floors: Number(form.floors),
        quality: form.quality,
        city: form.city,
        bhk: Number(form.bedrooms),
        projectType: form.projectType,
        area: form.marla ? `${form.marla} Marla` : `${sqftValue} sqft`,
      };

      const [estimateResult, comparisonResult] = await Promise.all([
        aiService.estimateCost(params),
        aiService.compareQualities(sqftValue, Number(form.floors), form.city),
      ]);

      setEstimate(estimateResult);
      setComparison(
        Array.isArray(comparisonResult?.data)
          ? comparisonResult.data
          : comparisonResult,
      );
      setDetailsOpen(true);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "";
      if (!navigator.onLine || /failed to fetch|network/i.test(message)) {
        setError("AI estimator is temporarily unavailable.");
      } else {
        setError("Could not calculate. Check your inputs and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEstimate = async () => {
    const breakdownText = breakdownRows
      .map(
        (row) =>
          `${row.label}: ${row.percentage}% (${formatCompactPKR(row.amount)})`,
      )
      .join("\n");

    const text = [
      "BuildHive AI Construction Estimate",
      `City: ${form.city}`,
      `Project Type: ${form.projectType}`,
      `Area: ${moneyFormatter.format(summary.totalArea ?? 0)} sqft`,
      `Quality: ${form.quality}`,
      `Total Cost: ${formatPKR(summary.totalCost)}`,
      `Cost per Sqft: ${formatCompactPKR(summary.costPerSqft)}`,
      `Timeline: ${summary.timeline}`,
      "",
      "Breakdown:",
      breakdownText || "No breakdown available",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setSaveMessage("Estimate copied to clipboard.");
      window.setTimeout(() => setSaveMessage(null), 2200);
    } catch {
      setSaveMessage("Copy failed. Please copy manually.");
      window.setTimeout(() => setSaveMessage(null), 2200);
    }
  };

  const selectedQuality = form.quality.toLowerCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50/30 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-slate-950 px-6 py-14 text-white shadow-[0_24px_70px_rgba(15,23,42,0.28)] sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(250,204,21,0.20),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(251,191,36,0.14),_transparent_30%)]" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-yellow-300/40 bg-yellow-400/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-yellow-200">
              Powered by BuildHive AI
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              AI Construction Cost Estimator
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Get accurate PKR estimates for any construction project in
              Pakistan.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Enter your project details
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Use Marla or Sqft. One Marla is approximately 272 sqft in
                  Lahore.
                </p>
              </div>
              <div className="inline-flex items-center rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
                1 Marla ≈ 272 sqft in Lahore
              </div>
            </div>

            <div className="mt-8 grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="City">
                  <select
                    value={form.city}
                    aria-label="City"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        city: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-amber-400"
                  >
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Project Type">
                  <select
                    value={form.projectType}
                    aria-label="Project Type"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        projectType: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-amber-400"
                  >
                    {projectTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Area in Marla">
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 5"
                    value={form.marla}
                    onChange={(event) => handleMarlaChange(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-amber-400"
                  />
                </Field>

                <Field label="Area in Sqft">
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1360"
                    value={form.sqft}
                    onChange={(event) => handleSqftChange(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-amber-400"
                  />
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Floors">
                  <select
                    value={form.floors}
                    aria-label="Floors"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        floors: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-amber-400"
                  >
                    {floorOptions.map((floor) => (
                      <option key={floor} value={floor}>
                        {floor}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Quality">
                  <select
                    value={form.quality}
                    aria-label="Quality"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        quality: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-amber-400"
                  >
                    {qualityOptions.map((quality) => (
                      <option key={quality.value} value={quality.value}>
                        {quality.value} - {quality.description}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Bedrooms">
                  <select
                    value={form.bedrooms}
                    aria-label="Bedrooms"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        bedrooms: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-amber-400"
                  >
                    {bedroomOptions.map((bedrooms) => (
                      <option key={bedrooms} value={bedrooms}>
                        {bedrooms}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Washrooms">
                  <select
                    value={form.washrooms}
                    aria-label="Washrooms"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        washrooms: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-amber-400"
                  >
                    {washroomOptions.map((washrooms) => (
                      <option key={washrooms} value={washrooms}>
                        {washrooms}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <button
                type="button"
                onClick={() => void handleCalculate()}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-yellow-500 px-6 py-4 text-base font-bold text-slate-950 shadow-[0_18px_35px_rgba(250,204,21,0.28)] transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/20 border-t-slate-950" />
                    AI is calculating your estimate...
                  </>
                ) : (
                  <>
                    <Icons.Calculator className="h-5 w-5" />
                    Calculate Cost
                  </>
                )}
              </button>

              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              {saveMessage && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {saveMessage}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <h3 className="text-xl font-bold text-slate-900">How it works</h3>
              <div className="mt-5 grid gap-4">
                {[
                  "Enter your project details",
                  "AI calculates based on current Lahore market rates",
                  "Get itemized breakdown + contractor recommendations",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-6 text-slate-600">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <h3 className="text-xl font-bold text-slate-900">
                Current selection
              </h3>
              <div className="mt-5 grid gap-4 text-sm text-slate-600">
                <InfoRow
                  label="Area"
                  value={`${moneyFormatter.format(totalSqft)} sqft`}
                />
                <InfoRow label="City" value={form.city} />
                <InfoRow label="Project" value={form.projectType} />
                <InfoRow label="Quality" value={form.quality} />
              </div>
            </div>
          </div>
        </section>

        {estimate && (
          <section className="mt-8 space-y-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Total Cost"
                value={formatPKR(summary.totalCost)}
                accent="from-yellow-400 to-amber-500"
              />
              <SummaryCard
                label="Cost per Sqft"
                value={formatCompactPKR(summary.costPerSqft)}
                accent="from-slate-950 to-slate-700"
              />
              <SummaryCard
                label="Total Area"
                value={`${moneyFormatter.format(summary.totalArea ?? 0)} sqft`}
                accent="from-emerald-400 to-teal-500"
              />
              <SummaryCard
                label="Timeline"
                value={summary.timeline}
                accent="from-orange-400 to-rose-500"
              />
            </div>

            <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Quality Comparison
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Economy | Standard | Premium
                    </p>
                  </div>
                  <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-800">
                    {form.quality} selected
                  </span>
                </div>

                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">
                          Metric
                        </th>
                        {comparisonRows.map((row) => (
                          <th
                            key={row.quality}
                            className={`px-4 py-3 text-left font-semibold ${row.quality.toLowerCase() === selectedQuality ? "bg-yellow-50 text-yellow-900" : ""}`}
                          >
                            {row.quality}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <ComparisonRowTable
                        label="Total Cost"
                        rows={comparisonRows}
                        selectedQuality={selectedQuality}
                        valueAccessor={(row) => formatPKR(row.totalCost)}
                      />
                      <ComparisonRowTable
                        label="Cost per Sqft"
                        rows={comparisonRows}
                        selectedQuality={selectedQuality}
                        valueAccessor={(row) =>
                          formatCompactPKR(row.costPerSqft)
                        }
                      />
                      <ComparisonRowTable
                        label="% difference"
                        rows={comparisonRows}
                        selectedQuality={selectedQuality}
                        valueAccessor={(row) => row.difference ?? "—"}
                      />
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Breakdown Chart
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Simple visual split of your estimate
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {breakdownRows.length > 0 ? (
                    breakdownRows.map((row) => (
                      <div key={row.label} className="space-y-2">
                        <div className="flex items-center justify-between gap-4 text-sm">
                          <span className="font-medium text-slate-700">
                            {row.label}
                          </span>
                          <span className="text-slate-500">
                            {row.percentage}% · {formatCompactPKR(row.amount)}
                          </span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-100">
                          <div
                            className={`h-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 ${widthClassForPercent(row.percentage)}`}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No breakdown returned by the AI API.
                    </p>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setDetailsOpen((current) => !current)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    View detailed breakdown {detailsOpen ? "▲" : "▼"}
                  </button>
                </div>
              </div>
            </div>

            {detailsOpen && itemizedRows.length > 0 && (
              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <h3 className="text-xl font-bold text-slate-900">
                  Detailed Breakdown
                </h3>
                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">
                          Item
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Unit
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Rate (PKR)
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Total (PKR)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {itemizedRows.map((row) => (
                        <tr key={`${row.item}-${row.qty}-${row.unit}`}>
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {row.item}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {row.qty}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {row.unit}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {formatCompactPKR(row.rate)}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {formatCompactPKR(row.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tips.length > 0 && (
              <div className="rounded-[30px] border border-amber-200 bg-amber-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <h3 className="text-xl font-bold text-amber-950">
                  💡 Tips to reduce cost
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-amber-900">
                  {tips.map((tip: any, index: number) => (
                    <li key={`${String(tip)}-${index}`} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-amber-500" />
                      <span>{String(tip)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void handleSaveEstimate()}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Save This Estimate
              </button>
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Find Materials
              </button>
              <button
                type="button"
                onClick={() => navigate("/contractors")}
                className="inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
              >
                Find a Contractor
              </button>
            </div>
          </section>
        )}

        <section className="mt-8 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Construction Phases Guide
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                10 phases from site preparation to handover.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {phases.map((phase, index) => (
              <details
                key={phase.phase_number}
                open={index < 3}
                className="group rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                      {phase.phase_number}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {phase.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {phase.categories.join(" · ")}
                      </div>
                    </div>
                  </div>
                  <Icons.ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-4 flex flex-wrap gap-2 pl-[3.1rem]">
                  {phase.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="block space-y-2">
    <span className="text-sm font-semibold text-slate-700">{label}</span>
    {children}
  </label>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
    <span className="font-medium text-slate-500">{label}</span>
    <span className="font-semibold text-slate-900">{value}</span>
  </div>
);

const SummaryCard: React.FC<{
  label: string;
  value: string;
  accent: string;
}> = ({ label, value, accent }) => (
  <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
    <div className={`mb-4 h-1.5 rounded-full bg-gradient-to-r ${accent}`} />
    <div className="text-sm font-medium text-slate-500">{label}</div>
    <div className="mt-2 text-2xl font-black tracking-tight text-slate-900">
      {value}
    </div>
  </div>
);

const ComparisonRowTable: React.FC<{
  label: string;
  rows: ComparisonRow[];
  selectedQuality: string;
  valueAccessor: (row: ComparisonRow) => string;
}> = ({ label, rows, selectedQuality, valueAccessor }) => (
  <tr>
    <td className="px-4 py-3 font-semibold text-slate-700">{label}</td>
    {rows.map((row) => (
      <td
        key={`${label}-${row.quality}`}
        className={`px-4 py-3 text-slate-700 ${row.quality.toLowerCase() === selectedQuality ? "bg-yellow-50 font-semibold text-yellow-900" : ""}`}
      >
        {valueAccessor(row)}
      </td>
    ))}
  </tr>
);
