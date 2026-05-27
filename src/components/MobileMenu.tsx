import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface MobileMenuProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menú de navegación">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-lg font-semibold text-gray-900">Menú</span>
          <button
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-md"
            aria-label="Cerrar menú"
            autoFocus
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                onClick={onClose}
                className="block px-4 py-3 min-h-[44px] rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/browse"
                onClick={onClose}
                className="block px-4 py-3 min-h-[44px] rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Explorar
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                onClick={onClose}
                className="block px-4 py-3 min-h-[44px] rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Carrito
              </Link>
            </li>
            <li>
              <Link
                to="/users/login"
                onClick={onClose}
                className="block px-4 py-3 min-h-[44px] rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Iniciar sesión
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
