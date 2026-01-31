import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { getPetImage } from '../../lib/pet-utils';

export const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, itemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-lg shadow-sm p-12">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any pets yet.</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({itemCount} items)</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.pet.id} className="p-6 flex flex-col sm:flex-row items-center">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                  src={getPetImage(item.pet.id)}
                  alt={item.pet.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="ml-4 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mt-4 sm:mt-0">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    <Link to={`/pets/${item.pet.id}`} className="hover:text-blue-600">
                      {item.pet.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{item.pet.category?.name || 'Uncategorized'}</p>
                  <p className="mt-1 text-sm font-medium text-blue-600">£{item.price}</p>
                </div>

                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => updateQuantity(item.pet.id!, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 text-gray-600"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-1 text-gray-900 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.pet.id!, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 text-gray-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.pet.id!)}
                    className="text-red-500 hover:text-red-700 p-2"
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
            <p>Subtotal</p>
            <p>£{totalPrice}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500 mb-6">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
             <Link
              to="/"
              className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => navigate('/checkout')}
              className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
