"""
Seed data for AI Traffic System
Generates realistic vehicle GPS data for Hyderabad city
"""
from datetime import datetime
import random

def get_seed_vehicles():
    """Generate 12 vehicles with realistic GPS data for Hyderabad"""
    
    base_time = datetime.now().isoformat()
    
    vehicles = [
        {
            "vehicle_id": "VH-001",
            "lat": 17.3695,
            "long": 78.4867,
            "speed": 35,
            "road_id": "RD-001",
            "timestamp": base_time,
            "driver_name": "Rajesh Kumar",
            "destination": "Madhapur",
        },
        {
            "vehicle_id": "VH-002",
            "lat": 17.3850,
            "long": 78.4890,
            "speed": 28,
            "road_id": "RD-001",
            "timestamp": base_time,
            "driver_name": "Amit Singh",
            "destination": "HITEC City",
        },
        {
            "vehicle_id": "VH-003",
            "lat": 17.3950,
            "long": 78.4950,
            "speed": 42,
            "road_id": "RD-002",
            "timestamp": base_time,
            "driver_name": "Priya Sharma",
            "destination": "Kondapur",
        },
        {
            "vehicle_id": "VH-004",
            "lat": 17.3500,
            "long": 78.5000,
            "speed": 18,
            "road_id": "RD-002",
            "timestamp": base_time,
            "driver_name": "Mohammad Hassan",
            "destination": "Gachibowli",
        },
        {
            "vehicle_id": "VH-005",
            "lat": 17.4025,
            "long": 78.5040,
            "speed": 32,
            "road_id": "RD-003",
            "timestamp": base_time,
            "driver_name": "Sunita Patel",
            "destination": "Kukatpally",
        },
        {
            "vehicle_id": "VH-006",
            "lat": 17.3600,
            "long": 78.4800,
            "speed": 25,
            "road_id": "RD-001",
            "timestamp": base_time,
            "driver_name": "Vikram Reddy",
            "destination": "Uppal",
        },
        {
            "vehicle_id": "VH-007",
            "lat": 17.4100,
            "long": 78.5100,
            "speed": 38,
            "road_id": "RD-003",
            "timestamp": base_time,
            "driver_name": "Nisha Gupta",
            "destination": "Secunderabad",
        },
        {
            "vehicle_id": "VH-008",
            "lat": 17.3750,
            "long": 78.4950,
            "speed": 22,
            "road_id": "RD-002",
            "timestamp": base_time,
            "driver_name": "Arjun Das",
            "destination": "Banjara Hills",
        },
        {
            "vehicle_id": "VH-009",
            "lat": 17.3400,
            "long": 78.4700,
            "speed": 40,
            "road_id": "RD-001",
            "timestamp": base_time,
            "driver_name": "Divya Singh",
            "destination": "Hyderabad Central",
        },
        {
            "vehicle_id": "VH-010",
            "lat": 17.4200,
            "long": 78.5200,
            "speed": 30,
            "road_id": "RD-004",
            "timestamp": base_time,
            "driver_name": "Ravi Kumar",
            "destination": "Jeedimetla",
        },
        {
            "vehicle_id": "VH-011",
            "lat": 17.3300,
            "long": 78.4600,
            "speed": 25,
            "road_id": "RD-004",
            "timestamp": base_time,
            "driver_name": "Priyanka Desai",
            "destination": "LB Nagar",
        },
        {
            "vehicle_id": "VH-012",
            "lat": 17.3550,
            "long": 78.4850,
            "speed": 35,
            "road_id": "RD-002",
            "timestamp": base_time,
            "driver_name": "Sanjay Rao",
            "destination": "Vanasthalipuram",
        },
    ]
    
    return vehicles


def get_seed_routes():
    """Generate 5 delivery routes with waypoints"""
    
    routes = [
        {
            "id": 1,
            "name": "Route A: Factory → Warehouse",
            "distance": "12.5 km",
            "duration": "28 min",
            "stops": 5,
            "vehicles": 2,
            "status": "active",
            "waypoints": [
                [17.3695, 78.4867],
                [17.3750, 78.4890],
                [17.3805, 78.4920],
                [17.3860, 78.4950],
                [17.3915, 78.4980],
                [17.3970, 78.5010],
                [17.4025, 78.5040],
            ],
        },
        {
            "id": 2,
            "name": "Route B: Store Distribution",
            "distance": "18.3 km",
            "duration": "42 min",
            "stops": 8,
            "vehicles": 3,
            "status": "active",
            "waypoints": [
                [17.3500, 78.5000],
                [17.3600, 78.4950],
                [17.3700, 78.4900],
                [17.3800, 78.5050],
                [17.3900, 78.5100],
            ],
        },
        {
            "id": 3,
            "name": "Route C: Evening Run",
            "distance": "9.7 km",
            "duration": "22 min",
            "stops": 3,
            "vehicles": 1,
            "status": "pending",
            "waypoints": [
                [17.4100, 78.5100],
                [17.4150, 78.5050],
                [17.4200, 78.5150],
            ],
        },
        {
            "id": 4,
            "name": "Route D: CBD Deliveries",
            "distance": "15.2 km",
            "duration": "35 min",
            "stops": 6,
            "vehicles": 2,
            "status": "active",
            "waypoints": [
                [17.3300, 78.4600],
                [17.3400, 78.4700],
                [17.3500, 78.4800],
                [17.3600, 78.4900],
            ],
        },
        {
            "id": 5,
            "name": "Route E: Outskirts Loop",
            "distance": "22.1 km",
            "duration": "48 min",
            "stops": 9,
            "vehicles": 3,
            "status": "active",
            "waypoints": [
                [17.4100, 78.5100],
                [17.4200, 78.5200],
                [17.4300, 78.5300],
                [17.4400, 78.5400],
            ],
        },
    ]
    
    return routes


def get_seed_delivery_metrics():
    """Generate delivery performance data"""
    
    metrics = {
        "today": {
            "totalDistance": "240 km",
            "totalTime": "8.5 hrs",
            "avgSpeed": "28 km/h",
            "fuelUsed": "35 L",
            "deliveries": 24,
            "onTimeRate": 94,
            "revenue": "$1,240",
            "efficiency": 87,
        },
        "week": {
            "totalDistance": "1,680 km",
            "totalTime": "59.5 hrs",
            "avgSpeed": "28.2 km/h",
            "fuelUsed": "245 L",
            "deliveries": 168,
            "onTimeRate": 91,
            "revenue": "$8,680",
            "efficiency": 85,
        },
        "month": {
            "totalDistance": "7,200 km",
            "totalTime": "255 hrs",
            "avgSpeed": "28.2 km/h",
            "fuelUsed": "1,050 L",
            "deliveries": 720,
            "onTimeRate": 89,
            "revenue": "$37,200",
            "efficiency": 82,
        },
    }
    
    return metrics


def initialize_gps_data(gps_data_dict):
    """Initialize in-memory GPS data with seeded vehicles"""
    vehicles = get_seed_vehicles()
    for vehicle in vehicles:
        gps_data_dict[vehicle["vehicle_id"]] = vehicle
    return gps_data_dict
