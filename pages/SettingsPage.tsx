import React, { useState, useRef, useEffect } from "react";
import { Icons } from "../components/Icons";
import { settingsPageStyles } from "../src/styles/settingsPageStyles";
import { settingsPageData } from "../src/data/settingsPageData";
import { settingsService } from "../src/services/settingsService";

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Load initial values from settingsPageData.defaults
  const [notifications, setNotifications] = useState(settingsPageData.defaults.notifications);
  const [privacy, setPrivacy] = useState(settingsPageData.defaults.privacy);
  const [preferences, setPreferences] = useState(settingsPageData.defaults.preferences);
  const [security, setSecurity] = useState(settingsPageData.defaults.security);

  // Track which sections have unsaved changes
  const [unsavedSections, setUnsavedSections] = useState<Set<string>>(new Set());
  const [savedSections, setSavedSections] = useState<Set<string>>(new Set());
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Scroll reveal
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealNodes = root.querySelectorAll<HTMLElement>(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("active");
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    revealNodes.forEach((node) => observer.observe(node));

    const heroReveals = root.querySelectorAll<HTMLElement>(".hero .reveal");
    const timers: number[] = [];
    heroReveals.forEach((el, index) => {
      const id = window.setTimeout(() => {
        el.classList.add("active");
      }, 200 + index * 150);
      timers.push(id);
    });

    return () => {
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    settingsService
      .getSettings()
      .then((settings) => {
        if (cancelled) return;
        if (settings.notifications) setNotifications((current) => ({ ...current, ...settings.notifications }));
        if (settings.privacy) setPrivacy((current) => ({ ...current, ...settings.privacy }));
        if (settings.preferences) setPreferences((current) => ({ ...current, ...settings.preferences }));
        if (settings.security) setSecurity((current) => ({ ...current, ...settings.security }));
        setSettingsError(null);
      })
      .catch((error) => {
        console.error("Failed to load settings:", error);
        if (!cancelled) setSettingsError("Settings are unavailable right now.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Mark section as unsaved when any value changes
  const markUnsaved = (section: string) => {
    setUnsavedSections((prev) => new Set(prev).add(section));
    setSavedSections((prev) => {
      const next = new Set(prev);
      next.delete(section);
      return next;
    });
  };

  // Save handler per section
  const handleSave = (section: string) => {
    const payload = {
      notifications,
      privacy,
      preferences,
      security,
    };
    settingsService.updateSettings({ [section]: payload[section as keyof typeof payload] }).catch((error) => {
      console.error("Failed to save settings:", error);
      setSettingsError("Failed to save settings. Please try again.");
    });
    setUnsavedSections((prev) => {
      const next = new Set(prev);
      next.delete(section);
      return next;
    });
    setSavedSections((prev) => new Set(prev).add(section));

    // Auto-hide saved indicator after 2s
    setTimeout(() => {
      setSavedSections((prev) => {
        const next = new Set(prev);
        next.delete(section);
        return next;
      });
    }, 2000);
  };

  // Toggle switch component pattern
  const ToggleSwitch = ({
    checked,
    onChange,
    label,
    description,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    description?: string;
  }) => (
    <div className="setting-row">
      <div className="setting-info">
        <span className="setting-label">{label}</span>
        {description && <span className="setting-desc">{description}</span>}
      </div>
      <button
        className={`toggle-switch ${checked ? "active" : ""}`}
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
      >
        <span className="toggle-knob"></span>
      </button>
    </div>
  );

  // Select dropdown component pattern
  const SelectDropdown = ({
    value,
    onChange,
    label,
    description,
    options,
  }: {
    value: string;
    onChange: (v: string) => void;
    label: string;
    description?: string;
    options: { value: string; label: string }[];
  }) => (
    <div className="setting-row">
      <div className="setting-info">
        <span className="setting-label">{label}</span>
        {description && <span className="setting-desc">{description}</span>}
      </div>
      <div className="select-wrapper">
        <select
          className="setting-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Icons.ChevronDown className="select-chevron" />
      </div>
    </div>
  );

  return (
    <div ref={rootRef}>
      <style>{settingsPageStyles}</style>

      <div className="settings-root">
        {/* ===== HERO ===== */}
        <section className="hero">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-grid"></div>

          <div className="hero-content">
            <div className="hero-badge reveal">
              <Icons.Settings className="h-[16px] w-[16px]" />
              Settings
            </div>

            <h1 className="reveal stagger-1">
              Manage Your
              <br />
              <span className="gradient-text">Preferences</span>
            </h1>

            <p className="reveal stagger-2">
              Customize notifications, privacy, security, and app behavior 
              to tailor BuildHive to your workflow.
            </p>
            {settingsError && <p className="reveal stagger-2">{settingsError}</p>}
          </div>
        </section>

        {/* ===== SETTINGS GRID ===== */}
        <div className="settings-container">
          {/* --- Notifications Section --- */}
          <section className="settings-card reveal">
            <div className="card-header">
              <div className={`card-icon ${settingsPageData.sections.notifications.tone}`}>
                <Icons.Bell />
              </div>
              <div className="card-title-wrap">
                <h2>{settingsPageData.sections.notifications.title}</h2>
                <p>{settingsPageData.sections.notifications.subtitle}</p>
              </div>
              {unsavedSections.has("notifications") && (
                <span className="unsaved-badge">Unsaved</span>
              )}
              {savedSections.has("notifications") && (
                <span className="saved-badge">
                  <Icons.Check className="h-[12px] w-[12px]" />
                  Saved
                </span>
              )}
            </div>

            <div className="card-body">
              <ToggleSwitch
                label="Email Notifications"
                description="Receive updates about orders, deliveries, and promotions"
                checked={notifications.email}
                onChange={(v) => {
                  setNotifications((p) => ({ ...p, email: v }));
                  markUnsaved("notifications");
                }}
              />
              <ToggleSwitch
                label="Push Notifications"
                description="Browser and mobile push alerts for real-time updates"
                checked={notifications.push}
                onChange={(v) => {
                  setNotifications((p) => ({ ...p, push: v }));
                  markUnsaved("notifications");
                }}
              />
              <ToggleSwitch
                label="SMS Alerts"
                description="Text messages for critical order and delivery updates"
                checked={notifications.sms}
                onChange={(v) => {
                  setNotifications((p) => ({ ...p, sms: v }));
                  markUnsaved("notifications");
                }}
              />
              <ToggleSwitch
                label="Marketing Emails"
                description="New products, discounts, and industry insights"
                checked={notifications.marketing}
                onChange={(v) => {
                  setNotifications((p) => ({ ...p, marketing: v }));
                  markUnsaved("notifications");
                }}
              />
              <ToggleSwitch
                label="Price Drop Alerts"
                description="Get notified when materials in your watchlist drop in price"
                checked={notifications.priceDrop}
                onChange={(v) => {
                  setNotifications((p) => ({ ...p, priceDrop: v }));
                  markUnsaved("notifications");
                }}
              />
            </div>

            <div className="card-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setNotifications(settingsPageData.defaults.notifications);
                  markUnsaved("notifications");
                }}
              >
                Reset Defaults
              </button>
              <button
                className="btn-primary"
                onClick={() => handleSave("notifications")}
                disabled={!unsavedSections.has("notifications")}
              >
                <Icons.Save className="h-[16px] w-[16px]" />
                Save Changes
              </button>
            </div>
          </section>

          {/* --- Privacy Section --- */}
          <section className="settings-card reveal stagger-1">
            <div className="card-header">
              <div className={`card-icon ${settingsPageData.sections.privacy.tone}`}>
                <Icons.Shield />
              </div>
              <div className="card-title-wrap">
                <h2>{settingsPageData.sections.privacy.title}</h2>
                <p>{settingsPageData.sections.privacy.subtitle}</p>
              </div>
              {unsavedSections.has("privacy") && (
                <span className="unsaved-badge">Unsaved</span>
              )}
              {savedSections.has("privacy") && (
                <span className="saved-badge">
                  <Icons.Check className="h-[12px] w-[12px]" />
                  Saved
                </span>
              )}
            </div>

            <div className="card-body">
              <ToggleSwitch
                label="Share Activity with Suppliers"
                description="Allow suppliers to see your browsing and quote history"
                checked={privacy.shareWithSuppliers}
                onChange={(v) => {
                  setPrivacy((p) => ({ ...p, shareWithSuppliers: v }));
                  markUnsaved("privacy");
                }}
              />
              <ToggleSwitch
                label="Public Project Listings"
                description="Make your project posts visible to other builders on the platform"
                checked={privacy.publicProjects}
                onChange={(v) => {
                  setPrivacy((p) => ({ ...p, publicProjects: v }));
                  markUnsaved("privacy");
                }}
              />
              <ToggleSwitch
                label="Analytics & Usage Data"
                description="Help us improve by sharing anonymized app usage data"
                checked={privacy.analytics}
                onChange={(v) => {
                  setPrivacy((p) => ({ ...p, analytics: v }));
                  markUnsaved("privacy");
                }}
              />
              <ToggleSwitch
                label="Third-Party Cookies"
                description="Allow cookies from partner services for personalization"
                checked={privacy.thirdPartyCookies}
                onChange={(v) => {
                  setPrivacy((p) => ({ ...p, thirdPartyCookies: v }));
                  markUnsaved("privacy");
                }}
              />
            </div>

            <div className="card-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setPrivacy(settingsPageData.defaults.privacy);
                  markUnsaved("privacy");
                }}
              >
                Reset Defaults
              </button>
              <button
                className="btn-primary"
                onClick={() => handleSave("privacy")}
                disabled={!unsavedSections.has("privacy")}
              >
                <Icons.Save className="h-[16px] w-[16px]" />
                Save Changes
              </button>
            </div>
          </section>

          {/* --- Preferences Section --- */}
          <section className="settings-card reveal stagger-2">
            <div className="card-header">
              <div className={`card-icon ${settingsPageData.sections.preferences.tone}`}>
                <Icons.Sliders />
              </div>
              <div className="card-title-wrap">
                <h2>{settingsPageData.sections.preferences.title}</h2>
                <p>{settingsPageData.sections.preferences.subtitle}</p>
              </div>
              {unsavedSections.has("preferences") && (
                <span className="unsaved-badge">Unsaved</span>
              )}
              {savedSections.has("preferences") && (
                <span className="saved-badge">
                  <Icons.Check className="h-[12px] w-[12px]" />
                  Saved
                </span>
              )}
            </div>

            <div className="card-body">
              <SelectDropdown
                label="Default City"
                description="Prices and availability will be shown for this location"
                value={preferences.defaultCity}
                options={settingsPageData.options.cities}
                onChange={(v) => {
                  setPreferences((p) => ({ ...p, defaultCity: v }));
                  markUnsaved("preferences");
                }}
              />
              <SelectDropdown
                label="Currency"
                description="Display all prices in your preferred currency"
                value={preferences.currency}
                options={settingsPageData.options.currencies}
                onChange={(v) => {
                  setPreferences((p) => ({ ...p, currency: v }));
                  markUnsaved("preferences");
                }}
              />
              <SelectDropdown
                label="Language"
                description="App interface language"
                value={preferences.language}
                options={settingsPageData.options.languages}
                onChange={(v) => {
                  setPreferences((p) => ({ ...p, language: v }));
                  markUnsaved("preferences");
                }}
              />
              <SelectDropdown
                label="Unit System"
                description="Metric (kg, m²) or Imperial (lb, sq ft)"
                value={preferences.unitSystem}
                options={settingsPageData.options.unitSystems}
                onChange={(v) => {
                  setPreferences((p) => ({ ...p, unitSystem: v }));
                  markUnsaved("preferences");
                }}
              />
              <ToggleSwitch
                label="Compact View"
                description="Show more items per page with less spacing"
                checked={preferences.compactView}
                onChange={(v) => {
                  setPreferences((p) => ({ ...p, compactView: v }));
                  markUnsaved("preferences");
                }}
              />
              <ToggleSwitch
                label="Auto-Refresh Prices"
                description="Live price updates on product pages every 5 minutes"
                checked={preferences.autoRefresh}
                onChange={(v) => {
                  setPreferences((p) => ({ ...p, autoRefresh: v }));
                  markUnsaved("preferences");
                }}
              />
            </div>

            <div className="card-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setPreferences(settingsPageData.defaults.preferences);
                  markUnsaved("preferences");
                }}
              >
                Reset Defaults
              </button>
              <button
                className="btn-primary"
                onClick={() => handleSave("preferences")}
                disabled={!unsavedSections.has("preferences")}
              >
                <Icons.Save className="h-[16px] w-[16px]" />
                Save Changes
              </button>
            </div>
          </section>

          {/* --- Security Section --- */}
          <section className="settings-card reveal stagger-3">
            <div className="card-header">
              <div className={`card-icon ${settingsPageData.sections.security.tone}`}>
                <Icons.Lock />
              </div>
              <div className="card-title-wrap">
                <h2>{settingsPageData.sections.security.title}</h2>
                <p>{settingsPageData.sections.security.subtitle}</p>
              </div>
              {unsavedSections.has("security") && (
                <span className="unsaved-badge">Unsaved</span>
              )}
              {savedSections.has("security") && (
                <span className="saved-badge">
                  <Icons.Check className="h-[12px] w-[12px]" />
                  Saved
                </span>
              )}
            </div>

            <div className="card-body">
              <ToggleSwitch
                label="Two-Factor Authentication"
                description="Require OTP via SMS or authenticator app on login"
                checked={security.twoFactor}
                onChange={(v) => {
                  setSecurity((p) => ({ ...p, twoFactor: v }));
                  markUnsaved("security");
                }}
              />
              <ToggleSwitch
                label="Login Alerts"
                description="Get notified when a new device logs into your account"
                checked={security.loginAlerts}
                onChange={(v) => {
                  setSecurity((p) => ({ ...p, loginAlerts: v }));
                  markUnsaved("security");
                }}
              />
              <ToggleSwitch
                label="Biometric Login"
                description="Use fingerprint or face recognition on supported devices"
                checked={security.biometric}
                onChange={(v) => {
                  setSecurity((p) => ({ ...p, biometric: v }));
                  markUnsaved("security");
                }}
              />
              <ToggleSwitch
                label="Session Timeout"
                description="Automatically log out after 30 minutes of inactivity"
                checked={security.sessionTimeout}
                onChange={(v) => {
                  setSecurity((p) => ({ ...p, sessionTimeout: v }));
                  markUnsaved("security");
                }}
              />

              <div className="setting-row danger-row">
                <div className="setting-info">
                  <span className="setting-label danger-label">
                    <Icons.AlertTriangle className="h-[16px] w-[16px]" />
                    Active Sessions
                  </span>
                  <span className="setting-desc">
                    You are currently logged in on 2 devices
                  </span>
                </div>
                <button className="btn-danger-outline">
                  <Icons.LogOut className="h-[14px] w-[14px]" />
                  Log Out All
                </button>
              </div>
            </div>

            <div className="card-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setSecurity(settingsPageData.defaults.security);
                  markUnsaved("security");
                }}
              >
                Reset Defaults
              </button>
              <button
                className="btn-primary"
                onClick={() => handleSave("security")}
                disabled={!unsavedSections.has("security")}
              >
                <Icons.Save className="h-[16px] w-[16px]" />
                Save Changes
              </button>
            </div>
          </section>

          {/* --- Data & Export Section --- */}
          <section className="settings-card reveal stagger-4">
            <div className="card-header">
              <div className={`card-icon ${settingsPageData.sections.data.tone}`}>
                <Icons.Database />
              </div>
              <div className="card-title-wrap">
                <h2>{settingsPageData.sections.data.title}</h2>
                <p>{settingsPageData.sections.data.subtitle}</p>
              </div>
            </div>

            <div className="card-body">
              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">Download Your Data</span>
                  <span className="setting-desc">
                    Export all your orders, quotes, and project data as a JSON file
                  </span>
                </div>
                <button className="btn-secondary">
                  <Icons.Download className="h-[14px] w-[14px]" />
                  Export
                </button>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">Clear Cache</span>
                  <span className="setting-desc">
                    Remove locally stored images and temporary files
                  </span>
                </div>
                <button className="btn-secondary">
                  <Icons.Trash className="h-[14px] w-[14px]" />
                  Clear
                </button>
              </div>

              <div className="setting-row danger-row">
                <div className="setting-info">
                  <span className="setting-label danger-label">
                    <Icons.AlertTriangle className="h-[16px] w-[16px]" />
                    Delete Account
                  </span>
                  <span className="setting-desc">
                    Permanently delete your account and all associated data
                  </span>
                </div>
                <button className="btn-danger-outline">
                  <Icons.Trash className="h-[14px] w-[14px]" />
                  Delete
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
