import requests
import time

# FIXED ROUTE (lat, long)
route = [
    (17.3850, 78.4867),
    (17.3875, 78.4890),
    (17.3900, 78.4920),
    (17.3925, 78.4950),
    (17.3950, 78.4980),
]

index = 0

while True:
    lat, lon = route[index]

    data = {
        "vehicle_id": "TRUCK_1",
        "road_id": "INDUSTRIAL_ROUTE_1",
        "lat": lat,
        "long": lon,
        "speed": 35   # constant realistic speed
    }

    requests.post("http://127.0.0.1:5000/api/location", json=data)

    index += 1
    if index >= len(route):
        index = len(route) - 1   # VEHICLE STOPS (STATIC)

    time.sleep(3)
