"use client";
import "./chabot.css";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getResponseAi } from "@/app/api/chatbot/route";

interface Tour {
  id: number;
  name: string;
  priceAdult: number;
  priceChild: number;
  duration: number;
  transport: string;
  tourType?: string;
}

interface Message {
  from: "user" | "bot";
  text: string;
  tours?: Tour[];
}

export default function ChatBotWidget() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null); // Track session for conversation history
  const [recommendedTours, setRecommendedTours] = useState<Tour[]>([]); // Store recommended tours
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function handleSend() {
    if (input.trim() === "" || loading) return;

    setLoading(true);

    // Add user message to chat
    const userMessage: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");

    try {
      // Call backend API with sessionId to maintain conversation history
      const response = await getResponseAi(
        currentInput,
        sessionId,
        null // User not logged in
      );

      const data = response.data;

      // Save sessionId for future messages
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      // Save recommended tours
      if (data.recommendedTours && data.recommendedTours.length > 0) {
        setRecommendedTours(data.recommendedTours);
      }

      // Add bot response to chat
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: data.message, tours: data.recommendedTours },
      ]);
    } catch (error: any) {
      console.error("Error details:", error);
      console.error("Response data:", error?.response?.data);
      console.error("Request config:", error?.config);

      let errorMessage = "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.";

      // Show more specific error if available
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = `Lỗi: ${error.message}`;
      }

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white w-96 h-[600px] shadow-xl rounded-2xl flex flex-col border"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b bg-blue-500 text-white rounded-t-2xl">
              <h2 className="font-semibold flex items-center gap-2">
                <MessageCircle size={20} />
                Travel Assistant
              </h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Don't clear messages and sessionId - keep conversation
                }}
                className="hover:bg-blue-600 rounded-full p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <MessageCircle
                    size={48}
                    className="mx-auto mb-2 opacity-50"
                  />
                  <p>Xin chào! Tôi có thể giúp bạn tìm tour du lịch phù hợp.</p>
                  <p className="text-sm mt-2">
                    Hãy cho tôi biết bạn muốn đi đâu, bao nhiêu ngày và ngân
                    sách của bạn.
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i}>
                  {msg.from === "user" ? (
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[75%]">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[85%]">
                        <p style={{ whiteSpace: "pre-line" }}>{msg.text}</p>

                        {/* Display recommended tours */}
                        {msg.tours && msg.tours.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {msg.tours.map((tour) => (
                              <div
                                key={tour.id}
                                className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md
  transition-shadow"
                              >
                                <h4 className="font-semibold text-blue-600 mb-1">
                                  {tour.name}
                                </h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p>
                                    💰 Người lớn: {formatPrice(tour.priceAdult)}
                                  </p>
                                  <p>
                                    👶 Trẻ em: {formatPrice(tour.priceChild)}
                                  </p>
                                  <p>⏱️ Thời gian: {tour.duration} ngày</p>
                                  <p>🚗 Phương tiện: {tour.transport}</p>
                                  {tour.tourType && (
                                    <p>📍 Loại tour: {tour.tourType}</p>
                                  )}
                                </div>
                                <a
                                  href={`/${tour.id}`}
                                  className="inline-block mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded
  hover:bg-blue-600"
                                >
                                  Xem chi tiết →
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} />

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2
  focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || input.trim() === ""}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50
  disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
              {sessionId && (
                <button
                  onClick={() => {
                    setMessages([]);
                    setSessionId(null);
                    setRecommendedTours([]);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 mt-2"
                >
                  Bắt đầu cuộc trò chuyện mới
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center
  hover:bg-blue-600 transition-colors"
        >
          <MessageCircle size={28} />
        </motion.button>
      )}
    </div>
  );
}
