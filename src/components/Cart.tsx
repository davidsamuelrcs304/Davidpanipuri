import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { CartItem } from '../lib/supabase';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout, isOpen, onClose }: CartProps) {
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
        <div className="bg-orange-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart size={24} />
            <h2 className="text-2xl font-bold">Your Cart</h2>
          </div>
          <button onClick={onClose} className="hover:bg-orange-600 p-2 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <ShoppingCart size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Your cart is empty</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              {items.map((item) => (
                <div key={item.id} className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 flex-1">{item.name}</h3>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="font-bold text-orange-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-700">Total ({itemCount} items)</span>
                <span className="text-2xl font-bold text-orange-600">${totalAmount.toFixed(2)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-bold text-lg transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
