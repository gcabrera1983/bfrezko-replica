"use client";

import { useEffect, useState } from "react";

export default function GlobalErrorCatcher() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("[GlobalErrorCatcher]", event.error);
      setError(event.error?.stack || event.message || "Error desconocido");
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error("[GlobalErrorCatcher] Unhandled rejection:", event.reason);
      const reason = event.reason;
      const msg = reason?.stack || reason?.message || String(reason);
      setError(msg);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  if (!error) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-red-50 p-6 overflow-auto font-mono text-red-900">
      <h1 className="text-2xl font-bold mb-4">Error de Cliente Detectado</h1>
      <p className="mb-4 whitespace-pre-wrap text-sm">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Recargar página
      </button>
    </div>
  );
}
