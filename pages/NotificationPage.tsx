import React, { useCallback, useEffect, useRef, useState } from "react";
import { Icons } from "../components/Icons";

interface NotificationPageProps {
  onNavigate: (page: string) => void;
}

interface Notification {
  id: string;
  type: "order" | "message" | "system" | "alert" | "payment" | "review";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  starred?: boolean;
  actionable: boolean;
  actionLabel?: string;
  initials?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Order Shipped",
    description: "Your order #ORD-2847 (Cement Bags x50) has been shipped via TCS Logistics. Expected delivery: May 2, 2026.",
    timestamp: "2026-04-30T18:30:00",
    read: false,
    actionable: true,
    actionLabel: "Track Order",
    initials: "PK",
  },
  {
    id: "2",
    type: "message",
    title: "New Message from Ali Construction",
    description: "Hi, we have a bulk discount available for the steel rods you inquired about. Let me know if you're interested!",
    timestamp: "2026-04-30T17:15:00",
    read: false,
    actionable: true,
    actionLabel: "Reply",
    initials: "AC",
  },
  {
    id: "3",
    type: "system",
    title: "Account Verified",
    description: "Congratulations! Your seller account has been verified. You can now list products and receive payments.",
    timestamp: "2026-04-30T14:00:00",
    read: false,
    actionable: false,
    initials: "BH",
  },
  {
    id: "4",
    type: "alert",
    title: "Price Drop Alert",
    description: "The Ceramic Tiles (24x24) you saved to your wishlist dropped by 12%. Now PKR 1,450 per piece.",
    timestamp: "2026-04-30T11:20:00",
    read: true,
    actionable: true,
    actionLabel: "View Deal",
    initials: "PD",
  },
  {
    id: "5",
    type: "payment",
    title: "Payment Received",
    description: "PKR 125,000 has been credited to your wallet from order #ORD-2812. Transaction ID: TXN-998234.",
    timestamp: "2026-04-29T22:45:00",
    read: true,
    actionable: true,
    actionLabel: "View Receipt",
    initials: "PK",
  },
  {
    id: "6",
    type: "review",
    title: "New Review Received",
    description: "Your product 'Premium Portland Cement' received a 5-star review from Karachi Builders Co.",
    timestamp: "2026-04-29T16:30:00",
    read: true,
    actionable: true,
    actionLabel: "See Review",
    initials: "KB",
  },
  {
    id: "7",
    type: "system",
    title: "Platform Maintenance",
    description: "Scheduled maintenance on May 3, 2026 from 2:00 AM to 4:00 AM PKT. Some features may be unavailable.",
    timestamp: "2026-04-29T10:00:00",
    read: true,
    actionable: false,
    initials: "BH",
  },
  {
    id: "8",
    type: "order",
    title: "Order Delivered",
    description: "Your order #ORD-2791 (PVC Pipes x100) has been delivered. Please confirm receipt and leave a review.",
    timestamp: "2026-04-28T15:20:00",
    read: true,
    actionable: true,
    actionLabel: "Confirm Receipt",
    initials: "PK",
  },
  {
    id: "9",
    type: "message",
    title: "New Message from BuildHive Support",
    description: "Your dispute ticket #DSP-442 has been resolved. The refund of PKR 8,500 will be processed within 3-5 business days.",
    timestamp: "2026-04-28T09:10:00",
    read: true,
    actionable: true,
    actionLabel: "View Ticket",
    initials: "BH",
  },
  {
    id: "10",
    type: "alert",
    title: "Low Stock Warning",
    description: "Your listing 'Galvanized Steel Sheets' is running low on stock (only 5 units remaining). Restock soon to avoid losing sales.",
    timestamp: "2026-04-27T20:00:00",
    read: true,
    actionable: true,
    actionLabel: "Restock Now",
    initials: "LS",
  },
];

const typeConfig: Record<Notification["type"], { icon: keyof typeof Icons; color: string; bg: string; border: string }> = {
  order: { icon: "Package", color: "#ffffff", bg: "linear-gradient(135deg, #3b82f6, #2563eb)", border: "rgba(96, 165, 250, 0.35)" },
  message: { icon: "MessageCircle", color: "#ffffff", bg: "linear-gradient(135deg, #8b5cf6, #7c3aed)", border: "rgba(167, 139, 250, 0.35)" },
  system: { icon: "Info", color: "#ffffff", bg: "linear-gradient(135deg, #10b981, #059669)", border: "rgba(52, 211, 153, 0.35)" },
  alert: { icon: "Bell", color: "#ffffff", bg: "linear-gradient(135deg, #f59e0b, #d97706)", border: "rgba(251, 191, 36, 0.35)" },
  payment: { icon: "Wallet", color: "#ffffff", bg: "linear-gradient(135deg, #14b8a6, #0f766e)", border: "rgba(20, 184, 166, 0.35)" },
  review: { icon: "Star", color: "#ffffff", bg: "linear-gradient(135deg, #f43f5e, #e11d48)", border: "rgba(251, 113, 133, 0.35)" },
};

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const notificationStyles = `
.notif-root {
  min-height: 100vh;
  background: #0b0f12;
  color: #e2e8f0;
  padding-bottom: 80px;
}

.notif-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(11, 15, 18, 0.86);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(126, 107, 199, 0.15);
  padding: 20px 24px 0;
}

.notif-header-inner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.notif-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notif-title h1 {
  font-size: 24px;
  font-weight: 800;
  color: white;
  margin: 0;
}

.notif-badge {
  background: rgba(167, 139, 250, 0.14);
  border: 1px solid rgba(167, 139, 250, 0.28);
  color: #e9d5ff;
  font-size: 12px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 20px;
}

.notif-actions,
.batch-actions,
.notif-actions-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.notif-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
  border: 1px solid rgba(167, 139, 250, 0.2);
  background: rgba(255, 255, 255, 0.025);
  color: #cbd5e1;
}

.notif-btn:hover {
  background: rgba(255, 255, 255, 0.055);
  border-color: rgba(167, 139, 250, 0.45);
  color: #ffffff;
  transform: translateY(-2px);
}

.notif-btn.primary {
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
  color: #f5f3ff;
  border: 1px solid rgba(167, 139, 250, 0.44);
  border-radius: 14px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 10px 24px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(124, 58, 237, 0.18);
}

.notif-btn.danger {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.3);
}

.notif-btn.danger:hover {
  background: rgba(248, 113, 113, 0.1);
}

.notif-filters {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px 0;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.notif-filters::-webkit-scrollbar { display: none; }

.filter-chip {
  min-height: 40px;
  padding: 0 18px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(126, 107, 199, 0.2);
  background: rgba(126, 107, 199, 0.05);
  color: #94a3b8;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-chip:hover {
  border-color: rgba(126, 107, 199, 0.4);
  color: #e2e8f0;
}

.filter-chip.active {
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
  color: #f5f3ff;
  border-color: rgba(167, 139, 250, 0.44);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 10px 24px rgba(0, 0, 0, 0.2);
}

.filter-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 11px;
}

.batch-bar {
  max-width: 900px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: rgba(126, 107, 199, 0.08);
  border-bottom: 1px solid rgba(126, 107, 199, 0.15);
}

.batch-info {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 700;
}

.notif-list {
  max-width: 900px;
  margin: 24px auto 0;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notif-item {
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 20px;
  display: flex;
  gap: 16px;
  backdrop-filter: blur(16px);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s ease, background 0.5s ease, box-shadow 0.5s ease;
  cursor: pointer;
  overflow: hidden;
}

.notif-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: transparent;
}

.notif-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(139, 92, 246, 0.2);
  transform: translateY(-6px);
  box-shadow: 0 25px 50px -12px rgba(139, 92, 246, 0.12);
}

.notif-item.unread::before {
  background: linear-gradient(180deg, #7e6bc7, #a58cff);
}

.notif-item.unread {
  background: rgba(139, 92, 246, 0.06);
  border-color: rgba(139, 92, 246, 0.2);
}

.notif-avatar {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
  flex-shrink: 0;
  position: relative;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.notif-item:hover .notif-avatar { transform: rotate(8deg) scale(1.1); }
.notif-avatar svg { width: 28px; height: 28px; stroke: #fff; }

.notif-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #7e6bc7, #a58cff);
  border: 2px solid #0b0f12;
  border-radius: 50%;
}

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}

.notif-title-text {
  font-size: 15px;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.4;
}

.notif-time {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.notif-desc {
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notif-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.notif-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.notif-action-btn {
  min-height: 36px;
  padding: 0 14px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  border: 1px solid rgba(167, 139, 250, 0.44);
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
  color: #f5f3ff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 10px 22px rgba(0, 0, 0, 0.22);
}

.notif-action-btn:hover { transform: translateY(-2px); border-color: rgba(196, 181, 253, 0.68); }

.notif-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid transparent;
  background: transparent;
  color: #64748b;
}

.notif-icon-btn:hover {
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.2);
}

.notif-icon-btn.star:hover {
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.25);
}

.notif-icon-btn.star.active {
  background: rgba(251, 191, 36, 0.12);
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.28);
}

.notif-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid rgba(126, 107, 199, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
}

.notif-checkbox.checked {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-color: rgba(167, 139, 250, 0.44);
}

.notif-empty {
  text-align: center;
  padding: 80px 24px;
}

.notif-empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.notif-empty h3 {
  font-size: 20px;
  font-weight: 800;
  color: white;
  margin: 0 0 8px;
}

.notif-empty p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 640px) {
  .notif-header-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .notif-item {
    padding: 16px;
  }

  .notif-footer {
    flex-wrap: wrap;
  }
}
`;

export const NotificationPage: React.FC<NotificationPageProps> = ({ onNavigate }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "starred" | "orders" | "messages" | "system">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    if (filter === "starred") return Boolean(notification.starred);
    if (filter === "orders") return notification.type === "order";
    if (filter === "messages") return notification.type === "message";
    if (filter === "system") return notification.type === "system" || notification.type === "alert";
    return true;
  });

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const starredCount = notifications.filter((notification) => notification.starred).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((notification) => notification.id === id ? { ...notification, read: true } : notification)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  }, []);

  const toggleStar = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, starred: !notification.starred }
          : notification
      )
    );
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const deleteSelected = useCallback(() => {
    setNotifications((current) => current.filter((notification) => !selectedIds.has(notification.id)));
    setSelectedIds(new Set());
    setSelectMode(false);
  }, [selectedIds]);

  const markSelectedAsRead = useCallback(() => {
    setNotifications((current) =>
      current.map((notification) => selectedIds.has(notification.id) ? { ...notification, read: true } : notification)
    );
    setSelectedIds(new Set());
    setSelectMode(false);
  }, [selectedIds]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealNodes = root.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.05 }
    );

    revealNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [filteredNotifications]);

  const filters: { key: typeof filter; label: string; count?: number }[] = [
    { key: "all", label: "All", count: notifications.length },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "starred", label: "Starred", count: starredCount },
    { key: "orders", label: "Orders" },
    { key: "messages", label: "Messages" },
    { key: "system", label: "System" },
  ];

  return (
    <div ref={rootRef}>
      <style>{notificationStyles}</style>
      <div className="notif-root">
        <div className="notif-header">
          <div className="notif-header-inner">
            <div className="notif-title">
              <h1>Notifications</h1>
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </div>
            <div className="notif-actions">
              {!selectMode ? (
                <>
                  <button className="notif-btn" onClick={() => setSelectMode(true)}>
                    <Icons.CheckSquare className="h-4 w-4" />
                    Select
                  </button>
                  {unreadCount > 0 && (
                    <button className="notif-btn" onClick={markAllAsRead}>
                      <Icons.Check className="h-4 w-4" />
                      Mark all read
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button className="notif-btn" onClick={() => { setSelectMode(false); setSelectedIds(new Set()); }}>
                    Cancel
                  </button>
                  <button className="notif-btn primary" onClick={markSelectedAsRead} disabled={selectedIds.size === 0} style={{ opacity: selectedIds.size === 0 ? 0.5 : 1 }}>
                    <Icons.Check className="h-4 w-4" />
                    Mark read ({selectedIds.size})
                  </button>
                  <button className="notif-btn danger" onClick={deleteSelected} disabled={selectedIds.size === 0} style={{ opacity: selectedIds.size === 0 ? 0.5 : 1 }}>
                    <Icons.Trash2 className="h-4 w-4" />
                    Delete ({selectedIds.size})
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="notif-filters">
            {filters.map((filterItem) => (
              <button
                key={filterItem.key}
                className={`filter-chip ${filter === filterItem.key ? "active" : ""}`}
                onClick={() => setFilter(filterItem.key)}
              >
                {filterItem.label}
                {filterItem.count !== undefined && filterItem.count > 0 && <span className="filter-count">{filterItem.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {selectMode && (
          <div className="batch-bar">
            <span className="batch-info">{selectedIds.size} of {filteredNotifications.length} selected</span>
            <div className="batch-actions">
              <button className="notif-btn" onClick={() => setSelectedIds(new Set(filteredNotifications.map((notification) => notification.id)))}>
                Select all
              </button>
              <button className="notif-btn" onClick={() => setSelectedIds(new Set())}>
                Deselect all
              </button>
            </div>
          </div>
        )}

        <div className="notif-list">
          {filteredNotifications.length === 0 ? (
            <div className="notif-empty reveal">
              <div className="notif-empty-icon">
                <Icons.Bell className="h-10 w-10" />
              </div>
              <h3>No notifications</h3>
              <p>You are all caught up. Check back later for updates.</p>
            </div>
          ) : (
            filteredNotifications.map((notification, index) => {
              const config = typeConfig[notification.type];
              const IconComp = Icons[config.icon];
              const isSelected = selectedIds.has(notification.id);

              return (
                <div
                  key={notification.id}
                  className={`notif-item reveal ${!notification.read ? "unread" : ""}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  onClick={() => {
                    if (selectMode) toggleSelect(notification.id);
                    else markAsRead(notification.id);
                  }}
                >
                  {selectMode && (
                    <div
                      className={`notif-checkbox ${isSelected ? "checked" : ""}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleSelect(notification.id);
                      }}
                    >
                      {isSelected && <Icons.Check className="h-3 w-3 text-white" />}
                    </div>
                  )}

                  <div className="notif-avatar" style={{ background: config.bg, border: `1px solid ${config.border}` }}>
                    <IconComp style={{ color: config.color }} />
                    {!notification.read && <div className="notif-dot" />}
                  </div>

                  <div className="notif-content">
                    <div className="notif-top">
                      <h4 className="notif-title-text">{notification.title}</h4>
                      <span className="notif-time">
                        <Icons.Clock className="h-3 w-3" />
                        {timeAgo(notification.timestamp)}
                      </span>
                    </div>
                    <p className="notif-desc">{notification.description}</p>
                    <div className="notif-footer">
                      <span className="notif-tag" style={{ background: "rgba(139, 92, 246, 0.08)", color: "#c4b5fd", border: "1px solid rgba(139, 92, 246, 0.18)" }}>
                        <IconComp className="h-3 w-3" />
                        {notification.type}
                      </span>
                      <div className="notif-actions-row">
                        {!selectMode && (
                          <button
                            className={`notif-icon-btn star ${notification.starred ? "active" : ""}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleStar(notification.id);
                            }}
                            title={notification.starred ? "Remove star" : "Star notification"}
                          >
                            <Icons.Star
                              className="h-4 w-4"
                              style={{ fill: notification.starred ? "currentColor" : "none" }}
                            />
                          </button>
                        )}
                        {notification.actionable && notification.actionLabel && !selectMode && (
                          <button
                            className="notif-action-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              markAsRead(notification.id);
                              if (notification.type === "order") onNavigate("account");
                              else if (notification.type === "message") onNavigate("contact");
                              else if (notification.type === "payment") onNavigate("checkout");
                              else if (notification.type === "alert") onNavigate("products");
                            }}
                          >
                            {notification.actionLabel}
                          </button>
                        )}
                        {!selectMode && (
                          <button
                            className="notif-icon-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            title="Delete"
                          >
                            <Icons.Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
