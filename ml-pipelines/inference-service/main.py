"""
UPI Fraud Detection - Real-time ML Inference Service
Executes the Hybrid GraphSAGE + GAT Model.
"""
import random
import time
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - INFERENCE PUMP - %(levelname)s - %(message)s")

def extract_subgraph_features(tx_data):
    """Mock connection to Neo4j Redis feature store to grab spatial topology."""
    return {
        "velocity_1h": random.randint(1, 50), 
        "hops_to_mule": random.choice([1, 2, 3, 99]),
        "device_trust": random.uniform(0.1, 1.0)
    }

def run_gnn_model(features):
    """Mock Multi-layer Graph Neural Network forward pass execution."""
    # Base randomized risk
    score = random.uniform(0.01, 0.99)
    
    # Apply deterministic topology assumptions
    if features["hops_to_mule"] <= 2:
        score = max(score, 0.88)  # High risk if closely linked to a mule
    if features["device_trust"] < 0.3:
        score = max(score, 0.75)  # Medium-high risk for untrusted emulators
        
    return score

def process_stream():
    logging.info("Starting ML Inference Service on 'transaction-events' topic...")
    logging.info("Loaded GraphSAGE+GAT ONNX model into GPU memory. Awaiting events...")
    
    # Mock listening to the stream
    try:
        while True:
            time.sleep(4)
            mock_tx = {"transaction_id": f"TXN{random.randint(100000, 999999)}", "amount": random.randint(500, 25000)}
            
            start_time = time.time()
            
            # 1. Feature Engineering
            features = extract_subgraph_features(mock_tx)
            
            # 2. Inference
            score = run_gnn_model(features)
            
            # 3. Publish to Alerts Topic
            latency = (time.time() - start_time) * 1000
            risk_tier = "BLOCK" if score > 0.9 else "REVIEW" if score > 0.75 else "CLEAN"
            
            logging.info(f"Scored {mock_tx['transaction_id']}: {score:.2f} Risk ({risk_tier}) | Latency: {latency:.1f}ms | Topology features: Mules={features['hops_to_mule']} hops")
    
    except KeyboardInterrupt:
        logging.info("Shutting down inference pump.")

if __name__ == "__main__":
    process_stream()
