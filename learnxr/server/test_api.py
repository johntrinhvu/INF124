import requests
import json

BASE_URL = "http://localhost:8000"

def test_create_user():
    # Test data
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    # Create user
    response = requests.post(f"{BASE_URL}/users/", json=user_data)
    print("\nTesting user creation:")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test duplicate email
    response = requests.post(f"{BASE_URL}/users/", json=user_data)
    print("\nTesting duplicate email:")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test duplicate username
    duplicate_username = {
        "username": "testuser",
        "email": "different@example.com",
        "password": "testpassword123"
    }
    response = requests.post(f"{BASE_URL}/users/", json=duplicate_username)
    print("\nTesting duplicate username:")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

def test_root():
    response = requests.get(BASE_URL)
    print("\nTesting root endpoint:")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_root()
    test_create_user() 