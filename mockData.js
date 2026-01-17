// Mock Data for the Feed
export const MOCK_VIDEOS = [
  { id: '1', user: '@seller_one', description: 'Check out these sneakers! #kicks', shop: 'Sneaker World', likes: '1.2k', comments: '30', linkedProductId: '101', thumbnail: 'https://via.placeholder.com/400x600/000000/FFFFFF?text=Sneakers+Video' },
  { id: '2', user: '@fashion_guru', description: 'Summer collection is here.', shop: 'Fashion Hub', likes: '4.5k', comments: '120', linkedProductId: '103', thumbnail: 'https://via.placeholder.com/400x600/000000/FFFFFF?text=Fashion+Video' },
  { id: '3', user: '@tech_store', description: 'Latest gadgets for you.', shop: 'Tech Zone', likes: '800', comments: '15', linkedProductId: '102', thumbnail: 'https://via.placeholder.com/400x600/000000/FFFFFF?text=Tech+Video' },
];

// Mock Data for Products
export const MOCK_PRODUCTS = [
  { 
    id: '101', name: 'Premium Sneakers', price: '$120.00', 
    description: 'High-performance sneakers designed for comfort and style. Features breathable mesh and cushioned sole.',
    reviews: [{ id: 'r1', user: 'Mike', rating: 5, comment: 'Super comfortable!' }, { id: 'r2', user: 'Sarah', rating: 4, comment: 'Great style, fits true to size.' }]
  },
  { 
    id: '102', name: 'Sport Watch', price: '$250.00',
    description: 'Track your fitness goals with precision. Water-resistant, heart rate monitor, and 7-day battery life.',
    reviews: [{ id: 'r3', user: 'Alex', rating: 5, comment: 'Best watch I have owned.' }]
  },
  { 
    id: '103', name: 'Running Tee', price: '$45.00',
    description: 'Lightweight, sweat-wicking fabric to keep you cool during your most intense runs.',
    reviews: []
  },
  { 
    id: '104', name: 'Gym Bag', price: '$60.00',
    description: 'Spacious gym bag with separate shoe compartment and water-resistant coating.',
    reviews: [{ id: 'r4', user: 'Chris', rating: 4, comment: 'Good quality, but could use more pockets.' }]
  },
];

// Mock Data for Orders
export const MOCK_ORDERS = [
  { id: '1001', date: 'Oct 24, 2023', total: '$120.00', status: 'Delivered', items: 'Premium Sneakers' },
  { id: '1002', date: 'Oct 15, 2023', total: '$45.00', status: 'Processing', items: 'Running Tee' },
  { id: '1003', date: 'Sep 28, 2023', total: '$250.00', status: 'Cancelled', items: 'Sport Watch' },
  { id: '1004', date: 'Sep 10, 2023', total: '$60.00', status: 'Delivered', items: 'Gym Bag' },
];

// Mock Data for Finances
export const MOCK_FINANCIAL_SUMMARY = {
  totalRevenue: '$1,855.00',
  pendingPayout: '$450.00',
  lastPayout: '$1,405.00',
};

export const MOCK_TRANSACTIONS = [
  { id: 't1', date: 'Oct 26, 2023', type: 'Sale', description: 'Order #1002', amount: '+$45.00', status: 'Pending' },
  { id: 't2', date: 'Oct 25, 2023', type: 'Withdrawal', description: 'Bank Transfer', amount: '-$1,405.00', status: 'Completed' },
  { id: 't3', date: 'Oct 24, 2023', type: 'Sale', description: 'Order #1001', amount: '+$120.00', status: 'Completed' },
  { id: 't4', date: 'Oct 23, 2023', type: 'Fee', description: 'Platform Fee', amount: '-$12.00', status: 'Completed' },
  { id: 't5', date: 'Oct 22, 2023', type: 'Sale', description: 'Order #1000', amount: '+$60.00', status: 'Completed' },
];