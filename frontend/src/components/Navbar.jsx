import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';

const Navbar = ({ cartCount }) => {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50" data-testid="navbar">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-bold text-gray-800">DiligentStore</span>
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

            {/* User Account */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium" data-testid="user-name">Hi, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 font-medium transition-colors"
                  data-testid="logout-button"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center text-gray-700 hover:text-purple-600 transition-colors"
                data-testid="login-link"
              >
                <User size={24} className="mr-1" />
                <span className="font-medium">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;