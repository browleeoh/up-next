import { createRootRoute, Outlet, Link } from "@tanstack/react-router";
import {
  Home,
  Search,
  Bookmark,
  Play,
  CheckCircle,
  BarChart3,
  Settings,
} from "lucide-react";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-background-primary text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-background-primary/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-3">
          <Link
            to="/"
            className="mr-4 text-xl font-semibold text-amber-500 hover:text-amber-400"
          >
            Up Next
          </Link>

          <NavLink to="/">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </NavLink>

          <NavLink to="/search">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </NavLink>

          <NavLink to="/watchlist">
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Watchlist</span>
          </NavLink>

          <NavLink to="/watching">
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">Watching</span>
          </NavLink>

          <NavLink to="/watched">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Watched</span>
          </NavLink>

          <NavLink to="/stats">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Stats</span>
          </NavLink>

          <div className="flex-1" />

          <NavLink to="/settings">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

function NavLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 [&.active]:bg-slate-800 [&.active]:text-slate-100"
    >
      {children}
    </Link>
  );
}
