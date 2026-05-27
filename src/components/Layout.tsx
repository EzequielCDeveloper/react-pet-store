import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Dog, ShoppingCart, User as UserIcon, LogIn, Search, Menu } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import MobileMenu from './MobileMenu';
import BackToTop from './BackToTop';

export const Layout = () => {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/browse?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleMobileSearch = () => {
    const trimmed = searchQuery.trim();
    if (trimmed) navigate(`/browse?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-blue-600 focus:px-4 focus:py-2 focus:rounded focus:shadow-lg">
        Saltar al contenido principal
      </a>
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 min-h-[44px] min-w-[44px]"
                aria-label="Abrir menú"
              >
                <Menu size={24} />
              </button>
              <Link to="/" className="flex-shrink-0 flex items-center space-x-2 group min-h-[44px]">
                <Dog className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                <span className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Petstore</span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Buscar mascotas..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                  />
                </div>
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleMobileSearch}
                className="md:hidden p-2 min-h-[44px] min-w-[44px]"
                 aria-label="Buscar"
              >
                <Search size={24} />
              </button>

              {/* Cart */}
              <Link to="/cart" className="p-2 min-h-[44px] min-w-[44px] text-gray-500 hover:text-blue-600 transition-colors relative group" aria-label="Carrito">
                <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-xs font-bold text-white flex items-center justify-center shadow-sm">
                    {itemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">Hola,</p>
                    <p className="text-xs text-gray-500">{user}</p>
                  </div>
                  <Link 
                    to="/users/login" 
                    className="h-11 w-11 min-w-[44px] bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                  >
                    <UserIcon size={20} />
                  </Link>
                </div>
              ) : (
                <Link
                  to="/users/login"
                  className="flex items-center space-x-2 px-4 py-2 min-h-[44px] bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <LogIn size={18} />
                   <span>Iniciar sesión</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      </header>

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">Acerca de</h3>
              <p className="text-base text-gray-500">
                Una tienda de mascotas simple construida con React y Swagger API.
              </p>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">Enlaces</h3>
              <ul className="space-y-4">
                <li><Link to="/" className="text-base text-gray-500 hover:text-blue-600">Inicio</Link></li>
                <li><Link to="/users/login" className="text-base text-gray-500 hover:text-blue-600">Iniciar sesión</Link></li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">Contacto</h3>
              <p className="text-base text-gray-500">
                support@petstore.com
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Swagger Petstore Client. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
};
