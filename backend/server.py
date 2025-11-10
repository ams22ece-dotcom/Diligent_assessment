from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============= E-COMMERCE MODELS =============

class Product(BaseModel):
    """Product model for the e-commerce store"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    image_url: str
    category: str
    stock: int = 100

class ProductCreate(BaseModel):
    """Model for creating a new product"""
    name: str
    description: str
    price: float
    image_url: str
    category: str
    stock: int = 100

class OrderItem(BaseModel):
    """Single item in an order"""
    product_id: str
    product_name: str
    quantity: int
    price: float

class Order(BaseModel):
    """Order model"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_email: str
    customer_address: str
    customer_phone: str
    items: List[OrderItem]
    total: float
    order_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"

class OrderCreate(BaseModel):
    """Model for creating a new order"""
    customer_name: str
    customer_email: str
    customer_address: str
    customer_phone: str
    items: List[OrderItem]
    total: float


# ============= API ROUTES =============

@api_router.get("/")
async def root():
    """Root endpoint"""
    return {"message": "E-commerce API"}

# Product Routes
@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None):
    """Get all products, optionally filtered by category"""
    query = {}
    if category:
        query["category"] = category
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a single product by ID"""
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    """Create a new product (for admin use)"""
    product_obj = Product(**product.model_dump())
    doc = product_obj.model_dump()
    await db.products.insert_one(doc)
    return product_obj

# Order Routes
@api_router.post("/orders", response_model=Order)
async def create_order(order: OrderCreate):
    """Create a new order (checkout)"""
    order_obj = Order(**order.model_dump())
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = order_obj.model_dump()
    doc['order_date'] = doc['order_date'].isoformat()
    
    await db.orders.insert_one(doc)
    return order_obj

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    """Get order details by ID"""
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Convert ISO string timestamp back to datetime object
    if isinstance(order['order_date'], str):
        order['order_date'] = datetime.fromisoformat(order['order_date'])
    
    return order

@api_router.get("/categories")
async def get_categories():
    """Get all unique product categories"""
    categories = await db.products.distinct("category")
    return {"categories": categories}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()