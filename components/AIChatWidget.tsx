import React, { useEffect, useMemo, useRef, useState } from "react";
import { aiService } from "../src/services/aiService";
import { Icons } from "./Icons";

type ChatRole = "assistant" | "user";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

const QUICK_REPLIES = [
  "5 marla house cost in Lahore",
  "Recommend tiles for bathroom",
  "What is grey structure?",
];

const WELCOME_MESSAGE =
  "Hi! I'm your BuildHive construction assistant. Ask me about:\n• Construction costs in Pakistan\n• Material recommendations\n• Finding the right contractor\nHow can I help you today?";

const createMessage = (role: ChatRole, content: string): ChatMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  role,
  content,
});

export const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [quickReplies, setQuickReplies] = useState<string[]>(QUICK_REPLIES);
  const [hasClickedChat, setHasClickedChat] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHasClickedChat(
      window.localStorage.getItem("buildhive-ai-chat-clicked") === "true",
    );
  }, []);

  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      if (!hasClickedChat) {
        window.localStorage.setItem("buildhive-ai-chat-clicked", "true");
        setHasClickedChat(true);
      }
    };
    window.addEventListener("open-ai-chat", handleOpenChat);
    return () => {
      window.removeEventListener("open-ai-chat", handleOpenChat);
    };
  }, [hasClickedChat]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([createMessage("assistant", WELCOME_MESSAGE)]);
      setQuickReplies(QUICK_REPLIES);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages((current) => [...current, createMessage("user", trimmed)]);
    setInputValue("");
    setIsTyping(true);

    try {
      const result = await aiService.chat(trimmed, conversationId ?? undefined);
      if (result.responseId) {
        setConversationId(result.responseId);
      }
      setMessages((current) => [
        ...current,
        createMessage("assistant", result.answer),
      ]);
      setQuickReplies(
        Array.isArray(result.suggestedFollowUps)
          ? result.suggestedFollowUps.slice(0, 3)
          : QUICK_REPLIES,
      );
    } catch (error) {
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          "AI chat is temporarily unavailable. Please try again in a moment.",
        ),
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleWidget = () => {
    if (!hasClickedChat) {
      window.localStorage.setItem("buildhive-ai-chat-clicked", "true");
      setHasClickedChat(true);
    }
    setIsOpen((current) => !current);
  };

  const title = useMemo(
    () => (isOpen ? "Close BuildHive AI" : "Ask BuildHive AI"),
    [isOpen],
  );

  return (
    <div className="fixed bottom-6 right-6 z-[70]">
      {!isOpen ? (
        <div className="relative">
          {!hasClickedChat && <span className="ai-pulse-ring" />}
          <button
            type="button"
            onClick={toggleWidget}
            title={title}
            className="group relative flex h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#6C3BD5] to-[#8B5CF6] px-5 text-white shadow-[0_18px_40px_rgba(108,59,213,0.35)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(108,59,213,0.45)] sm:min-w-[168px]"
          >
            <Icons.Bot className="h-6 w-6" />
            <span className="hidden text-sm font-bold sm:inline">Chat with AI</span>
          </button>
        </div>
      ) : (
        <div className="ai-chat-panel w-[340px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-[28px] border shadow-[0_24px_60px_rgba(15,23,42,0.24)] backdrop-blur-xl" style={{ background: "color-mix(in srgb, var(--bh-card) 86%, transparent)", borderColor: "var(--bh-border)" }}>
          <div className="flex items-center justify-between border-b px-4 py-3 text-white" style={{ borderColor: "var(--bh-border)", background: "linear-gradient(135deg,#13131A,#2D1B69)" }}>
            <div>
              <div className="text-sm font-semibold">
                BuildHive AI Assistant
              </div>
              <div className="text-[11px] text-slate-300">
                Ask about costs, materials, contractors
              </div>
            </div>
            <button
              type="button"
              onClick={toggleWidget}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close BuildHive AI"
            >
              <Icons.Close className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="max-h-[450px] space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-[#6C3BD5] text-white"
                      : "border border-[var(--bh-border)] bg-[var(--bh-card)] text-[var(--bh-text)]"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-[var(--bh-border)] bg-[var(--bh-card)] px-4 py-3 text-sm text-[var(--bh-muted)]">
                  <span className="mr-2">BuildHive AI is typing</span>
                  <span className="ai-typing-dots">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            )}

            {messages.length > 0 && quickReplies.length > 0 && !isTyping && (
              <div className="flex flex-wrap gap-2 pt-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => sendMessage(reply)}
                    className="rounded-full border border-[var(--bh-border)] bg-[var(--bh-card)] px-3 py-2 text-left text-xs font-medium text-[var(--bh-muted)] transition-colors hover:border-[#8B5CF6] hover:text-[var(--bh-text)]"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t px-4 py-4" style={{ borderColor: "var(--bh-border)", background: "var(--bh-card)" }}>
            <div className="flex items-center gap-2 rounded-2xl border px-3 py-2" style={{ borderColor: "var(--bh-border)", background: "var(--bh-surface)" }}>
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void sendMessage(inputValue);
                  }
                }}
                placeholder="Ask about a project, material, or contractor..."
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[var(--bh-text)] outline-none placeholder:text-[var(--bh-muted)]"
              />
              <button
                type="button"
                onClick={() => void sendMessage(inputValue)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C3BD5] text-white transition-colors hover:bg-[#5B21B6]"
                aria-label="Send message"
              >
                <Icons.ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 text-center text-[11px] text-slate-400">
              Powered by BuildHive AI
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ai-typing-dots {
          display: inline-flex;
          gap: 4px;
          vertical-align: middle;
        }

        .ai-pulse-ring {
          position: absolute;
          inset: -8px;
          border-radius: 999px;
          border: 2px solid rgba(139, 92, 246, .45);
          animation: ai-pulse-ring 5s infinite ease-out;
        }

        .ai-chat-panel {
          animation: ai-slide-up .3s ease both;
        }

        .ai-typing-dots span {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #f59e0b;
          animation: ai-dot-bounce 1s infinite ease-in-out;
        }

        .ai-typing-dots span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .ai-typing-dots span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes ai-dot-bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.55;
          }
          40% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

        @keyframes ai-pulse-ring {
          0%, 72%, 100% {
            transform: scale(.94);
            opacity: 0;
          }
          8% {
            opacity: .75;
          }
          22% {
            transform: scale(1.12);
            opacity: 0;
          }
        }

        @keyframes ai-slide-up {
          from {
            opacity: 0;
            transform: translateY(18px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
