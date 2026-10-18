
import { Sparkles, TrendingUp, Bot, ShieldCheck } from "lucide-react";

/* Premium split-screen authentication layout */
export function AuthShell({ children }) {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#080d1b] text-white">

      {/* Left marketing panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-br from-[#080d1b] via-[#101a35] to-[#17143a] p-12 lg:flex xl:p-16">

        {/* Ambient lighting */}
        <div className="pointer-events-none absolute -right-28 -top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-[30rem] w-[30rem] rounded-full bg-blue-600/25 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-violet-500/15 blur-[100px]" />

        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        {/* Brand */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 shadow-lg shadow-cyan-950/40 backdrop-blur-xl">
            <Sparkles className="h-6 w-6 text-cyan-300" />
          </div>

          <div>
            <span className="block text-xl font-bold tracking-tight text-white">
              Amir.s
            </span>
            <span className="text-xs font-medium tracking-[0.2em] text-cyan-300/80">
              INTELLIGENT CRM
            </span>
          </div>
        </div>

        {/* Marketing content */}
        <div className="relative my-12 max-w-xl">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-2 text-sm font-medium text-cyan-200 shadow-lg shadow-cyan-950/10 backdrop-blur-xl">
            <Sparkles className="h-4 w-4" />
            <span>Full-Stack CRM · AI-Powered Insights</span>
          </div>

          <h2 className="font-display text-4xl font-bold leading-[1.2] tracking-tight xl:text-5xl">
            Your Business,
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
              Smarter with AI.
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-base leading-8 text-slate-300">
            A full-stack CRM dashboard that brings leads, contacts, tasks,
            and sales analytics together in one place. AI-powered summaries
            and intelligent insights help you organize your workflow,
            understand your sales pipeline, and make better business decisions.
          </p>

          {/* Feature cards */}
          <div className="mt-10 space-y-3">
            {[
              {
                icon: TrendingUp,
                title: "Sales & Analytics",
                text: "Track leads, monitor performance, and visualize your sales pipeline.",
                color: "from-cyan-400/20 to-blue-500/20",
                iconColor: "text-cyan-300",
              },
              {
                icon: Bot,
                title: "AI-Powered Assistance",
                text: "Generate smart summaries, sales insights, and email drafts.",
                color: "from-blue-400/20 to-violet-500/20",
                iconColor: "text-sky-300",
              },
              {
                icon: ShieldCheck,
                title: "Secure Authentication",
                text: "Access your workspace through protected authentication.",
                color: "from-violet-400/20 to-indigo-500/20",
                iconColor: "text-violet-300",
              },
            ].map(({ icon: Icon, title, text, color, iconColor }) => (
              <div
                key={title}
                className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-white/[0.065]"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br ${color} ${iconColor} transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="relative flex items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="text-xs tracking-wide text-slate-400">
            © {new Date().getFullYear()} Amir.s. All rights reserved.
          </p>
          <span className="text-xs font-medium text-cyan-300/70">
            Built with intelligence.
          </span>
        </div>
      </div>

      {/* Right authentication panel */}
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1224] via-[#101a32] to-[#171532] px-6 py-12 lg:w-1/2 lg:px-12 xl:px-16">

        {/* Background glow */}
        <div className="pointer-events-none absolute -right-32 -top-20 h-80 w-80 rounded-full bg-cyan-400/15 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-violet-500/15 blur-[110px]" />
        <div className="pointer-events-none absolute left-1/3 top-1/4 h-48 w-48 rounded-full bg-blue-500/10 blur-[90px]" />

        {/* Mobile brand */}
        <div className="relative mb-10 flex items-center gap-3 lg:hidden">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-400/20 to-indigo-500/20">
            <Sparkles className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <span className="block text-lg font-bold text-white">Amir.s</span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-cyan-300">
              INTELLIGENT CRM
            </span>
          </div>
        </div>

        {/* Existing login / registration form */}
        <div className="relative w-full max-w-sm animate-fade-up">
          {children}
        </div>

        {/* Footer */}
        <p className="relative mt-8 text-center text-xs leading-6 text-slate-400">
          Secure access <span className="mx-1 text-cyan-400">·</span>
          Smarter workflows <span className="mx-1 text-cyan-400">·</span>
          Powered by AI
        </p>

        <p className="relative mt-3 text-center text-[11px] text-slate-500 lg:hidden">
          © {new Date().getFullYear()} Amir.s. All rights reserved.
        </p>
      </div>
    </div>
  );
}
