import { Plus } from 'lucide-react';
import { MenuItem } from '../lib/supabase';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image_url || 'https://images.pexels.com/photos/13945426/pexels-photo-13945426.jpeg'}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {!item.is_available && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Sold Out</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-orange-600">
            ${item.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(item)}
            disabled={!item.is_available}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
