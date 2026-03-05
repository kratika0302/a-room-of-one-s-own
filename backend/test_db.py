import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

print(f"Testing connection to: {DATABASE_URL}")

try:
    # Create an engine
    engine = create_engine(DATABASE_URL)

    # Try to connect and execute a simple query
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))
        version = result.fetchone()
        print("✅ Connection successful!")
        print(f"🐘 PostgreSQL version: {version[0]}")
except Exception as e:
    print("❌ Connection failed!")
    print(f"Error: {e}")
