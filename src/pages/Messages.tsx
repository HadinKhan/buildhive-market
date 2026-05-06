import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icons } from "../../components/Icons";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Conversation {
  id: string;
  participant_id: string;
  participant_name: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

const CONVERSATION_REFRESH_MS = 8000;
const MESSAGE_REFRESH_MS = 3000;

const normalizeConversations = (data: any): Conversation[] => {
  const list = Array.isArray(data)
    ? data
    : data?.conversations || data?.data || [];

  return list.map((conversation: any) => ({
    id: conversation.id,
    participant_id:
      conversation.participant_id ||
      conversation.participantId ||
      conversation.other_user_id ||
      conversation.otherUserId ||
      conversation.user_id ||
      "",
    participant_name:
      conversation.participant_name ||
      conversation.participantName ||
      conversation.other_user_name ||
      conversation.otherUserName ||
      conversation.business_name ||
      conversation.seller_name ||
      conversation.sellerName ||
      conversation.name ||
      "Seller",
    last_message:
      conversation.last_message ||
      conversation.lastMessage ||
      conversation.last_message_text ||
      conversation.preview ||
      conversation.message ||
      "",
    last_message_at:
      conversation.last_message_at ||
      conversation.lastMessageAt ||
      conversation.updated_at ||
      conversation.updatedAt ||
      conversation.created_at ||
      conversation.createdAt ||
      new Date().toISOString(),
    unread_count: conversation.unread_count || conversation.unreadCount || 0,
  }));
};

const normalizeMessages = (data: any): Message[] => {
  const list = Array.isArray(data) ? data : data?.messages || data?.data || [];

  return list.map((message: any) => ({
    id: message.id,
    conversation_id:
      message.conversation_id ||
      message.conversationId ||
      message.thread_id ||
      message.threadId ||
      "",
    sender_id:
      message.sender_id ||
      message.senderId ||
      message.user_id ||
      message.userId ||
      "",
    sender_name:
      message.sender_name ||
      message.senderName ||
      message.user_name ||
      message.userName ||
      message.name ||
      message.author_name ||
      message.authorName ||
      "",
    message:
      message.message ||
      message.messageText ||
      message.message_text ||
      message.text ||
      message.body ||
      message.content ||
      message.content_text ||
      message.contentText ||
      "",
    created_at:
      message.created_at ||
      message.createdAt ||
      message.sent_at ||
      message.sentAt ||
      message.timestamp ||
      new Date().toISOString(),
  }));
};

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesRefreshing, setMessagesRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const createConversationLockRef = useRef(false);
  const hasLoadedMessagesRef = useRef(false);
  const requestedConversationId = useMemo(
    () =>
      new URLSearchParams(location.search).get("conv") ||
      new URLSearchParams(location.search).get("conversationId"),
    [location.search],
  );
  const requestedParticipantId = useMemo(
    () =>
      new URLSearchParams(location.search).get("participantId") ||
      new URLSearchParams(location.search).get("sellerId"),
    [location.search],
  );

  const loadConversations = async () => {
    try {
      const response = await api.get("/chat");
      console.log("CONVS RAW:", response.data);
      setConversations(normalizeConversations(response.data));
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string, silent = false) => {
    try {
      if (silent && hasLoadedMessagesRef.current) {
        setMessagesRefreshing(true);
      } else {
        setLoadingMessages(true);
      }
      const response = await api.get(
        `/chat/conversations/${conversationId}/messages`,
      );
      console.log("MSGS RAW:", response.data);
      setMessages(normalizeMessages(response.data));
      hasLoadedMessagesRef.current = true;
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoadingMessages(false);
      setMessagesRefreshing(false);
    }
  };

  const openConversationForParticipant = async (participantId: string) => {
    if (createConversationLockRef.current) return;
    createConversationLockRef.current = true;

    try {
      const existing = conversations.find(
        (conversation) => conversation.participant_id === participantId,
      );

      if (existing) {
        setSelectedConversationId(existing.id);
        navigate(`/messages?participantId=${participantId}`, { replace: true });
        return;
      }

      const response = await api.post("/chat/conversations", { participantId });
      const conversation =
        response.data?.data || response.data?.conversation || response.data;
      const conversationId =
        conversation?.id ||
        conversation?.conversation_id ||
        conversation?.conversationId;

      if (conversationId) {
        setSelectedConversationId(conversationId);
        navigate(`/messages?participantId=${participantId}`, { replace: true });
      }

      await loadConversations();
    } catch (error) {
      console.error("Failed to open conversation:", error);
    } finally {
      createConversationLockRef.current = false;
    }
  };

  useEffect(() => {
    setLoading(true);
    void loadConversations();

    const intervalId = window.setInterval(() => {
      void loadConversations();
    }, CONVERSATION_REFRESH_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (requestedParticipantId) {
      const match = conversations.find(
        (conversation) =>
          conversation.participant_id === requestedParticipantId,
      );

      if (match) {
        if (selectedConversationId !== match.id) {
          setSelectedConversationId(match.id);
        }
        return;
      }

      void openConversationForParticipant(requestedParticipantId);
      return;
    }

    if (requestedConversationId) {
      if (selectedConversationId !== requestedConversationId) {
        setSelectedConversationId(requestedConversationId);
      }
      return;
    }

    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [
    conversations,
    requestedConversationId,
    requestedParticipantId,
    selectedConversationId,
  ]);

  useEffect(() => {
    if (!selectedConversationId) return;

    void loadMessages(selectedConversationId, false);

    const intervalId = window.setInterval(() => {
      void loadMessages(selectedConversationId, true);
    }, MESSAGE_REFRESH_MS);

    return () => window.clearInterval(intervalId);
  }, [selectedConversationId]);

  useEffect(() => {
    if (!loadingMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loadingMessages, selectedConversationId]);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId) return;

    try {
      setSending(true);
      await api.post(`/chat/conversations/${selectedConversationId}/messages`, {
        message: newMessage,
        messageText: newMessage,
      });
      setNewMessage("");
      await loadMessages(selectedConversationId, true);
      void loadConversations();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f12] pt-20 pb-20">
      <div className="container mx-auto px-4 h-[calc(100vh-120px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {/* Left Panel - Conversations */}
          <div className="md:col-span-1 border border-zinc-800 rounded-2xl bg-[#11151d] flex flex-col">
            <div className="p-4 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-white">Messages</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Loading conversations...
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 p-4 text-center">
                  No conversations yet. Message a seller from any product page.
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversationId(conv.id);
                      navigate(
                        `/messages?participantId=${conv.participant_id}`,
                        {
                          replace: true,
                        },
                      );
                    }}
                    className={`w-full px-4 py-3 border-b border-zinc-800 text-left transition-colors ${
                      selectedConversationId === conv.id
                        ? "bg-violet-500/20 border-l-2 border-l-violet-500"
                        : "hover:bg-zinc-900/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">
                          {conv.participant_name}
                        </div>
                        <div className="text-sm text-gray-400 truncate mt-1">
                          {conv.last_message}
                        </div>
                      </div>
                      {conv.unread_count > 0 && (
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-violet-500 flex items-center justify-center text-xs text-white font-bold">
                          {conv.unread_count}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(conv.last_message_at).toLocaleDateString()}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Messages */}
          <div className="md:col-span-2 border border-zinc-800 rounded-2xl bg-[#11151d] flex flex-col">
            {selectedConversationId && conversations.length > 0 ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-zinc-800">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-white">
                      {conversations.find(
                        (c) => c.id === selectedConversationId,
                      )?.participant_name || "Seller"}
                    </h3>
                    <div className="text-xs text-gray-500">
                      {messagesRefreshing ? "Updating..." : "Live"}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isSentByMe = msg.sender_id === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                              isSentByMe
                                ? "bg-blue-500 text-white"
                                : "bg-zinc-800 text-gray-100"
                            }`}
                          >
                            {!isSentByMe && msg.sender_name ? (
                              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                {msg.sender_name}
                              </div>
                            ) : null}
                            <p className="break-words whitespace-pre-wrap leading-relaxed">
                              {msg.message || ""}
                            </p>
                            <div
                              className={`mt-1 text-xs ${
                                isSentByMe ? "text-blue-100" : "text-gray-400"
                              }`}
                            >
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-zinc-800 flex gap-2"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="px-4 py-2 bg-violet-500 hover:bg-violet-600 disabled:bg-gray-600 text-white rounded-full transition-colors"
                  >
                    {sending ? "..." : <Icons.ArrowRight className="h-5 w-5" />}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
