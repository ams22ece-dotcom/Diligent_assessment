import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const Cart = ({ cart, updateQuantity, removeFromCart }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-12" data-testid="empty-cart">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Link to="/" className="btn btn-primary" data-testid="continue-shopping-empty">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" data-testid="cart-page">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-6"
                data-testid={`cart-item-${item.id}`}
              >
                {/* Product Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    data-testid={`cart-item-image-${item.id}`}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="text-lg font-bold text-gray-800 hover:text-purple-600 transition-colors" data-testid={`cart-item-name-${item.id}`}>
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">{item.category}</p>
                  <p className="text-lg font-bold text-gray-800 mt-2" data-testid={`cart-item-price-${item.id}`}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                    data-testid={`decrease-quantity-${item.id}`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-bold w-8 text-center" data-testid={`cart-item-quantity-${item.id}`}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                    data-testid={`increase-quantity-${item.id}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  data-testid={`remove-item-${item.id}`}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24" data-testid="order-summary">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span data-testid="subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span data-testid="shipping">${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span data-testid="total">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="btn btn-primary w-full py-3 text-lg block text-center"
                data-testid="proceed-to-checkout"
              >
                Proceed to Checkout
              </Link>
              
              <Link 
                to="/" 
                className="btn btn-secondary w-full py-3 mt-3 block text-center"
                data-testid="continue-shopping"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;