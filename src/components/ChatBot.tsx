import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Loader2, User, Bot, TrendingUp } from "lucide-react";
import { getChatResponse } from "../services/geminiService";
import ReactMarkdown from "react-markdown";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: "user" | "model";
  text: string;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hi! I'm your Ranchi Foodie Growth Assistant. Looking to grow your restaurant in Ranchi? Ask me anything about our digital marketing services!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend || isLoading) return;

    if (!customMessage) setInput("");
    setMessages((prev) => [...prev, { role: "user", text: messageToSend }]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const response = await getChatResponse(messageToSend, history);
      setMessages((prev) => [...prev, { role: "model", text: response }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Sorry, I'm having some trouble right now. Please try again later!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[400px] h-[600px] max-w-[calc(100vw-2rem)] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-brand-green/5"
          >
            {/* Header */}
            <div className="bg-brand-green p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-brand-green">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg">Growth Assistant</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-60">Online & Ready</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-brand-cream/30">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.role === "user" ? "bg-brand-accent text-brand-green" : "bg-brand-green text-white"
                    )}
                  >
                    {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                      message.role === "user"
                        ? "bg-brand-accent text-brand-green rounded-tr-none"
                        : "bg-white text-brand-green shadow-sm rounded-tl-none border border-brand-green/5"
                    )}
                  >
                    <div className="prose prose-sm prose-brand max-w-none">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-brand-green/5">
                    <Loader2 size={16} className="animate-spin text-brand-accent" />
                  </div>
                </div>
              )}
              
              {/* Quick Actions */}
              {!isLoading && messages.length === 1 && (
                <div className="flex flex-col gap-3 pt-4">
                  <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Quick Start</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "I'm a New Restaurant",
                      "I'm an Established Restaurant",
                      "My Instagram is Stagnant",
                      "My Google Maps isn't Ranking",
                      "Get a Free Audit"
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="text-xs bg-white border border-brand-green/10 px-4 py-2 rounded-full hover:bg-brand-accent hover:text-brand-green transition-all shadow-sm font-medium"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-brand-green/5">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about growing your restaurant..."
                  className="w-full bg-brand-cream/50 border-none rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-brand-accent transition-all"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 w-10 h-10 bg-brand-green text-brand-accent rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-brand-green text-brand-accent rounded-full shadow-2xl flex items-center justify-center relative group"
      >
        <div className="absolute inset-0 bg-brand-accent rounded-full scale-0 group-hover:scale-110 opacity-20 transition-transform duration-500" />
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>
    </div>
  );
};
