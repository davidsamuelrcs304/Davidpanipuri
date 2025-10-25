import { useState, useEffect } from 'react';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { supabase, MenuItem, CartItem, Order, OrderItem } from './lib/supabase';
import { MenuCard } from './components/MenuCard';
import { Cart } from './components/Cart';
import { CheckoutModal } from './components/CheckoutModal';

function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'pani puri', name: 'Pani Puri' },
    { id: 'sides', name: 'Sides' },
    { id: 'drinks', name: 'Drinks' },
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  async function fetchMenuItems() {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function addToCart(item: MenuItem) {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  }

  function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }

  function removeItem(itemId: string) {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }

  function handleCheckout() {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }

  async function handleOrderSubmit(formData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    special_instructions: string;
  }) {
    try {
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const orderData: Order = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        total_amount: totalAmount,
        special_instructions: formData.special_instructions || undefined,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems: OrderItem[] = cartItems.map((item) => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setCartItems([]);
      setIsCheckoutOpen(false);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 5000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    }
  }

  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <header className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={32} className="text-yellow-200" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">David's Pani Puri</h1>
                <p className="text-orange-100 text-sm md:text-base">
                  Authentic Indian Street Food
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-white text-orange-500 px-4 py-3 rounded-full hover:bg-orange-50 transition-colors flex items-center gap-2 font-semibold shadow-lg"
            >
              <ShoppingCart size={24} />
              <span className="hidden md:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {orderSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-lg shadow-xl z-50 animate-bounce">
          <p className="font-bold text-lg">Order placed successfully!</p>
          <p className="text-sm">We'll contact you shortly with confirmation.</p>
        </div>
      )}

      <section className="bg-gradient-to-r from-yellow-400 to-orange-400 py-16 text-center text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Experience the Authentic Taste of India
          </h2>
          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
            Crispy puris, flavorful fillings, and tangy water - made fresh daily with love!
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading delicious items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-xl">No items available in this category.</p>
          </div>
        )}
      </div>

      <footer className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">David's Pani Puri</h3>
          <p className="text-orange-100 mb-4">Bringing authentic Indian street food to your plate</p>
          <p className="text-sm text-orange-100">
            Contact: (555) 123-4567 | info@davidspanipuri.com
          </p>
        </div>
      </footer>

      <Cart
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleOrderSubmit}
        totalAmount={totalAmount}
      />
    </div>
  );
}

export default App;
