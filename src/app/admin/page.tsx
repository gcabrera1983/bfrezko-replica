"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdminDashboardContent from "./AdminDashboardContent";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isTracker } = useAdmin();

  useEffect(() => {
    if (isAuthenticated && isTracker) {
      router.push("/tracking");
    }
  }, [isAuthenticated, isTracker, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF9F3]">
        <p className="font-cormorant text-[#6B4423]">Redirigiendo...</p>
      </div>
    );
  }

  if (isTracker) return null;

  return (
    <ErrorBoundary>
      <AdminDashboardContent />
    </ErrorBoundary>
  );
}
