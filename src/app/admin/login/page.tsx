"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import Logo from "@/components/Logo";
import { Eye, EyeOff, Lock, User } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    router.push("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(username, password);
    
    if (success) {
      router.push("/admin");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo variant="light" size="lg" showTagline />
          <h1 className="font-cinzel text-2xl text-[#F6D3B3] mt-6 mb-2">
            Panel de Administración
          </h1>
          <p className="font-cormorant text-[#F6D3B3]/60">
            Ágape Studio
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[#FDF9F3] rounded-lg p-8">
          <h2 className="font-cinzel text-xl text-[#6B4423] mb-6 text-center">
            Iniciar Sesión
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 font-cormorant text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-cinzel text-sm text-[#6B4423] mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B4423]/40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#6B4423]/20 font-cormorant text-[#1A1A1A] focus:outline-none focus:border-[#6B4423] transition-colors"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-cinzel text-sm text-[#6B4423] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B4423]/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-[#6B4423]/20 font-cormorant text-[#1A1A1A] focus:outline-none focus:border-[#6B4423] transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B4423]/40 hover:text-[#6B4423] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#6B4423] text-[#F6D3B3] font-cinzel uppercase tracking-wider hover:bg-[#6B4423]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="font-cormorant text-sm text-[#6B4423]/60 hover:text-[#6B4423] transition-colors">
              ← Volver a la tienda
            </a>
          </div>
        </div>

        {/* Info */}
        <p className="text-center font-cormorant text-xs text-[#F6D3B3]/40 mt-6">
          Acceso exclusivo para administradores de Ágape Studio
        </p>
      </div>
    </div>
  );
}
