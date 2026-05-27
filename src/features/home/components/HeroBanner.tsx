import { useScrollReveal } from '../../../hooks/useScrollReveal';

interface HeroBannerProps {
  readonly targetRef: React.RefObject<HTMLElement | null>;
}

export default function HeroBanner({ targetRef }: HeroBannerProps) {
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal({ threshold: 0.1 });

  const handleCTAClick = () => {
    targetRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={heroRef} className={`bg-gradient-to-br from-blue-600 to-blue-800 min-h-[320px] md:min-h-[500px] flex items-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Encuentra a tu compañero perfecto
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Descubre mascotas amorosas que esperan un hogar. Desde cachorros juguetones hasta gatos adorables, tu nuevo mejor amigo está a un clic de distancia.
        </p>
        <button
          onClick={handleCTAClick}
          className="inline-flex items-center px-8 py-3 bg-white text-blue-700 font-semibold rounded-full hover:bg-blue-50 transition-all hover:scale-105 min-h-[44px] text-lg"
        >
          Comprar ahora
        </button>
      </div>
    </section>
  );
}
