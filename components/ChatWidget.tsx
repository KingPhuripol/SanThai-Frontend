"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";
import { chatApi } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

let globalSessionId = "";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        'สวัสดีครับ ผมคือสานไทย 👋 ช่วยแนะนำลายผ้าไทยให้คุณได้เลย ลองถามเช่น "ลายผ้าเหมาะสำหรับงานแต่งงาน" หรือ "ผ้าไหมจากอีสานมีอะไรบ้าง?"',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!globalSessionId) {
      globalSessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    }
  }, []);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: ChatMessage = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await chatApi.send(text, globalSessionId);
      globalSessionId = res.session_id;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-900 text-white shadow-lg hover:bg-gold-600 transition-all duration-200 flex items-center justify-center"
        aria-label="เปิด chatbot"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-amber-100 flex flex-col overflow-hidden"
          style={{ maxHeight: "70vh" }}
        >
          {/* Header */}
          <div className="bg-brand-900 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center">
              <Bot size={18} className="text-brand-900" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">สานไทยสนทนา</p>
              <p className="text-amber-200 text-xs">ผู้เชี่ยวชาญผ้าไทย AI</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-stone-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-brand-900 text-white rounded-tr-sm"
                      : "bg-white text-brand-900 border border-amber-100 rounded-tl-sm shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-amber-100 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-brand-400 flex items-center gap-2 shadow-sm">
                  <Loader2 size={14} className="animate-spin" />
                  กำลังคิด…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-3 pt-2 pb-1 flex gap-2 overflow-x-auto scrollbar-none bg-white border-t border-amber-50">
            {["งานแต่งงาน", "ผ้าไหมอีสาน", "ลายสมัยใหม่"].map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setInput(prompt);
                }}
                className="shrink-0 text-xs px-2.5 py-1 rounded-full border border-gold-400 text-gold-700 hover:bg-gold-50 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-2 flex gap-2 bg-white border-t border-amber-100">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="พิมพ์คำถามได้เลย…"
              className="flex-1 text-sm px-3 py-2 rounded-full border border-amber-200 bg-stone-50 focus:outline-none focus:border-gold-400 placeholder-brand-300"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-full bg-brand-900 text-white flex items-center justify-center hover:bg-gold-600 disabled:opacity-40 transition-all"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
