"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Check, ChevronRight, Truck, Package, Loader2, MapPin, Banknote, CreditCard } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { createOrder } from "@/lib/api";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  department: string;
  postalCode: string;
  phone: string;
}

type PaymentMethod = 'cod' | '50transfer' | '100transfer';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"information" | "confirmation">("information");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [shippingZone, setShippingZone] = useState<'capital' | 'interior' | ''>('');
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    department: "",
    postalCode: "",
    phone: "",
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#FDF9F3]">
        <Package className="w-16 h-16 text-[#6B4423]/20 mb-4" />
        <h1 className="font-cinzel text-2xl text-[#6B4423] mb-2">Tu carrito está vacío</h1>
        <p className="font-cormorant text-lg text-[#6B4423]/60 mb-6">
          No hay productos para procesar el pedido.
        </p>
        <Link
          href="/tienda"
          className="inline-flex items-center px-8 py-4 bg-[#6B4423] text-[#F6D3B3] font-cinzel uppercase tracking-wider hover:bg-[#6B4423]/90 transition-colors"
        >
          Seguir Comprando
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'department' && value) {
      setShippingZone(value === 'Guatemala' ? 'capital' : 'interior');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === "information") {
      setStep("confirmation");
    } else {
      setIsProcessing(true);
      
      try {
        const orderData = {
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
            color: item.color,
            name: item.product.name,
            image: item.product.image
          })),
          customer: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
          },
          shipping: {
            address: `${formData.address}${formData.apartment ? `, ${formData.apartment}` : ''}`,
            city: formData.city,
            department: formData.department,
            postalCode: formData.postalCode
          },
          total: totalPrice,
          shippingCost: getShippingCost(),
          paymentMethod
        };

        const order = await createOrder(orderData);
        
        localStorage.setItem('pendingOrder', JSON.stringify({
          ...orderData,
          id: order.id,
          customer: orderData.customer
        }));

        clearCart();
        router.push(`/checkout/success?orderId=${order.id}`);

      } catch (err: any) {
        alert(err?.message || 'Error al procesar el pedido. Intenta de nuevo.');
        setIsProcessing(false);
      }
    }
  };

  const getShippingCost = () => {
    // Envío gratis a partir de Q500
    if (totalPrice >= 500) return 0;
    // Capital: Q25 | Interior: Q35
    if (shippingZone === 'capital') return 25;
    return 35;
  };

  const getPaymentDescription = () => {
    switch (paymentMethod) {
      case 'cod':
        return 'Pago contra entrega';
      case '50transfer':
        return '50% transferencia + 50% contra entrega';
      case '100transfer':
        return '100% transferencia bancaria';
    }
  };

  const shippingCost = getShippingCost();
  const total = totalPrice + shippingCost;

  const isStepValid = () => {
    return formData.email && formData.firstName && formData.lastName && 
           formData.phone && formData.address && formData.city && 
           formData.department && formData.postalCode && shippingZone;
  };

  return (
    <div className="min-h-screen bg-[#FDF9F3]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Form */}
          <div className="px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
            <Link href="/" className="inline-block mb-8">
              <h1 className="font-cinzel text-2xl tracking-wider text-[#6B4423]">Ágape Studio</h1>
            </Link>

            <nav className="flex items-center text-sm mb-8 font-cormorant">
              <span className={step === "information" ? "text-[#6B4423] font-medium" : "text-[#6B4423]/50"}>
                Información
              </span>
              <ChevronRight className="w-4 h-4 mx-2 text-[#6B4423]/30" />
              <span className={step === "confirmation" ? "text-[#6B4423] font-medium" : "text-[#6B4423]/50"}>
                Confirmación
              </span>
            </nav>

            <form onSubmit={handleSubmit}>
              {step === "information" && (
                <div className="space-y-6">
                  <h2 className="font-cinzel text-lg text-[#6B4423]">Información de Contacto</h2>
                  
                  <div>
                    <label className="block font-cormorant text-sm text-[#6B4423]/70 mb-1">Correo electrónico <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant focus:outline-none focus:border-[#6B4423] bg-white"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-cormorant text-sm text-[#6B4423]/70 mb-1">Nombre <span className="text-red-500">*</span></label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant bg-white" />
                    </div>
                    <div>
                      <label className="block font-cormorant text-sm text-[#6B4423]/70 mb-1">Apellido <span className="text-red-500">*</span></label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant bg-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-cormorant text-sm text-[#6B4423]/70 mb-1">Teléfono <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant bg-white" placeholder="+502 XXXX XXXX" />
                  </div>

                  <h2 className="font-cinzel text-lg text-[#6B4423] pt-4">Dirección de Envío</h2>
                  
                  <div>
                    <label className="block font-cormorant text-sm text-[#6B4423]/70 mb-1">Dirección <span className="text-red-500">*</span></label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant bg-white" placeholder="Calle y número" />
                  </div>

                  <div>
                    <label className="block font-cormorant text-sm text-[#6B4423]/70 mb-1">Apartamento, suite, etc. (opcional)</label>
                    <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant bg-white" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-cormorant text-sm text-[#6B4423]/70 mb-1">Ciudad <span className="text-red-500">*</span></label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant bg-white" />
                    </div>
                    <div>
                      <label className="block font-cormorant text-sm text-[#6B4423]/70 mb-1">Código Postal <span className="text-red-500">*</span></label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant bg-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-cormorant text-sm text-[#6B4423]/70 mb-1">Departamento <span className="text-red-500">*</span></label>
                    <select name="department" value={formData.department} onChange={handleInputChange} required className="w-full px-4 py-3 border border-[#6B4423]/20 font-cormorant bg-white">
                      <option value="">Selecciona un departamento</option>
                      <option value="Guatemala">Guatemala</option>
                      <option value="Sacatepéquez">Sacatepéquez</option>
                      <option value="Escuintla">Escuintla</option>
                      <option value="Quetzaltenango">Quetzaltenango</option>
                      <option value="Petén">Petén</option>
                      <option value="Huehuetenango">Huehuetenango</option>
                      <option value="San Marcos">San Marcos</option>
                      <option value="Totonicapán">Totonicapán</option>
                      <option value="Quiché">Quiché</option>
                      <option value="Alta Verapaz">Alta Verapaz</option>
                      <option value="Baja Verapaz">Baja Verapaz</option>
                      <option value="El Progreso">El Progreso</option>
                      <option value="Izabal">Izabal</option>
                      <option value="Zacapa">Zacapa</option>
                      <option value="Chiquimula">Chiquimula</option>
                      <option value="Jalapa">Jalapa</option>
                      <option value="Jutiapa">Jutiapa</option>
                      <option value="Santa Rosa">Santa Rosa</option>
                      <option value="Sololá">Sololá</option>
                      <option value="Suchitepéquez">Suchitepéquez</option>
                      <option value="Retalhuleu">Retalhuleu</option>
                      <option value="Chimaltenango">Chimaltenango</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-cormorant text-sm text-[#6B4423]/70 mb-1">Zona de envío <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-colors ${shippingZone === 'capital' ? 'border-[#6B4423] bg-[#F6D3B3]/10' : 'border-[#6B4423]/20'}`}>
                        <input type="radio" name="shippingZone" value="capital" checked={shippingZone === 'capital'} onChange={() => setShippingZone('capital')} className="hidden" required />
                        <MapPin className="w-4 h-4 text-[#6B4423]" />
                        <span className="font-cinzel text-sm text-[#6B4423]">Capital Q25</span>
                      </label>
                      <label className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-colors ${shippingZone === 'interior' ? 'border-[#6B4423] bg-[#F6D3B3]/10' : 'border-[#6B4423]/20'}`}>
                        <input type="radio" name="shippingZone" value="interior" checked={shippingZone === 'interior'} onChange={() => setShippingZone('interior')} className="hidden" required />
                        <Truck className="w-4 h-4 text-[#6B4423]" />
                        <span className="font-cinzel text-sm text-[#6B4423]">Interior Q35</span>
                      </label>
                    </div>
                    {totalPrice >= 500 && (
                      <p className="font-cormorant text-sm text-[#889E81] mt-2 text-center">
                        🎉 Tu pedido aplica para <strong>envío gratis</strong>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === "confirmation" && (
                <div className="space-y-6">
                  <div className="bg-[#F6D3B3]/20 p-4 rounded">
                    <div className="flex justify-between text-sm font-cormorant">
                      <span className="text-[#6B4423]/70">Contacto</span>
                      <span className="text-[#6B4423]">{formData.email}</span>
                    </div>
                    <div className="border-t my-2" />
                    <div className="flex justify-between text-sm font-cormorant">
                      <span className="text-[#6B4423]/70">Envío a</span>
                      <span className="text-[#6B4423]">{`${formData.city}, ${formData.department}`}</span>
                    </div>
                  </div>

                  <h2 className="font-cinzel text-lg text-[#6B4423]">Método de Pago</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 border-2 border-[#6B4423] bg-[#F6D3B3]/10 rounded-lg">
                      <div className="w-10 h-10 bg-[#6B4423] rounded-full flex items-center justify-center flex-shrink-0">
                        <Banknote className="w-5 h-5 text-[#F6D3B3]" />
                      </div>
                      <div className="flex-1">
                        <span className="font-cinzel text-[#6B4423]">Pago Contra Entrega</span>
                        <p className="font-cormorant text-sm text-[#6B4423]/70">Paga en efectivo cuando recibas tu pedido</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#889E81]/10 border border-[#889E81]/30 p-4 rounded">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#889E81] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-cormorant text-sm text-[#6B4423]">
                          <strong>Seguimiento de pedido incluido</strong>
                        </p>
                        <p className="font-cormorant text-xs text-[#6B4423]/70">
                          Recibirás un número de guía para rastrear tu pedido. Trabajamos con Cargo Expreso.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                    <p className="font-cormorant text-sm text-yellow-800">
                      <strong>Importante:</strong> {paymentMethod === 'cod' ? 'Asegúrate de tener el monto exacto al momento de la entrega.' : 'Envía tu comprobante de transferencia para procesar tu pedido.'}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-8">
                <button type="button" onClick={() => step === "information" ? router.push("/carrito") : setStep("information")} className="font-cormorant text-sm text-[#6B4423]/70 hover:text-[#6B4423]">
                  ← {step === "information" ? "Volver al carrito" : "Volver"}
                </button>

                <button type="submit" disabled={!isStepValid() || isProcessing} className="px-8 py-4 bg-[#6B4423] text-[#F6D3B3] font-cinzel uppercase tracking-wider hover:bg-[#6B4423]/90 disabled:opacity-50 flex items-center gap-2">
                  {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</> : step === "confirmation" ? <><Check className="w-5 h-5" /> Confirmar Pedido</> : "Continuar"}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-[#F6D3B3]/10 px-4 sm:px-6 lg:px-12 py-8 lg:py-12 border-l border-[#6B4423]/10">
            <h2 className="font-cinzel text-lg text-[#6B4423] mb-6">Resumen del Pedido</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-white flex-shrink-0 overflow-hidden border border-[#6B4423]/10">
                    <ProductImage src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    <span className="absolute -top-2 -right-2 bg-[#6B4423] text-[#F6D3B3] text-xs w-5 h-5 rounded-full flex items-center justify-center font-cormorant">{item.quantity}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-cinzel text-sm text-[#6B4423]">{item.product.name}</p>
                    <p className="font-cormorant text-sm text-[#6B4423]/60">{item.color} / {item.size}</p>
                  </div>
                  <span className="font-cormorant text-[#6B4423]">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#6B4423]/20 pt-4 space-y-3">
              <div className="flex justify-between text-sm font-cormorant">
                <span className="text-[#6B4423]/70">Subtotal</span>
                <span className="text-[#6B4423]">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm font-cormorant">
                <span className="text-[#6B4423]/70">Envío</span>
                <span className="text-[#6B4423]">{shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
              </div>
              <p className="font-cormorant text-xs text-[#6B4423]/50">
                {totalPrice >= 500 ? 'Envío gratis por compras mayores a Q500' : `Capital: Q25 | Interior: Q35`}
              </p>
            </div>

            <div className="border-t border-[#6B4423]/20 mt-4 pt-4">
              <div className="flex justify-between font-cinzel text-lg">
                <span className="text-[#6B4423]">Total a pagar</span>
                <span className="text-[#6B4423]">{formatPrice(total)}</span>
              </div>
              <p className="font-cormorant text-xs text-[#6B4423]/50 mt-1">{getPaymentDescription()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
