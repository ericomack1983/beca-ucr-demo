"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { MOCK_STUDENTS } from "@/lib/mock-students";
import {
  getMessagesByStudentId,
  type Message,
  type Sender,
} from "@/lib/mock-messages";
import { formatRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type FilterType = "all" | "unread" | "ucr" | "issuer" | "action";

export default function MensajesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState("");
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    getSession().then(session => {
      if (!session) return;
      const mockId = (MOCK_STUDENTS.find(s => s.email === session.email) ?? MOCK_STUDENTS[0]).id;
      setMessages(getMessagesByStudentId(mockId));
    });
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const filtered = getFiltered();
      const idx = filtered.findIndex((m) => m.id === selected?.id);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = filtered[idx + 1];
        if (next) openMessage(next);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = filtered[idx - 1];
        if (prev) openMessage(prev);
      }
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const getFiltered = useCallback(() => {
    return messages
      .filter((m) => {
        if (filter === "unread") return m.status === "unread";
        if (filter === "ucr") return m.sender === "ucr";
        if (filter === "issuer") return m.sender === "issuer";
        if (filter === "action") return m.category === "action_required";
        return true;
      })
      .filter((m) =>
        search
          ? m.subject.toLowerCase().includes(search.toLowerCase()) ||
            m.preview.toLowerCase().includes(search.toLowerCase())
          : true
      );
  }, [messages, filter, search]);

  const openMessage = (msg: Message) => {
    setSelected(msg);
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, status: "read" } : m))
    );
    setShowList(false);
  };

  const filtered = getFiltered();
  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200/60 bg-white flex items-center gap-4 shrink-0">
        <div>
          <h1 className="text-lg font-bold text-[#0B2A5B] tracking-tight">Mensajes</h1>
          <p className="text-xs text-slate-500">
            {unreadCount > 0 ? `${unreadCount} sin leer` : "Al día"}
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Message list — desktop always visible, mobile shows when showList */}
        <div
          className={`w-full md:w-[360px] border-r border-slate-200/60 bg-white flex flex-col shrink-0 ${
            !showList ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Filters */}
          <div className="px-4 py-3 border-b border-slate-100 space-y-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar mensajes... ⌘K"
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(["all", "unread", "ucr", "issuer", "action"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                    filter === f
                      ? "bg-[#0B2A5B] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f === "all" ? "Todos" :
                   f === "unread" ? "No leídos" :
                   f === "ucr" ? "UCR" :
                   f === "issuer" ? "Issuer" :
                   "Acción requerida"}
                </button>
              ))}
            </div>
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">Sin resultados</p>
              </div>
            ) : (
              filtered.map((msg) => (
                <MessageListItem
                  key={msg.id}
                  msg={msg}
                  isSelected={selected?.id === msg.id}
                  onClick={() => openMessage(msg)}
                />
              ))
            )}
          </div>
        </div>

        {/* Detail pane */}
        <div
          className={`flex-1 flex flex-col bg-[#F8F9FB] overflow-hidden ${
            showList && !selected ? "hidden md:flex" : "flex"
          }`}
        >
          {!selected ? (
            <EmptyDetail />
          ) : (
            <MessageDetail
              msg={selected}
              replyText={replyText}
              onReplyChange={setReplyText}
              onBack={() => setShowList(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SenderAvatar({ sender }: { sender: Sender }) {
  if (sender === "ucr") {
    return (
      <div className="w-9 h-9 rounded-full bg-[#0B2A5B] flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
          <path d="M11 2L4 5.5V11.5C4 15.2 7.2 18.8 11 20C14.8 18.8 18 15.2 18 11.5V5.5L11 2Z" fill="white" fillOpacity="0.9" />
          <path d="M11 5L7 7.2V10.8C7 13.1 8.8 15.3 11 16C13.2 15.3 15 10.8 15 10.8V7.2L11 5Z" fill="#0B2A5B" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
      <span className="text-white text-xs font-bold">I</span>
    </div>
  );
}

function MessageListItem({
  msg,
  isSelected,
  onClick,
}: {
  msg: Message;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 flex items-start gap-3 border-b border-slate-100 transition-colors ${
        isSelected ? "bg-[#0B2A5B]/5" : "hover:bg-slate-50"
      }`}
    >
      <SenderAvatar sender={msg.sender} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`text-xs font-semibold truncate ${
            msg.sender === "issuer" ? "text-amber-700" : "text-[#0B2A5B]"
          }`}>
            {msg.senderName}
          </span>
          {msg.sender === "issuer" && (
            <Badge variant="issuer" className="text-[9px] py-0">Externa</Badge>
          )}
        </div>
        <p className={`text-sm truncate ${msg.status === "unread" ? "font-semibold text-slate-900" : "text-slate-700"}`}>
          {msg.subject}
        </p>
        <p className="text-xs text-slate-400 truncate mt-0.5">{msg.preview}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-slate-400">{formatRelativeTime(msg.timestamp)}</span>
          {msg.category === "action_required" && (
            <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
              Acción requerida
            </span>
          )}
        </div>
      </div>
      {msg.status === "unread" && (
        <div className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0 mt-1.5" />
      )}
    </motion.button>
  );
}

function MessageDetail({
  msg,
  replyText,
  onReplyChange,
  onBack,
}: {
  msg: Message;
  replyText: string;
  onReplyChange: (s: string) => void;
  onBack: () => void;
}) {
  const bodyLines = msg.body.split("\n");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200/60 shrink-0">
        <button
          onClick={onBack}
          className="md:hidden flex items-center gap-1 text-sm text-slate-500 mb-3 hover:text-[#0B2A5B]"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <div className="flex items-start gap-3">
          <SenderAvatar sender={msg.sender} />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm font-semibold ${
                msg.sender === "issuer" ? "text-amber-800" : "text-[#0B2A5B]"
              }`}>
                {msg.senderName}
              </span>
              {msg.sender === "issuer" && (
                <Badge variant="issuer">Entidad externa</Badge>
              )}
              {msg.sender === "ucr" && (
                <Badge variant="ucr">UCR</Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {msg.senderEmail} · {formatRelativeTime(msg.timestamp)}
            </p>
          </div>
        </div>
        <h2 className="text-xl font-bold text-[#0B2A5B] mt-3 tracking-tight font-serif-editorial">
          {msg.subject}
        </h2>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl space-y-3">
          <div className="prose prose-sm prose-slate max-w-none">
            {bodyLines.map((line, i) => {
              if (!line.trim()) return <br key={i} />;
              if (line.startsWith("---")) {
                return <hr key={i} className="border-slate-200" />;
              }
              if (line.startsWith("**") && line.endsWith("**") && !line.slice(2, -2).includes("**")) {
                return (
                  <p key={i} className="font-bold text-slate-800">
                    {line.slice(2, -2)}
                  </p>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={i} className="ml-4 text-slate-700">
                    {formatInline(line.slice(2))}
                  </li>
                );
              }
              if (line.startsWith("> ")) {
                return (
                  <blockquote key={i} className="border-l-4 border-slate-200 pl-4 italic text-slate-600 bg-slate-50 py-2 rounded-r-lg">
                    {formatInline(line.slice(2))}
                  </blockquote>
                );
              }
              return (
                <p key={i} className="text-slate-700 leading-relaxed">
                  {formatInline(line)}
                </p>
              );
            })}
          </div>

          <div className="pt-4 text-xs text-slate-400 italic border-t border-slate-100">
            {msg.sender === "issuer"
              ? "— Equipo de Evaluación, Issuer Risk Services"
              : "— Oficina de Becas, Universidad de Costa Rica"}
          </div>

          {/* Action chips */}
          {msg.actionChip && (
            <div className="flex gap-2 pt-2">
              <Link href={msg.actionChip.href}>
                <Button size="sm" variant="secondary" className="rounded-full">
                  {msg.actionChip.label} <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Reply composer — only for UCR messages */}
      {msg.sender === "ucr" && (
        <div className="px-6 py-4 bg-white border-t border-slate-200/60 shrink-0">
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={(e) => onReplyChange(e.target.value)}
                placeholder="Escribir respuesta..."
                rows={2}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              />
            </div>
            <Button size="sm" disabled={!replyText.trim()} className="shrink-0 rounded-xl self-end">
              Enviar
            </Button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            Los mensajes de Issuer son de solo lectura
          </p>
        </div>
      )}

      {msg.sender === "issuer" && (
        <div className="px-6 py-3 bg-amber-50 border-t border-amber-100 shrink-0">
          <p className="text-xs text-amber-700">
            Este mensaje proviene de <strong>Issuer Risk Services</strong>, una entidad
            externa. No es posible responder directamente. Para consultas, contacte la
            Oficina de Becas UCR.
          </p>
        </div>
      )}
    </div>
  );
}

function EmptyDetail() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center p-8">
      <div className="w-16 h-16 opacity-10">
        <svg viewBox="0 0 100 120" fill="none">
          <path d="M50 5L10 24V58C10 82 28 102 50 108C72 102 90 82 90 58V24L50 5Z" fill="#0B2A5B" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">Selecciona un mensaje</p>
        <p className="text-xs text-slate-400 mt-1">Usa ↑↓ para navegar, Enter para abrir</p>
      </div>
    </div>
  );
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
