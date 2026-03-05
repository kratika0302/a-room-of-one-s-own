import requests

BASE_URL = "http://127.0.0.1:8000"


def test_auth_flow():
    # 1. Register a new user
    print("Testing Registration...")
    reg_data = {
        "email": "testuser@example.com",
        "username": "testuser",
        "password": "securepassword123"
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
    print(f"Registration Status: {response.status_code}")
    print(f"Registration Response: {response.json()}")

    if response.status_code == 201:
        print("✅ Registration successful!")
    elif response.status_code == 400 and "already registered" in response.text:
        print("ℹ️ User already exists, proceeding to login test.")
    else:
        print("❌ Registration failed!")

    # 2. Login with correct credentials
    print("\nTesting Login (Correct Credentials)...")
    login_data = {
        "email": "testuser@example.com",
        "password": "securepassword123"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print(f"Login Status: {response.status_code}")

    if response.status_code == 200:
        token = response.json().get("access_token")
        print("✅ Login successful!")
        print(f"JWT Token: {token[:20]}...")
    else:
        print("❌ Login failed!")

    # 3. Login with incorrect credentials
    print("\nTesting Login (Incorrect Password)...")
    wrong_login_data = {
        "email": "testuser@example.com",
        "password": "wrongpassword"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=wrong_login_data)
    print(f"Login Status: {response.status_code}")

    if response.status_code == 401:
        print("✅ Incorrect password correctly rejected!")
    else:
        print("❌ Incorrect password test failed!")


if __name__ == "__main__":
    try:
        test_auth_flow()
    except Exception as e:
        print(f"Error connecting to server: {e}")
        print("Make sure uvicorn is running on http://127.0.0.1:8000")
