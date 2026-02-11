import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom vehicle icon
const vehicleIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3597/3597084.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [38, 38],
  shadowSize: [41, 41],
  iconAnchor: [19, 38],
  shadowAnchor: [12, 41],
  popupAnchor: [0, -38],
});

// Auto center map on vehicle
function AutoCenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== undefined && lng !== undefined) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
}

// Demo vehicle for testing
const DEMO_VEHICLE = {
  vehicle_id: "VH-001",
  lat: 17.3695,
  long: 78.4867,
  speed: 35,
  timestamp: new Date().toISOString(),
};

export default function Dashboard({ vehicle, vehicles, gpsConnected, mobileGPS }) {
  // Realistic route from Factory to Warehouse in Hyderabad
  const plannedRoute = [
    [17.3695, 78.4867], // Start: HITEC City
    [17.3750, 78.4890],
    [17.3805, 78.4920],
    [17.3860, 78.4950],
    [17.3915, 78.4980],
    [17.3970, 78.5010],
    [17.4025, 78.5040], // End: Madhapur
  ];

  const startLocation = [17.3695, 78.4867];
  const endLocation = [17.4025, 78.5040];

  // Use vehicle data or demo data
  const displayVehicle = vehicle || DEMO_VEHICLE;

  // If mobile GPS is available, use it as the vehicle position (real-time movement)
  // Otherwise, simulate vehicle movement
  const [simulatedLat, setSimulatedLat] = useState(displayVehicle.lat);
  const [simulatedLng, setSimulatedLng] = useState(displayVehicle.long);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedLat((prev) => prev + (Math.random() - 0.5) * 0.0005);
      setSimulatedLng((prev) => prev + (Math.random() - 0.5) * 0.0005);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Primary vehicle position: mobile GPS if available, else simulated
  const vehicleLat = mobileGPS.available && mobileGPS.lat !== null ? mobileGPS.lat : simulatedLat;
  const vehicleLng = mobileGPS.available && mobileGPS.lng !== null ? mobileGPS.lng : simulatedLng;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📊 Live Dashboard</h1>
        <p className="page-subtitle">Real-time vehicle tracking and route monitoring</p>
      </div>

      <div className="map-container">
        <MapContainer
          center={[17.39, 78.49]}
          zoom={14}
          style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Planned Route */}
          <Polyline
            positions={plannedRoute}
            color="#3b82f6"
            weight={3}
            opacity={0.7}
            dashArray="5, 5"
          />

          {/* Start Point */}
          <Marker position={startLocation}>
            <Popup>
              <div>
                <strong>🏭 Factory Warehouse</strong>
                <br />
                Start: HITEC City
              </div>
            </Popup>
          </Marker>

          {/* End Point */}
          <Marker position={endLocation}>
            <Popup>
              <div>
                <strong>🏪 Distribution Center</strong>
                <br />
                End: Madhapur
              </div>
            </Popup>
          </Marker>

          {/* Vehicle Position */}
          <Marker position={[vehicleLat, vehicleLng]} icon={vehicleIcon}>
            <Popup>
              <div>
                <strong>🚛 {displayVehicle.vehicle_id}</strong>
                <br />
                Speed: {displayVehicle.speed ?? "—"} km/h
                <br />
                Lat: {vehicleLat.toFixed(6)}
                <br />
                Lng: {vehicleLng.toFixed(6)}
                {mobileGPS.available && <><br /><span style={{color: '#22c55e'}}>📱 Live GPS</span></> }
              </div>
            </Popup>
          </Marker>
          <AutoCenter lat={vehicleLat} lng={vehicleLng} />

          {/* Mobile GPS Position */}
          {mobileGPS.available && mobileGPS.lat && (
            <Marker position={[mobileGPS.lat, mobileGPS.lng]}>
              <Popup>
                <div>
                  <strong>📱 Your Location</strong>
                  <br />
                  Accuracy: ±{Math.round(mobileGPS.accuracy)}m
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        <div className="metric-card">
          <div className="metric-label">Total Vehicles Active</div>
          <div className="metric-value">8/12</div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>3 on route, 5 idle</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Average Speed</div>
          <div className="metric-value">34 km/h</div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>Current conditions: Moderate</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">On-Time Delivery Rate</div>
          <div className="metric-value">94%</div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>+2% from last week</div>
        </div>
      </div>
    </div>
  );
}
