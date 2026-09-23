import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, LogOut, LayoutDashboard, Menu, X, Shield, Package, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cart, openDrawer } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart?.itemCount || 0;

  const navLinks = [
    { label: 'Overview', href: '/' },
    { label: 'Shop', href: '/catalog' },
    { label: 'Collections', href: '/catalog?category=HEADPHONES' },
    { label: 'Support', href: '/support' },
    { label: 'My Orders', href: '/orders' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070707]/92 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-2xl shadow-black/90'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5 border-b border-white/[0.04]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-copper to-bronze flex items-center justify-center font-extrabold text-black text-sm font-headline shadow-lg shadow-copper/20 group-hover:scale-105 transition-transform duration-300">
            N
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black font-headline tracking-[0.22em] text-white group-hover:text-champagne transition-colors leading-none">
              NEXORO
            </span>
            <span className="text-[8px] font-mono tracking-[0.25em] text-copper uppercase mt-0.5">
              ELECTROACOUSTICS
            </span>
          </div>
        </Link>

        {/* Center: Editorial Navigation Links */}
        <nav className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`text-xs font-bold uppercase tracking-[0.18em] transition-all relative py-1 ${
                  isActive ? 'text-copper' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-copper rounded-full shadow-[0_0_8px_#C8834A]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Search, Cart, Profile, Admin Panel */}
        <div className="flex items-center gap-3">
          {/* Search trigger */}
          <Link
            to="/catalog"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-copper/40 text-white/70 hover:text-white transition-all text-xs"
            title="Search Catalogue"
          >
            <Search className="w-3.5 h-3.5 text-copper" />
            <span className="hidden sm:inline-block font-mono text-[11px] text-white/50">Search</span>
          </Link>

          {/* Cart Button */}
          <button
            onClick={openDrawer}
            className="relative p-2.5 text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-xl border border-white/[0.08] hover:border-copper/50 transition-all active:scale-95 flex items-center justify-center group"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 group-hover:text-copper transition-colors" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-copper text-black text-[10px] font-black flex items-center justify-center shadow-lg shadow-copper/60 font-mono">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Profile Access */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-copper/40 transition-all text-xs text-white"
              >
                <div className="w-5 h-5 rounded-full bg-copper/20 border border-copper text-copper font-bold flex items-center justify-center text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline-block font-medium max-w-[90px] truncate text-[11px]">
                  {user.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0e0f13] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in backdrop-blur-xl">
                  <div className="px-4 py-2.5 border-b border-white/[0.08]">
                    <p className="text-xs font-bold text-white truncate font-headline">{user.name}</p>
                    <p className="text-[10px] text-white/50 truncate font-mono mt-0.5">{user.email}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-copper/10 text-copper uppercase font-mono border border-copper/30">
                      {user.role} ACCOUNT
                    </span>
                  </div>

                  <Link
                    to="/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Package className="w-3.5 h-3.5 text-copper" />
                    <span>My Orders & Tracking</span>
                  </Link>

                  <Link
                    to="/support"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-copper" />
                    <span>Customer Care Concierge</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-copper-light hover:bg-copper/10 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-copper" />
                      <span>Operations Suite</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-950/20 transition-colors mt-1 border-t border-white/[0.08]"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-bold tracking-[0.15em] uppercase text-white/80 hover:text-copper transition-colors"
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-flex px-3.5 py-1.5 bg-copper hover:bg-copper-hover text-black text-xs font-black tracking-[0.15em] uppercase rounded-lg shadow-md shadow-copper/20 transition-all active:scale-95"
              >
                JOIN
              </Link>
            </div>
          )}

          {/* Admin Panel Direct Link */}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold text-copper bg-copper/10 border border-copper/30 hover:bg-copper/20 hover:border-copper transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>ADMIN PANEL</span>
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white/70 hover:text-white bg-white/5 rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#070707] border-b border-white/10 px-6 py-5 space-y-3 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-xs font-bold uppercase tracking-[0.18em] text-white/80 hover:text-copper py-1.5"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-xs font-bold uppercase tracking-[0.18em] text-copper py-1.5 border-t border-white/10 pt-3"
            >
              Admin Operations Suite
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
