import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const Navbar = ({ cartCount }) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50" data-testid="navbar">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-gray-800">SimpleShop</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              data-testid="home-link"
            >
              Home
            </Link>
            
            {/* Cart Icon with Badge */}
            <Link 
              to="/cart" 
              className="relative flex items-center text-gray-700 hover:text-purple-600 transition-colors"
              data-testid="cart-link"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  data-testid="cart-count"
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;