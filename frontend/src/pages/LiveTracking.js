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

// Demo vehicles for testing
const DEMO_VEHICLES = [
  { vehicle_id: "VH-001", lat: 17.3695, long: 78.4867, speed: 35, driver_name: "Rajesh Kumar", destination: "Madhapur" },
  { vehicle_id: "VH-002", lat: 17.3850, long: 78.4890, speed: 28, driver_name: "Amit Singh", destination: "HITEC City" },
  { vehicle_id: "VH-003", lat: 17.3950, long: 78.4950, speed: 42, driver_name: "Priya Sharma", destination: "Kondapur" },
  { vehicle_id: "VH-004", lat: 17.3500, long: 78.5000, speed: 18, driver_name: "Mohammad Hassan", destination: "Gachibowli" },
  { vehicle_id: "VH-005", lat: 17.4025, long: 78.5040, speed: 32, driver_name: "Sunita Patel", destination: "Kukatpally" },
  { vehicle_id: "VH-006", lat: 17.3600, long: 78.4800, speed: 25, driver_name: "Vikram Reddy", destination: "Uppal" },
  { vehicle_id: "VH-007", lat: 17.4100, long: 78.5100, speed: 38, driver_name: "Nisha Gupta", destination: "Secunderabad" },
  { vehicle_id: "VH-008", lat: 17.3750, long: 78.4950, speed: 22, driver_name: "Arjun Das", destination: "Banjara Hills" },
];

// Auto center map
function AutoCenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== undefined && lng !== undefined) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
}

export default function LiveTracking({ vehicle, vehicles: vehiclesProp, gpsConnected, mobileGPS }) {
  const [vehicles, setVehicles] = useState(Array.isArray(vehiclesProp) && vehiclesProp.length > 0 ? vehiclesProp : DEMO_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState((Array.isArray(vehiclesProp) && vehiclesProp.length > 0 ? vehiclesProp[0] : DEMO_VEHICLES[0]));
  const [routeHistory, setRouteHistory] = useState([]);

  // Realistic route
  const plannedRoute = [
    [17.3850, 78.4867],
    [17.3875, 78.4890],
    [17.3900, 78.4920],
    [17.3925, 78.4950],
    [17.3950, 78.4980],
    [17.3975, 78.5010],
    [17.4000, 78.5040],
  ];

  // Update local vehicles when parent provides them
  useEffect(() => {
    if (Array.isArray(vehiclesProp) && vehiclesProp.length > 0) {
      setVehicles(vehiclesProp);
      if (!selectedVehicle) setSelectedVehicle(vehiclesProp[0]);
      setRouteHistory((prev) => [...prev, [vehiclesProp[0].lat, vehiclesProp[0].long]].slice(-50));
    }
  }, [vehiclesProp]);

  const displayVehicle = selectedVehicle || vehicle || (Array.isArray(vehicles) && vehicles.length > 0 ? vehicles[0] : DEMO_VEHICLES[0]);

  // Primary vehicle position: mobile GPS if available, else backend position
  const vehicleLat = mobileGPS.available && mobileGPS.lat !== null ? mobileGPS.lat : displayVehicle.lat;
  const vehicleLng = mobileGPS.available && mobileGPS.lng !== null ? mobileGPS.lng : displayVehicle.long;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📍 Live Tracking</h1>
        <p className="page-subtitle">Track all vehicles in real-time</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "16px", height: "calc(100vh - 140px)" }}>
        {/* Vehicles List */}
        <div style={{
          background: "white",
          borderRadius: "10px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{
            padding: "16px",
            borderBottom: "1px solid #e2e8f0",
            fontWeight: 600,
            fontSize: "14px",
          }}>
            🚚 Available Vehicles {(Array.isArray(vehicles) ? vehicles.length : 0)}
          </div>
          <div style={{ overflow: "auto", flex: 1 }}>
            {Array.isArray(vehicles) && vehicles.length > 0 ? (
              vehicles.map((v) => (
                <div
                  key={v.vehicle_id}
                  onClick={() => setSelectedVehicle(v)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f0f4f8",
                    background: selectedVehicle?.vehicle_id === v.vehicle_id ? "#f0f9ff" : "white",
                    borderLeft: selectedVehicle?.vehicle_id === v.vehicle_id ? "4px solid #0369a1" : "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedVehicle?.vehicle_id !== v.vehicle_id) {
                      e.currentTarget.style.background = "#f8fafc";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedVehicle?.vehicle_id !== v.vehicle_id) {
                      e.currentTarget.style.background = "white";
                    }
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "#0f172a" }}>
                    🚛 {v.vehicle_id}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                    <div>Driver: {v.driver_name || "Unknown"}</div>
                    <div>Destination: {v.destination || "—"}</div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                    Speed: {v.speed ?? "—"} km/h
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Status: <span style={{ color: gpsConnected ? "#22c55e" : "#ef4444" }}>
                      {gpsConnected ? "🟢 Active" : "🟢 Demo"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "20px", color: "#94a3b8", textAlign: "center" }}>
                No vehicles available
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="map-container">
          <MapContainer
            center={[17.39, 78.49]}
            zoom={14}
            style={{ height: "100%", width: "100%", borderRadius: "10px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {/* Planned Route */}
            <Polyline positions={plannedRoute} color="#3b82f6" weight={2} opacity={0.5} />

            {/* Route History Trail */}
            {routeHistory.length > 1 && (
              <Polyline
                positions={routeHistory}
                color="#1e90ff"
                weight={2}
                opacity={0.6}
              />
            )}

            {/* Display Selected Vehicle */}
            {displayVehicle && vehicleLat !== undefined && vehicleLng !== undefined && (
              <>
                <Marker position={[vehicleLat, vehicleLng]} icon={vehicleIcon}>
                  <Popup>
                    <div>
                      <strong>🚛 {displayVehicle.vehicle_id}</strong>
                      <br />
                      Driver: {displayVehicle.driver_name || "—"}
                      <br />
                      Speed: {displayVehicle.speed ?? "—"} km/h
                      <br />
                      Destination: {displayVehicle.destination || "—"}
                      <br />
                      Lat: {vehicleLat.toFixed(6)}
                      <br />
                      Lng: {vehicleLng.toFixed(6)}
                      {mobileGPS.available && <><br /><span style={{color: '#22c55e'}}>📱 Live GPS</span></> }
                    </div>
                  </Popup>
                </Marker>
                <AutoCenter lat={vehicleLat} lng={vehicleLng} />
              </>
            )}

            {/* All Vehicle Markers */}
            {Array.isArray(vehicles) && vehicles.map((v) => (
              v.vehicle_id !== displayVehicle?.vehicle_id && (
                <Marker key={v.vehicle_id} position={[v.lat, v.long]}>
                  <Popup>
                    <strong>{v.vehicle_id}</strong><br />
                    {v.driver_name}
                  </Popup>
                </Marker>
              )
            ))}

            {/* Mobile GPS Position - only show if different from vehicle position */}
            {!mobileGPS.available && mobileGPS.lat && (
              <Marker position={[mobileGPS.lat, mobileGPS.lng]}>
                <Popup>📱 Your Location</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
