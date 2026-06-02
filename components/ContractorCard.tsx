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
  if (!value || value <= 0) {
    return null;
  }

  return `PKR ${value.toLocaleString()}`;
};

const getInitial = (name: string): string => {
  const first = name.trim().charAt(0).toUpperCase();
  return first || "C";
};

export const ContractorCard: React.FC<ContractorCardProps> = ({
  contractor,
  onViewProfile,
  onMessage,
}) => {
  const bio = contractor.bio || "Verified construction professional available for hire.";
  const location = contractor.city || contractor.location || "Pakistan";
  const servicesText =
    contractor.servicesCount > 0
      ? `${contractor.servicesCount} services available`
      : "Services available on request";
  const priceText = contractor.startingPrice
    ? `From ${formatMoney(contractor.startingPrice)}`
    : "Contact for pricing";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[24px] border border-white/8 bg-white/3 shadow-[0_20px_45px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:-translate-y-1 hover:border-violet-300/30">
      <div className="relative flex items-center gap-4 border-b border-white/6 bg-gradient-to-br from-slate-900 to-[#171121] px-5 py-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500 to-fuchsia-600 text-xl font-black text-white">
          {contractor.image ? (
            <img src={contractor.image} alt={contractor.name} className="h-full w-full object-cover" />
          ) : contractor.avatar ? (
            <img src={contractor.avatar} alt={contractor.name} className="h-full w-full object-cover" />
          ) : (
            <span>{getInitial(contractor.name)}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-lg font-extrabold text-white">{contractor.name}</h3>
                {contractor.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[11px] font-bold text-emerald-300">
                    <Icons.Check className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-violet-300">
                {contractor.trade}
              </p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-1 font-bold text-amber-300">
              <Icons.Star className="h-4 w-4 fill-current" />
              {contractor.rating.toFixed(1)}
            </span>
            <span className="text-slate-500">·</span>
            <span>{contractor.reviewCount} reviews</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-violet-300/15 bg-violet-300/10 px-3 py-1 text-xs font-bold text-violet-200">
            {contractor.trade}
          </span>
          <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
            {location || "Location on request"}
          </span>
        </div>

        <p className="min-h-[3.25rem] text-sm leading-6 text-slate-300">
          {bio.length > 80 ? `${bio.slice(0, 80).trim()}...` : bio}
        </p>

        <div className="grid gap-3 rounded-2xl border border-white/6 bg-white/4 p-4 text-sm text-slate-300 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Availability</p>
            <p className="mt-1 font-bold text-white">
              {contractor.availableNow ? "Available now" : "By appointment"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Services</p>
            <p className="mt-1 font-bold text-white">{servicesText}</p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/6 pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Starting at</p>
            <p className="text-sm font-extrabold text-white">{priceText}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <Button variant="outline" size="sm" className="w-full justify-center" onClick={() => onViewProfile(contractor)}>
            View Profile
          </Button>
          <Button variant="primary" size="sm" className="w-full justify-center" onClick={() => onMessage(contractor)}>
            Message
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ContractorCard;