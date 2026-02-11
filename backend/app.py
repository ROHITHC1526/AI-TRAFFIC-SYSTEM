from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from traffic import detect_traffic
from datetime import datetime
from seed_data import initialize_gps_data
from db import init_collections, GPSLocation, MONGODB_AVAILABLE

app = Flask(__name__)
CORS(app)

# Initialize MongoDB
init_collections()

# Store ONLY latest GPS per vehicle (in-memory fallback)
gps_data = {}

# Initialize with seed data on startup
gps_data = initialize_gps_data(gps_data)   # { vehicle_id: gps_object }

# If MongoDB is available, sync seed data to DB
if MONGODB_AVAILABLE:
    for vehicle_data in gps_data.values():
        GPSLocation.save_location(vehicle_data)
        GPSLocation.save_history(vehicle_data)
    print(f"[OK] Synced {len(gps_data)} seed vehicles to MongoDB")

@app.route("/")
def home():
    return "Backend running successfully 🚀"

# RECEIVE GPS DATA (REAL GPS / SIMULATOR)
@app.route("/api/location", methods=["POST"])
def receive_location():
    data = request.json

    vehicle_id = data.get("vehicle_id")
    if not vehicle_id:
        return jsonify({"error": "vehicle_id missing"}), 400

    # add timestamp
    data["timestamp"] = datetime.now().isoformat()

    # store latest position in memory
    gps_data[vehicle_id] = data

    # Save to MongoDB
    if MONGODB_AVAILABLE:
        GPSLocation.save_location(data)
        GPSLocation.save_history(data)

    # traffic detection uses latest data values
    traffic = detect_traffic(list(gps_data.values()))

    return jsonify({
        "message": "GPS received",
        "traffic": traffic,
        "stored": "mongodb" if MONGODB_AVAILABLE else "memory"
    })

# SEND LIVE LOCATIONS TO FRONTEND
@app.route("/api/locations", methods=["GET"])
def get_locations():
    # Prefer MongoDB if available
    if MONGODB_AVAILABLE:
        locations = GPSLocation.get_all_locations()
        if locations:
            return jsonify(locations)
    
    # Fallback to in-memory storage
    return jsonify(list(gps_data.values()))

# GET GPS HISTORY FOR A VEHICLE
@app.route("/api/history/<vehicle_id>", methods=["GET"])
def get_vehicle_history(vehicle_id):
    limit = request.args.get("limit", 100, type=int)
    
    if MONGODB_AVAILABLE:
        history = GPSLocation.get_history(vehicle_id, limit)
        return jsonify({"vehicle_id": vehicle_id, "history": history})
    
    return jsonify({"error": "MongoDB not available"}), 503

# GET ALL GPS HISTORY WITH PAGINATION
@app.route("/api/history", methods=["GET"])
def get_all_history():
    limit = request.args.get("limit", 50, type=int)
    
    if MONGODB_AVAILABLE:
        history = GPSLocation.get_history(limit=limit)
        return jsonify({"total": len(history), "history": history})
    
    return jsonify({"error": "MongoDB not available"}), 503

# GET DATABASE STATUS
@app.route("/api/status", methods=["GET"])
def get_status():
    locations_count = len(gps_data)
    db_status = "[OK] MongoDB Connected" if MONGODB_AVAILABLE else "[WARNING] Using In-Memory Storage"
    
    return jsonify({
        "status": "running",
        "database": db_status,
        "vehicles_tracked": locations_count,
        "timestamp": datetime.now().isoformat()
    })

@app.route("/gps")
def gps_page():
    return render_template("gps.html")

if __name__ == "__main__":
    app.run(debug=True)
