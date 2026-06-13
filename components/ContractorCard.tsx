import React from "react";
import { Button } from "./Button";
import { Icons } from "./Icons";
import type { ContractorSummary } from "../types";

interface ContractorCardProps {
  contractor: ContractorSummary;
  onViewProfile: (contractor: ContractorSummary) => void;
  onMessage: (contractor: ContractorSummary) => void;
}

const formatMoney = (value?: number): string | null => {
  if (!value || value <= 0) return null;
  return `PKR ${value.toLocaleString()}`;
};

const getInitials = (name: string): string => {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return initials || "C";
};

export const ContractorCard: React.FC<ContractorCardProps> = ({
  contractor,
  onViewProfile,
  onMessage,
}) => {
  const bio =
    contractor.bio || "Verified construction professional available for hire.";
  const location = contractor.city || contractor.location || "Pakistan";
  const servicesText =
    contractor.servicesCount > 0
      ? `${contractor.servicesCount} services`
      : "Services on request";
  const priceText = contractor.startingPrice
    ? `From ${formatMoney(contractor.startingPrice)}`
    : "Contact for pricing";
  const image = contractor.image || contractor.avatar;

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-[0_20px_45px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        background: "var(--bh-card)",
        borderColor: "var(--bh-border)",
        color: "var(--bh-text)",
      }}
    >
      <button
        type="button"
        onClick={() => onMessage(contractor)}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-white/10 text-[var(--bh-text)] backdrop-blur transition hover:bg-[#6C3BD5] hover:text-white"
        style={{ borderColor: "var(--bh-border)" }}
        aria-label={`Message ${contractor.name}`}
      >
        <Icons.Message className="h-4 w-4" />
      </button>

      <div
        className="relative flex flex-col items-center gap-4 border-b px-5 py-7 text-center"
        style={{
          borderColor: "var(--bh-border)",
          background:
            "linear-gradient(135deg, rgba(108,59,213,.18), rgba(16,185,129,.10))",
        }}
      >
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white/10 bg-gradient-to-br from-[#6C3BD5] to-[#10B981] text-2xl font-black text-white shadow-xl">
          {image ? (
            <img
              src={image}
              alt={contractor.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <span>{getInitials(contractor.name)}</span>
          )}
          {contractor.verified && (
            <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-[var(--bh-card)]">
              <Icons.Check className="h-4 w-4" />
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-xl font-extrabold tracking-tight text-[var(--bh-text)]">
            {contractor.name}
          </h3>
          <p className="mt-2 inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
            {contractor.trade || "Contractor"}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-[var(--bh-muted)]">
            <span className="inline-flex items-center gap-1 font-bold text-amber-300">
              <Icons.Star className="h-4 w-4 fill-current" />
              {Number(contractor.rating || 0).toFixed(1)}
            </span>
            <span>{contractor.reviewCount || 0} reviews</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold text-[var(--bh-muted)]"
            style={{ borderColor: "var(--bh-border)" }}
          >
            <Icons.MapPin className="h-3 w-3" />
            {location}
          </span>
          <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-300">
            {contractor.availableNow ? "Available now" : "By appointment"}
          </span>
        </div>

        <p className="min-h-[3.25rem] text-sm leading-6 text-[var(--bh-muted)]">
          {bio.length > 96 ? `${bio.slice(0, 96).trim()}...` : bio}
        </p>

        <div
          className="grid gap-3 rounded-2xl border p-4 text-sm text-[var(--bh-muted)] sm:grid-cols-2"
          style={{
            borderColor: "var(--bh-border)",
            background: "rgba(108,59,213,.06)",
          }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--bh-muted)]">
              Projects
            </p>
            <p className="mt-1 font-bold text-[var(--bh-text)]">
              {(contractor as any).completedProjects ||
                (contractor as any).projectsCount ||
                0}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--bh-muted)]">
              Services
            </p>
            <p className="mt-1 font-bold text-[var(--bh-text)]">
              {servicesText}
            </p>
          </div>
        </div>

        <div
          className="mt-auto flex items-center justify-between gap-3 border-t pt-4"
          style={{ borderColor: "var(--bh-border)" }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--bh-muted)]">
              Starting at
            </p>
            <p className="text-sm font-extrabold text-[var(--bh-text)]">
              {priceText}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center"
          onClick={() => onViewProfile(contractor)}
        >
          View Profile
        </Button>
      </div>
    </article>
  );
};

export default ContractorCard;
