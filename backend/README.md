# TryEverything Backend

## Database Configuration

**PostgreSQL Password:** AmIVqzzLlHaTkiwX

## Setup Instructions

1. Install dependencies: `npm install`
2. Configure environment variables in `.env`
3. Run the server: `npm start`

## API Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Add product (admin only)
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Place order
- `GET /api/deliveries/available` - Get available deliveries
- `POST /api/deliveries/:id/accept` - Accept delivery
- `POST /api/uploads` - Upload file
- `GET /api/notifications` - Get user notifications

## Environment Variables

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=3000