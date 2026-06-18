import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Send,
  Shield,
  Upload,
  Trash2,
  Eye,
} from "lucide-react";
import api from "../src/services/api";
import { useAuth } from "../src/context/AuthContext";
import { toast } from "react-toastify";

// Local Interfaces matching backend model & normalize helpers
interface DisputeDetail {
  id: string;
  disputeId: string;
  disputeType: "order" | "project";
  projectTitle: string;
  clientName: string;
  filedByName: string;
  filedAgainstName: string;
  reason: string;
  status: string;
  filedDate: string;
  amount: number;
  projectId: string;
  orderId: string;
  orderNumber: string;
  project: { id: string; title: string } | null;
  order: { id: string; order_number: string } | null;
  sellerResponse: string;
  resolution: string;
  adminNote: string;
  partialRefundAmount?: number;
  buyerId: string;
  clientId: string;
  sellerId: string;
  contractorId: string;
  filedByRole: string;
  filedAgainstRole: string;
  createdAt: string;
  resolvedAt: string | null;
  description: string;
}

interface DisputeMessage {
  id: string;
  disputeId: string;
  userId: string;
  userName: string;
  userRole: string;
  message: string;
  createdAt: string;
}

interface DisputeAttachment {
  id: string;
  disputeId: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  fileType: string | null;
  uploadedBy: string;
  uploadedByRole: string;
  createdAt: string;
}

type ResolutionStatus = "open" | "resolved" | "under_review" | "escalated" | "closed";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const statusClass = (status: string) => {
  const value = status.toLowerCase();
  if (/delivered|completed|approved|accepted|resolved|paid/.test(value))
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (/cancelled|rejected|failed|refunded/.test(value))
    return "bg-red-50 text-red-700 border-red-100";
  return "bg-amber-50 text-amber-700 border-amber-100";
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(status)}`}>
    {status.replace(/_/g, " ")}
  </span>
);

const roleTone = (role: string) => {
  const value = role.toLowerCase();
  if (value === "admin") return "bg-amber-100 text-amber-800";
  if (value === "buyer") return "bg-blue-100 text-blue-800";
  if (value === "seller" || value === "supplier")
    return "bg-emerald-100 text-emerald-800";
  if (value === "contractor" || value === "provider")
    return "bg-indigo-100 text-indigo-800";
  return "bg-gray-100 text-gray-700";
};

const formatPkr = (value: number | string) =>
  `PKR ${Number(value || 0).toLocaleString("en-PK")}`;

const formatRelativeTime = (value: string) => {
  if (!value) return "Just now";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  const deltaSeconds = Math.round((parsed.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(deltaSeconds);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absSeconds < 60) return formatter.format(deltaSeconds, "second");
  const deltaMinutes = Math.round(deltaSeconds / 60);
  if (Math.abs(deltaMinutes) < 60)
    return formatter.format(deltaMinutes, "minute");
  const deltaHours = Math.round(deltaSeconds / 3600);
  if (Math.abs(deltaHours) < 24) return formatter.format(deltaHours, "hour");
  const deltaDays = Math.round(deltaSeconds / 86400);
  return formatter.format(deltaDays, "day");
};

// API response wrappers
const unwrapApiData = (raw: any): any => {
  if (raw && typeof raw === "object" && "data" in raw) {
    return raw.data;
  }
  return raw;
};

const extractArray = (value: any, keys: string[] = []): any[] => {
  if (Array.isArray(value)) return value;
  for (const key of keys) {
    const candidate = value?.[key];
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
};

const normalizeDispute = (item: any): DisputeDetail => {
  const project = item.project || null;
  const order = item.order || null;
  const filedByUser = item.filed_by_user;
  const filedAgainstUser = item.filed_against_user;
  const disputeType = String(
    item.disputeType ??
      (item.order_id || item.orderId ? "order" : "project"),
  ).toLowerCase();

  const filedByName = item.filedByName ?? filedByUser?.full_name ?? filedByUser?.email ?? "Unknown User";
  const filedAgainstName = item.filedAgainstName ?? filedAgainstUser?.full_name ?? filedAgainstUser?.email ?? "Unknown User";

  return {
    id: String(item.id ?? ""),
    disputeId: String(item.disputeId ?? item.dispute_id ?? item.id ?? ""),
    disputeType: disputeType === "order" ? "order" : "project",
    projectTitle: String(item.projectTitle ?? project?.title ?? "Project dispute"),
    clientName: filedByName,
    filedByName,
    filedAgainstName,
    reason: String(item.reason ?? "No reason provided"),
    status: String(item.status ?? "open"),
    filedDate: String(item.filedDate ?? item.filed_date ?? item.createdAt ?? item.created_at ?? ""),
    amount: Number(item.amount ?? 0),
    projectId: String(item.projectId ?? item.project_id ?? project?.id ?? ""),
    orderId: String(item.orderId ?? item.order_id ?? order?.id ?? ""),
    orderNumber: String(item.orderNumber ?? order?.order_number ?? ""),
    project: project ? { id: String(project.id), title: String(project.title) } : null,
    order: order ? { id: String(order.id), order_number: String(order.order_number) } : null,
    sellerResponse: String(item.sellerResponse ?? item.seller_response ?? ""),
    resolution: String(item.resolution ?? ""),
    adminNote: String(item.adminNote ?? item.admin_note ?? item.resolution ?? ""),
    partialRefundAmount: item.partialRefundAmount ?? item.partial_refund_amount ?? undefined,
    buyerId: String(item.buyerId ?? item.filed_by ?? ""),
    clientId: String(item.clientId ?? item.filed_by ?? ""),
    sellerId: String(item.sellerId ?? item.filed_against ?? ""),
    contractorId: String(item.contractorId ?? item.filed_against ?? ""),
    filedByRole: String(item.filedByRole ?? filedByUser?.role ?? ""),
    filedAgainstRole: String(item.filedAgainstRole ?? filedAgainstUser?.role ?? ""),
    createdAt: String(item.createdAt ?? item.created_at ?? ""),
    resolvedAt: item.resolvedAt ?? item.resolved_date ?? null,
    description: String(item.description ?? ""),
  };
};

const normalizeMessage = (item: any): DisputeMessage => {
  return {
    id: String(item.id ?? ""),
    disputeId: String(item.disputeId ?? item.dispute_id ?? ""),
    userId: String(item.userId ?? item.user_id ?? ""),
    userName: String(item.userName ?? item.user_name ?? "Unknown User"),
    userRole: String(item.userRole ?? item.user_role ?? ""),
    message: String(item.message ?? ""),
    createdAt: String(item.createdAt ?? item.created_at ?? ""),
  };
};

const normalizeAttachment = (item: any): DisputeAttachment => {
  return {
    id: String(item.id ?? ""),
    disputeId: String(item.disputeId ?? item.dispute_id ?? ""),
    userId: String(item.userId ?? item.user_id ?? ""),
    fileName: String(item.fileName ?? item.file_name ?? "Attachment"),
    fileUrl: String(item.fileUrl ?? item.file_url ?? ""),
    fileSize: item.fileSize ?? item.file_size ?? null,
    fileType: item.fileType ?? item.file_type ?? null,
    uploadedBy: String(item.uploadedBy ?? item.uploaded_by ?? "Unknown User"),
    uploadedByRole: String(item.uploadedByRole ?? item.uploaded_by_role ?? ""),
    createdAt: String(item.createdAt ?? item.created_at ?? ""),
  };
};

export const DisputeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingMessage, setSavingMessage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [dispute, setDispute] = useState<DisputeDetail | null>(null);
  const [messages, setMessages] = useState<DisputeMessage[]>([]);
  const [attachments, setAttachments] = useState<DisputeAttachment[]>([]);
  const [messageText, setMessageText] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const pollingRef = useRef<number | null>(null);

  const disputeIdLabel = useMemo(() => {
    const shortId =
      dispute?.id?.slice(0, 8)?.toUpperCase() ||
      id?.slice(0, 8)?.toUpperCase() ||
      "00000000";
    return `#DIS-${shortId}`;
  }, [dispute?.id, id]);

  const isAdmin = user?.role === "admin";
  const canUpload =
    isAdmin ||
    Boolean(
      dispute &&
      [
        dispute.buyerId,
        dispute.sellerId,
        dispute.contractorId,
        dispute.clientId,
      ].includes(user?.id || ""),
    );
  const canChat = canUpload;

  const relatedLink = useMemo(() => {
    if (!dispute) return "/account";
    if (dispute.disputeType === "order") {
      return "/account?tab=orders";
    }
    return "/account?tab=projects";
  }, [dispute]);

  const loadDispute = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await api.get(`/disputes/${id}`);
      const payload = unwrapApiData(response.data);
      setDispute(normalizeDispute(payload));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load dispute");
      navigate("/account?tab=disputes", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!id) return;

    try {
      const response = await api.get(`/disputes/${id}/messages`);
      const data = extractArray(unwrapApiData(response.data), ["messages"]).map(
        normalizeMessage,
      );
      data.sort(
        (left, right) =>
          new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
      );
      setMessages(data);
    } catch (error: any) {
      console.warn("Failed to load messages:", error);
    }
  };

  const loadAttachments = async () => {
    if (!id) return;

    try {
      const response = await api.get(`/disputes/${id}/attachments`);
      const data = extractArray(unwrapApiData(response.data), [
        "attachments",
      ]).map(normalizeAttachment);
      data.sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      );
      setAttachments(data);
    } catch (error: any) {
      console.warn("Failed to load attachments:", error);
    }
  };

  useEffect(() => {
    void loadDispute();
  }, [id]);

  useEffect(() => {
    if (!id) return undefined;

    void loadMessages();
    void loadAttachments();

    pollingRef.current = window.setInterval(() => {
      void loadMessages();
    }, 8000);

    return () => {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const sendMessage = async () => {
    if (!id || !messageText.trim()) return;

    setSavingMessage(true);
    try {
      await api.post(`/disputes/${id}/messages`, {
        message: messageText.trim(),
      });
      setMessageText("");
      await loadMessages();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      setSavingMessage(false);
    }
  };

  const uploadAttachment = async (file: File) => {
    if (!id) return;

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      toast.error("Only PDF, JPG, PNG, and WEBP files are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File must be 5MB or smaller");
      return;
    }

    if (attachments.length >= 10) {
      toast.error("Maximum of 10 files per dispute reached");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingFile(true);
    try {
      await api.post(`/disputes/${id}/attachments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await loadAttachments();
      toast.success("Attachment uploaded successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to upload attachment");
    } finally {
      setUploadingFile(false);
    }
  };

  const onFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    await uploadAttachment(file);
  };

  const deleteAttachment = async (attachmentId: string) => {
    if (!window.confirm("Delete this attachment?")) return;

    try {
      await api.delete(`/disputes/${id}/attachments/${attachmentId}`);
      toast.success("Attachment deleted successfully");
      await loadAttachments();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete attachment");
    }
  };

  const handleAiSummary = async () => {
    if (!dispute) return;

    setSummarizing(true);
    try {
      const msgText = messages.map((message) => `${message.userName}: ${message.message}`).join("\n");
      const query = `Summarize this construction marketplace dispute in 3 bullet points:
Reason: ${dispute.reason}
Description: ${dispute.description || "No description provided."}
Chat messages:
${msgText}
Format: - What happened - What each party claims - Recommended resolution`;

      const response = await api.post("/ai/chat", {
        query,
        user_role: user?.role || "buyer",
        conversation_id: null,
        use_llm: true,
      });

      const resData = response.data?.data ?? response.data;
      setAiSummary(resData.answer || "No summary generated.");
    } catch (err) {
      toast.error("AI summary unavailable");
    } finally {
      setSummarizing(false);
    }
  };

  const fileCountLabel = `${attachments.length}/10 files uploaded`;
  const disputeStatus = dispute?.status || "open";
  const isResolved = disputeStatus.toLowerCase() === "resolved";
  const canUploadEvidence = Boolean(dispute && (isAdmin || canUpload) && !isResolved);
  const canSendMessages = Boolean(dispute && (isAdmin || canChat) && !isResolved);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-gray-500 font-medium">
        <Loader2 className="animate-spin h-8 w-8 mx-auto text-blue-600 mb-4" />
        Loading dispute details...
      </div>
    );
  }

  if (!dispute) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            title="Go back"
            aria-label="Go back"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 shadow-sm transition"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white-400">
              Dispute Detail
            </p>
            <h1 className="text-2xl font-bold text-white-900">
              {disputeIdLabel}
            </h1>
          </div>
        </div>
        <StatusBadge status={disputeStatus} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Filer / Defendant / Related Resource Header */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold tracking-wider uppercase text-gray-400">
                  {dispute.disputeType === "order"
                    ? "Order Dispute"
                    : "Project Dispute"}
                </p>
                <h2 className="mt-2 text-xl font-bold text-gray-900 leading-tight">
                  Filed by {dispute.filedByName} against {dispute.filedAgainstName}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Created{" "}
                  {dispute.createdAt
                    ? formatRelativeTime(dispute.createdAt)
                    : "recently"}
                  {dispute.resolvedAt
                    ? ` · Resolved ${formatRelativeTime(dispute.resolvedAt)}`
                    : ""}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700 border border-gray-100 flex-shrink-0">
                <p className="font-semibold text-gray-900">Related Link</p>
                <Link
                  to={relatedLink}
                  className="mt-1 inline-flex text-blue-600 hover:underline font-medium"
                >
                  {dispute.disputeType === "order"
                    ? `Order: #${dispute.orderNumber || dispute.orderId || dispute.id.slice(0, 8).toUpperCase()}`
                    : `Project: ${dispute.projectTitle || "Untitled Project"}`}
                </Link>
              </div>
            </div>
          </section>

          {/* Dispute Details Claims */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Dispute Details</h3>
              <p className="text-sm text-gray-500">Claim, reason, and resolution details</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Reason
                </p>
                <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {dispute.reason || "No reason provided."}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Refund Amount
                </p>
                <p className="mt-2 text-sm font-bold text-gray-900">
                  {formatPkr(dispute.partialRefundAmount || dispute.amount || 0)}
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                Description
              </p>
              <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {dispute.description || "No description provided."}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                Resolution Notes
              </p>
              <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {dispute.adminNote ||
                  dispute.sellerResponse ||
                  "Awaiting resolution from administrator."}
              </p>
            </div>
          </section>

          {/* Evidence / Attachments */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Evidence / Attachments</h3>
                <p className="text-sm text-gray-500">PDF, JPG, PNG, WEBP only. Max 5MB per file.</p>
              </div>
              <p className="text-sm font-semibold text-gray-700">{fileCountLabel}</p>
            </div>

            {canUploadEvidence && (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 shadow transition">
                  {uploadingFile ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {uploadingFile ? "Uploading..." : "Upload file"}
                  <input
                    type="file"
                    accept=".pdf,image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={onFileSelect}
                    disabled={uploadingFile || attachments.length >= 10}
                  />
                </label>
                <p className="text-sm text-gray-500">
                  Visible to all dispute parties and admin.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {attachments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500 text-center">
                  No attachments uploaded yet.
                </div>
              ) : (
                attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 md:flex-row md:items-center md:justify-between shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 flex-shrink-0">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {attachment.fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Uploaded by {attachment.uploadedBy}{" "}
                          {attachment.uploadedByRole ? `(${attachment.uploadedByRole})` : ""}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {attachment.fileSize
                            ? `${Math.round(attachment.fileSize / 1024)} KB`
                            : "Unknown size"}{" "}
                          · {formatRelativeTime(attachment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                      >
                        <Eye size={16} /> View
                      </a>
                      <a
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        download
                      >
                        <Download size={16} /> Download
                      </a>
                      {!isResolved && (isAdmin || attachment.userId === user?.id) && (
                        <button
                          onClick={() => void deleteAttachment(attachment.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition"
                          title="Delete attachment"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Dispute Chat */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Dispute Chat</h3>
              <p className="text-sm text-gray-500">Oldest messages first. Refreshes every 8 seconds.</p>
            </div>

            <div className="max-h-[28rem] space-y-3 overflow-y-auto rounded-xl bg-gray-50 p-4 border border-gray-100">
              {messages.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500 text-center">
                  No messages yet. Start the conversation.
                </div>
              ) : (
                messages.map((message) => {
                  const senderRole = message.userRole || "user";
                  const isAdminMessage = senderRole === "admin";
                  const isOwnMessage = String(message.userId) === String(user?.id || "");

                  return (
                    <div
                      key={message.id}
                      className={`flex w-full ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                          isAdminMessage
                            ? "border border-amber-200 bg-amber-50 text-amber-900"
                            : isOwnMessage
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-800 border border-gray-200"
                        }`}
                      >
                        <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                          <span>{message.userName}</span>
                          <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${roleTone(senderRole)}`}>
                            {senderRole}
                          </span>
                          <span className="text-gray-400 normal-case tracking-normal font-normal">
                            {formatRelativeTime(message.createdAt)}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.message}
                        </p>
                        {isAdminMessage && (
                          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            <Shield size={12} /> Admin
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {canSendMessages && (
              <div className="space-y-3">
                <textarea
                  value={messageText}
                  onChange={(event) =>
                    setMessageText(event.target.value.slice(0, 1000))
                  }
                  placeholder="Write your update, response, or evidence summary..."
                  className="min-h-24 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition "
                />
                <div className="flex items-center justify-between gap-3 text-sm text-gray-500">
                  <span>{messageText.length}/1000</span>
                  <button
                    onClick={() => void sendMessage()}
                    disabled={savingMessage || !messageText.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 transition"
                  >
                    {savingMessage ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    Send
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 xl:col-span-1">
          {/* Dispute Overview Card */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Dispute Overview</h3>
              <p className="text-sm text-gray-500">Quick details</p>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start justify-between gap-3">
                <span className="text-gray-500">Type</span>
                <span className="font-medium">
                  {dispute.disputeType === "order" ? "Order Dispute" : "Project Dispute"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-gray-500">Status</span>
                <span className="font-medium capitalize">{dispute.status}</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-gray-500">Created</span>
                <span className="font-medium">
                  {dispute.createdAt ? new Date(dispute.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium">{formatPkr(dispute.amount)}</span>
              </div>
            </div>
          </section>

         

          {/* Access Warning */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <AlertCircle size={16} /> Access
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              This page is visible to the dispute parties and admin only. Updates appear in the thread without websockets.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CalendarDays size={16} /> Polling every 8 seconds
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
