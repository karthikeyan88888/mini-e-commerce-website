import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Layers,
  ShoppingBag,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#070707] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-headline text-white mb-2">Access Restricted</h1>
        <p className="text-sm text-white/60 max-w-md mb-6">
          You must be authenticated as an Administrator to access the NEXORO Operations Portal.
        </p>
        <Link
          to="/login"
          className="px-6 py-2.5 bg-copper hover:bg-copper-hover text-black font-bold text-xs tracking-widest uppercase rounded-lg transition-all"
        >
          GO TO LOGIN
        </Link>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Products', icon: Box, href: '/admin/products' },
    { label: 'Inventory', icon: Layers, href: '/admin/inventory' },
    { label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  ];

  return (
    <div className="min-h-screen bg-[#08090b] text-white flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-[#0d0e12] border-r border-white/[0.08] flex-col justify-between p-6 fixed inset-y-0 left-0 z-30">
        <div>
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 mb-10 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-copper to-copper-bronze flex items-center justify-center font-bold text-black font-headline">
              N
            </div>
            <div>
              <span className="text-lg font-extrabold font-headline tracking-widest text-white block leading-none">
                NEXORO
              </span>
              <span className="text-[9px] font-mono tracking-widest text-copper uppercase block mt-1">
                OPERATIONS SUITE
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all ${
                    isActive
                      ? 'bg-copper text-black shadow-lg shadow-copper/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/[0.08] space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-copper" />
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs text-red-400 hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-[#0c0d10]/90 backdrop-blur-md border-b border-white/[0.08] px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-white/70 hover:text-white bg-white/5 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold font-headline uppercase tracking-wider text-white">
              {navItems.find((n) => n.href === location.pathname)?.label || 'Administration'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYSTEM: ONLINE</span>
            </div>

            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <div className="w-7 h-7 rounded-full bg-copper/20 border border-copper text-copper font-bold flex items-center justify-center text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-semibold text-white block leading-tight">{user.name}</span>
                <span className="text-[10px] text-copper font-mono uppercase">Master Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-64 bg-[#0d0e12] border-r border-white/10 p-6 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-copper flex items-center justify-center font-bold text-black text-xs font-headline">
                    N
                  </div>
                  <span className="text-base font-bold font-headline tracking-widest text-white">
                    NEXORO ADMIN
                  </span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-1 text-white/60">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider ${
                        isActive
                          ? 'bg-copper text-black'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-2">
              <Link
                to="/"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center justify-between px-3.5 py-2 text-xs text-white/60"
              >
                <span>Storefront</span>
                <ExternalLink className="w-3.5 h-3.5 text-copper" />
              </Link>
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-400"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
