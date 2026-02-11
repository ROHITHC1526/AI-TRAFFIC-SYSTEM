import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useState } from "react";
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

export default function RoutePlanning() {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: "Route A: Factory → Warehouse",
      distance: "12.5 km",
      duration: "28 min",
      stops: 5,
      vehicles: 2,
      status: "active",
      waypoints: [
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
      id: 2,
      name: "Route B: Store Distribution",
      distance: "18.3 km",
      duration: "42 min",
      stops: 8,
      vehicles: 3,
      status: "active",
      waypoints: [
        [17.3500, 78.5000],
        [17.3600, 78.4950],
        [17.3700, 78.4900],
        [17.3800, 78.5050],
      ],
    },
    {
      id: 3,
      name: "Route C: Evening Run",
      distance: "9.7 km",
      duration: "22 min",
      stops: 3,
      vehicles: 1,
      status: "pending",
      waypoints: [
        [17.4100, 78.5100],
        [17.4150, 78.5050],
        [17.4200, 78.5150],
      ],
    },
  ]);

  const [selectedRoute, setSelectedRoute] = useState(routes[0]);
  const [newRoute, setNewRoute] = useState({
    name: "",
    distance: "",
    duration: "",
  });

  const handleAddRoute = () => {
    if (newRoute.name && newRoute.distance && newRoute.duration) {
      const route = {
        id: routes.length + 1,
        ...newRoute,
        stops: 0,
        vehicles: 0,
        status: "pending",
        waypoints: [],
      };
      setRoutes([...routes, route]);
      setNewRoute({ name: "", distance: "", duration: "" });
      alert("Route added successfully!");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🗺️ Route Planning</h1>
        <p className="page-subtitle">Create and manage delivery routes</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "16px", height: "calc(100vh - 140px)" }}>
        {/* Routes Sidebar */}
        <div style={{
          background: "white",
          borderRadius: "10px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Add New Route Form */}
          <div style={{
            padding: "16px",
            borderBottom: "1px solid #e2e8f0",
            maxHeight: "40%",
            overflow: "auto",
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 600 }}>
              ➕ New Route
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="text"
                placeholder="Route name"
                value={newRoute.name}
                onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              />
              <input
                type="text"
                placeholder="Distance (km)"
                value={newRoute.distance}
                onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              />
              <input
                type="text"
                placeholder="Duration (min)"
                value={newRoute.duration}
                onChange={(e) => setNewRoute({ ...newRoute, duration: e.target.value })}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              />
              <button onClick={handleAddRoute} style={{ padding: "8px 12px", fontSize: "13px" }}>
                Add Route
              </button>
            </div>
          </div>

          {/* Routes List */}
          <div style={{
            padding: "16px",
            overflow: "auto",
            borderTop: "1px solid #e2e8f0",
            flex: 1,
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", color: "#64748b" }}>
              📋 Routes
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {routes.map((route) => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  style={{
                    padding: "12px",
                    background: selectedRoute.id === route.id ? "#f0f9ff" : "#f8fafc",
                    border: selectedRoute.id === route.id ? "1px solid #0369a1" : "1px solid #e2e8f0",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedRoute.id !== route.id) {
                      e.currentTarget.style.background = "#f5f9fc";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedRoute.id !== route.id) {
                      e.currentTarget.style.background = "#f8fafc";
                    }
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: "13px", color: "#0f172a" }}>
                    {route.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                    <div>📏 {route.distance} • ⏱️ {route.duration}</div>
                    <div>🚛 {route.vehicles} vehicles • 📍 {route.stops} stops</div>
                  </div>
                  <div style={{ marginTop: "6px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 8px",
                        borderRadius: "3px",
                        fontSize: "11px",
                        fontWeight: 600,
                        background: route.status === "active" ? "#dcfce7" : "#fef3c7",
                        color: route.status === "active" ? "#166534" : "#92400e",
                      }}
                    >
                      {route.status === "active" ? "🟢 Active" : "🟡 Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="map-container">
          <MapContainer
            center={[17.39, 78.49]}
            zoom={13}
            style={{ height: "100%", width: "100%", borderRadius: "10px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {/* Route Polyline */}
            {selectedRoute.waypoints.length > 1 && (
              <Polyline
                positions={selectedRoute.waypoints}
                color="#3b82f6"
                weight={4}
                opacity={0.8}
              />
            )}

            {/* Route Markers */}
            {selectedRoute.waypoints.map((waypoint, idx) => (
              <Marker key={idx} position={waypoint}>
                <Popup>Stop {idx + 1}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Route Details */}
      <div style={{
        marginTop: "16px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "12px",
      }}>
        <div className="metric-card">
          <div className="metric-label">Distance</div>
          <div className="metric-value">{selectedRoute.distance}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Duration</div>
          <div className="metric-value">{selectedRoute.duration}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Stops</div>
          <div className="metric-value">{selectedRoute.stops}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Vehicles</div>
          <div className="metric-value">{selectedRoute.vehicles}</div>
        </div>
      </div>
    </div>
  );
}
