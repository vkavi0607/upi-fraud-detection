import asyncio
import json
import logging
import os
from neo4j import AsyncGraphDatabase

# Setup basic logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("graph-service")

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password123")
KAFKA_BROKER = os.getenv("KAFKA_BROKER", "localhost:9092")
TOPIC = "transaction-events"

class GraphProcessor:
    def __init__(self, uri, user, password):
        self.driver = AsyncGraphDatabase.driver(uri, auth=(user, password))

    async def close(self):
        await self.driver.close()

    async def initialize_constraints(self):
        # Create constraints to ensure entity uniqueness and fast lookups
        queries = [
            "CREATE CONSTRAINT account_upi_id IF NOT EXISTS FOR (a:Account) REQUIRE a.upi_id IS UNIQUE",
            "CREATE CONSTRAINT device_id IF NOT EXISTS FOR (d:Device) REQUIRE d.device_id IS UNIQUE",
            "CREATE CONSTRAINT ip_address IF NOT EXISTS FOR (i:IP_Address) REQUIRE i.ip_address IS UNIQUE"
        ]
        async with self.driver.session() as session:
            for query in queries:
                await session.run(query)
        logger.info("Neo4j Constraints initialized.")

    async def process_transaction(self, tx_data):
        """
        Merge transaction data into the graph topology.
        This operation must be idempotent and low-latency.
        """
        query = """
        // 1. Merge core entities (Sender, Receiver, Device, IP)
        MERGE (sender:Account {upi_id: $sender_upi_id})
        MERGE (receiver:Account {upi_id: $receiver_upi_id})
        MERGE (device:Device {device_id: $device_id})
        MERGE (ip:IP_Address {ip_address: $ip_address})

        // 2. Create Transaction Relationship
        MERGE (sender)-[r:TRANSFERRED_TO {transaction_id: $tx_id}]->(receiver)
        ON CREATE SET 
            r.amount = toFloat($amount), 
            r.timestamp = $timestamp,
            r.currency = $currency

        // 3. Update connection history
        MERGE (sender)-[sd:USED_DEVICE]->(device)
        ON MATCH SET sd.last_seen = $timestamp
        ON CREATE SET sd.last_seen = $timestamp

        MERGE (device)-[di:CONNECTED_FROM]->(ip)
        ON MATCH SET di.last_seen = $timestamp
        ON CREATE SET di.last_seen = $timestamp
        """
        
        async with self.driver.session() as session:
            await session.run(
                query, 
                sender_upi_id=tx_data["sender_upi_id"],
                receiver_upi_id=tx_data["receiver_upi_id"],
                device_id=tx_data["device_id"],
                ip_address=tx_data["ip_address"],
                tx_id=tx_data["transaction_id"],
                amount=tx_data["amount"],
                timestamp=tx_data["timestamp"],
                currency=tx_data.get("currency", "INR")
            )
        logger.info(f"Graph updated for transaction: {tx_data['transaction_id']}")

async def consume_loop(processor):
    logger.info("Initializing Kafka Consumer (Stub for Proof-of-concept)...")
    logger.info(f"Listening to topic '{TOPIC}' at {KAFKA_BROKER}")
    
    # Normally we would use aiokafka to listen infinitely.
    # For demonstration / standalone execution, we mock an incoming transaction:
    mock_event = {
        "transaction_id": "TXN_MOCK_123456",
        "sender_upi_id": "alice@bank",
        "receiver_upi_id": "bob@bank",
        "amount": 1500.00,
        "currency": "INR",
        "device_id": "DEV-A1B2C3",
        "ip_address": "192.168.1.55",
        "timestamp": "2026-03-26T14:15:00"
    }
    
    # Process the mock event after a short delay to simulate network latency
    await asyncio.sleep(2)
    # await processor.process_transaction(mock_event)
    logger.info("In a live environment, the consumer will continuously ingest aiokafka messages and call processor.process_transaction().")

async def main():
    processor = GraphProcessor(NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD)
    try:
        # await processor.initialize_constraints()
        await consume_loop(processor)
    except Exception as e:
        logger.error(f"Graph service encountered an error: {e}")
    finally:
        await processor.close()

if __name__ == "__main__":
    asyncio.run(main())
