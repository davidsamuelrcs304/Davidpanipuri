import { useState } from 'react';
import { X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    special_instructions: string;
  }) => void;
  totalAmount: number;
}

export function CheckoutModal({ isOpen, onClose, onSubmit, totalAmount }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    special_instructions: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
        <div className="bg-orange-500 text-white p-6 rounded-t-xl flex items-center justify-between">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <button onClick={onClose} className="hover:bg-orange-600 p-2 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="John Doe"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.customer_email}
              onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="john@example.com"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.customer_phone}
              onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="instructions" className="block text-gray-700 font-semibold mb-2">
              Special Instructions
            </label>
            <textarea
              id="instructions"
              value={formData.special_instructions}
              onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
              placeholder="Any special requests or dietary restrictions?"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Total Amount</span>
              <span className="text-2xl font-bold text-orange-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-bold text-lg transition-colors"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}
