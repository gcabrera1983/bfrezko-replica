"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { useProducts } from "@/context/ProductsContext";
import Link from "next/link";
import { Package, ShoppingBag, TrendingUp, Eye, Plus, Edit, Trash2, LogOut, Images, Loader2, Users, UserPlus, X } from "lucide-react";
import AdminProductImage from "@/components/admin/AdminProductImage";
import { fetchOrders } from "@/lib/api";
import { Order } from "@/types";
import { toFixedSafe, toNumberSafe } from "@/lib/utils";

interface TrackerUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export default function AdminDashboardContent() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAdmin();
  const { products, deleteProduct, isLoading: productsLoading, refreshProducts } = useProducts();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');
  const [trackerUsers, setTrackerUsers] = useState<TrackerUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '' });
  const [userFormError, setUserFormError] = useState('');

  const loadOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const loadTrackerUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const res = await fetch('/api/admin/users?role=TRACKER');
      if (res.ok) {
        const data = await res.json();
        setTrackerUsers(data);
      }
    } catch (error) {
      console.error("Error loading tracker users:", error);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshProducts();
      loadOrders();
      loadTrackerUsers();
    }
  }, [isAuthenticated, refreshProducts, loadOrders, loadTrackerUsers]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF9F3]">
        <p className="font-cormorant text-[#6B4423]">Redirigiendo...</p>
      </div>
    );
  }

  const stats = [
    { label: "Productos", value: products.length, icon: Package, color: "bg-[#6B4423]" },
    { label: "Órdenes", value: orders.length, icon: ShoppingBag, color: "bg-[#889E81]" },
    { label: "Nuevos", value: products.filter(p => p.isNew).length, icon: TrendingUp, color: "bg-[#F6D3B3]" },
    { label: "Bestsellers", value: products.filter(p => p.isBestseller).length, icon: Eye, color: "bg-[#FFE4EE]" },
  ];

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar "${name}"?`)) {
      try {
        await deleteProduct(id);
      } catch (error) {
        alert("Error al eliminar el producto");
      }
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, role: 'TRACKER' })
      });
      const data = await res.json();
      if (!res.ok) {
        setUserFormError(data.error || 'Error al crear usuario');
        return;
      }
      setTrackerUsers(prev => [data, ...prev]);
      setShowUserForm(false);
      setNewUser({ email: '', password: '', name: '' });
    } catch (err) {
      setUserFormError('Error de conexión');
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (confirm(`¿Eliminar usuario "${name}"?`)) {
      try {
        const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setTrackerUsers(prev => prev.filter(u => u.id !== id));
        } else {
          const data = await res.json();
          alert(data.error || 'Error al eliminar');
        }
      } catch (err) {
        alert('Error de conexión');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F3]">
      {/* Admin Header */}
      <header className="bg-[#6B4423] text-[#F6D3B3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-cinzel text-2xl tracking-wide">Panel de Administración</h1>
              <p className="font-cormorant text-sm text-[#F6D3B3]/70">Ágape Studio</p>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="/" 
                target="_blank"
                className="font-cormorant text-sm text-[#F6D3B3]/80 hover:text-[#F6D3B3] transition-colors"
              >
                Ver tienda →
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border border-[#F6D3B3]/30 rounded hover:bg-[#F6D3B3]/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-cormorant text-sm hidden sm:inline">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-lg border border-[#6B4423]/10">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color === "bg-[#F6D3B3]" || stat.color === "bg-[#FFE4EE]" ? "text-[#6B4423]" : "text-white"}`} />
              </div>
              <p className="font-cinzel text-2xl text-[#6B4423]">{stat.value}</p>
              <p className="font-cormorant text-sm text-[#6B4423]/60">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#6B4423]/10">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-cinzel text-sm border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-[#6B4423] text-[#6B4423]'
                : 'border-transparent text-[#6B4423]/50 hover:text-[#6B4423]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Productos
            </span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-cinzel text-sm border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-[#6B4423] text-[#6B4423]'
                : 'border-transparent text-[#6B4423]/50 hover:text-[#6B4423]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuarios de Tracking
            </span>
          </button>
        </div>

        {activeTab === 'products' && (
          <>
            {/* Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href="/admin/productos/nuevo"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#6B4423] text-[#F6D3B3] font-cinzel uppercase tracking-wider hover:bg-[#6B4423]/90 transition-colors rounded-lg"
              >
                <Plus className="w-5 h-5" />
                Nuevo Producto
              </Link>
            </div>

            {/* Products Table */}
        <div className="bg-white rounded-lg border border-[#6B4423]/10 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#6B4423]/10 flex items-center justify-between">
            <h2 className="font-cinzel text-xl text-[#6B4423]">Productos</h2>
            {productsLoading && <Loader2 className="w-5 h-5 animate-spin text-[#6B4423]" />}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F6D3B3]/20">
                <tr>
                  <th className="px-6 py-3 text-left font-cinzel text-sm text-[#6B4423]">Producto</th>
                  <th className="px-6 py-3 text-left font-cinzel text-sm text-[#6B4423]">Precio</th>
                  <th className="px-6 py-3 text-left font-cinzel text-sm text-[#6B4423]">Categoría</th>
                  <th className="px-6 py-3 text-left font-cinzel text-sm text-[#6B4423]">Estado</th>
                  <th className="px-6 py-3 text-right font-cinzel text-sm text-[#6B4423]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#6B4423]/10">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F6D3B3]/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <AdminProductImage
                            src={product.image}
                            alt={product.name}
                            size="small"
                          />
                          {(product.images?.length || 0) > 1 && (
                            <div className="absolute -top-1 -right-1 bg-[#6B4423] text-[#F6D3B3] rounded-full w-5 h-5 flex items-center justify-center">
                              <Images className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-cinzel text-sm text-[#6B4423]">{product.name}</p>
                          <p className="font-cormorant text-xs text-[#6B4423]/60">{product.id}</p>
                          {(product.images?.length || 0) > 1 && (
                            <p className="font-cormorant text-xs text-[#889E81]">
                              {product.images?.length} fotos
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-cormorant text-[#1A1A1A]">Q{toFixedSafe(product.price)}</p>
                      {product.originalPrice && (
                        <p className="font-cormorant text-xs text-[#6B4423]/50 line-through">
                          Q{toFixedSafe(product.originalPrice)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-cormorant text-sm text-[#6B4423]/80">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {product.isNew && (
                          <span className="px-2 py-1 bg-[#889E81]/20 text-[#889E81] text-xs font-cinzel rounded">
                            Nuevo
                          </span>
                        )}
                        {product.isBestseller && (
                          <span className="px-2 py-1 bg-[#6B4423]/20 text-[#6B4423] text-xs font-cinzel rounded">
                            Bestseller
                          </span>
                        )}
                        {!product.inStock && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-cinzel rounded">
                            Agotado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/producto/${product.id}`}
                          target="_blank"
                          className="p-2 text-[#6B4423]/60 hover:text-[#889E81] transition-colors"
                          title="Ver en tienda"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/productos/${product.id}/editar`}
                          className="p-2 text-[#6B4423]/60 hover:text-[#6B4423] transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 text-[#6B4423]/60 hover:text-red-600 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && !productsLoading && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-[#6B4423]/20 mx-auto mb-4" />
              <p className="font-cormorant text-[#6B4423]/60">No hay productos</p>
              <Link
                href="/admin/productos/nuevo"
                className="inline-block mt-4 text-[#6B4423] font-cinzel hover:underline"
              >
                Agregar primer producto
              </Link>
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg border border-[#6B4423]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#6B4423]/10 flex items-center justify-between">
            <h2 className="font-cinzel text-xl text-[#6B4423]">Órdenes Recientes</h2>
            {ordersLoading && <Loader2 className="w-5 h-5 animate-spin text-[#6B4423]" />}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F6D3B3]/20">
                <tr>
                  <th className="px-6 py-3 text-left font-cinzel text-sm text-[#6B4423]">Orden</th>
                  <th className="px-6 py-3 text-left font-cinzel text-sm text-[#6B4423]">Cliente</th>
                  <th className="px-6 py-3 text-left font-cinzel text-sm text-[#6B4423]">Total</th>
                  <th className="px-6 py-3 text-left font-cinzel text-sm text-[#6B4423]">Estado</th>
                  <th className="px-6 py-3 text-left font-cinzel text-sm text-[#6B4423]">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#6B4423]/10">
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-[#F6D3B3]/10 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/ordenes/${order.id}`} className="font-mono text-sm text-[#6B4423] hover:underline">
                        #{order.id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-cormorant text-sm text-[#6B4423]">{order.customerName}</p>
                      <p className="font-cormorant text-xs text-[#6B4423]/60">{order.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-cormorant text-[#6B4423]">
                        Q{toFixedSafe(toNumberSafe(order.total) + toNumberSafe(order.shippingCost))}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-cinzel rounded ${
                        order.status === 'PAID' ? 'bg-[#889E81]/20 text-[#889E81]' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                        'bg-[#6B4423]/20 text-[#6B4423]'
                      }`}>
                        {order.status === 'PAID' ? 'Pagado' :
                         order.status === 'PENDING' ? 'Pendiente' :
                         order.status === 'SHIPPED' ? 'Enviado' :
                         order.status === 'DELIVERED' ? 'Entregado' :
                         order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-cormorant text-sm text-[#6B4423]/70">
                        {new Date(order.createdAt).toLocaleDateString('es-GT')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && !ordersLoading && (
            <div className="text-center py-8">
              <ShoppingBag className="w-10 h-10 text-[#6B4423]/20 mx-auto mb-2" />
              <p className="font-cormorant text-[#6B4423]/60 text-sm">No hay órdenes aún</p>
            </div>
          )}
        </div>
        </>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-cinzel text-xl text-[#6B4423]">Usuarios de Tracking</h2>
              <button
                onClick={() => setShowUserForm(!showUserForm)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#889E81] text-white font-cinzel uppercase tracking-wider hover:bg-[#889E81]/90 transition-colors rounded-lg"
              >
                {showUserForm ? <X className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                {showUserForm ? 'Cancelar' : 'Nuevo Usuario'}
              </button>
            </div>

            {showUserForm && (
              <div className="bg-white rounded-lg border border-[#6B4423]/10 p-6">
                <h3 className="font-cinzel text-lg text-[#6B4423] mb-4">Crear usuario de tracking</h3>
                {userFormError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 font-cormorant text-sm">
                    {userFormError}
                  </div>
                )}
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-cormorant text-sm text-[#6B4423]/70 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-cormorant text-sm text-[#6B4423]/70 mb-1">Correo electrónico</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-cormorant text-sm text-[#6B4423]/70 mb-1">Contraseña</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant bg-white"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#6B4423] text-[#F6D3B3] font-cinzel uppercase tracking-wider hover:bg-[#6B4423]/90 transition-colors"
                    >
                      Crear Usuario
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg border border-[#6B4423]/10 overflow-hidden">
              {usersLoading && (
                <div className="px-6 py-4 border-b border-[#6B4423]/10 flex items-center justify-between">
                  <Loader2 className="w-5 h-5 animate-spin text-[#6B4423]" />
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F6D3B3]/20">
                    <tr>
                      <th className="px-6 py-3 text-left font-cinzel text-sm text-[#6B4423]">Nombre</th>
                      <th className="px-6 py-3 text-left font-cinzel text-sm text-[#6B4423]">Email</th>
                      <th className="px-6 py-3 text-left font-cinzel text-sm text-[#6B4423]">Estado</th>
                      <th className="px-6 py-3 text-left font-cinzel text-sm text-[#6B4423]">Último acceso</th>
                      <th className="px-6 py-3 text-right font-cinzel text-sm text-[#6B4423]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#6B4423]/10">
                    {trackerUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#F6D3B3]/10 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-cormorant text-sm text-[#6B4423]">{u.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-cormorant text-sm text-[#6B4423]/70">{u.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-cinzel rounded ${
                            u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {u.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-cormorant text-sm text-[#6B4423]/70">
                            {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('es-GT') : 'Nunca'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="p-2 text-[#6B4423]/60 hover:text-red-600 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {trackerUsers.length === 0 && !usersLoading && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-[#6B4423]/20 mx-auto mb-4" />
                  <p className="font-cormorant text-[#6B4423]/60">No hay usuarios de tracking</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
