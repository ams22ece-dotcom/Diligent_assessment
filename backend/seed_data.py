"""Script to populate the database with sample products"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Sample products data
SAMPLE_PRODUCTS = [
    {
        "id": str(uuid.uuid4()),
        "name": "Wireless Headphones",
        "description": "Premium noise-canceling wireless headphones with 30-hour battery life. Crystal clear sound and comfortable design for all-day wear.",
        "price": 149.99,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        "category": "Electronics",
        "stock": 50
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Smart Watch",
        "description": "Track your fitness goals with this sleek smartwatch. Features heart rate monitoring, GPS, and water resistance.",
        "price": 299.99,
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
        "category": "Electronics",
        "stock": 35
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Leather Backpack",
        "description": "Stylish and durable leather backpack perfect for work or travel. Multiple compartments keep you organized.",
        "price": 89.99,
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        "category": "Accessories",
        "stock": 25
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Running Shoes",
        "description": "Lightweight running shoes with advanced cushioning technology. Perfect for long-distance runs and daily training.",
        "price": 119.99,
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
        "category": "Footwear",
        "stock": 60
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Coffee Maker",
        "description": "Programmable coffee maker with thermal carafe. Brew the perfect cup every morning with customizable settings.",
        "price": 79.99,
        "image_url": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop",
        "category": "Home & Kitchen",
        "stock": 40
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Yoga Mat",
        "description": "Non-slip yoga mat with extra cushioning. Eco-friendly material perfect for yoga, pilates, and floor exercises.",
        "price": 34.99,
        "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
        "category": "Sports & Fitness",
        "stock": 75
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Desk Lamp",
        "description": "Modern LED desk lamp with adjustable brightness and color temperature. USB charging port included.",
        "price": 45.99,
        "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
        "category": "Home & Kitchen",
        "stock": 55
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Wireless Mouse",
        "description": "Ergonomic wireless mouse with precision tracking. Long battery life and comfortable grip for extended use.",
        "price": 29.99,
        "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
        "category": "Electronics",
        "stock": 100
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Sunglasses",
        "description": "Classic aviator sunglasses with UV protection. Stylish design suitable for any occasion.",
        "price": 59.99,
        "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
        "category": "Accessories",
        "stock": 45
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Water Bottle",
        "description": "Insulated stainless steel water bottle keeps drinks cold for 24 hours or hot for 12 hours. Leak-proof design.",
        "price": 24.99,
        "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
        "category": "Sports & Fitness",
        "stock": 80
    }
]

async def seed_database():
    """Seed the database with sample products"""
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        # Clear existing products
        await db.products.delete_many({})
        print("Cleared existing products")
        
        # Insert sample products
        await db.products.insert_many(SAMPLE_PRODUCTS)
        print(f"Successfully seeded {len(SAMPLE_PRODUCTS)} products")
        
        # Display categories
        categories = await db.products.distinct("category")
        print(f"Categories: {categories}")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())