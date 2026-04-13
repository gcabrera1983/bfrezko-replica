import Link from "next/link";
import { Truck, CreditCard, RefreshCw, Package, Ruler, Palette, Scale } from "lucide-react";

export const metadata = {
  title: "Información | Ágape Studio",
  description: "Información sobre productos, envíos, pagos y políticas de Ágape Studio",
};

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-[#FDF9F3] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-cinzel text-4xl text-[#6B4423] mb-12 text-center">Información</h1>

        {/* Productos */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-[#6B4423]" />
            <h2 className="font-cinzel text-2xl text-[#6B4423]">Nuestros Productos</h2>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-[#6B4423]/10">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Ruler className="w-5 h-5 text-[#889E81] mt-1" />
                <div>
                  <h3 className="font-cinzel text-[#6B4423] mb-2">Tallas Disponibles</h3>
                  <p className="font-cormorant text-[#6B4423]/80">
                    S, M, L y XL
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Palette className="w-5 h-5 text-[#889E81] mt-1" />
                <div>
                  <h3 className="font-cinzel text-[#6B4423] mb-2">Colores</h3>
                  <p className="font-cormorant text-[#6B4423]/80">
                    Negro, Beige y Blanco
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Scale className="w-5 h-5 text-[#889E81] mt-1" />
                <div>
                  <h3 className="font-cinzel text-[#6B4423] mb-2">Material</h3>
                  <p className="font-cormorant text-[#6B4423]/80">
                    100% Algodón
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-[#889E81] mt-1" />
                <div>
                  <h3 className="font-cinzel text-[#6B4423] mb-2">Gramaje</h3>
                  <p className="font-cormorant text-[#6B4423]/80">
                    342 g aproximadamente (todas las tallas)
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#6B4423]/10 mt-6 pt-6">
              <h3 className="font-cinzel text-[#6B4423] mb-4">Modelos Disponibles</h3>
              <ul className="space-y-3 font-cormorant text-[#6B4423]/80">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#6B4423] rounded-full"></span>
                  <strong>"He Loved Me So Much"</strong> - Color negro
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#6B4423] rounded-full"></span>
                  <strong>"God's With Me"</strong> - Color blanco
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#6B4423] rounded-full"></span>
                  <strong>"The Agape Foundation"</strong> - Logo oficial
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Envíos */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-6 h-6 text-[#6B4423]" />
            <h2 className="font-cinzel text-2xl text-[#6B4423]">Envíos</h2>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-[#6B4423]/10">
            <div className="space-y-4 font-cormorant text-[#6B4423]/80">
              <div className="flex justify-between items-center py-3 border-b border-[#6B4423]/10">
                <span>Ciudad Capital (Guatemala)</span>
                <span className="font-cinzel text-[#6B4423]">Q20</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#6B4423]/10">
                <span>Interior de la República</span>
                <span className="font-cinzel text-[#6B4423]">Desde Q30</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-[#889E81]/10 rounded">
              <p className="font-cormorant text-sm text-[#6B4423]">
                <strong>Transportista:</strong> Trabajamos con Cargo Expreso para envíos a todo el país.
                Tiempo estimado de entrega: 2-4 días hábiles en capital, 3-6 días en interior.
              </p>
            </div>
          </div>
        </section>

        {/* Pagos */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-[#6B4423]" />
            <h2 className="font-cinzel text-2xl text-[#6B4423]">Métodos de Pago</h2>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-[#6B4423]/10">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border border-[#6B4423]/20 rounded-lg">
                <div className="w-10 h-10 bg-[#6B4423] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#F6D3B3] font-cinzel font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-cinzel text-[#6B4423] mb-1">Pago Contra Entrega</h3>
                  <p className="font-cormorant text-sm text-[#6B4423]/70">
                    Paga en efectivo cuando recibas tu pedido. Disponible en Ciudad Capital y algunas zonas del interior.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 border border-[#6B4423]/20 rounded-lg">
                <div className="w-10 h-10 bg-[#889E81] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-cinzel font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-cinzel text-[#6B4423] mb-1">50% Transferencia + 50% Contra Entrega</h3>
                  <p className="font-cormorant text-sm text-[#6B4423]/70">
                    Abona el 50% por transferencia bancaria y el 50% restante al momento de la entrega.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 border border-[#6B4423]/20 rounded-lg">
                <div className="w-10 h-10 bg-[#6B4423] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#F6D3B3] font-cinzel font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-cinzel text-[#6B4423] mb-1">100% Transferencia Bancaria</h3>
                  <p className="font-cormorant text-sm text-[#6B4423]/70 mb-2">
                    Pago completo por transferencia antes del envío.
                  </p>
                  <div className="bg-[#F6D3B3]/20 p-3 rounded text-sm">
                    <p><strong>Banco:</strong> BAC Credomatic</p>
                    <p><strong>Cuenta:</strong> 1234567890</p>
                    <p><strong>Nombre:</strong> Ágape Studio</p>
                    <p><strong>Enviar comprobante a:</strong> hola@agapestudio.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Política de Cambios */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="w-6 h-6 text-[#6B4423]" />
            <h2 className="font-cinzel text-2xl text-[#6B4423]">Política de Cambios</h2>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-[#6B4423]/10">
            <div className="space-y-4 font-cormorant text-[#6B4423]/80">
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800">
                  <strong>No hay devoluciones de dinero.</strong> Solo realizamos cambios de producto.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-cinzel text-[#6B4423]">Cambios por defectos:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Aceptamos cambios dentro de los 15 días posteriores a la compra</li>
                  <li>Los cambios aplican únicamente por defectos de fábrica:</li>
                  <ul className="list-circle list-inside ml-6 space-y-1 text-[#6B4423]/70">
                    <li>Deshilado</li>
                    <li>Encogimiento excesivo</li>
                    <li>Defectos en la tela</li>
                    <li>Estampado defectuoso</li>
                  </ul>
                </ul>
              </div>
              
              <div className="border-t border-[#6B4423]/10 pt-4 mt-4">
                <h3 className="font-cinzel text-[#6B4423] mb-2">Condiciones para cambio:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-[#6B4423]/70">
                  <li>El producto debe estar sin usar</li>
                  <li>Debe conservar todas sus etiquetas</li>
                  <li>Se requiere presentar el comprobante de compra</li>
                  <li>El cliente asume el costo del envío para el cambio</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section className="text-center">
          <p className="font-cormorant text-[#6B4423]/70 mb-4">
            ¿Tienes alguna pregunta? Contáctanos
          </p>
          <a 
            href="mailto:hola@agapestudio.com" 
            className="inline-block px-8 py-3 bg-[#6B4423] text-[#F6D3B3] font-cinzel uppercase tracking-wider hover:bg-[#6B4423]/90 transition-colors"
          >
            hola@agapestudio.com
          </a>
        </section>
      </div>
    </div>
  );
}
