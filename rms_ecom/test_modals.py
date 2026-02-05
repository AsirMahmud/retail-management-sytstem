
import requests
import json

try:
    response = requests.get('http://localhost:8000/api/ecommerce/public/promotional-modals/')
    if response.status_code == 200:
        data = response.json()
        print(json.dumps(data, indent=2))
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Failed to connect: {e}")
