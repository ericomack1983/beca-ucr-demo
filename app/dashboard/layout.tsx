"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { getSession } from "@/lib/auth";
import { MOCK_STUDENTS, type Student } from "@/lib/mock-students";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then(session => {
      if (!session) { router.replace("/login"); return; }
      const stu = MOCK_STUDENTS.find(s => s.email === session.email)
               ?? MOCK_STUDENTS[0];
      setStudent(stu);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#0B2A5B]/20 border-t-[#0B2A5B] rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Cargando portal...</p>
        </div>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="flex min-h-screen bg-[#F8F9FB]">
      <Sidebar student={student} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
