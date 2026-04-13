"use client";

import Image from "next/image";
import Logo from "@/components/Logo";

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-[#FDF9F3]">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-[#1A1A1A]">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&auto=format&fit=crop"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <Logo variant="light" size="lg" showTagline />
          <h1 className="font-cinzel text-4xl md:text-5xl lg:text-6xl text-[#F6D3B3] mt-8 mb-6 tracking-wide">
            Nuestra Historia
          </h1>
          <p className="font-cormorant text-xl text-[#F6D3B3]/80 italic">
            "Tener ropa que hable de nuestro Padre también es una forma de transmitirlo al mundo"
          </p>
        </div>
      </section>

      {/* Fundación */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="prose prose-lg max-w-none">
            <div className="text-center mb-12">
              <span className="font-cinzel text-sm tracking-[0.3em] text-[#889E81] uppercase">Fundación</span>
              <h2 className="font-cinzel text-3xl md:text-4xl text-[#6B4423] mt-4">
                Un Testimonio de Fe
              </h2>
            </div>
            
            <div className="space-y-6 font-cormorant text-lg text-[#1A1A1A]/80 leading-relaxed">
              <p>
                <strong className="text-[#6B4423]">Ágape Studio</strong> nace después de un proceso muy difícil en mi vida.
              </p>
              
              <p>
                Pasé por un momento de salud muy complicado. Los dolores eran fuertes y el órgano 
                que estaba causando el problema era, según los médicos, muy difícil de recuperar. 
                En medio de ese proceso yo llevaba puesta una playera que usaba en la iglesia, 
                la cual mencionaba que yo era líder.
              </p>
              
              <p>
                Los doctores mismos llegaron a decir que <strong className="text-[#6B4423]">el Padre me había sanado</strong>, 
                porque la recuperación que tuve no era algo común.
              </p>
              
              <div className="bg-[#F6D3B3]/20 border-l-4 border-[#6B4423] p-6 my-8">
                <p className="font-playfair text-xl text-[#6B4423] italic m-0">
                  "En ese momento entendí algo muy profundo: tener ropa que hable de nuestro 
                  Padre también es una forma de transmitirlo al mundo."
                </p>
              </div>
              
              <p>
                Y así nació la idea de crear una marca que no solo sea ropa, sino <strong className="text-[#6B4423]">testimonio</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visión y Misión */}
      <section className="py-16 lg:py-24 bg-[#6B4423]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Visión */}
            <div className="text-center md:text-left">
              <span className="font-cinzel text-sm tracking-[0.3em] text-[#F6D3B3]/60 uppercase">Nuestra</span>
              <h2 className="font-cinzel text-3xl md:text-4xl text-[#F6D3B3] mt-2 mb-6">
                Visión
              </h2>
              <div className="space-y-4 font-cormorant text-lg text-[#F6D3B3]/90 leading-relaxed">
                <p>
                  Ser una marca que impacte vidas más allá de la ropa, recordándole al mundo 
                  que existe un amor que redime, restaura y transforma.
                </p>
                <p>
                  Nuestra visión es que cada prenda sea un recordatorio de que un día fuimos 
                  alcanzados por la misericordia del <strong>Padre</strong>, y que nuestras vidas 
                  son testimonio vivo de su gracia.
                </p>
                <p>
                  Que donde llegue <strong>Ágape Studio</strong>, también llegue el recordatorio 
                  de que el amor del <strong>Padre</strong> siempre está dispuesto a recibirnos.
                </p>
              </div>
            </div>

            {/* Misión */}
            <div className="text-center md:text-left">
              <span className="font-cinzel text-sm tracking-[0.3em] text-[#F6D3B3]/60 uppercase">Nuestra</span>
              <h2 className="font-cinzel text-3xl md:text-4xl text-[#F6D3B3] mt-2 mb-6">
                Misión
              </h2>
              <div className="space-y-4 font-cormorant text-lg text-[#F6D3B3]/90 leading-relaxed">
                <p>
                  Expandir el mensaje del amor incondicional y la misericordia del <strong>Padre</strong> 
                  a través de cada prenda que creamos.
                </p>
                <p>
                  Queremos que nuestra ropa sea una forma de comunicar <strong>fe, esperanza y redención</strong>, 
                  para que quienes la usen puedan identificarse con el <strong>Padre</strong> y recordar 
                  que su amor sigue alcanzando vidas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="font-cinzel text-sm tracking-[0.3em] text-[#889E81] uppercase">Conócenos</span>
            <h2 className="font-cinzel text-3xl md:text-4xl text-[#6B4423] mt-4">
              Quiénes Somos
            </h2>
          </div>
          
          <div className="space-y-6 font-cormorant text-lg text-[#1A1A1A]/80 leading-relaxed text-center">
            <p>
              Somos <strong className="text-[#6B4423]">Ágape Studio</strong>, un estudio de ropa cristiana 
              con un propósito claro: expandir el mensaje del <strong>amor y la misericordia del Padre</strong>.
            </p>
            
            <p>
              Creemos que cada prenda puede ser una forma de comunicar <strong>fe, identidad y esperanza</strong>. 
              Para nosotros, la ropa no es solo algo que se viste, sino una manera de reflejar aquello en lo que creemos.
            </p>
            
            <p>
              Somos personas que entendemos que necesitamos del <strong>Padre</strong> para caminar cada día, 
              y por eso queremos que lo que vestimos también sea un recordatorio de su <strong>amor y su misericordia</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* El Logo */}
      <section className="py-16 lg:py-24 bg-[#889E81]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <span className="font-cinzel text-sm tracking-[0.3em] text-[#889E81] uppercase">Símbolo</span>
              <h2 className="font-cinzel text-3xl md:text-4xl text-[#6B4423] mt-4 mb-6">
                El Significado del Logo
              </h2>
              <div className="space-y-4 font-cormorant text-lg text-[#1A1A1A]/80 leading-relaxed">
                <p>
                  Nuestro logo es, en esencia, una <strong className="text-[#6B4423]">"U" invertida</strong>. 
                  La <strong>"U"</strong> representa <strong>"Unconditional"</strong> (incondicional), 
                  haciendo referencia al amor ágape: el amor perfecto, fiel y sin condiciones del 
                  <strong> Padre</strong> hacia nosotros.
                </p>
                <p>
                  Sin embargo, más que imponer un único significado, también creemos que cada persona 
                  puede darle su propia interpretación.
                </p>
                <p>
                  Algunos han dicho que representa <strong>una puerta</strong>, otros lo ven como 
                  <strong> un camino</strong> o una <strong>cobertura</strong>. Para nosotros, lo más 
                  importante es que recuerde el significado de <strong>Ágape</strong>: el amor incondicional.
                </p>
                <p className="italic text-[#6B4423]">
                  Ese amor que no depende de lo que somos o de lo que hicimos, sino del amor perfecto 
                  del Padre hacia nosotros.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-[#1A1A1A] p-12 rounded-lg">
                <Logo variant="light" size="lg" showTagline />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-[#6B4423]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-cinzel text-3xl md:text-4xl text-[#F6D3B3] mb-6">
            Únete a Nuestra Misión
          </h2>
          <p className="font-cormorant text-xl text-[#F6D3B3]/80 mb-8">
            Cada prenda que llevas es un testimonio de fe y un recordatorio del amor incondicional del Padre.
          </p>
          <a
            href="/tienda"
            className="inline-block px-10 py-4 bg-[#F6D3B3] text-[#6B4423] font-cinzel uppercase tracking-wider hover:bg-[#F6D3B3]/90 transition-colors"
          >
            Explorar Colección
          </a>
        </div>
      </section>
    </div>
  );
}
