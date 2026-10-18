
import { NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";
import {
  Avatar,
  IconButton,
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
} from "../ui";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

const LINKS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/leads", label: "Leads" },
  { to: "/pipeline", label: "Pipeline" },
  { to: "/contacts", label: "Contacts" },
  { to: "/tasks", label: "Follow-ups" },
];

export function TopNav({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="relative flex items-center gap-3 rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-white via-emerald-50/70 to-amber-50/70 px-3 py-3 shadow-[0_8px_30px_-15px_rgba(6,78,59,0.18)] backdrop-blur-xl transition-all duration-300 sm:gap-4 sm:px-5">

      {/* Brand */}
      <div className="flex shrink-0 items-center gap-2.5 pr-1">
        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-emerald-300/30 bg-gradient-to-br from-[#064e3b] via-[#087f5b] to-[#b88635] text-white shadow-lg shadow-emerald-900/15 transition-transform duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20" />
          <Sparkles className="relative h-5 w-5" />
        </div>

        <div className="hidden sm:block">
          <span className="block font-display text-lg font-extrabold tracking-tight text-[#12382c]">
            Amir<span className="text-[#b88635]">.s</span>
          </span>
          <span className="block text-[9px] font-semibold uppercase tracking-[0.19em] text-emerald-800/65">
            Intelligent CRM
          </span>
        </div>
      </div>

      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="rounded-xl border border-emerald-900/10 bg-white/70 p-2.5 text-emerald-950 shadow-sm transition-all duration-200 hover:border-emerald-400/40 hover:bg-emerald-50 active:scale-95 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Navigation */}
      <nav className="mx-auto hidden items-center gap-1 rounded-full border border-emerald-900/[0.07] bg-white/80 p-1.5 shadow-[0_3px_12px_rgba(6,78,59,0.06)] backdrop-blur-md lg:flex">
        {LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "relative rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 xl:px-5",
                isActive
                  ? "bg-gradient-to-r from-[#064e3b] via-[#087f5b] to-[#166534] text-white shadow-md shadow-emerald-900/15"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-900"
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Right actions */}
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">

        <IconButton
          aria-label="Search"
          className="hidden border border-emerald-900/10 bg-white/75 text-emerald-900 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 sm:inline-flex"
        >
          <Search className="h-[18px] w-[18px]" />
        </IconButton>

        <IconButton
          aria-label="Notifications"
          className="relative border border-emerald-900/10 bg-white/75 text-emerald-900 transition-all duration-200 hover:border-amber-300 hover:bg-amber-50"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
        </IconButton>

        {/* Account dropdown */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 py-1 pl-1 pr-2.5 shadow-sm transition-all duration-200 hover:border-emerald-300/70 hover:bg-emerald-50 hover:shadow-md sm:gap-2.5">
              <Avatar name={user?.name || "Amir"} src={user?.avatar} size="sm" />
              <span className="hidden max-w-[100px] truncate text-sm font-semibold text-emerald-950 xl:block">
                {user?.name || "Amir"}
              </span>
              <ChevronDown className="h-4 w-4 text-emerald-800/70" />
            </button>
          }
        >
          <DropdownLabel>{user?.email}</DropdownLabel>
          <DropdownSeparator />
          <DropdownItem onClick={() => navigate("/settings")}>
            <User className="h-4 w-4" />
            Profile & settings
          </DropdownItem>
          <DropdownItem danger onClick={logout}>
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
