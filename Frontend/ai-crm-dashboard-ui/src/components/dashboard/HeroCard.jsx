
import { Wifi, Sparkles, TrendingUp } from "lucide-react";
import { Card, SectionHeading } from "../ui";
import { currency } from "../../lib/format";

export function HeroCard({ value = 0, label = "Pipeline value" }) {
  return (
    <Card className="overflow-hidden border border-amber-200/20 bg-[#111713] p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/20">
      <SectionHeading
        title="Pipeline Goal"
        subtitle="Total deal value"
        to="/pipeline"
      />

      <div className="group relative mt-5 overflow-hidden rounded-2xl border border-amber-200/20 bg-gradient-to-br from-[#102c25] via-[#17483a] to-[#252d24] p-5 text-white shadow-[0_20px_55px_-18px_rgba(16,185,129,0.28)] sm:p-6">

        {/* Emerald and champagne ambient glow */}
        <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-emerald-300/15 blur-3xl transition-transform duration-700 group-hover:scale-125" />
        <div className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-teal-300/10 blur-3xl" />

        {/* Fine decorative pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Brand */}
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-200/25 bg-gradient-to-br from-amber-200/20 to-emerald-300/10 shadow-lg shadow-black/10 backdrop-blur-md">
              <Sparkles className="h-5 w-5 text-amber-200" />
            </div>

            <div>
              <p className="font-display text-lg font-extrabold tracking-tight text-white">
                Amir<span className="text-amber-200">.s</span>
              </p>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-emerald-100/70">
                Intelligent CRM
              </p>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-100/15 bg-white/[0.05]">
            <Wifi className="h-5 w-5 rotate-90 text-amber-200" />
          </div>
        </div>

        {/* Pipeline value */}
        <div className="relative mt-8">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-50/75">
            <TrendingUp className="h-4 w-4 text-amber-200" />
            <span>{label}</span>
          </div>

          <p className="mt-2 break-words font-display text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl">
            {currency(value)}
          </p>

          <div className="mt-4 h-1 w-28 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200" />
          </div>
        </div>

        {/* Bottom details */}
        <div className="relative mt-8 flex items-end justify-between border-t border-amber-100/15 pt-4">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-emerald-50/50">
              Sales overview
            </p>
            <p className="mt-1 text-xs font-semibold tracking-[0.16em] text-amber-100/90">
              AMIR.S · PIPELINE
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/[0.08] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_9px_rgba(110,231,183,0.8)]" />
            <span className="text-[10px] font-bold tracking-[0.15em] text-emerald-100">
              OVERVIEW
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
