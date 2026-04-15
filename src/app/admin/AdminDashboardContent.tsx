"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { useProducts } from "@/context/ProductsContext";
import Link from "next/link";
import { Package, ShoppingBag, TrendingUp, Eye, Plus, Edit, Trash2, LogOut, Images, Loader2 } from "lucide-react";
import AdminProductImage from "@/components/admin/AdminProductImage";
import { fetchOrders } from "@/lib/api";
import { Order } from "@/types";
import { toFixedSafe, toNumberSafe } from "@/lib/utils";

export default function AdminDashboardContent() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAdmin();
  const { products, deleteProduct, isLoading: productsLoading, refreshProducts } = useProducts();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      refreshProducts();
      loadOrders();
    }
  }, [isAuthenticated, refreshProducts]);

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

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
      </div>
    </div>
  );
}
