def detect_traffic(gps_data):
    roads = {}

    # group speeds by road
    for d in gps_data:
        road = d.get("road_id")
        speed = d.get("speed")

        if road is None or speed is None:
            continue

        if road not in roads:
            roads[road] = []

        roads[road].append(speed)

    traffic_status = {}

    for road, speeds in roads.items():
        avg_speed = sum(speeds) / len(speeds)
        vehicle_count = len(speeds)

        if vehicle_count > 5 and avg_speed < 20:
            traffic_status[road] = "HIGH"
        elif vehicle_count > 3:
            traffic_status[road] = "MEDIUM"
        else:
            traffic_status[road] = "LOW"

    return traffic_status
