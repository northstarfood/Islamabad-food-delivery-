export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  time: string;
  rating: string;
  emoji: string;
  menu: MenuItem[];
}

export interface CartLine {
  itemId: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  restaurantId: string;
  restaurantName: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    notes: string;
  };
  lines: CartLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'Cash on delivery';
  status: 'Placed (demo)';
}
