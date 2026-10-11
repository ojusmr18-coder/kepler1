"use client";

import * as React from "react";
import { ClassroomDashboard } from "@/components/ClassroomDashboard";
import { useRouter } from "next/navigation";
import { apiClient } from "@/services/apiClient";
import { StudentProfile } from "@/types/api";

export default function DashboardRoute() {
  const router = useRouter();
  const [student, setStudent] = React.useState<StudentProfile>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("current_student");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // ignore
        }
      }
    }
    return {
      id: "1",
      name: "Ojus",
      email: "ojus@kepler.edu",
      role: "student",
      grade: "Grade 10",
      school: "Kepler International Academy",
      targetExam: "CBSE Class 10 Board Exam",
    };
  });

  React.useEffect(() => {
    let isMounted = true;
    async function syncStudent() {
      try {
        const me = await apiClient.auth.getMe();
        if (isMounted && me && me.name) {
          setStudent(me);
        }
      } catch {
        // Keep cached state
      }
    }
    syncStudent();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ClassroomDashboard
      studentName={student.name || "Ojus"}
      studentId={student.id || "1"}
      onSignOut={() => router.push("/")}
      onOpenDoubtSolver={() => router.push("/ask")}
    />
  );
}
