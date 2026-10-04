import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  getChats,
  createChat,
  getChat,
  sendMessage,
} from "../../utils/api";
import type { Chat as ChatType, Message } from "../../utils/api";
import sendIcon from "../../assets/send.png";
import "./Chat.css";

type MobileContext = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Chat() {
  const messagesEndRef = useRef<HTMLLIElement>(null);

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
      } catch (error) {
        console.error("Failed to load chats:", error);
        setChatsError("Failed to load chats.");
      } finally {
        setIsLoadingChats(false);
      }
    };

    load();
  }, []);

  // Load messages when a chat is selected
  useEffect(() => {
    if (!activeChatId) {
      return;
    }

    const load = async () => {
      setIsLoadingMessages(true);
      setMessagesError("");

      try {
        const res = await getChat(activeChatId);
        setMessages(res.data?.messages || []);
      } catch (error) {
        console.error("Failed to load messages:", error);
        setMessagesError("Failed to load messages.");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    load();
  }, [activeChatId]);

  // Scroll to the latest message whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

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
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  // Send a message
  const handleSend = async () => {
    const text = input.trim();

    if (!text || !activeChatId || isSending) {
      return;
    }

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
        setMessages((prev) => [
          ...prev.filter((message) => message._id !== userMessage._id),
          ...res.data!,
        ]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);

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
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Open the new chat form
  const handleStartNewChat = () => {
    setIsCreatingChat(true);
    setIsMobileMenuOpen(true);
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
          <p className="chat__sidebar-message">
            Loading…
          </p>
        )}

        {chatsError && (
          <p className="chat__sidebar-message">
            {chatsError}
          </p>
        )}

        <ul className="chat__list">
          {chats.map((chat) => (
            <li
              key={chat._id}
              className={
                chat._id === activeChatId
                  ? "chat__item chat__item_active"
                  : "chat__item"
              }
              onClick={() => {
                setActiveChatId(chat._id);
                setIsMobileMenuOpen(false);
              }}
            >
              {chat.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main chat area */}
      <main className="chat__main">
        {/* Initial state - no chat selected */}
        {!messagesError &&
          !isLoadingMessages &&
          !activeChatId && (
            <div className="chat__no-messages">
              <div className="chat__initial-container">
                <h2>
                  Create a new chat or select an existing one to
                  start the conversation
                </h2>

                <button
                  className="chat__start-button"
                  type="button"
                  onClick={handleStartNewChat}
                >
                  Start a new chat
                </button>
              </div>
            </div>
          )}

        {/* Selected chat with no messages */}
        {!messagesError &&
          !isLoadingMessages &&
          activeChatId &&
          messages.length === 0 && (
            <div className="chat__no-messages">
              <div className="chat__empty-container">
                <h2>
                  Ask a question below to start the conversation
                </h2>

                <div className="chat__empty-input">
                  <textarea
                    className="chat__empty-textarea"
                    placeholder="Ask anything..."
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSending}
                  />

                  <div className="chat__empty-input-container">
                    <div className="chat__empty-icon-frame" />

                    <button
                      className="chat__empty-send"
                      type="button"
                      onClick={handleSend}
                      disabled={!input.trim() || isSending}
                      aria-label="Send message"
                    >
                      <img
                        src={sendIcon}
                        alt="Send message"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Loading messages */}
        {activeChatId && isLoadingMessages && (
          <div className="chat__no-messages">
            <p>Loading messages…</p>
          </div>
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
          !messagesError &&
          messages.length > 0 && (
            <>
              <ul className="chat__messages">
                {messages.map((message) => (
                  <li
                    key={message._id}
                    className={
                      message.role === "user"
                        ? "chat__message chat__message_user"
                        : "chat__message chat__message_assistant"
                    }
                  >
                    {message.role === "assistant" ? (
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </li>
                ))}

                {isSending && (
                  <li className="chat__message chat__message_assistant chat__message_thinking">
                    Thinking…
                  </li>
                )}

                <li ref={messagesEndRef} />
              </ul>

              {/* Input bar */}
              <div className="chat__input-bar">
                <div className="chat__input-wrapper">
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
                    type="button"
                    className="chat__send"
                    onClick={handleSend}
                    disabled={!input.trim() || isSending}
                    aria-label="Send message"
                  >
                    <img
                      src={sendIcon}
                      alt="Send message"
                    />
                  </button>
                </div>
              </div>
            </>
          )}
      </main>
    </div>
  );
}


