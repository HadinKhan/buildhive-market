import React, { useEffect, useMemo, useState } from "react";
import { Icons } from "../../components/Icons";
import api from "../services/api";

type TicketStatus = "open" | "in_progress" | "resolved";
type TicketCategory = "order_issue" | "payment" | "general";

interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  category?: TicketCategory;
  description?: string;
  last_message?: string;
  created_at?: string;
  updated_at?: string;
}

interface TicketMessage {
  id: string;
  message: string;
  sender_name?: string;
  sender_id?: string;
  created_at?: string;
}

const statusStyles: Record<TicketStatus, string> = {
  open: "bg-yellow-100 text-yellow-800 border-yellow-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  resolved: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const categories: TicketCategory[] = ["order_issue", "payment", "general"];

export const SupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState<TicketCategory>("general");
  const [newDescription, setNewDescription] = useState("");
  const [creatingTicket, setCreatingTicket] = useState(false);

  const normalizeTickets = (list: any): Ticket[] => {
    const payload = list?.data || list;
    const arr = Array.isArray(payload?.tickets)
      ? payload.tickets
      : Array.isArray(payload)
        ? payload
        : [];
    console.log("TICKETS EXTRACTED:", arr.length);
    return arr.map((ticket: any) => ({
      id: ticket.id,
      subject: ticket.subject || ticket.title || "Support ticket",
      status: (ticket.status || "open") as TicketStatus,
      category: ticket.category || ticket.type,
      description: ticket.description || ticket.body || "",
      last_message:
        ticket.last_message || ticket.lastMessage || ticket.preview || "",
      created_at: ticket.created_at || ticket.createdAt,
      updated_at: ticket.updated_at || ticket.updatedAt,
    }));
  };

  // Support page focuses on tickets; messages are handled in Messages page.

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) || null,
    [selectedTicketId, tickets],
  );

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoadingTickets(true);
        const response = await api.get("/tickets");
        console.log("TICKETS RAW:", response.data);
        const normalized = normalizeTickets(response.data);
        setTickets(normalized);
        if (normalized.length > 0) {
          setSelectedTicketId(normalized[0].id);
        }
      } catch (error) {
        console.error("Failed to load tickets:", error);
      } finally {
        setLoadingTickets(false);
      }
    };

    loadTickets();
  }, []);

  useEffect(() => {
    // Ticket thread loading removed from this page. Messages are displayed
    // and managed in the buyer-seller Messages area. Support page is for
    // ticket creation and admin replies only.
  }, [selectedTicketId]);

  const refreshTickets = async () => {
    const response = await api.get("/tickets");
    console.log("TICKETS RAW:", response.data);
    const normalized = normalizeTickets(response.data);
    setTickets(normalized);
    if (!selectedTicketId && normalized.length > 0) {
      setSelectedTicketId(normalized[0].id);
    }
  };

  const handleCreateTicket = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    try {
      setCreatingTicket(true);
      const response = await api.post("/tickets", {
        subject: newSubject,
        category: newCategory,
        description: newDescription,
      });
      console.log("TICKETS RAW:", response.data);
      const createdTickets = normalizeTickets(response.data);
      setIsNewTicketOpen(false);
      setNewSubject("");
      setNewCategory("general");
      setNewDescription("");
      if (createdTickets.length > 0) {
        setTickets((current) => [createdTickets[0], ...current]);
        setSelectedTicketId(createdTickets[0].id);
      }
      await refreshTickets();
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      setCreatingTicket(false);
    }
  };

  // Reply handling moved to admin tooling; keep support client-side minimal.

  return (
    <div className="min-h-screen bg-[#0b0f12] px-4 py-8 pt-20 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Support</h1>
            <p className="mt-1 text-sm text-gray-400">
              Track tickets and reply in one place.
            </p>
          </div>
          <button
            onClick={() => setIsNewTicketOpen(true)}
            className="inline-flex items-center justify-center rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-600"
          >
            <Icons.Plus className="mr-2 h-4 w-4" /> New Ticket
          </button>
        </div>

        <div className="grid min-h-[70vh] grid-cols-1 gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-[#11151d]">
            <div className="border-b border-zinc-800 p-4">
              <h2 className="text-lg font-semibold">Tickets</h2>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {loadingTickets ? (
                <div className="flex h-full items-center justify-center p-6 text-gray-400">
                  Loading tickets...
                </div>
              ) : tickets.length === 0 ? (
                <div className="flex h-full items-center justify-center p-6 text-center text-gray-400">
                  No tickets yet.
                </div>
              ) : (
                tickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`w-full border-b border-zinc-800 px-4 py-4 text-left transition-colors ${
                      selectedTicketId === ticket.id
                        ? "bg-violet-500/10"
                        : "hover:bg-zinc-900/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-white">
                          {ticket.subject}
                        </div>
                        <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                          {(ticket.category || "general").replace("_", " ")}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${statusStyles[ticket.status]}`}
                      >
                        {ticket.status.replace("_", " ")}
                      </span>
                    </div>
                    {ticket.last_message && (
                      <p className="mt-3 line-clamp-2 text-sm text-gray-400">
                        {ticket.last_message}
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </aside>

          <main className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-[#11151d] p-6">
            {selectedTicket ? (
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    {selectedTicket.subject}
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    {(selectedTicket.category || "general").replace("_", " ")}
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-900/70 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-100">
                    {selectedTicket.description || "No description provided."}
                  </p>
                  <div className="mt-4 text-xs text-gray-400">
                    Created:{" "}
                    {selectedTicket.created_at
                      ? new Date(selectedTicket.created_at).toLocaleString()
                      : ""}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center p-6 text-gray-400">
                Select a ticket to view its details.
              </div>
            )}
          </main>
        </div>
      </div>

      {isNewTicketOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-[#11151d] p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">New Ticket</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Describe the issue and we’ll follow up here.
                </p>
              </div>
              <button
                onClick={() => setIsNewTicketOpen(false)}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close new ticket modal"
              >
                <Icons.Close className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Subject
                </label>
                <input
                  value={newSubject}
                  onChange={(event) => setNewSubject(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none"
                  placeholder="Order not delivered"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Category
                </label>
                <select
                  aria-label="Ticket category"
                  value={newCategory}
                  onChange={(event) =>
                    setNewCategory(event.target.value as TicketCategory)
                  }
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(event) => setNewDescription(event.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none"
                  placeholder="Tell us what happened"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    creatingTicket ||
                    !newSubject.trim() ||
                    !newDescription.trim()
                  }
                  className="rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-gray-600"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
