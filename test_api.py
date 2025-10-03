#!/usr/bin/env python3

import sys
sys.path.append('.')
from server import app
from fastapi.testclient import TestClient

client = TestClient(app)

print('=== API VALIDATION RESULTS ===')

# Test health endpoint
try:
    response = client.get('/api/health')
    print(f'Health Check: {response.status_code} - API Status: {response.json()["status"]}')
except Exception as e:
    print(f'Health Check Failed: {e}')

# Test packages endpoint
try:
    response = client.get('/api/packages')
    plans = response.json()
    print(f'Packages: {response.status_code} - Found {len(plans)} eSIM plans')
    for plan in plans:
        print(f'  - {plan["name"]}: ${plan["price_usd"]} for {plan["duration_days"]} days')
except Exception as e:
    print(f'Packages Failed: {e}')

# Test company info
try:
    response = client.get('/api/company')
    company = response.json()
    print(f'Company Info: {response.status_code} - {company["name"]}')
    print(f'  Address: {company["address"]}')
    print(f'  Phone: {company["phone"]}')
    print(f'  Website: {company["website"]}')
except Exception as e:
    print(f'Company Info Failed: {e}')

# Test eSIM activation
try:
    activation_data = {
        'plan_id': 'tourist-7d',
        'device_imei': '123456789012345',
        'customer_email': 'test@example.com'
    }
    response = client.post('/api/esim/activate', json=activation_data)
    result = response.json()
    print(f'eSIM Activation: {response.status_code} - ID: {result["activation_id"][:8]}...')
except Exception as e:
    print(f'eSIM Activation Failed: {e}')

print('=== API VALIDATION COMPLETE ===')