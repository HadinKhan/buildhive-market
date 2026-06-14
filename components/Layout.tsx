import React, { useEffect, useState, useRef } from "react";
import api from "../src/services/api";
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user: authUser, logout: authLogout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [headerSearch, setHeaderSearch] = useState("");
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Declare isLoggedIn before any usage in useEffect or other logic
  const user = authUser || propUser;
  const isLoggedIn = isAuthenticated || !!propUser;

  useEffect(() => {
    let mounted = true;
    const loadUnread = async () => {
      if (!isLoggedIn) return;
      try {
        const res = await api.get("/chat/unread-count");
        const cnt = res.data?.data?.count ?? res.data?.count ?? res.data ?? 0;
        if (mounted) setUnreadCount(Number(cnt));
      } catch (e) {
        // ignore
      }
    };
    loadUnread();
    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);

  const loadNotifications = async () => {
    if (!isLoggedIn) return;
    try {
      const [countResponse, listResponse] = await Promise.all([
        api.get("/notifications/unread-count"),
        api.get("/notifications", { params: { limit: 8 } }),
      ]);
      setNotificationUnreadCount(
        Number(
          countResponse.data?.data?.count ??
            countResponse.data?.data?.unreadCount ??
            0,
        ),
      );
      setNotifications(
        listResponse.data?.data?.notifications ||
          listResponse.data?.data?.items ||
          [],
      );
    } catch {
      setNotificationUnreadCount(0);
      setNotifications([]);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, [isLoggedIn]);

  const markNotificationRead = async (notificationId: string) => {
    await api.put("/notifications/mark-as-read", {
      notificationIds: [notificationId],
    });
    await loadNotifications();
  };

  const markAllNotificationsRead = async () => {
    await api.put("/notifications/mark-all-as-read");
    await loadNotifications();
  };

  const deleteNotificationHeader = async (notificationId: string) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      await loadNotifications();
    } catch {
      // ignore
    }
  };

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  };

  const handleDropdownLeave = (slug: string) => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 300);
  };

  const displayName =
    (user as any)?.full_name || (user as any)?.fullName || "Account";
  const displayEmail = user?.email || "";
  const displayRole = (user as any)?.role || "Buyer + Seller";
  const currentActivePage =
    activePage ||
    (() => {
      const pathname = location.pathname.replace(/^\/+/, "");
      return pathname.split("/")[0] || "home";
    })();
  const submenuIconToneClasses: Record<string, string> = {
    amber: "bg-gradient-to-br from-amber-500 to-amber-600",
    blue: "bg-gradient-to-br from-blue-500 to-blue-600",
    cyan: "bg-gradient-to-br from-cyan-500 to-cyan-700",
    green: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    purple: "bg-gradient-to-br from-purple-500 to-violet-700",
    rose: "bg-gradient-to-br from-rose-400 to-rose-600",
    violet: "bg-gradient-to-br from-violet-500 to-violet-700",
  };
  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const handleNav = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (page === "ai") {
      if (onNavigate) onNavigate("cost-estimator");
      setIsMobileMenuOpen(false);
      return;
    }
    if (onNavigate) onNavigate(page === "messages" ? "account?tab=messages" : page);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleTempLogin = (e: React.MouseEvent) => {
    e.preventDefault();

    if (onNavigate) {
      onNavigate("signin");
      return;
    }

    navigate("/signin");
  };

  const handleLogout = async () => {
    try {
      await authLogout();
    } catch {
      // ignore logout errors in the public shell
    }
    if (propOnLogout) propOnLogout();
    setIsUserMenuOpen(false);
    if (onNavigate) onNavigate("home");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900 shadow-lg shadow-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => handleNav(e, "home")}
            >
              <img
                src="/Build-Hive-Logo.png"
                alt="BuildHive"
                className="h-14 w-auto select-none object-contain"
              />
            </div>

            {/* Desktop Navigation (guest dark style) */}
            <nav className="hidden lg:flex items-center gap-6">
              {!isLoggedIn &&
                (() => {
                  const items: Array<any> = [
                    { label: "Home", slug: "home" },
                    { label: "Products", slug: "products" },
                    { label: "Services", slug: "services" },
                    { label: "Find Contractors", slug: "contractors" },
                    {
                      label: "AI",
                      slug: "ai",
                      submenu: [
                        {
                          title: "Cost Estimator",
                          desc: "Smart budget planning",
                          slug: "cost-estimator",
                          icon: "Calculator",
                          tone: "blue",
                        },
                        {
                          title: "AI Recommendations",
                          desc: "Material recommendations",
                          slug: "recommendations",
                          icon: "Brain",
                          tone: "purple",
                        },
                      ],
                    },
                    {
                      label: "About",
                      slug: "about",
                      submenu: [
                        {
                          title: "About BuildHive",
                          desc: "Our mission & story",
                          url: "/about?section=story",
                          icon: "Building",
                          tone: "violet",
                        },
                        {
                          title: "Our Team",
                          desc: "People behind BuildHive",
                          url: "/about?section=team",
                          icon: "Users",
                          tone: "cyan",
                        },
                      ],
                    },
                    { label: "Contact", slug: "contact" },
                  ];

                  return (
                    <>
                      {items.map((item) => (
                        <div
                          key={item.slug}
                          className="relative"
                          onMouseEnter={() => {
                            handleDropdownEnter();
                            setOpenDropdown(item.slug);
                          }}
                          onMouseLeave={() => handleDropdownLeave(item.slug)}
                        >
                          <button
                            onClick={(e) => handleNav(e, item.slug)}
                            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                              openDropdown === item.slug ||
                              currentActivePage === item.slug
                                ? "bg-violet-500/15 text-violet-300"
                                : "text-gray-200 hover:bg-violet-500/10 hover:text-violet-300"
                            }`}
                          >
                            <span>{item.label}</span>
                            {item.submenu && (
                              <Icons.ChevronDown
                                className={`h-4 w-4 ${openDropdown === item.slug ? "text-violet-300" : "text-gray-400"}`}
                              />
                            )}
                          </button>

                          {item.submenu && openDropdown === item.slug && (
                            <div className="absolute left-0 top-full mt-3 w-80 rounded-2xl bg-[#0b0f12] ring-1 ring-black/40 shadow-xl p-4">
                              <div className="grid gap-2">
                                {item.submenu.map((s: any) => {
                                  const IconComponent =
                                    (Icons as any)[s.icon] || Icons.Package;
                                  return (
                                    <a
                                      key={s.slug || s.title}
                                      href={s.url || "#"}
                                      onClick={(e) => {
                                        if (s.url) {
                                          // Internal about sections: use browser routes and let the page scroll
                                          if (
                                            s.url.startsWith("/about?section=")
                                          ) {
                                            e.preventDefault();
                                            navigate(s.url);
                                            setIsMobileMenuOpen(false);
                                            setIsUserMenuOpen(false);
                                          } else if (s.url.startsWith("http")) {
                                            // External link - go full nav
                                            // allow default behavior to follow external URL
                                            return;
                                          } else {
                                            // For other internal-style urls, use router navigation
                                            e.preventDefault();
                                            navigate(s.url);
                                            setIsMobileMenuOpen(false);
                                            setIsUserMenuOpen(false);
                                          }
                                        } else {
                                          handleNav(e, s.slug);
                                        }
                                      }}
                                      className="group flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-900"
                                    >
                                      <div
                                        className={`h-10 w-10 flex shrink-0 items-center justify-center rounded-xl ${submenuIconToneClasses[s.tone] || submenuIconToneClasses.violet} shadow-lg shadow-black/25 transition-transform duration-300 group-hover:scale-110`}
                                      >
                                        <IconComponent className="h-5 w-5 text-white" />
                                      </div>
                                      <div>
                                        <div className="text-sm font-semibold text-white">
                                          {s.title}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                          {s.desc}
                                        </div>
                                      </div>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  );
                })()}

              {isLoggedIn &&
                (() => {
                  const items: Array<any> = [
                    { label: "Home", slug: "home" },
                    { label: "Products", slug: "products" },
                    { label: "Services", slug: "services" },
                    { label: "Find Contractors", slug: "contractors" },
                    {
                      label: "AI",
                      slug: "ai",
                      submenu: [
                        {
                          title: "Cost Estimator",
                          desc: "Smart budget planning",
                          slug: "cost-estimator",
                          icon: "Calculator",
                          tone: "blue",
                        },
                        {
                          title: "AI Recommendations",
                          desc: "Material recommendations",
                          slug: "recommendations",
                          icon: "Brain",
                          tone: "purple",
                        },
                      ],
                    },
                    {
                      label: "About",
                      slug: "about",
                      submenu: [
                        {
                          title: "About BuildHive",
                          desc: "Our mission & story",
                          url: "/about?section=story",
                          icon: "Building",
                          tone: "violet",
                        },
                        {
                          title: "Our Team",
                          desc: "People behind BuildHive",
                          url: "/about?section=team",
                          icon: "Users",
                          tone: "cyan",
                        },
                      ],
                    },
                    { label: "Contact", slug: "contact" },
                  ];

                  return (
                    <>
                      {items.map((item) => (
                        <div
                          key={item.slug}
                          className="relative"
                          onMouseEnter={() => {
                            handleDropdownEnter();
                            setOpenDropdown(item.slug);
                          }}
                          onMouseLeave={() => handleDropdownLeave(item.slug)}
                        >
                          <button
                            onClick={(e) => handleNav(e, item.slug)}
                            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                              openDropdown === item.slug ||
                              currentActivePage === item.slug
                                ? "bg-violet-500/15 text-violet-300"
                                : "text-gray-200 hover:bg-violet-500/10 hover:text-violet-300"
                            }`}
                          >
                            <span>{item.label}</span>
                            {item.submenu && (
                              <Icons.ChevronDown
                                className={`h-4 w-4 ${openDropdown === item.slug ? "text-violet-300" : "text-gray-400"}`}
                              />
                            )}
                          </button>

                          {item.submenu && openDropdown === item.slug && (
                            <div className="absolute left-0 top-full mt-3 w-80 rounded-2xl bg-[#0b0f12] ring-1 ring-black/40 shadow-xl p-4">
                              <div className="grid gap-2">
                                {item.submenu.map((s: any) => {
                                  const IconComponent =
                                    (Icons as any)[s.icon] || Icons.Package;
                                  return (
                                    <a
                                      key={s.slug || s.title}
                                      href={s.url || "#"}
                                      onClick={(e) => {
                                        if (s.url) {
                                          e.preventDefault();
                                          navigate(s.url);
                                          setIsMobileMenuOpen(false);
                                          setIsUserMenuOpen(false);
                                        } else {
                                          handleNav(e, s.slug);
                                        }
                                      }}
                                      className="group flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-900"
                                    >
                                      <div
                                        className={`h-10 w-10 flex shrink-0 items-center justify-center rounded-xl ${submenuIconToneClasses[s.tone] || submenuIconToneClasses.violet} shadow-lg shadow-black/25 transition-transform duration-300 group-hover:scale-110`}
                                      >
                                        <IconComponent className="h-5 w-5 text-white" />
                                      </div>
                                      <div>
                                        <div className="text-sm font-semibold text-white">
                                          {s.title}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                          {s.desc}
                                        </div>
                                      </div>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  );
                })()}
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <button
                    className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-[#11151d] text-gray-300 transition-colors hover:border-zinc-700 hover:text-white"
                    aria-label="Cart"
                    onClick={(e) => handleNav(e, "cart")}
                  >
                    <Icons.Cart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 px-1 text-[11px] font-bold text-white">
                        {cartItemCount}
                      </span>
                    )}
                  </button>

                  <button
                    className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-[#11151d] text-gray-300 transition-colors hover:border-zinc-700 hover:text-white"
                    aria-label="Messages"
                    onClick={(e) => handleNav(e, "messages")}
                  >
                    <Icons.Message className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 px-1 text-[11px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <div className="relative" ref={notificationRef}>
                    <button
                      className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-[#11151d] text-gray-300 transition-colors hover:border-zinc-700 hover:text-white"
                      aria-label="Notifications"
                      onClick={() => {
                        setIsNotificationsOpen((prev) => !prev);
                        void loadNotifications();
                      }}
                    >
                      <Icons.Bell className="h-5 w-5" />
                      {notificationUnreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-[11px] font-bold text-white">
                          {notificationUnreadCount}
                        </span>
                      )}
                    </button>
                    {isNotificationsOpen && (
                      <div className="absolute right-0 top-full mt-4 w-96 overflow-hidden rounded-3xl border border-white/10 bg-[#14121d] p-3 shadow-2xl shadow-black/40">
                        <div className="flex items-center justify-between px-2 py-2">
                          <h3 className="text-sm font-bold text-white">
                            Notifications
                          </h3>
                          <button
                            onClick={() => void markAllNotificationsRead()}
                            className="text-xs font-semibold text-violet-300"
                          >
                            Mark All Read
                          </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-3 py-8 text-center text-sm text-gray-400">
                              No notifications yet.
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className="flex items-start justify-between gap-3 rounded-2xl px-3 py-3 hover:bg-white/5 group"
                              >
                                <div
                                  className="flex-1 cursor-pointer"
                                  onClick={() => void markNotificationRead(notification.id)}
                                >
                                  <p className="text-sm font-semibold text-white">
                                    {notification.title || notification.type}
                                  </p>
                                  <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                                    {notification.message}
                                  </p>
                                  <p className="mt-2 text-[11px] text-gray-500">
                                    {notification.created_at
                                      ? new Date(notification.created_at).toLocaleString()
                                      : ""}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end justify-between self-stretch">
                                  {!notification.is_read && !notification.read && (
                                    <span className="h-2 w-2 rounded-full bg-pink-500" />
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      void deleteNotificationHeader(notification.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-opacity"
                                    title="Delete notification"
                                  >
                                    <Icons.Trash className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#8d7cff] bg-[#20192f] text-base font-semibold text-white transition-all duration-200 hover:bg-[#2a2140] focus:outline-none focus:ring-2 focus:ring-[#a58cff]/30 focus:ring-offset-2 focus:ring-offset-[#0b0f12]"
                      aria-label="Open profile menu"
                      aria-haspopup="menu"
                    >
                      <span>{userInitials || "AA"}</span>
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[#0b0f12]" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-4 w-80 overflow-hidden rounded-[28px] border border-white/8 bg-[#14121d] p-4 shadow-2xl shadow-black/40">
                        <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#8d7cff] bg-[#20192f] text-lg font-semibold text-white">
                            {userInitials || "AA"}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-lg font-bold text-white">
                              {displayName}
                            </div>
                            <div className="mt-1 inline-flex rounded-full bg-[#232034] px-3 py-1 text-xs font-semibold text-[#cbbcff]">
                              {displayRole.replace("_", " ")}
                            </div>
                          </div>
                        </div>

                        <div className="my-4 h-px bg-white/8" />

                        <div className="grid gap-2">
                          {[
                            {
                              label: "My Account",
                              desc: "Profile, orders, and settings",
                              slug: "account",
                              icon: Icons.Dashboard,
                              gradient: "from-blue-500 to-blue-600",
                            },
                          ].map((item) => (
                            <button
                              key={item.label}
                              onClick={(e) => handleNav(e, item.slug)}
                              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-white/5"
                            >
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white`}
                              >
                                <item.icon className="h-5 w-5 stroke-[2]" />
                              </div>
                              <div>
                                <div className="text-base font-semibold text-white">
                                  {item.label}
                                </div>
                                {item.desc && (
                                  <div className="text-sm text-gray-400">
                                    {item.desc}
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="my-4 h-px bg-white/8" />

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-white/5"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#302034] text-[#f8a0a0]">
                            <Icons.LogOut className="h-5 w-5" />
                          </div>
                          <div className="text-base font-semibold text-[#ff7d7d]">
                            Log out
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTempLogin}
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={(e) => handleNav(e, "get-started")}
                    className="inline-flex items-center justify-center rounded-full border border-[#7e6bc7]/40 bg-[#20192f] px-5 py-2 text-sm font-medium text-white shadow-lg shadow-[#7e6bc7]/15 transition-all duration-200 hover:bg-[#2b2240] hover:border-[#a58cff]/55 focus:outline-none focus:ring-2 focus:ring-[#a58cff]/30 focus:ring-offset-2 focus:ring-offset-[#0b0f12]"
                  >
                    Sign up free
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-3 text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
          <div
            className="lg:hidden border-t px-4 py-4 shadow-lg animate-in slide-in-from-top-2 duration-200"
            style={{ background: "var(--bh-surface)", borderColor: "var(--bh-border)", color: "var(--bh-text)" }}
          >
            <nav className="flex flex-col gap-4">
              {(isLoggedIn
                ? [
                    { label: "Home", slug: "home" },
                    { label: "Products", slug: "products" },
                    { label: "Support", slug: "support" },
                    { label: "Services", slug: "services" },
                    { label: "Find Contractors", slug: "contractors" },
                    { label: "AI", slug: "ai" },
                    { label: "About Us", slug: "about" },
                    { label: "Contact", slug: "contact" },
                  ]
                : [
                    { label: "Home", slug: "home" },
                    { label: "Products", slug: "products" },
                    { label: "Services", slug: "services" },
                    { label: "Find Contractors", slug: "contractors" },
                    { label: "AI", slug: "ai" },
                    { label: "About Us", slug: "about" },
                    { label: "Contact", slug: "contact" },
                  ]
              ).map((item) => (
                <a
                  key={item.slug}
                  href="#"
                  onClick={(e) => handleNav(e, item.slug)}
                  className={`flex items-center justify-between py-3 text-base font-medium min-h-[44px] ${
                    item.slug === "ai"
                      ? "text-primary"
                      : "text-[var(--bh-text)] hover:text-primary"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.slug === "ai" && <Icons.AI className="h-4 w-4" />}
                    {item.slug === "ai" ? "AI Assistant" : item.label}
                  </span>
                  <Icons.ChevronRight className="h-4 w-4 text-gray-300" />
                </a>
              ))}

                <div className="mt-2 space-y-4 border-t pt-4" style={{ borderColor: "var(--bh-border)" }}>
                {/* Mobile User Actions */}
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icons.User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--bh-text)]">
                          {displayName}
                        </p>
                        <p className="text-xs text-[var(--bh-muted)]">{displayEmail}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleNav(e, "account")}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-base text-[var(--bh-text)] hover:bg-white/10"
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
                      onClick={handleTempLogin}
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
                    className="h-10 w-full rounded-lg border pl-10 pr-4 text-sm outline-none"
                    style={{ background: "var(--bh-card)", borderColor: "var(--bh-border)", color: "var(--bh-text)" }}
                  />
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

    </>
  );
};

interface FooterLink {
  label: string;
  path: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerColumns: FooterColumn[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Products", path: "products" },
      { label: "Services", path: "services" },
      { label: "Contractors", path: "contractors" },
    ],
  },
  {
    title: "AI Tools",
    links: [
      { label: "Cost Estimator", path: "cost-estimator" },
      { label: "AI Recommendations", path: "recommendations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", path: "about" },
      { label: "Contact", path: "contact" },
      { label: "Terms", path: "terms" },
      { label: "Privacy", path: "privacy" },
    ],
  },
];

const footerSocialLinks = [
  { icon: "Instagram", label: "Instagram" },
  { icon: "Linkedin", label: "LinkedIn" },
  { icon: "Facebook", label: "Facebook" },
];

export const Footer = () => {
  const navigate = useNavigate();

  const onNavigate = (slug: string) => {
    navigate(slug === "home" ? "/" : `/${slug}`);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  return (
    <footer className="footer-root">
      <style>{`
        .footer-root {
          background: #080a0c;
          border-top: 1px solid rgba(126, 107, 199, 0.12);
          color: #94a3b8;
          font-size: 14px;
        }

        .footer-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 24px 36px;
          display: grid;
          grid-template-columns: 1.35fr repeat(4, minmax(150px, 1fr));
          gap: 48px;
          align-items: start;
        }

        .footer-brand { max-width: 280px; }

        .footer-logo {
          display: inline-flex;
          align-items: center;
          margin-bottom: 12px;
          background: none;
          border: 0;
          padding: 0;
          cursor: pointer;
        }

        .footer-logo img {
          height: 48px;
          width: auto;
          object-fit: contain;
          display: block;
        }

        .footer-brand p {
          font-size: 14px;
          line-height: 1.7;
          color: #64748b;
          margin: 0 0 20px;
          text-align: justify;
          text-justify: inter-word;
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: #64748b;
        }

        .footer-contact-item svg {
          color: #a58cff;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .footer-column h4 {
          font-size: 13px;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 18px;
        }

        .footer-column ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-start;
        }

        .footer-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 14px;
          line-height: 1.35;
          text-align: left;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          font-family: inherit;
          white-space: nowrap;
        }

        .footer-link:hover {
          color: #a58cff;
          transform: translateX(3px);
        }

        .footer-link svg {
          opacity: 0;
          transition: opacity 0.2s ease;
          width: 12px;
          height: 12px;
        }

        .footer-link:hover svg { opacity: 1; }

        .footer-divider {
          max-width: 1200px;
          margin: 0 auto;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(126, 107, 199, 0.2), transparent);
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          text-align: center;
        }

        .footer-copyright {
          font-size: 13px;
          color: #475569;
        }

        .footer-copyright span {
          color: #a58cff;
          font-weight: 600;
        }

        .footer-socials {
          display: grid;
          align-items: stretch;
          gap: 10px;
        }

        .footer-social-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #64748b;
          font-size: 14px;
          background: none;
          border: 0;
          padding: 0;
          cursor: pointer;
          transition: color 0.2s ease, transform 0.2s ease;
          font-family: inherit;
          text-align: left;
        }

        .footer-social-link:hover {
          color: #a58cff;
          transform: translateX(3px);
        }

        .social-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(126, 107, 199, 0.08);
          border: 1px solid rgba(126, 107, 199, 0.15);
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .social-btn:hover {
          background: rgba(126, 107, 199, 0.2);
          border-color: rgba(126, 107, 199, 0.35);
          color: #a58cff;
          transform: translateY(-2px);
        }
        .footer-campus-link { color: #64748b; text-decoration: none; transition: color 0.2s ease; }
        .footer-campus-link:hover { color: #a58cff; }

        @media (max-width: 1024px) {
          .footer-main { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .footer-brand {
            grid-column: 1 / -1;
            max-width: 100%;
            text-align: center;
          }
          .footer-logo { justify-content: center; }
          .footer-contact { align-items: center; }
        }

        @media (max-width: 640px) {
          .footer-main {
            grid-template-columns: 1fr;
            gap: 32px;
            text-align: center;
          }
          .footer-column h4 { margin-bottom: 12px; }
          .footer-column ul { align-items: center; }
          .footer-socials { justify-items: center; }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

      <div className="footer-main">
        <div className="footer-brand">
          <button
            type="button"
            className="footer-logo"
            onClick={() => onNavigate("home")}
            aria-label="Go to BuildHive home"
          >
            <img src="/Build-Hive-Logo.png" alt="BuildHive" />
          </button>
          <p>
            Pakistan's premier digital construction marketplace. Connecting
            builders, contractors, and suppliers with quality materials and
            innovative tools.
          </p>
          <div className="footer-contact">
            <div className="footer-contact-item">
              <Icons.Mail className="h-4 w-4" />
              <span>support@buildhive.pk</span>
            </div>
            <div className="footer-contact-item">
              <Icons.Phone className="h-4 w-4" />
              <span>+92 300 1234567</span>
            </div>
            <div className="footer-contact-item">
              <Icons.MapPin className="h-4 w-4" />
              <span>
                Department of Computer Science, COMSATS University Islamabad,
                Lahore Campus, Defence Road, Lahore, Pakistan
              </span>
            </div>
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title} className="footer-column">
            <h4>{column.title}</h4>
            <ul>
              {column.links.map((link) => (
                <li key={link.path}>
                  <button
                    className="footer-link"
                    onClick={() => onNavigate(link.path)}
                  >
                    <Icons.ChevronRight className="h-3 w-3" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer-column">
          <h4>Social Links</h4>
          <div className="footer-socials">
            {footerSocialLinks.map((social) => {
              const IconComp = Icons[social.icon as keyof typeof Icons];
              return (
                <button
                  key={social.label}
                  className="footer-social-link"
                  aria-label={social.label}
                >
                  <span className="social-btn">
                    <IconComp className="h-4 w-4" />
                  </span>
                  {social.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <span className="footer-copyright">
          {"\u00a9"} 2026 <span>BuildHive</span>. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

const LegacyFooter = () => {
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
          </div>
        </div>
      </div>
    </footer>
  );
};
