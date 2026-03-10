import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icons } from "./Icons";
import { Button } from "./Button";
import { User } from "../types";
import { useAuth } from "../src/context/AuthContext";

interface HeaderProps {
  onNavigate?: (page: string) => void;
  activePage?: string;
  cartItemCount?: number;
  user?: User | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  activePage,
  cartItemCount = 0,
  user: propUser,
  onLogout: propOnLogout,
}) => {
  const { isAuthenticated, user: authUser, logout: authLogout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");

  // Use auth context user if available, otherwise fall back to prop
  const user = authUser || propUser;
  const isLoggedIn = isAuthenticated || !!propUser;

  const handleNav = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (page === "ai") {
      setIsAIModalOpen(true);
      setIsMobileMenuOpen(false); // Close mobile menu if open
      return;
    }
    if (onNavigate) onNavigate(page);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    if (propOnLogout) propOnLogout();
    setIsUserMenuOpen(false);
    if (onNavigate) onNavigate("home");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => handleNav(e, "home")}
            >
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Icons.Tools className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                BuildHive
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {[
                { label: "Home", slug: "home" },
                { label: "Products", slug: "products" },
                { label: "Categories", slug: "categories" },
                { label: "Services", slug: "services" },
                { label: "AI", slug: "ai" },
                { label: "About Us", slug: "about" },
                { label: "Contact", slug: "contact" },
              ].map((item) => {
                // Special styling for AI
                if (item.slug === "ai") {
                  return (
                    <button
                      key={item.slug}
                      onClick={(e) => handleNav(e, "ai")}
                      className="group flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100 px-3 py-1 text-sm font-bold text-primary transition-all hover:from-violet-200 hover:to-fuchsia-200 hover:shadow-sm"
                    >
                      <Icons.AI className="h-3.5 w-3.5" />
                      <span>AI Assistant</span>
                    </button>
                  );
                }

                // Simple active state check
                const isActive = activePage === item.slug;

                return (
                  <a
                    key={item.slug}
                    href="#"
                    onClick={(e) => handleNav(e, item.slug)}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? "text-primary font-semibold" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="relative hidden xl:block">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search supplies..."
                  className="h-10 w-64 rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && headerSearch.trim()) {
                      window.location.href = `/products?search=${encodeURIComponent(
                        headerSearch
                      )}`;
                    }
                  }}
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Cart */}
                <button
                  className="relative text-gray-500 hover:text-primary transition-colors group"
                  onClick={(e) => handleNav(e, "cart")}
                >
                  <Icons.Cart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  {cartItemCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-md animate-in zoom-in">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                {/* Auth / User Menu */}
                {isLoggedIn && user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary focus:outline-none"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icons.User className="h-5 w-5" />
                      </div>
                      <span className="max-w-[100px] truncate">
                        {user.full_name || user.name}
                      </span>
                      <Icons.ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.full_name || user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={(e) => handleNav(e, "account")}
                            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                          >
                            <Icons.Dashboard className="h-4 w-4" /> My Account
                          </button>
                          <button
                            onClick={(e) => {
                              handleNav(
                                e,
                                "account"
                              ); /* Pass subpage param in real app */
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                          >
                            <Icons.Package className="h-4 w-4" /> My Orders
                          </button>
                        </div>
                        <div className="border-t border-gray-100 py-1">
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Icons.LogOut className="h-4 w-4" /> Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleNav(e, "signin")}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => handleNav(e, "get-started")}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <Icons.Menu className="h-6 w-6 rotate-90 transition-transform" />
              ) : (
                <Icons.Menu className="h-6 w-6 transition-transform" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-4">
              {[
                { label: "Home", slug: "home" },
                { label: "Products", slug: "products" },
                { label: "Categories", slug: "categories" },
                { label: "Services", slug: "services" },
                { label: "AI", slug: "ai" },
                { label: "About Us", slug: "about" },
                { label: "Contact", slug: "contact" },
              ].map((item) => (
                <a
                  key={item.slug}
                  href="#"
                  onClick={(e) => handleNav(e, item.slug)}
                  className={`flex items-center justify-between py-2 text-base font-medium ${
                    item.slug === "ai"
                      ? "text-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.slug === "ai" && <Icons.AI className="h-4 w-4" />}
                    {item.slug === "ai" ? "AI Assistant" : item.label}
                  </span>
                  <Icons.ChevronRight className="h-4 w-4 text-gray-300" />
                </a>
              ))}

              <div className="border-t border-gray-100 pt-4 mt-2 space-y-4">
                {/* Mobile User Actions */}
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icons.User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.full_name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleNav(e, "account")}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-base text-gray-700 hover:bg-gray-50"
                    >
                      <Icons.Dashboard className="h-5 w-5" /> My Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-base text-red-600 hover:bg-red-50"
                    >
                      <Icons.LogOut className="h-5 w-5" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="w-full justify-center"
                      onClick={(e) => handleNav(e, "signin")}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="primary"
                      className="w-full justify-center"
                      onClick={(e) => handleNav(e, "get-started")}
                    >
                      Get Started
                    </Button>
                  </div>
                )}

                <div className="relative">
                  <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search supplies..."
                    className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none"
                  />
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* AI Coming Soon Modal */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent"></div>
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl"></div>

            <button
              onClick={() => setIsAIModalOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/50 p-1 text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
              aria-label="Close AI Modal"
            >
              <Icons.Close className="h-5 w-5" />
            </button>

            <div className="relative z-10 px-8 py-10 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 shadow-xl shadow-primary/30">
                <Icons.Brain className="h-10 w-10 text-white" />
              </div>

              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                BuildHive AI
              </h2>
              <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                Coming Soon
              </div>

              <p className="mb-8 text-gray-500 leading-relaxed">
                We are building the future of construction. Our AI assistant
                will help you estimate costs, find matching materials, and
                optimize your project planning.
              </p>

              <div className="mb-6">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-4 pr-12 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-hover"
                    aria-label="Subscribe to Notifications"
                  >
                    <Icons.ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Get notified when we launch!
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => setIsAIModalOpen(false)}
                className="w-full border-gray-200"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const Footer = () => {
  const navigate = useNavigate();

  const onNavigate = (slug: string) => {
    navigate(`/${slug}`);
  };

  return (
    <footer className="bg-dark text-white pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <Icons.Tools className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                BuildHive
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Pakistan's premier marketplace for construction resources. We
              connect builders, contractors, and DIY enthusiasts with
              top-quality tools and materials.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Icons.Facebook, label: "Facebook" },
                { icon: Icons.Twitter, label: "Twitter" },
                { icon: Icons.Linkedin, label: "LinkedIn" },
                { icon: Icons.Youtube, label: "YouTube" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-all hover:bg-primary hover:text-white hover:-translate-y-1"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-10">
            <h4 className="mb-6 text-lg font-bold text-white">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              {[
                { label: "Products", slug: "products" },
                { label: "Services", slug: "services" },
                { label: "About Us", slug: "about" },
                { label: "Contact", slug: "contact" },
                { label: "FAQ", slug: "faq" },
                { label: "Terms & Conditions", slug: "terms" },
                { label: "Privacy Policy", slug: "privacy" },
              ].map((link) => (
                <li key={link.slug}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(link.slug);
                    }}
                    className="hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-6 text-lg font-bold text-white">Contact Us</h4>
            <ul className="space-y-6 text-sm text-slate-400">
              <li className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-primary">
                  <Icons.MapPin className="h-4 w-4" />
                </div>
                <span className="leading-relaxed">
                  123 Construction Avenue, Industrial Zone,
                  <br />
                  Lahore, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-primary">
                  <Icons.Phone className="h-4 w-4" />
                </div>
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-primary">
                  <Icons.Mail className="h-4 w-4" />
                </div>
                <span>support@buildhive.pk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2024 BuildHive. All rights reserved.</p>
          <div className="flex gap-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("privacy");
              }}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("terms");
              }}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("faq");
              }}
              className="hover:text-white transition-colors"
            >
              FAQ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
