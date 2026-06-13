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
  projectDescription: string;
  maxBudget: string;
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
    return `Rs. ${(value / 10000000).toFixed(2)} Crore`;
  }
  if (value >= 100000) {
    return `Rs. ${(value / 100000).toFixed(1)} Lakh`;
  }
  return `Rs. ${moneyFormatter.format(Math.round(value))}`;
};

const formatCompactPKR = (value: number | null) => {
  if (value === null) return "—";
  if (value >= 10000000) return `Rs. ${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `Rs. ${(value / 100000).toFixed(1)} Lakh`;
  if (value >= 1000) return `Rs. ${(value / 1000).toFixed(1)}k`;
  return `Rs. ${moneyFormatter.format(Math.round(value))}`;
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
  const objectBreakdown =
    payload?.category_breakdown ||
    payload?.data?.category_breakdown ||
    payload?.data?.data?.category_breakdown;
  if (objectBreakdown && !Array.isArray(objectBreakdown) && typeof objectBreakdown === "object") {
    const total = Object.values(objectBreakdown).reduce(
      (sum, value) => sum + (Number(value) || 0),
      0,
    );
    return Object.entries(objectBreakdown).map(([label, amount]) => ({
      label,
      amount: Number(amount) || null,
      percentage: total > 0 ? Math.round(((Number(amount) || 0) / total) * 100) : 0,
    }));
  }

  const candidates =
    (Array.isArray(payload?.category_breakdown) &&
      payload.category_breakdown) ||
    (Array.isArray(payload?.breakdown?.categories) &&
      payload.breakdown.categories) ||
    (Array.isArray(payload?.data?.breakdown?.categories) &&
      payload.data.breakdown.categories) ||
    (Array.isArray(payload?.data?.data?.breakdown?.categories) &&
      payload.data.data.breakdown.categories) ||
    (Array.isArray(payload?.cost_breakdown) && payload.cost_breakdown) ||
    (Array.isArray(payload?.data?.cost_breakdown) &&
      payload.data.cost_breakdown) ||
    (Array.isArray(payload?.data?.data?.cost_breakdown) &&
      payload.data.data.cost_breakdown) ||
    (Array.isArray(payload?.breakdown) && payload.breakdown) ||
    (Array.isArray(payload?.data?.breakdown) && payload.data.breakdown) ||
    (Array.isArray(payload?.data?.data?.breakdown) &&
      payload.data.data.breakdown) ||
    [];

  return candidates.map((entry: any) => ({
    label: entry.label ?? entry.category ?? entry.name ?? "Category",
    percentage: Number(entry.percentage ?? entry.percent ?? 0),
    amount: readNumber(entry, ["amount", "cost", "total", "value"]),
  }));
};

const normalizeItemizedBreakdown = (payload: any): ItemizedRow[] => {
  const objectItems =
    payload?.itemized_breakdown ||
    payload?.data?.itemized_breakdown ||
    payload?.data?.data?.itemized_breakdown;
  if (objectItems && !Array.isArray(objectItems) && typeof objectItems === "object") {
    return Object.entries(objectItems).map(([name, entry]: [string, any]) => ({
      item: entry?.item ?? entry?.name ?? name,
      qty: String(entry?.qty ?? entry?.quantity ?? entry?.quantity_numeric ?? "—"),
      unit: String(entry?.unit ?? entry?.uom ?? entry?.measure ?? "—"),
      rate: readNumber(entry, ["rate", "unit_rate", "unit_cost", "price"]),
      total: readNumber(entry, ["total", "amount", "cost", "value"]),
    }));
  }

  const candidates =
    (Array.isArray(payload?.itemized_breakdown) &&
      payload.itemized_breakdown) ||
    (Array.isArray(payload?.data?.itemized_breakdown) &&
      payload.data.itemized_breakdown) ||
    (Array.isArray(payload?.data?.data?.itemized_breakdown) &&
      payload.data.data.itemized_breakdown) ||
    (Array.isArray(payload?.breakdown?.items) && payload.breakdown.items) ||
    (Array.isArray(payload?.data?.breakdown?.items) &&
      payload.data.breakdown.items) ||
    (Array.isArray(payload?.data?.data?.breakdown?.items) &&
      payload.data.data.breakdown.items) ||
    (Array.isArray(payload?.items) && payload.items) ||
    (Array.isArray(payload?.data?.items) && payload.data.items) ||
    (Array.isArray(payload?.data?.data?.items) &&
      payload.data.data.items) ||
    [];

  return candidates.map((entry: any) => ({
    item: entry.item ?? entry.name ?? entry.description ?? "Item",
    qty: String(entry.qty ?? entry.quantity ?? entry.count ?? "â€”"),
    unit: String(entry.unit ?? entry.uom ?? entry.measure ?? "â€”"),
    rate: readNumber(entry, ["rate", "unit_rate", "price"]),
    total: readNumber(entry, ["total", "amount", "cost", "value"]),
  }));
};

const normalizeComparison = (payload: any): ComparisonRow[] => {
  const comparisonObject =
    payload?.quality_comparison ||
    payload?.data?.quality_comparison ||
    payload?.data?.data?.quality_comparison;
  if (comparisonObject && !Array.isArray(comparisonObject) && typeof comparisonObject === "object") {
    return Object.entries(comparisonObject).map(([quality, entry]: [string, any]) => ({
      quality,
      totalCost: readNumber(entry, ["total_cost", "totalCost", "cost", "amount"]),
      costPerSqft: readNumber(entry, ["cost_per_sqft", "costPerSqft", "per_sqft"]),
      difference:
        entry?.percentage_diff_vs_economy !== undefined
          ? `${Number(entry.percentage_diff_vs_economy).toFixed(1)}%`
          : readString(entry, ["difference", "delta", "note"]),
    }));
  }

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
    projectDescription: "5 marla house in Lahore",
    maxBudget: "",
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
          "breakdown.summary.grand_total",
          "breakdown.summary.subtotal",
          "summary.total_pkr",
          "data.total_cost",
          "data.breakdown.summary.grand_total",
          "data.breakdown.summary.subtotal",
          "data.summary.total_pkr",
          "data.data.total_cost",
          "data.data.estimated_cost",
          "data.data.breakdown.summary.grand_total",
          "data.data.breakdown.summary.subtotal",
          "data.data.summary.total_pkr",
        ]) ?? null,
      costPerSqft:
        readNumber(estimate, [
          "cost_per_sqft",
          "costPerSqft",
          "per_sqft",
          "summary.cost_per_sqft",
          "data.cost_per_sqft",
          "data.summary.cost_per_sqft",
          "data.data.cost_per_sqft",
          "data.data.costPerSqft",
          "data.data.summary.cost_per_sqft",
        ]) ?? null,
      totalArea:
        readNumber(estimate, [
          "total_area",
          "totalArea",
          "sqft",
          "project.total_sqft",
          "project.sqft",
          "breakdown.summary.total_sqft",
          "data.total_area",
          "data.project.total_sqft",
          "data.project.sqft",
          "data.breakdown.summary.total_sqft",
          "data.data.total_area",
          "data.data.sqft",
          "data.data.project.total_sqft",
          "data.data.project.sqft",
          "data.data.breakdown.summary.total_sqft",
        ]) ?? (totalSqft > 0 ? totalSqft : null),
      timeline:
        readString(estimate, [
          "timeline",
          "estimated_timeline",
          "project_timeline",
          "data.timeline",
          "data.data.timeline",
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
      estimate?.data?.data?.cost_reduction_tips ||
      estimate?.data?.tips ||
      estimate?.data?.data?.tips ||
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
        bedrooms: Number(form.bedrooms),
        washrooms: Number(form.washrooms),
        kitchens: 1,
        projectType: form.projectType,
        area:
          form.projectDescription.trim() ||
          (form.marla ? `${form.marla} Marla` : `${sqftValue} sqft`),
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
  const panelClass =
    "rounded-[30px] border p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8";
  const inputClass =
    "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition placeholder:text-[var(--bh-muted)] focus:border-[#6C3BD5]";
  const inputStyle = {
    background: "var(--bh-card)",
    borderColor: "var(--bh-border)",
    color: "var(--bh-text)",
  };

  return (
    <div
      className="min-h-screen page-fade"
      style={{
        background:
          "radial-gradient(circle at 12% 8%, rgba(108,59,213,0.22), transparent 32%), radial-gradient(circle at 88% 18%, rgba(16,185,129,0.14), transparent 30%), var(--bh-bg)",
        color: "var(--bh-text)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section
          className="relative overflow-hidden rounded-[32px] border px-6 py-14 text-white shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:px-10"
          style={{
            background: "linear-gradient(135deg, #1A1A24, #2D1B69)",
            borderColor: "rgba(139,92,246,0.35)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(250,204,21,0.20),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(251,191,36,0.14),_transparent_30%)]" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-yellow-300/40 bg-yellow-400/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-yellow-200">
              Powered by BuildHive AI
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              AI <span className="bh-gradient-text">Construction Cost</span>{" "}
              Estimator
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Get accurate PKR estimates for any construction project in
              Pakistan.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div
            className={panelClass}
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--bh-text)]">
                  Enter your project details
                </h2>
                <p className="mt-2 text-sm text-[var(--bh-muted)]">
                  Use Marla or Sqft. One Marla is approximately 272 sqft in
                  Lahore.
                </p>
              </div>
              <div className="inline-flex items-center rounded-full border border-amber-400/35 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300">
                1 Marla approx 272 sqft in Lahore
              </div>
            </div>

            <div className="mt-8 grid gap-5">
              <Field label="Project Description">
                <textarea
                  rows={4}
                  placeholder="e.g. 5 marla house in Lahore"
                  value={form.projectDescription}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      projectDescription: event.target.value,
                    }))
                  }
                  className={inputClass}
                  style={inputStyle}
                />
              </Field>

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
                    className={inputClass}
                    style={inputStyle}
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
                    className={inputClass}
                    style={inputStyle}
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
                    className={inputClass}
                    style={inputStyle}
                  />
                </Field>

                <Field label="Area in Sqft">
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1360"
                    value={form.sqft}
                    onChange={(event) => handleSqftChange(event.target.value)}
                    className={inputClass}
                    style={inputStyle}
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
                    className={inputClass}
                    style={inputStyle}
                  >
                    {floorOptions.map((floor) => (
                      <option key={floor} value={floor}>
                        {floor}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Quality Grade">
                  <div className="grid gap-2 sm:grid-cols-3">
                    {qualityOptions.map((quality) => {
                      const active = form.quality === quality.value;
                      return (
                        <button
                          key={quality.value}
                          type="button"
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              quality: quality.value,
                            }))
                          }
                          className={`rounded-2xl border px-4 py-3 text-left text-sm transition active:scale-[0.98] ${
                            active
                              ? "border-[#6C3BD5] bg-[#6C3BD5] text-white shadow-lg shadow-violet-900/25"
                              : "border-[var(--bh-border)] bg-[var(--bh-card)] text-[var(--bh-text)] hover:border-[#8B5CF6]"
                          }`}
                        >
                          <span className="block font-bold">
                            {quality.value}
                          </span>
                          <span
                            className={`mt-1 block text-xs ${
                              active ? "text-violet-100" : "text-[var(--bh-muted)]"
                            }`}
                          >
                            {quality.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
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
                    className={inputClass}
                    style={inputStyle}
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
                    className={inputClass}
                    style={inputStyle}
                  >
                    {washroomOptions.map((washrooms) => (
                      <option key={washrooms} value={washrooms}>
                        {washrooms}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Max Budget (optional)">
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--bh-muted)]">
                    PKR
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. 5,000,000"
                    value={form.maxBudget}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        maxBudget: event.target.value,
                      }))
                    }
                    className={`${inputClass} pl-14`}
                    style={inputStyle}
                  />
                </div>
              </Field>

              <button
                type="button"
                onClick={() => void handleCalculate()}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#6C3BD5] to-[#10B981] px-6 py-4 text-base font-bold text-white shadow-[0_18px_35px_rgba(108,59,213,0.28)] transition hover:shadow-[0_20px_45px_rgba(108,59,213,0.36)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    AI is analyzing your project...
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
            <div className="rounded-[30px] border border-[var(--bh-border)] bg-[var(--bh-card)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
              <h3 className="text-xl font-bold text-[var(--bh-text)]">How it works</h3>
              <div className="mt-5 grid gap-4">
                {[
                  "Enter your project details",
                  "AI calculates based on current Lahore market rates",
                  "Get itemized breakdown + contractor recommendations",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex items-start gap-4 rounded-2xl border border-[var(--bh-border)] bg-[var(--bh-surface)] p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-6 text-[var(--bh-muted)]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-[var(--bh-border)] bg-[var(--bh-card)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
              <h3 className="text-xl font-bold text-[var(--bh-text)]">
                Current selection
              </h3>
              <div className="mt-5 grid gap-4 text-sm text-[var(--bh-muted)]">
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
              <div className="rounded-[30px] border border-[var(--bh-border)] bg-[var(--bh-card)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--bh-text)]">
                      Quality Comparison
                    </h3>
                    <p className="mt-1 text-sm text-[var(--bh-muted)]">
                      Economy | Standard | Premium
                    </p>
                  </div>
                  <span className="rounded-full bg-[#6C3BD5]/15 px-3 py-1 text-xs font-semibold text-[#8B5CF6]">
                    {form.quality} selected
                  </span>
                </div>

                <div className="mt-6 overflow-x-auto rounded-3xl border border-[var(--bh-border)]">
                  <table className="min-w-[680px] divide-y divide-[var(--bh-border)] text-sm">
                    <thead className="bg-[var(--bh-surface)] text-[var(--bh-muted)]">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">
                          Metric
                        </th>
                        {comparisonRows.map((row) => (
                          <th
                            key={row.quality}
                            className={`min-w-[150px] px-4 py-3 text-left font-semibold ${row.quality.toLowerCase() === selectedQuality ? "bg-[#6C3BD5]/10 text-[var(--bh-text)]" : ""}`}
                          >
                            {row.quality}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--bh-border)]">
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
                        valueAccessor={(row) => row.difference ?? "-"}
                      />
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-[30px] border border-[var(--bh-border)] bg-[var(--bh-card)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--bh-text)]">
                      Breakdown Chart
                    </h3>
                    <p className="mt-1 text-sm text-[var(--bh-muted)]">
                      Simple visual split of your estimate
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {breakdownRows.length > 0 ? (
                    breakdownRows.map((row) => (
                      <div key={row.label} className="space-y-2">
                        <div className="flex items-center justify-between gap-4 text-sm">
                          <span className="font-medium text-[var(--bh-text)]">
                            {row.label}
                          </span>
                          <span className="text-slate-500">
                            {row.percentage}% - {formatCompactPKR(row.amount)}
                          </span>
                        </div>
                        <div className="h-3 rounded-full bg-[var(--bh-surface)]">
                          <div
                            className={`h-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 ${widthClassForPercent(row.percentage)}`}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--bh-muted)]">
                      No breakdown returned by the AI API.
                    </p>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setDetailsOpen((current) => !current)}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)] px-4 py-2 text-sm font-semibold text-[var(--bh-text)] transition hover:border-[#8B5CF6]"
                  >
                    View detailed breakdown {detailsOpen ? "Up" : "Down"}
                  </button>
                </div>
              </div>
            </div>

            {detailsOpen && itemizedRows.length > 0 && (
              <div className="rounded-[30px] border border-[var(--bh-border)] bg-[var(--bh-card)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
                <h3 className="text-xl font-bold text-[var(--bh-text)]">
                  Detailed Breakdown
                </h3>
                <div className="mt-6 overflow-x-auto rounded-3xl border border-[var(--bh-border)]">
                  <table className="min-w-[760px] divide-y divide-[var(--bh-border)] text-sm">
                    <thead className="bg-[var(--bh-surface)] text-[var(--bh-muted)]">
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
                    <tbody className="divide-y divide-[var(--bh-border)]">
                      {itemizedRows.map((row) => (
                        <tr key={`${row.item}-${row.qty}-${row.unit}`}>
                          <td className="px-4 py-3 font-medium text-[var(--bh-text)]">
                            {row.item}
                          </td>
                          <td className="px-4 py-3 text-[var(--bh-muted)]">
                            {row.qty}
                          </td>
                          <td className="px-4 py-3 text-[var(--bh-muted)]">
                            {row.unit}
                          </td>
                          <td className="px-4 py-3 text-[var(--bh-muted)]">
                            {formatCompactPKR(row.rate)}
                          </td>
                          <td className="px-4 py-3 text-[var(--bh-muted)]">
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
                  ðŸ’¡ Tips to reduce cost
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

        <section className="mt-8 rounded-[30px] border border-[var(--bh-border)] bg-[var(--bh-card)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.14)] sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-[var(--bh-text)]">
                Construction Phases Guide
              </h3>
              <p className="mt-2 text-sm text-[var(--bh-muted)]">
                10 phases from site preparation to handover.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {phases.map((phase, index) => (
              <details
                key={phase.phase_number}
                open={index < 3}
                className="group rounded-2xl border border-[var(--bh-border)] bg-[var(--bh-surface)] px-4 py-3"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                      {phase.phase_number}
                    </span>
                    <div>
                      <div className="font-semibold text-[var(--bh-text)]">
                        {phase.name}
                      </div>
                      <div className="text-xs text-[var(--bh-muted)]">
                        {phase.categories.join(" - ")}
                      </div>
                    </div>
                  </div>
                  <Icons.ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-4 flex flex-wrap gap-2 pl-[3.1rem]">
                  {phase.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full border border-[var(--bh-border)] bg-[var(--bh-card)] px-3 py-1 text-xs font-medium text-[var(--bh-muted)]"
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
    <span className="text-sm font-semibold text-[var(--bh-text)]">{label}</span>
    {children}
  </label>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border px-4 py-3" style={{ background: "var(--bh-card)", borderColor: "var(--bh-border)" }}>
    <span className="font-medium text-[var(--bh-muted)]">{label}</span>
    <span className="font-semibold text-[var(--bh-text)]">{value}</span>
  </div>
);

const SummaryCard: React.FC<{
  label: string;
  value: string;
  accent: string;
}> = ({ label, value, accent }) => (
  <div className="overflow-hidden rounded-[28px] border p-5 shadow-[0_18px_50px_rgba(0,0,0,0.14)]" style={{ background: "var(--bh-card)", borderColor: "var(--bh-border)" }}>
    <div className={`mb-4 h-1.5 rounded-full bg-gradient-to-r ${accent}`} />
    <div className="text-sm font-medium text-[var(--bh-muted)]">{label}</div>
    <div className="mt-2 text-2xl font-black tracking-tight text-[var(--bh-text)]">
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
    <td className="min-w-[140px] px-4 py-3 font-semibold text-[var(--bh-text)]">{label}</td>
    {rows.map((row) => (
      <td
        key={`${label}-${row.quality}`}
        className={`min-w-[150px] px-4 py-3 text-[var(--bh-muted)] ${row.quality.toLowerCase() === selectedQuality ? "bg-[#6C3BD5]/10 font-semibold text-[var(--bh-text)]" : ""}`}
      >
        {valueAccessor(row).replace("Ã¢â‚¬â€", "â€”")}
      </td>
    ))}
  </tr>
);
