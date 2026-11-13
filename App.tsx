import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CartProvider } from './cart/CartContext';
import CartBar from './components/CartBar';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurant/:restaurantId" element={<RestaurantPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:orderId" element={<ConfirmationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <CartBar />
      </CartProvider>
    </BrowserRouter>
  );
}
