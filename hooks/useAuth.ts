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
    getSession().then(s => {
      if (!s && requireAuth) {
        router.replace("/login");
        return;
      }
      if (s) {
        setSession(s);
        const stu = MOCK_STUDENTS.find(st => st.email === s.email) ?? MOCK_STUDENTS[0];
        setStudent(stu);
      }
      setLoading(false);
    });
  }, [router, requireAuth]);

  return { session, student, loading };
}
