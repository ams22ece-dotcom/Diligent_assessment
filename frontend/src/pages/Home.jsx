import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { ShoppingCart, Filter } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="loading" data-testid="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" data-testid="home-page">
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to SimpleShop
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing products at great prices. Shop with confidence and enjoy fast delivery.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Category Filter */}
        <div className="mb-8 flex items-center space-x-4 flex-wrap gap-2" data-testid="category-filter">
          <div className="flex items-center text-gray-700 font-medium">
            <Filter size={20} className="mr-2" />
            Filter:
          </div>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            data-testid="category-all"
          >
            All Products
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="products-grid">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="card overflow-hidden"
              data-testid={`product-card-${product.id}`}
            >
              {/* Product Image */}
              <Link to={`/product/${product.id}`}>
                <div className="relative overflow-hidden rounded-lg mb-4 h-48 bg-gray-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    data-testid={`product-image-${product.id}`}
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  {product.category}
                </div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-bold text-gray-800 hover:text-purple-600 transition-colors" data-testid={`product-name-${product.id}`}>
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-bold text-gray-800" data-testid={`product-price-${product.id}`}>
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-primary btn-sm flex items-center space-x-2"
                    data-testid={`add-to-cart-${product.id}`}
                  >
                    <ShoppingCart size={16} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12" data-testid="no-products">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;