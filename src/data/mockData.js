export const initialShops = [
  { id: 'shop-1', name: 'Artisan Woodcraft PH', rating: 4.9, location: 'Puerto Princesa, Palawan' },
  { id: 'shop-2', name: 'Nordic Living Manila', rating: 4.8, location: 'BGC, Taguig' },
  { id: 'shop-3', name: 'Palawan Bamboo & Rattan', rating: 4.7, location: 'El Nido, Palawan' }
];

export const initialProducts = [
  {
    id: 1,
    name: 'Palawan Solid Mahogany Dining Table',
    shopId: 'shop-1',
    shopName: 'Artisan Woodcraft PH',
    category: 'Dining',
    style: 'Rustic Wood',
    price: 18500,
    originalPrice: 22000,
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
    colors: ['#704214', '#8B5A2B', '#D2B48C'],
    availableColors: ['Natural Teak', 'Dark Walnut', 'Honey Oak'],
    inStock: true,
    stockCount: 5,
    rating: 4.9,
    description: 'Handcrafted by master carpenters in Palawan using sustainable local mahogany. Features smooth rounded edges and natural grain finish.'
  },
  {
    id: 2,
    name: 'Nordic Minimalist Lounge Chair',
    shopId: 'shop-2',
    shopName: 'Nordic Living Manila',
    category: 'Living Room',
    style: 'Modern Minimalist',
    price: 6400,
    originalPrice: 7500,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    colors: ['#A3B18E', '#3A5A40', '#E5DFD3'],
    availableColors: ['Sage Green', 'Forest Moss', 'Warm Beige'],
    inStock: true,
    stockCount: 12,
    rating: 4.8,
    description: 'Ergonomic lounging chair with solid ash wood framing and breathable cotton-linen upholstery. Perfect for reading corners.'
  },
  {
    id: 3,
    name: 'Rattan Accent Bedside Drawer',
    shopId: 'shop-3',
    shopName: 'Palawan Bamboo & Rattan',
    category: 'Bedroom',
    style: 'Scandinavian',
    price: 3200,
    originalPrice: 3800,
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=800&q=80',
    colors: ['#D2B48C', '#8B5A2B'],
    availableColors: ['Natural Rattan', 'Bleached Cane'],
    inStock: true,
    stockCount: 8,
    rating: 4.7,
    description: 'Hand-woven natural cane webbing side table with smooth gliding solid wood drawer.'
  },
  {
    id: 4,
    name: 'Executive Ergonomic Oak Desk',
    shopId: 'shop-1',
    shopName: 'Artisan Woodcraft PH',
    category: 'Office',
    style: 'Modern Minimalist',
    price: 12500,
    originalPrice: 14000,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    colors: ['#704214', '#54320F'],
    availableColors: ['Espresso', 'Golden Oak'],
    inStock: false,
    stockCount: 0,
    rating: 4.9,
    description: 'Spacious workspace surface with built-in cable management conduits and solid tapered legs.'
  }
];