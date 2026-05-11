"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Calendar,
  User,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { logout } from "@/lib/auth";
import { type Student } from "@/lib/mock-students";
import { getUnreadCount } from "@/lib/mock-messages";
import { ADMIN_PORTAL_URL } from "@/lib/config";
import { CRFlag } from "@/components/ui/cr-flag";

interface SidebarProps {
  student: Student;
}

const navItems = [
  { label: "Mi Beca", href: "/dashboard", icon: LayoutDashboard },
  { label: "Documentos", href: "/dashboard/documentos", icon: FileText },
  { label: "Mensajes", href: "/dashboard/mensajes", icon: MessageSquare },
  { label: "Calendario", href: "/dashboard/calendario", icon: Calendar },
  { label: "Perfil", href: "/dashboard/perfil", icon: User },
];

export default function Sidebar({ student }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const unread = getUnreadCount(student.id);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = student.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200/60 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-200/60">
        <Link href="/" className="flex items-center gap-2.5 group">
          <CRFlag width={38} />
          <div>
            <span className="font-semibold text-[#0B2A5B] text-sm tracking-tight">Costa Rica Becas</span>
            <p className="text-[10px] text-slate-400 leading-none -mt-0.5">Portal Estudiantil</p>
          </div>
        </Link>
      </div>

      {/* Student avatar */}
      <div className="px-4 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B2A5B] to-[#2563EB] flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-sm font-bold text-white">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{student.name.split(" ").slice(0, 2).join(" ")}</p>
            <p className="text-xs text-slate-400 truncate">{student.faculty} · {student.carne}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[#0B2A5B]/8 text-[#0B2A5B]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#0B2A5B] rounded-full"
                />
              )}
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#0B2A5B]" : "text-slate-400 group-hover:text-slate-600"}`} />
              <span>{item.label}</span>
              {item.label === "Mensajes" && unread > 0 && (
                <span className="ml-auto min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1">
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-slate-100 space-y-1">
        <a
          href={ADMIN_PORTAL_URL}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Portal Administrativo</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

