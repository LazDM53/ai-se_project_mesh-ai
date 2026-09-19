import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getChats, createChat, getChat, sendMessage } from "../../utils/api";
import type { Chat as ChatType, Message } from "../../utils/api";
import sendIcon from "../../assets/send.png";
import "./Chat.css";

type MobileContext = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Chat() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } =
    useOutletContext<MobileContext>();

  // Sidebar state
  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
  const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
  const [newChatTitle, setNewChatTitle] = useState<string>("");

  // Message state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] =
    useState<boolean>(false);
  const [messagesError, setMessagesError] = useState<string>("");

  // Input state
  const [input, setInput] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  // Load existing chats
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getChats();
        setChats(res.data || []);
      } catch {
        setChatsError("Failed to load chats.");
      } finally {
        setIsLoadingChats(false);
      }
    };

    load();
  }, []);

  // Load messages when a chat is selected
  useEffect(() => {
    if (!activeChatId) return;

    const load = async () => {
      setMessages([]);
      setIsLoadingMessages(true);
      setMessagesError("");

      try {
        const res = await getChat(activeChatId);
        setMessages(res.data?.messages || []);
      } catch {
        setMessagesError("Failed to load messages.");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    load();
  }, [activeChatId]);

  // Create a new chat
  const handleCreateChat = async () => {
    const title = newChatTitle.trim() || "New Chat";

    setIsCreatingChat(false);
    setNewChatTitle("");

    try {
      const res = await createChat(title);

      if (res.data) {
        setChats((prev) => [res.data!, ...prev]);
        setActiveChatId(res.data._id);
        setIsMobileMenuOpen(false);
      }
    } catch {
      // A toast or inline error could go here in the future
    }
  };

  // Send a message
  const handleSend = async () => {
    const text = input.trim();

    if (!text || !activeChatId || isSending) return;

    const userMessage: Message = {
      _id: Date.now().toString(),
      chatId: activeChatId,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const res = await sendMessage(activeChatId, text);

      if (res.data) {
        setMessages((prev) => [...prev, res.data!]);
      }
    } catch {
      const errorMessage: Message = {
        _id: Date.now().toString(),
        chatId: activeChatId,
        role: "assistant",
        content: "Something went wrong. Please try again.",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat">
      {/* Sidebar */}
      <aside
        className={
          isMobileMenuOpen
            ? "chat__sidebar chat__sidebar_open"
            : "chat__sidebar"
        }
      >
        <button
          className="chat__new-btn"
          type="button"
          onClick={() => {
            setIsCreatingChat(true);
          }}
        >
          + New Chat
        </button>

        {isCreatingChat && (
          <input
            className="chat__title-input"
            type="text"
            placeholder="Chat name"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateChat();
              }

              if (e.key === "Escape") {
                setIsCreatingChat(false);
                setNewChatTitle("");
              }
            }}
            autoFocus
          />
        )}

        {isLoadingChats && (
          <p className="chat__sidebar-message">Loading…</p>
        )}

        {chatsError && (
          <p className="chat__sidebar-message">{chatsError}</p>
        )}

        <ul className="chat__list">
          {chats.map((c) => (
            <li
              key={c._id}
              className={
                c._id === activeChatId
                  ? "chat__item chat__item_active"
                  : "chat__item"
              }
              onClick={() => {
                setActiveChatId(c._id);
                setIsMobileMenuOpen(false);
              }}
            >
              {c.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main chat area */}
      <div className="chat__main">

    

        {/* No chat selected */}
        {!messagesError &&
          !isLoadingMessages &&
          !activeChatId && (
            <div className="chat__no-messages">
              <h2>
                Create a new chat or select an existing one to
                start the conversation
              </h2>

              <button
                className="chat__start-btn"
                type="button"
                onClick={() => {
                  setIsCreatingChat(true);
                  setIsMobileMenuOpen(true);
                }}
              >
                Start New Chat
              </button>
            </div>
          )}

        {/* Chat selected but no messages */}
        {!messagesError &&
          !isLoadingMessages &&
          activeChatId &&
          messages.length === 0 && (
            <div className="chat__no-messages">
              <h2>Start a conversation</h2>

              <button
                className="chat__start-btn"
                type="button"
                onClick={() => {
                  setIsCreatingChat(true);
                  setIsMobileMenuOpen(true);
                }}
              >
                Start New Chat
              </button>
            </div>
          )}

        {/* Loading messages */}
        {activeChatId && isLoadingMessages && (
          <p className="chat__no-messages">
            Loading messages…
          </p>
        )}

        {/* Message error */}
        {activeChatId && messagesError && (
          <div className="chat__error">
            <h2>Something went wrong</h2>
            <p>{messagesError}</p>
          </div>
        )}

        {/* Loaded messages + input */}
        {activeChatId &&
          !isLoadingMessages &&
          !messagesError && (
            <>
              <ul className="chat__messages">
                {messages.map((msg) => (
                  <li
                    key={msg._id}
                    className={
                      msg.role === "user"
                        ? "chat__message chat__message_user"
                        : "chat__message chat__message_assistant"
                    }
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </li>
                ))}
              </ul>

              {/* Input bar */}
              <div className="chat__input-bar">
                <textarea
                  className="chat__input"
                  placeholder="Ask any question"
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSending}
                />

                <button
  type="submit"
  className="chat__send-button"
  aria-label="Send message"
>
  <img
    src={sendIcon}
    alt=""
    className="chat__send-icon"
  />
</button>
              </div>
            </>
          )}
      </div>
    </div>
  );
}