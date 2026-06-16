import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icons } from "../../components/Icons";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

interface MessagesPageProps {
  embedded?: boolean;
}

interface Participant {
  id: string;
  fullName: string;
  profileImage?: string;
}

interface Conversation {
  id: string;
  otherParticipant: Participant;
  lastMessage?: { text?: string; createdAt?: string };
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  messageText: string;
  createdAt: string;
  read?: boolean;
}

const EMOJIS = [
  "😊",
  "😂",
  "👍",
  "🙏",
  "❤️",
  "🔥",
  "✅",
  "👀",
  "💯",
  "🤝",
  "😎",
  "🙌",
  "💪",
  "📦",
  "🚀",
  "⭐",
  "🏗️",
  "🔧",
  "💰",
  "📋",
];

const unwrap = (payload: any) => payload?.data?.data ?? payload?.data ?? payload ?? {};

const normalizeConversation = (conversation: any): Conversation => {
  const other = conversation?.otherParticipant ?? conversation?.other_participant ?? {};
  const fullName =
    other?.fullName ??
    other?.full_name ??
    other?.name ??
    conversation?.participant_name ??
    "Contact";

  return {
    id: String(conversation?.id ?? conversation?.conversationId ?? conversation?.conversation_id ?? ""),
    otherParticipant: {
      id: String(other?.id ?? other?.user_id ?? conversation?.participantId ?? ""),
      fullName: String(fullName),
      profileImage: other?.profileImage ?? other?.profile_image ?? other?.avatar,
    },
    lastMessage: {
      text:
        conversation?.lastMessage?.text ??
        conversation?.lastMessage?.messageText ??
        conversation?.last_message?.message_text ??
        conversation?.last_message ??
        "",
      createdAt:
        conversation?.lastMessage?.createdAt ??
        conversation?.last_message?.created_at ??
        conversation?.lastMessageAt ??
        conversation?.last_message_at,
    },
    unreadCount: Number(conversation?.unreadCount ?? conversation?.unread_count ?? 0),
  };
};

const normalizeMessage = (message: any): Message => ({
  id: String(message?.id ?? ""),
  senderId: String(message?.senderId ?? message?.sender_id ?? ""),
  senderName: message?.senderName ?? message?.sender_name,
  messageText: String(message?.messageText ?? message?.message_text ?? message?.message ?? message?.content ?? ""),
  createdAt: String(message?.createdAt ?? message?.created_at ?? message?.timestamp ?? ""),
  read: Boolean(message?.read ?? message?.is_read ?? false),
});

const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const relativeTime = (value?: string) => {
  if (!value) return "";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "";
  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSeconds < 60) return "Just now";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
};

const timeLabel = (value?: string) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const MessagesPage: React.FC<MessagesPageProps> = ({ embedded = false }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchConversationIds, setSearchConversationIds] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const activeConversationRef = useRef<string | null>(null);
  const createConversationLockRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const lastConvRef = useRef<string | null>(null);
  const messagesLengthRef = useRef(messages.length);

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const requestedConversationId = query.get("conversationId") || query.get("conv");
  const requestedParticipantId = query.get("participantId") || query.get("sellerId");

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedConversationId);
  const filteredConversations = useMemo(() => {
    if (!searchConversationIds) return conversations;
    const ids = new Set(searchConversationIds);
    return conversations.filter((conversation) => ids.has(conversation.id));
  }, [conversations, searchConversationIds]);

  const messagePath = (conversationId: string) =>
    embedded ? `/account?tab=messages&conversationId=${conversationId}` : `/messages?conversationId=${conversationId}`;

  const loadConversations = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await api.get("/chat");
      const payload = unwrap(response);
      const rows = Array.isArray(payload.conversations) ? payload.conversations : [];
      const next = rows.map(normalizeConversation).filter((conversation) => conversation.id);
      setConversations(next);
      if (requestedConversationId) {
        setSelectedConversationId(requestedConversationId);
      } else if (!activeConversationRef.current && next.length > 0) {
        setSelectedConversationId(next[0].id);
      }
    } catch {
      if (!silent) setConversations([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const openConversationForParticipant = async (participantId: string) => {
    if (createConversationLockRef.current) return;
    createConversationLockRef.current = true;

    try {
      const response = await api.post("/chat/conversations", { participantId });
      const payload = unwrap(response);
      const conversation = normalizeConversation(payload.conversation ?? payload);
      setConversations((prev) => {
        const exists = prev.some((item) => item.id === conversation.id);
        return exists
          ? prev.map((item) => (item.id === conversation.id ? conversation : item))
          : [conversation, ...prev];
      });
      setSelectedConversationId(conversation.id);
      navigate(messagePath(conversation.id), { replace: true });
    } catch {
      // The empty state remains visible if the backend cannot create the conversation.
    } finally {
      createConversationLockRef.current = false;
    }
  };

  const loadMessages = async (conversationId: string, silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const response = await api.get(`/chat/conversations/${conversationId}/messages`, {
        params: { page: 1, limit: 100 },
      });
      const payload = unwrap(response);
      const rows = Array.isArray(payload.messages) ? payload.messages : [];
      const next = rows.map(normalizeMessage).filter((message) => message.id);
      setMessages((prev) => {
        if (!silent) return next;
        const seen = new Set(prev.map((message) => message.id));
        const additions = next.filter((message) => !seen.has(message.id));
        return additions.length > 0 ? [...prev, ...additions] : prev;
      });
    } catch {
      if (!silent) setMessages([]);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  const markAsRead = async (conversationId: string) => {
    try {
      await api.put(`/chat/conversations/${conversationId}/read`);
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation,
        ),
      );
    } catch {
      // Read marking is non-blocking for the buyer thread.
    }
  };

  useEffect(() => {
    void loadConversations(false);
  }, []);

  useEffect(() => {
    if (requestedParticipantId) {
      void openConversationForParticipant(requestedParticipantId);
    }
  }, [requestedParticipantId]);

  useEffect(() => {
    activeConversationRef.current = selectedConversationId;
    if (!selectedConversationId) return;
    void loadMessages(selectedConversationId, false);
    void markAsRead(selectedConversationId);

    const intervalId = window.setInterval(() => {
      void loadMessages(selectedConversationId, true);
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [selectedConversationId]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadConversations(true);
    }, 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const value = searchTerm.trim();
      if (!value) {
        setSearchConversationIds(null);
        return;
      }

      try {
        const response = await api.get("/chat/search", { params: { q: value } });
        const payload = unwrap(response);
        const ids = Array.isArray(payload.conversationIds) ? payload.conversationIds : [];
        setSearchConversationIds(ids.map(String));
      } catch {
        setSearchConversationIds([]);
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const prevLength = messagesLengthRef.current;
    messagesLengthRef.current = messages.length;
    const convChanged = selectedConversationId !== lastConvRef.current;
    
    if (convChanged) {
      lastConvRef.current = selectedConversationId;
    }

    if (scrollContainerRef.current && (convChanged || messages.length > prevLength)) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [messages, selectedConversationId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId || sending) return;
    const text = newMessage.trim();
    setNewMessage("");
    setSending(true);
    setShowEmojiPicker(false);

    try {
      const response = await api.post(`/chat/conversations/${selectedConversationId}/messages`, {
        messageText: text,
      });
      const payload = unwrap(response);
      const sent = normalizeMessage(payload.message ?? payload);
      setMessages((prev) => [...prev, sent]);
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === selectedConversationId
            ? { ...conversation, lastMessage: { text, createdAt: sent.createdAt } }
            : conversation,
        ),
      );
    } catch {
      setNewMessage(text);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={embedded ? "h-[720px]" : "min-h-screen bg-[#0b0f12] pt-20 pb-20"}>
      <div className={embedded ? "h-full" : "container mx-auto px-4 h-[calc(100vh-120px)]"}>
        {!embedded && (
          <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span
              className="cursor-pointer hover:text-purple-400 transition-colors"
              onClick={() => navigate("/")}
            >
              Home
            </span>
            <Icons.ChevronRight className="h-3 w-3 text-slate-600" />
            <span
              className="cursor-pointer hover:text-purple-400 transition-colors"
              onClick={() => navigate("/account?tab=overview")}
            >
              Buyer Dashboard
            </span>
            <Icons.ChevronRight className="h-3 w-3 text-slate-600" />
            <span className="text-purple-400">Messages</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          <div className="md:col-span-1 border border-zinc-800 rounded-2xl bg-[#11151d] flex flex-col">
            <div className="p-4 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-white">Messages</h2>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search message history..."
                className="mt-3 w-full rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Loading conversations...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 p-4 text-center">
                  {searchTerm ? "No matching conversations." : "No conversations yet. Message a seller from any product page."}
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      setSelectedConversationId(conversation.id);
                      navigate(messagePath(conversation.id), { replace: true });
                    }}
                    className={`w-full px-4 py-3 border-b border-zinc-800 text-left transition-colors ${
                      selectedConversationId === conversation.id
                        ? "bg-violet-500/20 border-l-2 border-l-violet-500"
                        : "hover:bg-zinc-900/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {conversation.otherParticipant.profileImage ? (
                        <img
                          src={conversation.otherParticipant.profileImage}
                          alt={conversation.otherParticipant.fullName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                          {initials(conversation.otherParticipant.fullName)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-white truncate">
                            {conversation.otherParticipant.fullName}
                          </div>
                          <span className="text-xs text-gray-500">
                            {relativeTime(conversation.lastMessage?.createdAt)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 truncate mt-1">
                          {conversation.lastMessage?.text || "No messages yet"}
                        </div>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="flex-shrink-0 h-5 min-w-5 rounded-full bg-violet-500 px-1 flex items-center justify-center text-xs text-white font-bold">
                          {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="md:col-span-2 border border-zinc-800 rounded-2xl bg-[#11151d] flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {selectedConversation.otherParticipant.fullName}
                    </h3>
                    <p className="text-xs text-gray-500">Private conversation</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedConversationId(null);
                      navigate(embedded ? "/account?tab=messages" : "/messages", { replace: true });
                    }}
                    className="rounded-full p-2 text-gray-400 hover:bg-zinc-800 hover:text-white transition-colors"
                    aria-label="Close conversation"
                  >
                    <Icons.Close className="h-5 w-5" />
                  </button>
                </div>

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No messages yet — say hello! 👋
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isSentByMe = message.senderId === user?.id;
                      return (
                        <div key={message.id} className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] ${isSentByMe ? "text-right" : "text-left"}`}>
                            {!isSentByMe && (
                              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                {selectedConversation.otherParticipant.fullName}
                              </div>
                            )}
                            <div
                              className={`rounded-2xl px-4 py-3 shadow-sm ${
                                isSentByMe ? "bg-blue-500 text-white" : "bg-zinc-800 text-gray-100"
                              }`}
                            >
                              <p className="break-words whitespace-pre-wrap leading-relaxed">
                                {message.messageText}
                              </p>
                            </div>
                            <div className={`mt-1 text-xs ${isSentByMe ? "text-blue-300" : "text-gray-400"}`}>
                              {timeLabel(message.createdAt)}
                              {isSentByMe && <span className="ml-1">{message.read ? "✓✓" : "✓"}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="relative border-t border-zinc-800 p-4">
                  {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-20 grid w-64 grid-cols-5 gap-1 rounded-xl border border-zinc-700 bg-zinc-900 p-2 shadow-lg">
                      {EMOJIS.map((emoji) => (
                        <button
                          type="button"
                          key={emoji}
                          onClick={() => setNewMessage((current) => `${current}${emoji}`)}
                          className="rounded-lg p-2 text-lg hover:bg-zinc-800"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker((current) => !current)}
                      className="rounded-full border border-zinc-700 px-3 text-white hover:bg-zinc-800"
                      aria-label="Open emoji picker"
                    >
                      😊
                    </button>
                    <textarea
                      value={newMessage}
                      onChange={(event) => setNewMessage(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          void handleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      rows={1}
                      className="max-h-28 min-h-10 flex-1 resize-none rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={sending || !newMessage.trim()}
                      onClick={() => void handleSendMessage()}
                      className="rounded-full bg-violet-500 px-4 py-2 text-white transition-colors hover:bg-violet-600 disabled:bg-gray-600"
                      aria-label="Send message"
                    >
                      {sending ? "..." : <Icons.ArrowRight className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
                <Icons.Message className="h-10 w-10 opacity-40" />
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
