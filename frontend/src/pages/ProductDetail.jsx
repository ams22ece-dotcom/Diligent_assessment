import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${quantity} ${product.name}(s) added to cart!`);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  if (loading) {
    return (
      <div className="loading" data-testid="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center" data-testid="product-not-found">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" data-testid="product-detail-page">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-purple-600 mb-6 transition-colors"
          data-testid="back-button"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        {/* Product Detail */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative">
              <div className="rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                  data-testid="product-detail-image"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">
                  {product.category}
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4" data-testid="product-detail-name">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed" data-testid="product-detail-description">
                  {product.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800" data-testid="product-detail-price">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Stock Info */}
                <div className="mb-6">
                  <span className="text-gray-600" data-testid="product-stock">
                    {product.stock > 0 ? (
                      <span className="text-green-600 font-medium">
                        In Stock ({product.stock} available)
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">Out of Stock</span>
                    )}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={decrementQuantity}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      disabled={quantity <= 1}
                      data-testid="quantity-decrease"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-2xl font-bold w-12 text-center" data-testid="quantity-display">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      disabled={quantity >= product.stock}
                      data-testid="quantity-increase"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn btn-primary w-full py-4 text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="add-to-cart-button"
              >
                <ShoppingCart size={24} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;