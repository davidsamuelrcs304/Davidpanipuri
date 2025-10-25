/*
  # David's Pani Puri Database Schema

  1. New Tables
    - `menu_items`
      - `id` (uuid, primary key) - Unique identifier for each menu item
      - `name` (text) - Name of the dish
      - `description` (text) - Description of the item
      - `price` (numeric) - Price in dollars
      - `category` (text) - Category (e.g., 'pani puri', 'sides', 'drinks')
      - `image_url` (text) - URL to item image
      - `is_available` (boolean) - Whether item is currently available
      - `created_at` (timestamptz) - Creation timestamp
    
    - `orders`
      - `id` (uuid, primary key) - Unique identifier for each order
      - `customer_name` (text) - Customer's name
      - `customer_email` (text) - Customer's email
      - `customer_phone` (text) - Customer's phone number
      - `total_amount` (numeric) - Total order amount
      - `status` (text) - Order status (pending, confirmed, preparing, ready, completed)
      - `special_instructions` (text) - Any special requests
      - `created_at` (timestamptz) - Order timestamp
    
    - `order_items`
      - `id` (uuid, primary key) - Unique identifier
      - `order_id` (uuid) - Reference to orders table
      - `menu_item_id` (uuid) - Reference to menu_items table
      - `quantity` (integer) - Number of items ordered
      - `price_at_time` (numeric) - Price when ordered
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to menu_items
    - Add policies for public insert access to orders and order_items
    - Add policies for authenticated users to manage menu_items
*/

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  image_url text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  total_amount numeric(10, 2) NOT NULL CHECK (total_amount >= 0),
  status text DEFAULT 'pending',
  special_instructions text,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_at_time numeric(10, 2) NOT NULL CHECK (price_at_time >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for menu_items (public read access)
CREATE POLICY "Anyone can view menu items"
  ON menu_items FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert menu items"
  ON menu_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update menu items"
  ON menu_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for orders (public can create, only authenticated can view all)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for order_items (public can create with order, authenticated can view)
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category, image_url, is_available) VALUES
  ('Classic Pani Puri (6 pcs)', 'Crispy puris filled with spiced potatoes and chickpeas, served with tangy mint water', 6.99, 'pani puri', 'https://images.pexels.com/photos/13945426/pexels-photo-13945426.jpeg', true),
  ('Deluxe Pani Puri (12 pcs)', 'Double the fun! Our signature pani puri with extra chutneys', 11.99, 'pani puri', 'https://images.pexels.com/photos/13945426/pexels-photo-13945426.jpeg', true),
  ('Spicy Pani Puri (6 pcs)', 'For heat lovers! Extra spicy mint water with our classic filling', 7.49, 'pani puri', 'https://images.pexels.com/photos/13945426/pexels-photo-13945426.jpeg', true),
  ('Sweet & Tangy Pani Puri (6 pcs)', 'Perfect balance of sweet tamarind and tangy flavors', 7.49, 'pani puri', 'https://images.pexels.com/photos/13945426/pexels-photo-13945426.jpeg', true),
  ('Samosa Chaat', 'Crispy samosas topped with chickpeas, yogurt, and chutneys', 8.99, 'sides', 'https://images.pexels.com/photos/14477865/pexels-photo-14477865.jpeg', true),
  ('Bhel Puri', 'Puffed rice mixed with vegetables, sev, and tangy tamarind chutney', 7.99, 'sides', 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg', true),
  ('Papdi Chaat', 'Crispy crackers topped with potatoes, chickpeas, yogurt, and chutneys', 8.49, 'sides', 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg', true),
  ('Masala Chai', 'Authentic Indian spiced tea', 3.99, 'drinks', 'https://images.pexels.com/photos/1793037/pexels-photo-1793037.jpeg', true),
  ('Mango Lassi', 'Sweet and creamy yogurt drink with fresh mango', 4.99, 'drinks', 'https://images.pexels.com/photos/1337824/pexels-photo-1337824.jpeg', true),
  ('Sweet Lassi', 'Traditional sweet yogurt drink', 3.99, 'drinks', 'https://images.pexels.com/photos/1337824/pexels-photo-1337824.jpeg', true);
