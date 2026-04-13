"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Credenciales simples (en producción esto debería estar en un backend)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "agape2024";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si ya está logueado al cargar (solo en cliente)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const auth = localStorage.getItem("agape-admin-auth");
        if (auth === "true") {
          setIsAuthenticated(true);
        }
      }
    } catch (e) {
      console.error("Error checking auth:", e);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("agape-admin-auth", "true");
        }
      } catch (e) {
        console.error("Error saving auth:", e);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("agape-admin-auth");
      }
    } catch (e) {
      console.error("Error removing auth:", e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF9F3]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F6D3B3] border-t-[#6B4423] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-cormorant text-[#6B4423]">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}

// Hook para proteger rutas admin
export function useRequireAuth() {
  const { isAuthenticated } = useAdmin();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isClient, isAuthenticated, router]);

  return isClient && isAuthenticated;
}
