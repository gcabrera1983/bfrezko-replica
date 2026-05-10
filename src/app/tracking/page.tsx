"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { fetchOrders, updateOrder } from "@/lib/api";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  LogOut,
  Package,
  Search,
  Loader2,
  ChevronDown,
  Save,
  X,
  Truck,
  CheckCircle2
} from "lucide-react";

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  PROCESSING: "En preparación",
  READY: "Listo para envío",
  SHIPPED: "Enviado",
  IN_TRANSIT: "En tránsito",
  OUT_FOR_DELIVERY: "En reparto",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-[#889E81]/20 text-[#889E81]",
  PROCESSING: "bg-blue-100 text-blue-700",
  READY: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  IN_TRANSIT: "bg-indigo-100 text-indigo-700",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

export default function TrackingPage() {
  const router = useRouter();
  const { isAuthenticated, isTracker, user, logout } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status'] | "">("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/tracking/login");
      return;
    }
    loadOrders();
  }, [isAuthenticated, loadOrders, router]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredOrders(orders);
      return;
    }
    const term = search.toLowerCase();
    setFilteredOrders(
      orders.filter(
        (o) =>
          o.id.toLowerCase().includes(term) ||
          o.id.slice(-8).toLowerCase().includes(term) ||
          o.customerEmail.toLowerCase().includes(term) ||
          o.customerName.toLowerCase().includes(term)
      )
    );
  }, [search, orders]);

  const handleUpdateStatus = async (orderId: string) => {
    if (!newStatus) return;
    setSaving(true);
    try {
      await updateOrder(orderId, { status: newStatus as Order['status'] });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o))
      );
      setEditingOrder(null);
      setSuccessMsg("Estado actualizado correctamente");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Error al actualizar el estado");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/tracking/login");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF9F3]">
        <p className="font-cormorant text-[#6B4423]">Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF9F3]">
      {/* Header */}
      <header className="bg-[#889E81] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6" />
              <div>
                <h1 className="font-cinzel text-xl tracking-wide">Rastreo de Pedidos</h1>
                <p className="font-cormorant text-sm text-white/70">
                  {user?.name} • {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-white/30 rounded hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-cormorant text-sm hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B4423]/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por orden, email o nombre..."
              className="w-full pl-10 pr-4 py-3 border border-[#6B4423]/20 font-cormorant bg-white focus:outline-none focus:border-[#6B4423]"
            />
          </div>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-cormorant text-green-700">{successMsg}</span>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-[#6B4423]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#6B4423]/10 flex items-center justify-between">
            <h2 className="font-cinzel text-lg text-[#6B4423]">Órdenes</h2>
            {loading && <Loader2 className="w-5 h-5 animate-spin text-[#6B4423]" />}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F6D3B3]/20">
                <tr>
                  <th className="px-4 py-3 text-left font-cinzel text-sm text-[#6B4423]">Orden</th>
                  <th className="px-4 py-3 text-left font-cinzel text-sm text-[#6B4423]">Cliente</th>
                  <th className="px-4 py-3 text-left font-cinzel text-sm text-[#6B4423]">Total</th>
                  <th className="px-4 py-3 text-left font-cinzel text-sm text-[#6B4423]">Estado</th>
                  <th className="px-4 py-3 text-left font-cinzel text-sm text-[#6B4423]">Fecha</th>
                  <th className="px-4 py-3 text-right font-cinzel text-sm text-[#6B4423]">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#6B4423]/10">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F6D3B3]/10 transition-colors">
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm text-[#6B4423]">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-cormorant text-sm text-[#6B4423]">{order.customerName}</p>
                      <p className="font-cormorant text-xs text-[#6B4423]/60">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-cormorant text-[#6B4423]">
                        {formatPrice(Number(order.total) + Number(order.shippingCost || 0))}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      {editingOrder === order.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as Order['status'])}
                            className="px-2 py-1 border border-[#6B4423]/20 font-cormorant text-sm bg-white"
                          >
                            {Object.entries(statusLabels).map(([key, label]) => (
                              <option key={key} value={key}>{label}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className={`px-2 py-1 text-xs font-cinzel rounded ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-cormorant text-sm text-[#6B4423]/70">
                        {new Date(order.createdAt).toLocaleDateString("es-GT")}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {editingOrder === order.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStatus(order.id)}
                            disabled={saving || !newStatus}
                            className="p-2 bg-[#889E81] text-white rounded hover:bg-[#889E81]/90 disabled:opacity-50"
                            title="Guardar"
                          >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => {
                              setEditingOrder(null);
                              setNewStatus("");
                            }}
                            className="p-2 bg-[#6B4423]/20 text-[#6B4423] rounded hover:bg-[#6B4423]/30"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingOrder(order.id);
                            setNewStatus(order.status);
                          }}
                          className="px-3 py-1.5 bg-[#6B4423] text-[#F6D3B3] font-cinzel text-xs uppercase tracking-wider rounded hover:bg-[#6B4423]/90 transition-colors"
                        >
                          Cambiar Estado
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-[#6B4423]/20 mx-auto mb-4" />
              <p className="font-cormorant text-[#6B4423]/60">
                {search ? "No se encontraron órdenes" : "No hay órdenes aún"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
