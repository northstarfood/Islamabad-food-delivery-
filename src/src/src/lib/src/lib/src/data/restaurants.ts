import type { Restaurant } from '../types';

// ALL restaurants and prices below are fictional demo data for development.
export const restaurants: Restaurant[] = [
  {
    id: 'demo-burger-house',
    name: 'Demo Burger House',
    category: 'Burgers • Fast Food',
    time: '25–35 min',
    rating: '4.8',
    emoji: '🍔',
    menu: [
      { id: 'dbh-1', name: 'Demo Zinger Burger', description: 'Crispy chicken, lettuce, house sauce', price: 650 },
      { id: 'dbh-2', name: 'Demo Smash Burger', description: 'Double beef patty, cheese, pickles', price: 850 },
      { id: 'dbh-3', name: 'Demo Fries', description: 'Salted, regular size', price: 300 },
      { id: 'dbh-4', name: 'Demo Chicken Wings (6 pcs)', description: 'Hot and crispy', price: 700 },
      { id: 'dbh-5', name: 'Demo Soft Drink', description: '345 ml can', price: 150 },
    ],
  },
  {
    id: 'demo-pizza-corner',
    name: 'Demo Pizza Corner',
    category: 'Pizza • Italian',
    time: '30–40 min',
    rating: '4.7',
    emoji: '🍕',
    menu: [
      { id: 'dpc-1', name: 'Demo Margherita (Medium)', description: 'Tomato, mozzarella, basil', price: 1100 },
      { id: 'dpc-2', name: 'Demo Fajita Pizza (Medium)', description: 'Chicken fajita, onions, peppers', price: 1400 },
      { id: 'dpc-3', name: 'Demo Garlic Bread', description: '4 pieces with dip', price: 450 },
      { id: 'dpc-4', name: 'Demo Pasta Alfredo', description: 'Creamy white sauce, chicken', price: 950 },
      { id: 'dpc-5', name: 'Demo Soft Drink', description: '1 litre bottle', price: 200 },
    ],
  },
  {
    id: 'demo-wok-kitchen',
    name: 'Demo Wok Kitchen',
    category: 'Chinese • Asian',
    time: '25–35 min',
    rating: '4.6',
    emoji: '🍜',
    menu: [
      { id: 'dwk-1', name: 'Demo Chicken Chowmein', description: 'Stir-fried noodles with vegetables', price: 750 },
      { id: 'dwk-2', name: 'Demo Egg Fried Rice', description: 'Wok-tossed rice with egg', price: 600 },
      { id: 'dwk-3', name: 'Demo Chicken Manchurian', description: 'Tangy sauce, served with rice', price: 900 },
      { id: 'dwk-4', name: 'Demo Spring Rolls (4 pcs)', description: 'Vegetable filling', price: 400 },
      { id: 'dwk-5', name: 'Demo Hot and Sour Soup', description: 'Single bowl', price: 350 },
    ],
  },
  {
    id: 'demo-grill-house',
    name: 'Demo Grill House',
    category: 'BBQ • Pakistani',
    time: '35–45 min',
    rating: '4.9',
    emoji: '🍗',
    menu: [
      { id: 'dgh-1', name: 'Demo Chicken Tikka (2 pcs)', description: 'Charcoal grilled, with raita', price: 650 },
      { id: 'dgh-2', name: 'Demo Seekh Kebab (4 pcs)', description: 'Spiced minced beef', price: 800 },
      { id: 'dgh-3', name: 'Demo Chicken Karahi (Half)', description: 'Served with naan', price: 1800 },
      { id: 'dgh-4', name: 'Demo Naan', description: 'Fresh from the tandoor', price: 60 },
      { id: 'dgh-5', name: 'Demo Lassi', description: 'Sweet, 400 ml', price: 250 },
    ],
  },
];

export function getRestaurant(id: string | undefined): Restaurant | undefined {
  return restaurants.find((r) => r.id === id);
}
