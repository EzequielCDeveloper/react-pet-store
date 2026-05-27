import { Link } from "react-router-dom";

export default function PromoBanner() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          Oferta especial — 20% de descuento en tu primera compra
        </h2>
        <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
          Únete a nuestra comunidad de amantes de mascotas y ahorra en tu primer pedido. Cada mascota merece un hogar amoroso.
        </p>
        <Link
          to="/browse"
          className="inline-flex items-center px-8 py-3 bg-white text-emerald-700 font-semibold rounded-full hover:bg-emerald-50 transition-all hover:scale-105 min-h-[44px] text-lg"
        >
          Explorar mascotas
        </Link>
      </div>
    </section>
  );
}
