import { Link, Outlet } from 'react-router-dom';
import { Dog, ShoppingCart, User as UserIcon, LogIn } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

export const Layout = () => {
  const { user } = useAuth();
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center space-x-2 group">
                <Dog className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                <span className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Petstore</span>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link to="/cart" className="p-2 text-gray-500 hover:text-blue-600 transition-colors relative group">
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
                    <p className="text-sm font-medium text-gray-900">Hello,</p>
                    <p className="text-xs text-gray-500">{user}</p>
                  </div>
                  <Link 
                    to="/users/login" 
                    className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                  >
                    <UserIcon size={20} />
                  </Link>
                </div>
              ) : (
                <Link
                  to="/users/login"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">About</h3>
              <p className="text-base text-gray-500">
                A simple pet store application built with React and Swagger API.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">Links</h3>
              <ul className="space-y-4">
                <li><Link to="/" className="text-base text-gray-500 hover:text-blue-600">Home</Link></li>
                <li><Link to="/users/login" className="text-base text-gray-500 hover:text-blue-600">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">Contact</h3>
              <p className="text-base text-gray-500">
                support@petstore.com
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Swagger Petstore Client. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
