import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { Link } from 'react-router-dom';
import { useApi } from '../../api/client';
import { CheckCircle, User, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zip: z.string().min(1, "Zip code is required"),
  cardName: z.string().min(1, "Name on card is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3-4 digits"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { addToast } = useToast();
  const { user } = useAuth();
  const api = useApi();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema)
  });

  useEffect(() => {
    if (user) {
      // Pre-fill form with user data if available
      // Since we only have username, we'll do our best guess or just fill first name
      const parts = user.split(' ');
      if (parts.length > 0) setValue('firstName', parts[0]);
      if (parts.length > 1) setValue('lastName', parts.slice(1).join(' '));
    }
  }, [user, setValue]);

  const onSubmit = async (data: CheckoutForm) => {
    setIsProcessing(true);
    // Simulate using the form data
    console.log("Processing order for:", data);
    
    try {
      // Process orders sequentially
      for (const item of items) {
        // Create an order for each quantity unit (since API is typically 1 pet per order, 
        // but here we might just place one order per line item with quantity)
        // The API schema has quantity field in Order!
        
        await api.POST("/store/order", {
          body: {
            petId: item.pet.id,
            quantity: item.quantity,
            status: "placed",
            complete: true,
            shipDate: new Date().toISOString()
          }
        });
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearCart();
      setIsSuccess(true);
      addToast("Order placed successfully!", "success");
    } catch (error) {
      console.error("Checkout error:", error);
      addToast("Failed to place order. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
          <p className="text-gray-500 mb-8">
            Thank you for your purchase. Your order has been placed successfully and will be shipped soon.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some pets before checking out.</p>
        <Link to="/" className="text-blue-600 hover:underline font-medium">Go back to shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <User className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            {user ? (
              <p className="text-sm text-blue-700">
                Logged in as <span className="font-medium">{user}</span>. We've pre-filled your information.
              </p>
            ) : (
              <p className="text-sm text-blue-700">
                Checkout as guest or <Link to="/users/login" className="font-medium underline hover:text-blue-600">log in</Link> to save your order to your account.
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    id="firstName"
                    {...register('firstName')}
                    className="mt-0 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    id="lastName"
                    {...register('lastName')}
                    className="mt-0 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    id="address"
                    {...register('address')}
                    className="mt-0 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>}
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    id="city"
                    {...register('city')}
                    className="mt-0 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    id="zip"
                    {...register('zip')}
                    className="mt-0 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.zip && <p className="text-sm text-red-600 mt-1">{errors.zip.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Card Name</label>
                  <input
                    id="cardName"
                    {...register('cardName')}
                    className="mt-0 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.cardName && <p className="text-sm text-red-600 mt-1">{errors.cardName.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    id="cardNumber"
                    {...register('cardNumber')}
                    placeholder="1234123412341234"
                    className="mt-0 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.cardNumber && <p className="text-sm text-red-600 mt-1">{errors.cardNumber.message}</p>}
                </div>
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    id="expiry"
                    {...register('expiry')}
                    placeholder="MM/YY"
                    className="mt-0 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.expiry && <p className="text-sm text-red-600 mt-1">{errors.expiry.message}</p>}
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    id="cvv"
                    {...register('cvv')}
                    placeholder="123"
                    className="mt-0 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.cvv && <p className="text-sm text-red-600 mt-1">{errors.cvv.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : `Pay £${totalPrice}`}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200 sticky top-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <ul className="divide-y divide-gray-200 mb-4">
              {items.map((item) => (
                <li key={item.pet.id} className="py-4 flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{item.pet.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">£{item.price * item.quantity}</p>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
              <span className="text-base font-medium text-gray-900">Total</span>
              <span className="text-xl font-bold text-blue-600">£{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
