"use client";

import { useEffect, useRef, useState } from "react";

export default function GlobalErrorCatcher() {
  const [errorCount, setErrorCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("[GlobalErrorCatcher]", event.error);
      if (!hasLoggedRef.current) {
        hasLoggedRef.current = true;
        // Solo loguear el primer error detallado para evitar spam
        const msg = event.error?.stack || event.message || "Error desconocido";
        setLastError(msg);
      }
      setErrorCount((prev) => prev + 1);
      setShowToast(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShowToast(false), 5000);
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error("[GlobalErrorCatcher] Unhandled rejection:", event.reason);
      if (!hasLoggedRef.current) {
        hasLoggedRef.current = true;
        const reason = event.reason;
        const msg = reason?.stack || reason?.message || String(reason);
        setLastError(msg);
      }
      setErrorCount((prev) => prev + 1);
      setShowToast(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShowToast(false), 5000);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!showToast || errorCount === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-md w-full">
      <div className="bg-red-600 text-white rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-sm">
              {errorCount > 1 ? `${errorCount} errores detectados` : "Error detectado"}
            </p>
            <p className="text-xs text-red-100 mt-1 line-clamp-3">
              {lastError || "Revisa la consola (F12) para más detalles."}
            </p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-red-200 hover:text-white text-lg leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="text-xs bg-white text-red-600 px-3 py-1.5 rounded font-medium hover:bg-red-50 transition-colors"
          >
            Recargar página
          </button>
          <button
            onClick={() => setShowToast(false)}
            className="text-xs bg-red-700 text-white px-3 py-1.5 rounded font-medium hover:bg-red-800 transition-colors"
          >
            Ignorar
          </button>
        </div>
      </div>
    </div>
  );
}
