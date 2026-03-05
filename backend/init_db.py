from database import engine, Base
import models  # Import all models to ensure they are registered with Base.metadata


def init_db():
    print("🚀 Initializing database...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")


if __name__ == "__main__":
    init_db()
