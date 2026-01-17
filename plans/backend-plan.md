# Backend Plan for TryEverything App

## Overview
This document outlines the comprehensive backend plan for the TryEverything e-commerce and social media app, covering database design, technologies, architecture, and implementation steps.

## Technologies Stack

### Languages
- **Primary**: JavaScript (Node.js)
- **Database Queries**: SQL (PostgreSQL)
- **Configuration**: JSON, YAML

### Frameworks & Libraries
- **Web Framework**: Express.js
- **Database ORM/SDK**: Supabase JS SDK
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **File Uploads**: Multer + Supabase Storage
- **Cross-Origin**: CORS
- **Environment**: dotenv

### Database & Infrastructure
- **Database**: PostgreSQL via Supabase
- **Hosting**: VERCEL(  MAIN PRIORITY) ,Railway or Render
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime subscriptions

## High-Level Architecture

```mermaid
graph TB
    A[React Native Frontend (Expo)] --> B[Express.js API Server]
    B --> C[Supabase PostgreSQL Database]
    B --> D[Supabase Auth]
    B --> E[Supabase Storage]
    B --> F[Supabase Realtime]

    C --> G[Users Table]
    C --> H[Stores Table]
    C --> I[Products Table]
    C --> J[Videos Table]
    C --> K[Orders Table]
    C --> L[Deliveries Table]
    C --> M[Transactions Table]

    D --> N[JWT Tokens]
    E --> O[Images/Videos]
    F --> P[Real-time Subscriptions]
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uid VARCHAR(255) UNIQUE, -- Supabase Auth UID
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'staff', 'deliverer', 'customer')),
    store_id UUID REFERENCES stores(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Stores Table
```sql
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(255) NOT NULL,
    is_open BOOLEAN DEFAULT TRUE,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Products Table
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url TEXT,
    category VARCHAR(255),
    store_id UUID REFERENCES stores(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Videos Table
```sql
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    description TEXT,
    shop_id UUID REFERENCES stores(id),
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    linked_product_id UUID REFERENCES products(id),
    thumbnail_url TEXT,
    video_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id),
    items JSONB, -- Array of cart items
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    delivery_details JSONB,
    store_id UUID REFERENCES stores(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Deliveries Table
```sql
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    deliverer_id UUID REFERENCES users(id),
    pickup_address TEXT NOT NULL,
    dropoff_address TEXT NOT NULL,
    earnings DECIMAL(10,2),
    distance VARCHAR(255),
    items_count INTEGER,
    pickup_coords POINT,
    dropoff_coords POINT,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'accepted', 'in_progress', 'completed')),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) CHECK (type IN ('sale', 'payout', 'fee')),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints Structure

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID (admin only)

### Stores
- `GET /api/stores` - Get all stores
- `POST /api/stores` - Create store (admin/owner)
- `GET /api/stores/:id` - Get store details
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store

### Products
- `GET /api/products` - Get products (with filters)
- `POST /api/products` - Add product (store owner/staff)
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Videos (Social Feed)
- `GET /api/videos` - Get videos feed
- `POST /api/videos` - Upload video
- `GET /api/videos/:id` - Get video details
- `POST /api/videos/:id/like` - Like video
- `POST /api/videos/:id/comment` - Comment on video

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Place order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status

### Deliveries
- `GET /api/deliveries/available` - Get available deliveries
- `POST /api/deliveries/:id/accept` - Accept delivery
- `GET /api/deliveries/my` - Get my deliveries
- `PUT /api/deliveries/:id/status` - Update delivery status

### Transactions (Finances)
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Record transaction (admin)

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/:id/read` - Mark as read

### Uploads
- `POST /api/uploads/image` - Upload image
- `POST /api/uploads/video` - Upload video

## Security & Authentication
- JWT tokens via Supabase Auth
- Row Level Security (RLS) on all tables
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS configuration
- Rate limiting (future enhancement)

## Real-time Features
- Delivery status updates
- New order notifications
- Social feed updates
- Live chat (future)

## Deployment Strategy
1. Backend deployed on Railway/Render
2. Environment variables configured
3. Database migrations run
4. SSL certificates auto-managed
5. Monitoring and logging set up

## Integration Points
- Frontend makes HTTP requests to API endpoints
- Auth tokens passed in Authorization headers
- Real-time subscriptions for live updates
- File uploads via multipart/form-data

## Next Steps
This plan provides a complete roadmap from database design to deployment. The current backend has foundational code in place, and we can proceed with implementing the remaining components systematically.