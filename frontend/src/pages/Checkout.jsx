import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { CreditCard, User, Mail, Phone, MapPin } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Checkout = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 100;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        ...formData,
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: total
      };

      // Create order
      const response = await axios.post(`${API}/orders`, orderData);
      
      // Clear cart and navigate to confirmation
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${response.data.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen py-8" data-testid="checkout-page">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Customer Information</h2>
              
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <User size={16} className="inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Rahul Kumar"
                    data-testid="customer-name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="rahul@example.com"
                    data-testid="customer-email"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="+91 98765 43210"
                    data-testid="customer-phone"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Shipping Address *
                  </label>
                  <textarea
                    name="customer_address"
                    value={formData.customer_address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="123 Main St, City, State, ZIP"
                    data-testid="customer-address"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-4 text-lg mt-6 flex items-center justify-center space-x-2 disabled:opacity-50"
                data-testid="place-order-button"
              >
                {loading ? (
                  <>
                    <div className="spinner w-5 h-5 border-2"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={24} />
                    <span>Place Order</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24" data-testid="checkout-summary">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm" data-testid={`summary-item-${item.id}`}>
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span data-testid="checkout-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span data-testid="checkout-shipping">${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span data-testid="checkout-total">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;