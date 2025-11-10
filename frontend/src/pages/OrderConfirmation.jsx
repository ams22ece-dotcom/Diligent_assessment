import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Package } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API}/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading" data-testid="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center" data-testid="order-not-found">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" data-testid="order-confirmation-page">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Message */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Package size={24} className="text-purple-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
          </div>

          {/* Order ID */}
          <div className="mb-6 pb-6 border-b">
            <div className="text-sm text-gray-600">Order ID</div>
            <div className="text-lg font-bold text-gray-800" data-testid="order-id">{order.id}</div>
          </div>

          {/* Customer Info */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="font-bold text-gray-800 mb-3">Customer Information</h3>
            <div className="space-y-2 text-gray-600">
              <div>
                <span className="font-medium">Name:</span> <span data-testid="summary-item-name">{item.name} x {item.quantity}</span>
                <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                  data-testid={`order-item-${index}`}
                >
                  <div>
                    <div className="font-medium text-gray-800">{item.product_name}</div>
                    <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                  </div>
                  <div className="font-bold text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-2xl font-bold text-gray-800">
              <span>Total</span>
              <span data-testid="order-total">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link 
              to="/" 
              className="btn btn-primary flex-1 text-center py-3"
              data-testid="continue-shopping-button"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;