import requests
import time
import random
import threading

API_URL = "http://localhost:8000/api/v1/transactions"

upi_users = [f"user{i}@bank" for i in range(1, 50)]
devices = [f"DEV-{random.randint(100, 999)}" for _ in range(20)]

def pump_worker():
    while True:
        sender = random.choice(upi_users)
        receiver = random.choice(upi_users)
        if receiver == sender:
            continue
            
        payload = {
            "sender_upi_id": sender,
            "receiver_upi_id": receiver,
            "amount": random.uniform(10.0, 95000.0),
            "device_id": random.choice(devices),
            "ip_address": f"192.168.1.{random.randint(1, 255)}"
        }
        
        try:
            requests.post(API_URL, json=payload, timeout=2)
        except Exception:
            pass
        
        # 1-3 seconds organic delay
        time.sleep(random.uniform(0.5, 3.0))

print("Starting LIVE high-throughput transaction pump to API Gateway...")
print("This will send real POST requests to FastAPI, which streams it to React via WebSocket.")

# Spin up 3 fake user workers to generate concurrent organic traffic
for _ in range(3):
    t = threading.Thread(target=pump_worker, daemon=True)
    t.start()

# Keep script running
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\nData pump stopped.")
