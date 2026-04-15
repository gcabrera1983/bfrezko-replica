import ErrorBoundary from "@/components/ErrorBoundary";
import AdminDashboardContent from "./AdminDashboardContent";

export default function AdminDashboardPage() {
  return (
    <ErrorBoundary>
      <AdminDashboardContent />
    </ErrorBoundary>
  );
}
