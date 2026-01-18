-- TryEverything Database Schema for Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name VARCHAR(255),
    role VARCHAR(50) CHECK (role IN ('admin', 'staff', 'deliverer', 'customer')) DEFAULT 'customer',
    store_id UUID,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(255) NOT NULL,
    is_open BOOLEAN DEFAULT TRUE,
    owner_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on stores
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- RLS policies for stores
CREATE POLICY "Anyone can view stores" ON stores FOR SELECT USING (true);
CREATE POLICY "Store owners can update their stores" ON stores
    FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Admins can manage all stores" ON stores
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url TEXT,
    category VARCHAR(255),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS policies for products
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Store owners can manage their products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = products.store_id AND stores.owner_id = auth.uid()
        )
    );
CREATE POLICY "Admins can manage all products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    description TEXT,
    store_id UUID REFERENCES stores(id),
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    linked_product_id UUID REFERENCES products(id),
    thumbnail_url TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on videos
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- RLS policies for videos
CREATE POLICY "Anyone can view videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Users can manage their videos" ON videos
    FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all videos" ON videos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES auth.users(id),
    items JSONB,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    delivery_details JSONB,
    store_id UUID REFERENCES stores(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS policies for orders
CREATE POLICY "Customers can view their orders" ON orders
    FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Store owners can view orders for their store" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid()
        )
    );
CREATE POLICY "Admins can view all orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    deliverer_id UUID REFERENCES auth.users(id),
    pickup_address TEXT NOT NULL,
    dropoff_address TEXT NOT NULL,
    earnings DECIMAL(10,2),
    distance VARCHAR(255),
    items_count INTEGER,
    pickup_coords POINT,
    dropoff_coords POINT,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'accepted', 'in_progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on deliveries
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- RLS policies for deliveries
CREATE POLICY "Deliverers can view available deliveries" ON deliveries
    FOR SELECT USING (status = 'available' OR deliverer_id = auth.uid());
CREATE POLICY "Deliverers can update their deliveries" ON deliveries
    FOR UPDATE USING (deliverer_id = auth.uid());
CREATE POLICY "Admins can manage all deliveries" ON deliveries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    type VARCHAR(50) CHECK (type IN ('sale', 'payout', 'fee')),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for transactions
CREATE POLICY "Users can view their transactions" ON transactions
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all transactions" ON transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Set fixed search_path for security
  SET search_path = public;

  INSERT INTO public.profiles (id, name, role)
  VALUES (new.id, new.raw_user_meta_data->>'name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to prevent role changes after initial assignment
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Set fixed search_path for security
  SET search_path = public;

  -- If role is being changed, prevent the update
  IF OLD.role IS NOT NULL AND NEW.role IS NOT NULL AND OLD.role != NEW.role THEN
    RAISE EXCEPTION 'Role cannot be changed after initial assignment. Contact an administrator.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to prevent role changes
CREATE OR REPLACE TRIGGER prevent_role_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_change();