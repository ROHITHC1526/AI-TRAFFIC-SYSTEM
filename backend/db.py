"""MongoDB Database Configuration"""
from pymongo import MongoClient
from datetime import datetime
import os

# MongoDB connection string - default to localhost
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "ai_traffic_system")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
    # Test connection
    client.server_info()
    db = client[DB_NAME]
    print("[OK] MongoDB connected successfully")
    MONGODB_AVAILABLE = True
except Exception as e:
    print(f"[WARNING] MongoDB not available: {e}")
    print("   Falling back to in-memory storage")
    db = None
    MONGODB_AVAILABLE = False


def get_db():
    """Get MongoDB database instance"""
    return db


def init_collections():
    """Initialize MongoDB collections if they don't exist"""
    if MONGODB_AVAILABLE and db is not None:
        # Create collections with validation
        try:
            # GPS Locations Collection - stores latest GPS per vehicle
            if "gps_locations" not in db.list_collection_names():
                db.create_collection("gps_locations")
                db["gps_locations"].create_index("vehicle_id", unique=True)
                print("[OK] Created gps_locations collection")
            
            # GPS History Collection - stores all GPS records
            if "gps_history" not in db.list_collection_names():
                db.create_collection("gps_history")
                db["gps_history"].create_index("vehicle_id")
                db["gps_history"].create_index("timestamp")
                print("[OK] Created gps_history collection")
            
            # Vehicles Collection - store vehicle metadata
            if "vehicles" not in db.list_collection_names():
                db.create_collection("vehicles")
                db["vehicles"].create_index("vehicle_id", unique=True)
                print("[OK] Created vehicles collection")
        
        except Exception as e:
            print(f"[ERROR] Error initializing collections: {e}")


class GPSLocation:
    """GPS Location Model"""
    
    @staticmethod
    def save_location(vehicle_data):
        """Save/update latest GPS location"""
        if not MONGODB_AVAILABLE or db is None:
            return None
        
        try:
            loc_data = {
                "vehicle_id": vehicle_data.get("vehicle_id"),
                "lat": vehicle_data.get("lat"),
                "long": vehicle_data.get("long"),
                "speed": vehicle_data.get("speed"),
                "road_id": vehicle_data.get("road_id"),
                "destination": vehicle_data.get("destination"),
                "driver_name": vehicle_data.get("driver_name"),
                "timestamp": datetime.now().isoformat(),
                "updated_at": datetime.now(),
            }
            
            result = db["gps_locations"].update_one(
                {"vehicle_id": vehicle_data.get("vehicle_id")},
                {"$set": loc_data},
                upsert=True
            )
            return result
        except Exception as e:
            print(f"[ERROR] Error saving location: {e}")
            return None
    
    @staticmethod
    def save_history(vehicle_data):
        """Save GPS record to history"""
        if not MONGODB_AVAILABLE or db is None:
            return None
        
        try:
            hist_data = {
                "vehicle_id": vehicle_data.get("vehicle_id"),
                "lat": vehicle_data.get("lat"),
                "long": vehicle_data.get("long"),
                "speed": vehicle_data.get("speed"),
                "road_id": vehicle_data.get("road_id"),
                "destination": vehicle_data.get("destination"),
                "driver_name": vehicle_data.get("driver_name"),
                "timestamp": vehicle_data.get("timestamp", datetime.now().isoformat()),
                "created_at": datetime.now(),
                "source": vehicle_data.get("source", "gps_tracker")
            }
            
            result = db["gps_history"].insert_one(hist_data)
            return result
        except Exception as e:
            print(f"[ERROR] Error saving history: {e}")
            return None
    
    @staticmethod
    def get_all_locations():
        """Get all latest GPS locations"""
        if not MONGODB_AVAILABLE or db is None:
            return []
        
        try:
            return list(db["gps_locations"].find({}, {"_id": 0}))
        except Exception as e:
            print(f"[ERROR] Error fetching locations: {e}")
            return []
    
    @staticmethod
    def get_location_by_vehicle(vehicle_id):
        """Get latest location for a vehicle"""
        if not MONGODB_AVAILABLE or db is None:
            return None
        
        try:
            return db["gps_locations"].find_one({"vehicle_id": vehicle_id}, {"_id": 0})
        except Exception as e:
            print(f"[ERROR] Error fetching vehicle location: {e}")
            return None
    
    @staticmethod
    def get_history(vehicle_id=None, limit=100):
        """Get GPS history"""
        if not MONGODB_AVAILABLE or db is None:
            return []
        
        try:
            query = {} if not vehicle_id else {"vehicle_id": vehicle_id}
            return list(db["gps_history"].find(query, {"_id": 0}).sort("timestamp", -1).limit(limit))
        except Exception as e:
            print(f"[ERROR] Error fetching history: {e}")
            return []
