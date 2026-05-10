"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type AdminRole = 'ADMIN' | 'TRACKER';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

interface AdminContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTracker: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: AdminRole; error?: string }>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_KEY = "agape-admin-user";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error("Error checking auth:", e);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Error al iniciar sesión' };
      }

      setUser(data);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      return { success: true, role: data.role };
    } catch (e) {
      console.error("Login error:", e);
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
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
    <AdminContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      isTracker: user?.role === 'TRACKER',
      login,
      logout
    }}>
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

export function useRequireAuth(requiredRole?: AdminRole) {
  const { user, isAuthenticated } = useAdmin();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }
    if (requiredRole && user?.role !== requiredRole) {
      if (user?.role === 'TRACKER') {
        router.push("/tracking");
      } else {
        router.push("/admin");
      }
    }
  }, [isClient, isAuthenticated, requiredRole, user, router]);

  return isClient && isAuthenticated && (!requiredRole || user?.role === requiredRole);
}
