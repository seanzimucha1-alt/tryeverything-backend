// Firestore Collections and Document Structures

// Users Collection
const userSchema = {
    uid: 'string', // Firebase Auth UID
    email: 'string',
    name: 'string',
    role: 'string', // 'admin', 'staff', 'deliverer', 'customer'
    createdAt: 'timestamp',
    storeId: 'string', // For staff/deliverers
};

// Stores Collection
const storeSchema = {
    id: 'string',
    name: 'string',
    address: 'string',
    city: 'string',
    isOpen: 'boolean',
    ownerId: 'string', // User ID
    createdAt: 'timestamp',
};

// Products Collection
const productSchema = {
    id: 'string',
    name: 'string',
    price: 'number',
    description: 'string',
    imageUrl: 'string',
    category: 'string',
    reviews: 'array', // Array of review objects
    storeId: 'string',
    createdAt: 'timestamp',
};

// Videos Collection
const videoSchema = {
    id: 'string',
    user: 'string',
    description: 'string',
    shop: 'string',
    likes: 'number',
    comments: 'number',
    linkedProductId: 'string',
    thumbnailUrl: 'string',
    videoUrl: 'string',
    createdAt: 'timestamp',
};

// Orders Collection
const orderSchema = {
    id: 'string',
    customerId: 'string',
    items: 'array', // Array of cart items
    total: 'number',
    status: 'string', // 'pending', 'processing', 'shipped', 'arrived'//', 'cancelled'
    deliveryDetails: 'object',
    createdAt: 'timestamp',
    storeId: 'string',
};

// Deliveries Collection
const deliverySchema = {
    id: 'string',
    orderId: 'string',
    delivererId: 'string',
    pickupAddress: 'string',
    dropoffAddress: 'string',
    earnings: 'number',
    distance: 'string',
    itemsCount: 'number',
    pickupCoords: 'geoPoint',
    dropoffCoords: 'geoPoint',
    status: 'string', // 'available', 'accepted', 'in_progress', 'completed'
    createdAt: 'timestamp',
};

// Transactions Collection
const transactionSchema = {
    id: 'string',
    userId: 'string',
    type: 'string', // 'sale', 'payout', 'fee'
    amount: 'number',
    description: 'string',
    status: 'string',
    createdAt: 'timestamp',
};

module.exports = {
    userSchema,
    storeSchema,
    productSchema,
    videoSchema,
    orderSchema,
    deliverySchema,
    transactionSchema,
};