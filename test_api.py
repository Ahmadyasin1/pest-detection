import requests
import json
from datetime import datetime

def test_metrics_endpoint():
    url = "https://cropbugdetection.pythonanywhere.com/metrics"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    print(f"\nTesting API endpoint: {url}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        print("\nResponse Headers:")
        for key, value in response.headers.items():
            print(f"{key}: {value}")
        
        print("\nResponse Body:")
        try:
            json_response = response.json()
            print(json.dumps(json_response, indent=2))
            
            if "error" in json_response:
                print("\nError Details:")
                print(f"Error: {json_response.get('error', 'No error message')}")
                print(f"Message: {json_response.get('message', 'No message')}")
                print(f"Success: {json_response.get('success', False)}")
        except json.JSONDecodeError:
            print("Raw Response:")
            print(response.text)
            
    except requests.exceptions.Timeout:
        print("Error: Request timed out")
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server")
    except requests.exceptions.RequestException as e:
        print(f"Error occurred: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    test_metrics_endpoint() 