"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, type Session } from "@/lib/auth";
import { MOCK_STUDENTS, type Student } from "@/lib/mock-students";

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    if (!s && requireAuth) {
      router.replace("/login");
      return;
    }
    if (s) {
      setSession(s);
      const stu = MOCK_STUDENTS.find((st) => st.id === s.studentId) || null;
      setStudent(stu);
    }
    setLoading(false);
  }, [router, requireAuth]);

  return { session, student, loading };
}
