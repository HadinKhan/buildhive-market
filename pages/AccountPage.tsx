import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { User } from "../types";
import { useAuth } from "../src/context/AuthContext";
import api from "../src/services/api";
import { authService } from "../src/services/authService";
import {
  Address,
  CreateAddressData,
  UpdateProfileData,
  userService,
} from "../src/services/userService";
import { MessagesPage } from "../src/pages/Messages";

interface AccountPageProps {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

type TabId =
  | "overview"
  | "orders"
  | "active"
  | "saved"
  | "finance"
  | "projects"
  | "disputes"
  | "messages"
  | "support"
  | "profile"
  | "addresses";

type ModalState =
  | null
  | { type: "order"; order: any }
  | { type: "refund"; order: any }
  | { type: "project"; project: any }
  | { type: "project-form"; project?: any }
  | { type: "dispute-form"; order?: any }
  | { type: "dispute"; dispute: any }
  | { type: "ticket"; ticket: any }
  | { type: "ticket-form" }
  | { type: "confirm"; title: string; message: string; onConfirm: () => void };

const tabs: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
  { id: "overview", label: "Overview", icon: Icons.Dashboard },
  { id: "orders", label: "Purchase History", icon: Icons.Package },
  { id: "active", label: "Active Orders", icon: Icons.Truck },
  { id: "saved", label: "Saved Items", icon: Icons.Heart },
  { id: "finance", label: "Financial Overview", icon: Icons.Wallet },
  { id: "projects", label: "My Projects", icon: Icons.Briefcase },
  { id: "disputes", label: "My Disputes", icon: Icons.AlertCircle },
  { id: "messages", label: "Messages", icon: Icons.Message },
  { id: "support", label: "Support", icon: Icons.HelpCircle },
  { id: "profile", label: "Profile & Settings", icon: Icons.Settings },
  { id: "addresses", label: "My Addresses", icon: Icons.MapPin },
];

const emptyAddress: CreateAddressData = {
  address_type: "shipping",
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "Pakistan",
  is_default: false,
};

const unwrap = (payload: any) => payload?.data?.data ?? payload?.data ?? payload ?? {};
const asArray = (value: any, keys: string[] = []) => {
  if (Array.isArray(value)) return value;
  for (const key of keys) {
    const candidate = value?.[key];
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
};
const text = (value: any, fallback = "") => String(value ?? fallback);
const money = (value: any) => `PKR ${Number(value || 0).toLocaleString("en-PK")}`;
const dateLabel = (value?: string) => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
};
const toDateOnlyTime = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
};
const statusClass = (status: string) => {
  const value = status.toLowerCase();
  if (/delivered|completed|approved|accepted|resolved|paid/.test(value)) return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (/cancelled|rejected|failed|refunded/.test(value)) return "bg-red-50 text-red-700 border-red-100";
  if (/processing|confirmed|in_progress|shipped|requested/.test(value)) return "bg-blue-50 text-blue-700 border-blue-100";
  return "bg-amber-50 text-amber-700 border-amber-100";
};
const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(status)}`}>
    {status.replace(/_/g, " ")}
  </span>
);

const accountOutlineButton =
  "!border-violet-300 !bg-white !text-violet-800 hover:!border-violet-500 hover:!bg-violet-50 hover:!text-violet-950";
const accountDangerButton =
  "!border-red-300 !bg-white !text-red-700 hover:!border-red-500 hover:!bg-red-50 hover:!text-red-800";

export const AccountPage: React.FC<AccountPageProps> = ({ user, onNavigate, onLogout }) => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const activeTab = (params.get("tab") as TabId) || "overview";
  const setActiveTab = (tab: TabId) => setParams({ tab });

  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [trackingByOrder, setTrackingByOrder] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [busy, setBusy] = useState("");
  const [refundReason, setRefundReason] = useState("Damaged or incomplete order");
  const [ticketMessage, setTicketMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState<UpdateProfileData>({
    full_name: (user as any).fullName || user.full_name || "",
    phone: user.phone || "",
    profile_image: (user as any).profileImage || user.profile_image || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [addressForm, setAddressForm] = useState<CreateAddressData>(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState("");
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    budget: "",
    startDate: "",
    deadline: "",
    milestones: [{ name: "", dueDate: "" }],
  });
  const [disputeForm, setDisputeForm] = useState({
    relatedType: "order",
    relatedId: "",
    reason: "",
    description: "",
  });
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    description: "",
    category: "general",
    priority: "medium",
  });

  const resetProjectForm = () =>
    setProjectForm({
      title: "",
      description: "",
      budget: "",
      startDate: "",
      deadline: "",
      milestones: [{ name: "", dueDate: "" }],
    });

  const openCreateProject = () => {
    resetProjectForm();
    setModal({ type: "project-form" });
  };

  const openEditProject = (project: any) => {
    setProjectForm({
      title: project.title || "",
      description: project.description || "",
      budget: String(project.budget || project.budget_max || project.budgetMax || ""),
      startDate: String(project.start_date || project.startDate || "").slice(0, 10),
      deadline: String(project.deadline || project.due_date || "").slice(0, 10),
      milestones:
        asArray(project.milestones, []).length > 0
          ? asArray(project.milestones, []).map((milestone: any) => ({
              name: milestone.name || milestone.title || "",
              dueDate: String(milestone.due_date || milestone.dueDate || "").slice(0, 10),
            }))
          : [{ name: "", dueDate: "" }],
    });
    setModal({ type: "project-form", project });
  };

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [
        orderRes,
        wishlistRes,
        projectsRes,
        disputesRes,
        ticketsRes,
        notificationsRes,
        addressesRes,
        invoicesRes,
      ] = await Promise.all([
        api.get("/orders"),
        api.get("/wishlist").catch(() => null),
        api.get("/projects").catch(() => null),
        api.get("/disputes").catch(() => null),
        api.get("/tickets").catch(() => null),
        api.get("/notifications", { params: { limit: 10 } }).catch(() => null),
        userService.getAddresses(user.id).catch(() => []),
        api.get("/orders/buyer/invoices").catch(() => null),
      ]);

      setOrders(asArray(unwrap(orderRes), ["orders"]).sort((a, b) => Date.parse(b.created_at || b.createdAt || "") - Date.parse(a.created_at || a.createdAt || "")));
      setWishlist(asArray(unwrap(wishlistRes), ["items", "wishlist"]));
      setProjects(asArray(unwrap(projectsRes), ["projects"]));
      setDisputes(asArray(unwrap(disputesRes), ["disputes"]));
      setTickets(asArray(unwrap(ticketsRes), ["tickets"]));
      setNotifications(asArray(unwrap(notificationsRes), ["notifications"]));
      setAddresses(addressesRes);
      setInvoices(asArray(unwrap(invoicesRes), ["invoices"]));
    } catch {
      setError("Unable to load your account data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab)) setActiveTab("overview");
  }, [activeTab]);

  useEffect(() => {
    void loadAll();
  }, [user.id]);

  const activeOrders = useMemo(
    () => orders.filter((order) => !/completed|delivered|cancelled/i.test(text(order.status))),
    [orders],
  );
  const completedOrders = useMemo(
    () => orders.filter((order) => /completed|delivered/i.test(text(order.status))),
    [orders],
  );
  const totalSpent = completedOrders.reduce((sum, order) => sum + Number(order.total_amount || order.totalAmount || 0), 0);
  const refundOrders = orders.filter((order) => {
    const payment = Array.isArray(order.payments) ? order.payments[0] : null;
    return payment?.refund_status || order.refund_status;
  });

  const loadTracking = async (order: any) => {
    const orderId = order.id;
    if (!orderId || trackingByOrder[orderId]) return;
    try {
      const response = await api.get(`/orders/${orderId}/tracking`);
      setTrackingByOrder((current) => ({ ...current, [orderId]: unwrap(response) }));
    } catch {
      setTrackingByOrder((current) => ({ ...current, [orderId]: { events: [] } }));
    }
  };

  const openOrder = async (order: any) => {
    setModal({ type: "order", order });
    try {
      const detail = unwrap(await api.get(`/orders/${order.id}`));
      setModal({ type: "order", order: { ...order, ...detail } });
    } catch {
      setModal({ type: "order", order });
    }
    await loadTracking(order);
  };

  const downloadReceipt = async (order: any) => {
    setBusy(`receipt-${order.id}`);
    try {
      const response = await api.get(`/orders/${order.id}/receipt`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: response.headers?.["content-type"] || "application/json",
      });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `receipt-${orderNumber(order)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to download receipt.");
    } finally {
      setBusy("");
    }
  };

  const canCancel = (order: any) => !/delivered|completed|cancelled|refunded|shipped/i.test(text(order.status));

  const cancelOrder = async (order: any) => {
    setBusy(`cancel-${order.id}`);
    try {
      await api.post(`/orders/${order.id}/cancel`, { reason: "Cancelled by buyer" });
      toast.success("Order cancelled.");
      await loadAll();
      setModal(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to cancel order.");
    } finally {
      setBusy("");
    }
  };

  const requestRefund = async () => {
    if (modal?.type !== "refund") return;
    setBusy("refund");
    try {
      await api.post("/payments/refund-request", {
        orderId: modal.order.id,
        reason: refundReason,
      });
      toast.success("Refund request submitted.");
      await loadAll();
      setModal(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to request refund.");
    } finally {
      setBusy("");
    }
  };

  const wishlistProduct = (item: any) => item.product || item.products || item;
  const addWishlistToCart = async (item: any) => {
    const product = wishlistProduct(item);
    setBusy(`cart-${product.id}`);
    try {
      await api.post("/cart", { productId: item.product_id || product.id, quantity: 1 });
      toast.success("Added to cart.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to add to cart.");
    } finally {
      setBusy("");
    }
  };
  const removeWishlist = async (item: any) => {
    const product = wishlistProduct(item);
    setBusy(`wishlist-${product.id}`);
    try {
      await api.delete(`/wishlist/${item.product_id || product.id}`);
      setWishlist((current) => current.filter((row) => (row.product_id || wishlistProduct(row).id) !== (item.product_id || product.id)));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to remove saved item.");
    } finally {
      setBusy("");
    }
  };

  const openProject = async (project: any) => {
    setModal({ type: "project", project });
    try {
      const [detailRes, proposalRes] = await Promise.all([
        api.get(`/projects/${project.id}`).catch(() => null),
        api.get("/proposals", { params: { projectId: project.id } }).catch(() => null),
      ]);
      const detail = detailRes ? unwrap(detailRes) : project;
      const proposals = asArray(unwrap(proposalRes), ["proposals"]);
      setModal({ type: "project", project: { ...project, ...detail, proposals } });
    } catch {
      setModal({ type: "project", project });
    }
  };

  const updateProposal = async (proposalId: string, status: "accepted" | "rejected") => {
    setBusy(`proposal-${proposalId}`);
    try {
      await api.put(`/proposals/${proposalId}/status`, { status });
      toast.success(`Proposal ${status}.`);
      if (modal?.type === "project") await openProject(modal.project);
      await loadAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to update proposal.");
    } finally {
      setBusy("");
    }
  };

  const createProject = async (event: React.FormEvent) => {
    event.preventDefault();
    const editingProject = modal?.type === "project-form" ? modal.project : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startTime = toDateOnlyTime(projectForm.startDate);
    const deadlineTime = toDateOnlyTime(projectForm.deadline);

    if (startTime !== null && startTime < today.getTime()) {
      toast.error("Project start date cannot be in the past.");
      return;
    }

    if (startTime !== null && deadlineTime !== null && deadlineTime < startTime) {
      toast.error("Project due date cannot be before the start date.");
      return;
    }

    for (const milestone of projectForm.milestones) {
      if (!milestone.dueDate || !projectForm.startDate || !projectForm.deadline) continue;
      const milestoneTime = toDateOnlyTime(milestone.dueDate);
      if (milestoneTime !== null && startTime !== null && milestoneTime < startTime) {
        toast.error("Milestone date cannot be before the project start date.");
        return;
      }
      if (milestoneTime !== null && deadlineTime !== null && milestoneTime > deadlineTime) {
        toast.error("Milestone date cannot be after the project due date.");
        return;
      }
    }

    setBusy("project");
    const payload = {
      title: projectForm.title,
      description: projectForm.description,
      budget: Number(projectForm.budget),
      startDate: projectForm.startDate || undefined,
      deadline: projectForm.deadline || undefined,
      milestones: projectForm.milestones
        .filter((milestone) => milestone.name && milestone.dueDate)
        .map((milestone) => ({ name: milestone.name, dueDate: milestone.dueDate })),
    };
    try {
      if (editingProject?.id) {
        await api.put(`/projects/${editingProject.id}`, payload);
        toast.success("Project updated.");
      } else {
        await api.post("/projects", payload);
        toast.success("Project created.");
      }
      setModal(null);
      resetProjectForm();
      await loadAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to save project.");
    } finally {
      setBusy("");
    }
  };

  const deleteProject = async (project: any) => {
    setModal({
      type: "confirm",
      title: "Delete project?",
      message: "This will remove the project if deletion is supported. Otherwise it will be marked cancelled.",
      onConfirm: async () => {
        setBusy(`project-delete-${project.id}`);
        try {
          try {
            await api.delete(`/projects/${project.id}`);
          } catch {
            await api.put(`/projects/${project.id}`, { status: "cancelled" });
          }
          toast.success("Project removed.");
          setModal(null);
          await loadAll();
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Unable to remove project.");
        } finally {
          setBusy("");
        }
      },
    });
  };

  const createDispute = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy("dispute");
    try {
      let filedAgainst: string | undefined;
      if (disputeForm.relatedType === "order") {
        const selectedOrder =
          orders.find((order) => order.id === disputeForm.relatedId) || {};
        filedAgainst =
          selectedOrder.filed_against ||
          selectedOrder.filedAgainst ||
          selectedOrder.seller_id ||
          selectedOrder.sellerId ||
          selectedOrder.businesses?.user_id ||
          selectedOrder.business?.user_id;

        if (!filedAgainst && disputeForm.relatedId) {
          const orderDetail = unwrap(await api.get(`/orders/${disputeForm.relatedId}`));
          filedAgainst =
            orderDetail?.businesses?.user_id ||
            orderDetail?.business?.user_id ||
            orderDetail?.seller_id ||
            orderDetail?.sellerId;
        }
      }
      if (disputeForm.relatedType === "project") {
        const selectedProject =
          projects.find((project) => project.id === disputeForm.relatedId) || {};
        filedAgainst =
          selectedProject.filed_against ||
          selectedProject.filedAgainst ||
          selectedProject.contractor_id ||
          selectedProject.contractorId ||
          selectedProject.contractor?.id ||
          selectedProject.acceptedProposal?.contractor_id ||
          selectedProject.accepted_proposal?.contractor_id;
      }

      if (!filedAgainst) {
        toast.error("Unable to identify the other party for this dispute.");
        setBusy("");
        return;
      }

      const disputePayload: Record<string, any> = {
        filedAgainst,
        filed_against: filedAgainst,
        reason: disputeForm.reason,
        description: disputeForm.description,
      };
      if (disputeForm.relatedType === "order") {
        disputePayload.orderId = disputeForm.relatedId;
        disputePayload.order_id = disputeForm.relatedId;
      } else {
        disputePayload.projectId = disputeForm.relatedId;
        disputePayload.project_id = disputeForm.relatedId;
      }
      await api.post("/disputes", disputePayload);
      toast.success("Dispute filed.");
      setModal(null);
      setDisputeForm({ relatedType: "order", relatedId: "", reason: "", description: "" });
      await loadAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to file dispute.");
    } finally {
      setBusy("");
    }
  };

  const createTicket = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy("ticket");
    try {
      await api.post("/tickets", ticketForm);
      toast.success("Ticket created.");
      setModal(null);
      setTicketForm({ subject: "", description: "", category: "general", priority: "medium" });
      await loadAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to create ticket.");
    } finally {
      setBusy("");
    }
  };

  const openTicket = async (ticket: any) => {
    setModal({ type: "ticket", ticket });
    try {
      const detail = unwrap(await api.get(`/tickets/${ticket.id}`));
      setModal({ type: "ticket", ticket: { ...ticket, ...detail } });
    } catch {
      setModal({ type: "ticket", ticket });
    }
  };

  const sendTicketMessage = async () => {
    if (modal?.type !== "ticket" || !ticketMessage.trim()) return;
    setBusy("ticket-message");
    try {
      const response = await api.post(`/tickets/${modal.ticket.id}/messages`, { message: ticketMessage.trim(), attachments: [] });
      const createdMessage = unwrap(response);
      const updatedTicket = {
        ...modal.ticket,
        messages: [...asArray(modal.ticket.messages), createdMessage],
      };
      setModal({ type: "ticket", ticket: updatedTicket });
      setTickets((current) =>
        current.map((ticket) =>
          ticket.id === updatedTicket.id ? { ...ticket, ...updatedTicket } : ticket,
        ),
      );
      toast.success("Reply sent.");
      setTicketMessage("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to send reply.");
    } finally {
      setBusy("");
    }
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy("profile");
    try {
      await userService.updateProfile(user.id, profileForm);
      await refreshUser();
      toast.success("Profile updated.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to update profile.");
    } finally {
      setBusy("");
    }
  };

  const uploadProfileImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy("profile-image");
    try {
      const imageUrl = await userService.uploadProfileImage(user.id, file);
      setProfileForm((current) => ({ ...current, profile_image: imageUrl }));
      await refreshUser();
      toast.success("Profile image updated.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to upload image.");
    } finally {
      setBusy("");
    }
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setBusy("password");
    try {
      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to change password.");
    } finally {
      setBusy("");
    }
  };

  const saveAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy("address");
    try {
      if (editingAddressId) {
        await userService.updateAddress(user.id, editingAddressId, addressForm);
      } else {
        await userService.createAddress(user.id, addressForm);
      }
      setAddressForm(emptyAddress);
      setEditingAddressId("");
      setAddresses(await userService.getAddresses(user.id));
      toast.success("Address saved.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to save address.");
    } finally {
      setBusy("");
    }
  };

  const editAddress = (address: Address) => {
    setEditingAddressId(address.id);
    setAddressForm({
      address_type: address.address_type || "shipping",
      full_name: address.full_name || "",
      phone: address.phone || "",
      address_line1: address.address_line1 || "",
      address_line2: address.address_line2 || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "Pakistan",
      is_default: Boolean(address.is_default),
    });
  };

  const deleteAddress = async (address: Address) => {
    setBusy(`address-${address.id}`);
    try {
      await userService.deleteAddress(user.id, address.id);
      setAddresses((current) => current.filter((item) => item.id !== address.id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to delete address.");
    } finally {
      setBusy("");
    }
  };

  const setDefaultAddress = async (address: Address) => {
    setBusy(`default-${address.id}`);
    try {
      await userService.setDefaultAddress(user.id, address.id);
      setAddresses(await userService.getAddresses(user.id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to set default.");
    } finally {
      setBusy("");
    }
  };

  const orderItems = (order: any) => asArray(order.items || order.order_items, []);
  const sellerName = (order: any) => order.businesses?.business_name || order.businessName || order.sellerName || "Seller";
  const orderNumber = (order: any) => order.order_number || order.orderNumber || order.id?.slice?.(0, 8)?.toUpperCase() || "Order";
  const productImage = (product: any) => product.product_images?.[0]?.image_url || product.images?.[0]?.image_url || product.image_url || product.image || "";

  const renderOrderCard = (order: any, includeTracking = false) => {
    const tracking = trackingByOrder[order.id];
    const payment = Array.isArray(order.payments) ? order.payments[0] : null;
    return (
      <article key={order.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="font-bold text-gray-900">#{orderNumber(order)}</h3>
            <p className="mt-1 text-sm text-gray-500">{dateLabel(order.created_at || order.createdAt)} · {sellerName(order)}</p>
            <p className="mt-2 text-sm text-gray-600">
              {orderItems(order).length
                ? orderItems(order).map((item: any) => `${item.product?.name || item.products?.name || item.product_name || item.name || "Item"} x${item.quantity}`).join(", ")
                : "Click View Details to see items"}
            </p>
            {(payment?.refund_status || order.refund_status) && (
              <div className="mt-2"><StatusBadge status={`Refund ${payment?.refund_status || order.refund_status}`} /></div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <StatusBadge status={text(order.status, "pending")} />
            <span className="font-bold text-gray-900">{money(order.total_amount || order.totalAmount)}</span>
            <Button className={accountOutlineButton} variant="outline" size="sm" onClick={() => void openOrder(order)}>View Details</Button>
            {canCancel(order) && (
              <Button
                variant="outline"
                size="sm"
                className={accountDangerButton}
                onClick={() =>
                  setModal({
                    type: "confirm",
                    title: "Cancel order?",
                    message: `Cancel order #${orderNumber(order)}?`,
                    onConfirm: () => void cancelOrder(order),
                  })
                }
              >
                Cancel
              </Button>
            )}

          </div>
        </div>
        {includeTracking && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            {!tracking ? (
              <button className="text-sm font-semibold text-primary" onClick={() => void loadTracking(order)}>
                Load tracking timeline
              </button>
            ) : (
              <TrackingTimeline tracking={tracking} status={order.status} />
            )}
          </div>
        )}
      </article>
    );
  };

  const panelTitle = tabs.find((tab) => tab.id === activeTab)?.label || "Overview";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4 text-center text-gray-500">Loading buyer dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-xl border border-red-100 bg-white p-8 text-center">
            <h1 className="text-xl font-bold text-red-700">Unable to load account</h1>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <Button className="mt-5" onClick={() => void loadAll()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Buyer Account</p>
              <h1 className="text-3xl font-black text-gray-900">{panelTitle}</h1>
            </div>
            <Button className={accountOutlineButton} variant="outline" onClick={onLogout}>
              <Icons.LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:block">
              <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
                  {profileForm.profile_image ? (
                    <img
                      src={profileForm.profile_image}
                      alt={profileForm.full_name || user.full_name || "Buyer"}
                      className="h-full w-full object-cover"
                      onError={() =>
                        setProfileForm((current) => ({
                          ...current,
                          profile_image: "",
                        }))
                      }
                    />
                  ) : (
                    <Icons.User className="h-6 w-6" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold text-gray-900">{profileForm.full_name || user.full_name || "Buyer"}</p>
                  <p className="truncate text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold ${
                      activeTab === tab.id ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </aside>

            <div>
              <div className="mb-4 flex gap-2 overflow-x-auto rounded-xl border border-gray-100 bg-white p-2 shadow-sm lg:hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap rounded-lg px-3 py-3 text-sm font-semibold min-h-[44px] flex items-center ${
                      activeTab === tab.id ? "bg-primary text-white" : "text-gray-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "overview" && (
                <section className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard icon={Icons.Package} label="Total Orders" value={orders.length} />
                    <StatCard icon={Icons.Wallet} label="Total Spent" value={money(totalSpent)} />
                    <StatCard icon={Icons.Truck} label="Active Orders" value={activeOrders.length} />
                    <StatCard icon={Icons.Heart} label="Saved Items" value={wishlist.length} />
                  </div>
                  <TwoColumn>
                    <QuickList title="Recent Orders" action="View All" onAction={() => setActiveTab("orders")}>
                      {orders.slice(0, 3).map((order) => renderOrderMini(order))}
                      {orders.length === 0 && <EmptyLine text="No orders yet." />}
                    </QuickList>
                    <QuickList title="Recent Notifications" action="View All" onAction={() => navigate("/notifications")}>
                      {notifications.slice(0, 3).map((item) => (
                        <div key={item.id} className="rounded-lg border border-gray-100 p-3">
                          <p className="font-semibold text-gray-900">{item.title || item.type || "Notification"}</p>
                          <p className="mt-1 text-sm text-gray-500">{item.message || item.body || "No message"}</p>
                        </div>
                      ))}
                      {notifications.length === 0 && <EmptyLine text="No notifications yet." />}
                    </QuickList>
                  </TwoColumn>
                </section>
              )}

              {activeTab === "orders" && (
                <ListPanel empty="No purchase history yet.">
                  {orders.map((order) => renderOrderCard(order))}
                </ListPanel>
              )}

              {activeTab === "active" && (
                <ListPanel empty="No active orders right now.">
                  {activeOrders.map((order) => renderOrderCard(order, true))}
                </ListPanel>
              )}

              {activeTab === "saved" && (
                <section className="space-y-4">
                  {wishlist.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center">
                      <p className="text-gray-500">No saved items yet.</p>
                      <Button className="mt-4" onClick={() => onNavigate("products")}>Browse Products</Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {wishlist.map((item) => {
                        const product = wishlistProduct(item);
                        return (
                          <article key={item.id || product.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                            <div className="flex gap-3">
                              <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-100">
                                {productImage(product) ? <img src={productImage(product)} alt={product.name} className="h-full w-full object-cover" /> : null}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="truncate font-bold text-gray-900">{product.name || item.product_name || "Product"}</h3>
                                <p className="text-sm text-gray-500">{product.businesses?.business_name || product.businessName || "Seller"}</p>
                                <p className="mt-1 font-bold text-gray-900">{money(product.price || item.price)}</p>
                              </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button size="sm" className="flex-1" disabled={busy === `cart-${product.id}`} onClick={() => void addWishlistToCart(item)}>Add to Cart</Button>
                              <Button size="sm" className={accountDangerButton} variant="outline" disabled={busy === `wishlist-${product.id}`} onClick={() => void removeWishlist(item)}>Remove</Button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {activeTab === "finance" && (
                <section className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <StatCard icon={Icons.Wallet} label="Total Spent" value={money(totalSpent)} />
                    <StatCard icon={Icons.Check} label="Completed Orders" value={completedOrders.length} />
                    <StatCard icon={Icons.FileText} label="Invoices" value={invoices.length || orders.length} />
                  </div>
                  <QuickList title="Receipts & Invoices">
                    {orders.map((order) => (
                      <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 p-3">
                        <div>
                          <p className="font-semibold text-gray-900">#{orderNumber(order)}</p>
                          <p className="text-sm text-gray-500">{money(order.total_amount || order.totalAmount)}</p>
                        </div>
                        <button
                          type="button"
                          className="text-sm font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={busy === `receipt-${order.id}`}
                          onClick={() => void downloadReceipt(order)}
                        >
                          {busy === `receipt-${order.id}` ? "Downloading..." : "Download Receipt"}
                        </button>
                      </div>
                    ))}
                    {orders.length === 0 && <EmptyLine text="No receipts available." />}
                  </QuickList>
                  <QuickList title="Refund History">
                    {refundOrders.map((order) => {
                      const payment = Array.isArray(order.payments) ? order.payments[0] : null;
                      return (
                        <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 p-3">
                          <div>
                            <p className="font-semibold text-gray-900">#{orderNumber(order)}</p>
                            <p className="text-sm text-gray-500">{money(payment?.amount || order.total_amount)}</p>
                          </div>
                          <StatusBadge status={payment?.refund_status || order.refund_status || "requested"} />
                        </div>
                      );
                    })}
                    {refundOrders.length === 0 && <EmptyLine text="No refund requests yet." />}
                  </QuickList>
                </section>
              )}

              {activeTab === "projects" && (
                <section className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={openCreateProject}><Icons.Plus className="mr-2 h-4 w-4" /> New Project</Button>
                  </div>
                  <ListPanel empty="No projects posted yet.">
                    {projects.map((project) => (
                      <article key={project.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">{project.title || "Untitled project"}</h3>
                            <p className="mt-1 line-clamp-2 text-sm text-gray-500">{project.description || "No description"}</p>
                            <p className="mt-2 text-sm font-semibold text-gray-700">{money(project.budget || project.budget_max || project.budgetMax)}</p>
                            <p className="mt-1 text-xs text-gray-500">Deadline: {dateLabel(project.deadline || project.due_date)}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={project.status || "open"} />
                            <Button className={accountOutlineButton} variant="outline" size="sm" onClick={() => void openProject(project)}>View Details</Button>
                            <Button className={accountOutlineButton} variant="outline" size="sm" onClick={() => openEditProject(project)}>Edit</Button>
                            <Button className={accountDangerButton} variant="outline" size="sm" disabled={busy === `project-delete-${project.id}`} onClick={() => void deleteProject(project)}>Delete</Button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </ListPanel>
                </section>
              )}

              {activeTab === "disputes" && (
                <section className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={() => setModal({ type: "dispute-form" })}><Icons.Plus className="mr-2 h-4 w-4" /> Raise Dispute</Button>
                  </div>
                  <ListPanel empty="No disputes filed yet.">
                    {disputes.map((dispute) => (
                      <article key={dispute.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div>
                          <h3 className="font-bold text-gray-900">#{dispute.dispute_number || dispute.id?.slice?.(0, 8) || "Dispute"}</h3>
                          <p className="text-sm text-gray-500">{dispute.reason || dispute.description || "No reason"} · {dateLabel(dispute.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={dispute.status || "open"} />
                          <Button className={accountOutlineButton} variant="outline" size="sm" onClick={() => setModal({ type: "dispute", dispute })}>View</Button>
                        </div>
                      </article>
                    ))}
                  </ListPanel>
                </section>
              )}

              {activeTab === "messages" && (
                <section className="overflow-hidden rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
                  <MessagesPage embedded />
                </section>
              )}

              {activeTab === "support" && (
                <section className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={() => setModal({ type: "ticket-form" })}><Icons.Plus className="mr-2 h-4 w-4" /> Create Ticket</Button>
                  </div>
                  <ListPanel empty="No support tickets yet.">
                    {tickets.map((ticket) => (
                      <article key={ticket.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div>
                          <h3 className="font-bold text-gray-900">{ticket.subject}</h3>
                          <p className="text-sm text-gray-500">{ticket.priority || "medium"} · {dateLabel(ticket.created_at || ticket.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={ticket.status || "open"} />
                          <Button className={accountOutlineButton} variant="outline" size="sm" onClick={() => void openTicket(ticket)}>View</Button>
                        </div>
                      </article>
                    ))}
                  </ListPanel>
                </section>
              )}

              {activeTab === "profile" && (
                <TwoColumn>
                  <form onSubmit={(event) => void saveProfile(event)} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                    <div className="mt-4 space-y-3">
                      <TextInput label="Full Name" value={profileForm.full_name || ""} onChange={(value) => setProfileForm((current) => ({ ...current, full_name: value }))} />
                      <TextInput label="Phone" value={profileForm.phone || ""} onChange={(value) => setProfileForm((current) => ({ ...current, phone: value }))} />
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => void uploadProfileImage(event)} />
                      <Button type="button" className={accountOutlineButton} variant="outline" onClick={() => fileInputRef.current?.click()} disabled={busy === "profile-image"}>Upload Profile Image</Button>
                      <Button type="submit" disabled={busy === "profile"}>Save Profile</Button>
                    </div>
                  </form>
                  <form onSubmit={(event) => void changePassword(event)} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
                    <div className="mt-4 space-y-3">
                      <TextInput label="Current Password" type="password" value={passwordForm.currentPassword} onChange={(value) => setPasswordForm((current) => ({ ...current, currentPassword: value }))} />
                      <TextInput label="New Password" type="password" value={passwordForm.newPassword} onChange={(value) => setPasswordForm((current) => ({ ...current, newPassword: value }))} />
                      <TextInput label="Confirm New Password" type="password" value={passwordForm.confirmPassword} onChange={(value) => setPasswordForm((current) => ({ ...current, confirmPassword: value }))} />
                      <Button type="submit" disabled={busy === "password"}>Change Password</Button>
                    </div>
                  </form>
                </TwoColumn>
              )}

              {activeTab === "addresses" && (
                <TwoColumn>
                  <section className="space-y-3">
                    {addresses.map((address) => (
                      <article key={address.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-gray-900">{address.full_name}</h3>
                            <p className="mt-1 text-sm text-gray-500">{[address.address_line1, address.address_line2, address.city, address.state, address.postal_code, address.country].filter(Boolean).join(", ")}</p>
                            {address.is_default && <div className="mt-2"><StatusBadge status="Default" /></div>}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className={accountOutlineButton} variant="outline" onClick={() => editAddress(address)}>Edit</Button>
                            {!address.is_default && <Button size="sm" className={accountOutlineButton} variant="outline" onClick={() => void setDefaultAddress(address)}>Default</Button>}
                            <Button
                              size="sm"
                              variant="outline"
                              className={accountDangerButton}
                              onClick={() =>
                                setModal({
                                  type: "confirm",
                                  title: "Delete address?",
                                  message: "This saved address will be removed.",
                                  onConfirm: () => void deleteAddress(address),
                                })
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </article>
                    ))}
                    {addresses.length === 0 && <EmptyCard text="No saved addresses yet." />}
                  </section>
                  <form onSubmit={(event) => void saveAddress(event)} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900">{editingAddressId ? "Edit Address" : "Add Address"}</h2>
                    <div className="mt-4 space-y-3">
                      <TextInput label="Full Name" value={addressForm.full_name} onChange={(value) => setAddressForm((current) => ({ ...current, full_name: value }))} />
                      <TextInput label="Phone" value={addressForm.phone} onChange={(value) => setAddressForm((current) => ({ ...current, phone: value }))} />
                      <TextInput label="Address Line 1" value={addressForm.address_line1} onChange={(value) => setAddressForm((current) => ({ ...current, address_line1: value }))} />
                      <TextInput label="Address Line 2" value={addressForm.address_line2 || ""} onChange={(value) => setAddressForm((current) => ({ ...current, address_line2: value }))} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <TextInput label="City" value={addressForm.city} onChange={(value) => setAddressForm((current) => ({ ...current, city: value }))} />
                        <TextInput label="State" value={addressForm.state} onChange={(value) => setAddressForm((current) => ({ ...current, state: value }))} />
                      </div>
                      <TextInput label="Postal Code" value={addressForm.postal_code} onChange={(value) => setAddressForm((current) => ({ ...current, postal_code: value }))} />
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <input type="checkbox" checked={Boolean(addressForm.is_default)} onChange={(event) => setAddressForm((current) => ({ ...current, is_default: event.target.checked }))} />
                        Set as default
                      </label>
                      <Button type="submit" disabled={busy === "address"}>{editingAddressId ? "Update Address" : "Add Address"}</Button>
                    </div>
                  </form>
                </TwoColumn>
              )}
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <AccountModal onClose={() => setModal(null)}>
          {modal.type === "order" && (
            <OrderDetail order={modal.order} tracking={trackingByOrder[modal.order.id]} />
          )}
          {modal.type === "refund" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Request Refund</h2>
              <select className="w-full rounded-lg border border-gray-200 px-3 py-2" value={refundReason} onChange={(event) => setRefundReason(event.target.value)}>
                <option>Damaged or incomplete order</option>
                <option>Wrong item delivered</option>
                <option>Quality issue</option>
                <option>Other</option>
              </select>
              <Button disabled={busy === "refund"} onClick={() => void requestRefund()}>Submit Refund Request</Button>
            </div>
          )}
          {modal.type === "project" && (
            <ProjectDetail project={modal.project} busy={busy} onProposalUpdate={updateProposal} />
          )}
          {modal.type === "project-form" && (
            <ProjectForm form={projectForm} setForm={setProjectForm} busy={busy} onSubmit={createProject} isEditing={Boolean(modal.project)} />
          )}
          {modal.type === "dispute-form" && (
            <DisputeForm form={disputeForm} setForm={setDisputeForm} orders={orders} projects={projects} busy={busy} onSubmit={createDispute} />
          )}
          {modal.type === "dispute" && (
            <DetailBlock title={`Dispute ${modal.dispute.dispute_number || modal.dispute.id}`} rows={[
              ["Status", modal.dispute.status],
              ["Reason", modal.dispute.reason],
              ["Description", modal.dispute.description],
              ["Filed", dateLabel(modal.dispute.created_at)],
            ]} />
          )}
          {modal.type === "ticket-form" && (
            <TicketForm form={ticketForm} setForm={setTicketForm} busy={busy} onSubmit={createTicket} />
          )}
          {modal.type === "ticket" && (
            <div className="space-y-4">
              <DetailBlock title={modal.ticket.subject} rows={[
                ["Status", modal.ticket.status],
                ["Priority", modal.ticket.priority],
                ["Description", modal.ticket.description || modal.ticket.message],
              ]} />
              <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <h3 className="text-sm font-bold text-gray-900">Conversation</h3>
                {asArray(modal.ticket.messages).length === 0 ? (
                  <p className="text-sm text-gray-500">No replies yet.</p>
                ) : (
                  asArray(modal.ticket.messages).map((message: any) => (
                    <div key={message.id || `${message.created_at}-${message.message}`} className="rounded-lg bg-white p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-3 text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">
                          {message.sender?.full_name || message.sender?.email || (message.is_staff_reply ? "Support" : "You")}
                        </span>
                        <span>{dateLabel(message.created_at)}</span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-gray-700">{message.message}</p>
                    </div>
                  ))
                )}
              </div>
              {/resolved/i.test(modal.ticket.status) ? (
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-800 font-medium text-center">
                  This ticket has been resolved
                </div>
              ) : (
                <>
                  <textarea className="w-full rounded-lg border border-gray-200 px-3 py-2" rows={4} placeholder="Add a reply..." value={ticketMessage} onChange={(event) => setTicketMessage(event.target.value)} />
                  <Button disabled={busy === "ticket-message" || !ticketMessage.trim()} onClick={() => void sendTicketMessage()}>Send Reply</Button>
                </>
              )}
            </div>
          )}
          {modal.type === "confirm" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">{modal.title}</h2>
              <p className="text-gray-600">{modal.message}</p>
              <div className="flex justify-end gap-3">
                <Button className={accountOutlineButton} variant="outline" onClick={() => setModal(null)}>Cancel</Button>
                <Button
                  onClick={() => {
                    const confirm = modal.onConfirm;
                    setModal(null);
                    confirm();
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </AccountModal>
      )}
    </>
  );

  function renderOrderMini(order: any) {
    return (
      <button key={order.id} onClick={() => void openOrder(order)} className="w-full rounded-lg border border-gray-100 p-3 text-left hover:bg-gray-50">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-gray-900">#{orderNumber(order)}</p>
            <p className="text-sm text-gray-500">{sellerName(order)}</p>
          </div>
          <span className="font-bold text-gray-900">{money(order.total_amount || order.totalAmount)}</span>
        </div>
      </button>
    );
  }
};

const StatCard = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <Icon className="h-5 w-5 text-primary" />
    <p className="mt-3 text-sm text-gray-500">{label}</p>
    <p className="mt-1 text-2xl font-black text-gray-900">{value}</p>
  </div>
);

const TwoColumn = ({ children }: { children: React.ReactNode }) => <div className="grid gap-5 xl:grid-cols-2">{children}</div>;
const ListPanel = ({ children, empty }: { children: React.ReactNode[] | React.ReactNode; empty: string }) => {
  const list = React.Children.toArray(children).filter(Boolean);
  return <div className="space-y-4">{list.length ? list : <EmptyCard text={empty} />}</div>;
};
const QuickList = ({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children: React.ReactNode }) => (
  <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {action && <button className="text-sm font-semibold text-primary" onClick={onAction}>{action}</button>}
    </div>
    <div className="space-y-3">{children}</div>
  </section>
);
const EmptyLine = ({ text }: { text: string }) => <p className="text-sm text-gray-500">{text}</p>;
const EmptyCard = ({ text }: { text: string }) => <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">{text}</div>;

const TextInput = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) => (
  <label className="block text-sm font-semibold text-gray-700">
    {label}
    <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-primary" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
  </label>
);

const AccountModal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="max-h-[95vh] md:max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
      <div className="mb-4 flex justify-end">
        <button aria-label="Close" onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
          <Icons.Close className="h-5 w-5" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const mapStatusLabel = (status: string): string => {
  const normalized = String(status || "").toLowerCase().trim();
  const mapping: Record<string, string> = {
    pending_payment: "Pending Payment",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  if (mapping[normalized]) return mapping[normalized];
  return normalized
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const TrackingTimeline = ({ tracking, status }: { tracking: any; status: string }) => {
  const currentStatus = String(status || "").toLowerCase().trim();
  const steps = ["confirmed", "processing", "shipped", "delivered"];
  const activeIndex = steps.indexOf(currentStatus);

  if (currentStatus === "pending_payment" || currentStatus === "cancelled" || activeIndex === -1) {
    return (
      <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-xs font-semibold text-gray-500 text-center">
        Status: <span className="text-gray-700 font-bold">{mapStatusLabel(status)}</span> (Order not active)
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-4">
      {steps.map((step: string, index: number) => {
        const isPastOrActive = index <= activeIndex;
        return (
          <div
            key={step}
            className={`rounded-lg px-3 py-2 text-xs font-semibold text-center border ${
              isPastOrActive
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-gray-50 text-gray-400 border-gray-100"
            }`}
          >
            {mapStatusLabel(step)}
          </div>
        );
      })}
    </div>
  );
};

const OrderDetail = ({ order, tracking }: { order: any; tracking?: any }) => (
  <div className="space-y-5">
    <DetailBlock title={`Order #${order.order_number || order.id}`} rows={[
      ["Seller", order.businesses?.business_name || order.businessName || "Seller"],
      ["Status", mapStatusLabel(order.status)],
      ["Total", money(order.total_amount || order.totalAmount)],
      ["Date", dateLabel(order.created_at || order.createdAt)],
    ]} />
    <TrackingTimeline tracking={tracking} status={order.status || ""} />
    <QuickList title="Items">
      <div className="space-y-3">
        {asArray(order.items || order.order_items, []).map((item: any) => {
          const itemPrice = item.price || item.unit_price || 0;
          const lineTotal = item.subtotal || item.total_price || (Number(itemPrice) * item.quantity);
          return (
            <div key={item.id || item.product_id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 text-sm">
              <span className="font-semibold text-gray-900">{item.product?.name || item.products?.name || item.product_name || item.name || "Item"}</span>
              <span className="text-sm text-gray-500">{item.quantity} × {money(itemPrice)}</span>
              <span className="font-bold text-gray-900 font-mono">{money(lineTotal)}</span>
            </div>
          );
        })}
        {asArray(order.items || order.order_items, []).length === 0 && <EmptyLine text="No item rows returned." />}
      </div>

      {/* Summary rows */}
      <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span>{money(order.subtotal || (order.total_amount || order.totalAmount || 0) - (order.shipping_fee || 0) - (order.tax_amount || 0) + (order.discount_amount || 0))}</span>
        </div>
        {Number(order.shipping_fee || 0) > 0 && (
          <div className="flex justify-between text-gray-500">
            <span>Shipping Fee</span>
            <span>+{money(order.shipping_fee)}</span>
          </div>
        )}
        {Number(order.tax_amount || 0) > 0 && (
          <div className="flex justify-between text-gray-500">
            <span>Tax</span>
            <span>+{money(order.tax_amount)}</span>
          </div>
        )}
        {Number(order.discount_amount || 0) > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Discount</span>
            <span>-{money(order.discount_amount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base text-gray-900 pt-1.5 border-t border-dashed border-gray-100">
          <span>Total</span>
          <span>{money(order.total_amount || order.totalAmount)}</span>
        </div>
      </div>
    </QuickList>
  </div>
);

const DetailBlock = ({ title, rows }: { title: string; rows: Array<[string, any]> }) => (
  <section className="rounded-xl border border-gray-100 bg-white p-5">
    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase text-gray-400">{label}</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{text(value, "N/A")}</p>
        </div>
      ))}
    </div>
  </section>
);

const ProjectDetail = ({ project, busy, onProposalUpdate }: { project: any; busy: string; onProposalUpdate: (id: string, status: "accepted" | "rejected") => Promise<void> }) => {
  const proposals = asArray(project.proposals, []);
  const milestones = asArray(project.milestones, []);
  return (
    <div className="space-y-5">
      <DetailBlock title={project.title || "Project"} rows={[
        ["Status", project.status || "open"],
        ["Budget", money(project.budget || project.budget_max || project.budgetMax)],
        ["Posted", dateLabel(project.created_at || project.createdAt)],
        ["Deadline", dateLabel(project.deadline || project.due_date)],
        ["Description", project.description],
      ]} />
      <QuickList title="Proposals">
        {proposals.map((proposal: any) => (
          <div key={proposal.id} className="rounded-lg border border-gray-100 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-gray-900">{proposal.contractor?.full_name || proposal.contractorName || proposal.contractor_name || "Contractor"}</p>
                <p className="text-sm text-gray-500">{proposal.cover_letter || proposal.coverLetter || proposal.message || "No cover note"}</p>
                <p className="mt-1 font-semibold text-gray-900">{money(proposal.amount || proposal.bid_amount)} · {proposal.delivery_time || proposal.deliveryTime || "N/A"}</p>
              </div>
              <StatusBadge status={proposal.status || "pending"} />
            </div>
            {String(proposal.status || "pending").toLowerCase() === "pending" && (
              <div className="mt-3 flex gap-2">
                <Button size="sm" disabled={busy === `proposal-${proposal.id}`} onClick={() => void onProposalUpdate(proposal.id, "accepted")}>Accept</Button>
                <Button size="sm" className={accountDangerButton} variant="outline" disabled={busy === `proposal-${proposal.id}`} onClick={() => void onProposalUpdate(proposal.id, "rejected")}>Reject</Button>
              </div>
            )}
          </div>
        ))}
        {proposals.length === 0 && <EmptyLine text="No proposals received yet." />}
      </QuickList>
      <QuickList title="Milestone Timeline">
        {milestones.map((milestone: any) => (
          <div key={milestone.id || milestone.name} className="flex justify-between rounded-lg border border-gray-100 p-3">
            <div>
              <p className="font-semibold text-gray-900">{milestone.name || milestone.title}</p>
              <p className="text-sm text-gray-500">Due: {dateLabel(milestone.due_date || milestone.dueDate)}</p>
            </div>
            <StatusBadge status={milestone.status || "pending"} />
          </div>
        ))}
        {milestones.length === 0 && <EmptyLine text="No milestones available." />}
      </QuickList>
    </div>
  );
};

const ProjectForm = ({ form, setForm, busy, onSubmit, isEditing }: { form: any; setForm: React.Dispatch<React.SetStateAction<any>>; busy: string; onSubmit: (event: React.FormEvent) => void; isEditing?: boolean }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <h2 className="text-xl font-bold text-gray-900">{isEditing ? "Edit Project" : "Create New Project"}</h2>
    <TextInput label="Title" value={form.title} onChange={(value) => setForm((current: any) => ({ ...current, title: value }))} />
    <label className="block text-sm font-semibold text-gray-700">
      Description
      <textarea className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" rows={4} value={form.description} onChange={(event) => setForm((current: any) => ({ ...current, description: event.target.value }))} />
    </label>
    <TextInput label="Budget (PKR)" type="number" value={form.budget} onChange={(value) => setForm((current: any) => ({ ...current, budget: value }))} />
    <div className="grid gap-3 sm:grid-cols-2">
      <TextInput label="Start Date" type="date" value={form.startDate} onChange={(value) => setForm((current: any) => ({ ...current, startDate: value }))} />
      <TextInput label="Deadline" type="date" value={form.deadline} onChange={(value) => setForm((current: any) => ({ ...current, deadline: value }))} />
    </div>
    <QuickList title="Milestones">
      {form.milestones.map((milestone: any, index: number) => (
        <div key={index} className="grid gap-3 sm:grid-cols-2">
          <TextInput label="Name" value={milestone.name} onChange={(value) => setForm((current: any) => ({ ...current, milestones: current.milestones.map((item: any, currentIndex: number) => currentIndex === index ? { ...item, name: value } : item) }))} />
          <TextInput label="Due Date" type="date" value={milestone.dueDate} onChange={(value) => setForm((current: any) => ({ ...current, milestones: current.milestones.map((item: any, currentIndex: number) => currentIndex === index ? { ...item, dueDate: value } : item) }))} />
        </div>
      ))}
      <Button type="button" className={accountOutlineButton} variant="outline" onClick={() => setForm((current: any) => ({ ...current, milestones: [...current.milestones, { name: "", dueDate: "" }] }))}>Add Milestone</Button>
    </QuickList>
    <Button type="submit" disabled={busy === "project"}>{isEditing ? "Update Project" : "Create Project"}</Button>
  </form>
);

const DisputeForm = ({ form, setForm, orders, projects, busy, onSubmit }: { form: any; setForm: React.Dispatch<React.SetStateAction<any>>; orders: any[]; projects: any[]; busy: string; onSubmit: (event: React.FormEvent) => void }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <h2 className="text-xl font-bold text-gray-900">Raise Dispute</h2>
    <select className="w-full rounded-lg border border-gray-200 px-3 py-2" value={form.relatedType} onChange={(event) => setForm((current: any) => ({ ...current, relatedType: event.target.value, relatedId: "" }))}>
      <option value="order">Order</option>
      <option value="project">Project</option>
    </select>
    <select className="w-full rounded-lg border border-gray-200 px-3 py-2" value={form.relatedId} onChange={(event) => setForm((current: any) => ({ ...current, relatedId: event.target.value }))}>
      <option value="">Select related {form.relatedType}</option>
      {(form.relatedType === "order" ? orders : projects).map((item) => (
        <option key={item.id} value={item.id}>{item.order_number || item.title || item.id}</option>
      ))}
    </select>
    <TextInput label="Reason" value={form.reason} onChange={(value) => setForm((current: any) => ({ ...current, reason: value }))} />
    <label className="block text-sm font-semibold text-gray-700">
      Description
      <textarea className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" rows={4} value={form.description} onChange={(event) => setForm((current: any) => ({ ...current, description: event.target.value }))} />
    </label>
    <Button type="submit" disabled={busy === "dispute"}>File Dispute</Button>
  </form>
);

const TicketForm = ({ form, setForm, busy, onSubmit }: { form: any; setForm: React.Dispatch<React.SetStateAction<any>>; busy: string; onSubmit: (event: React.FormEvent) => void }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <h2 className="text-xl font-bold text-gray-900">Create Support Ticket</h2>
    <TextInput label="Subject" value={form.subject} onChange={(value) => setForm((current: any) => ({ ...current, subject: value }))} />
    <label className="block text-sm font-semibold text-gray-700">
      Description
      <textarea className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" rows={4} value={form.description} onChange={(event) => setForm((current: any) => ({ ...current, description: event.target.value }))} />
    </label>
    <div className="grid gap-3 sm:grid-cols-2">
      <select className="rounded-lg border border-gray-200 px-3 py-2" value={form.category} onChange={(event) => setForm((current: any) => ({ ...current, category: event.target.value }))}>
        <option value="general">General</option>
        <option value="billing">Billing</option>
        <option value="technical">Technical</option>
        <option value="dispute">Dispute</option>
        <option value="other">Other</option>
      </select>
      <select className="rounded-lg border border-gray-200 px-3 py-2" value={form.priority} onChange={(event) => setForm((current: any) => ({ ...current, priority: event.target.value }))}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>
    </div>
    <Button type="submit" disabled={busy === "ticket"}>Create Ticket</Button>
  </form>
);

export default AccountPage;
