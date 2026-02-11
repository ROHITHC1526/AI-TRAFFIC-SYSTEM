import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Import pages
import Dashboard from "./pages/Dashboard";
import LiveTracking from "./pages/LiveTracking";
import RoutePlanning from "./pages/RoutePlanning";
import Reports from "./pages/Reports";

// 🔑 BACKEND URLs (try local first, then ngrok)
const LOCAL_BACKEND = "http://localhost:5000";
const REMOTE_BACKEND = "https://joaquina-webbier-dena.ngrok-free.dev";

// Demo fallback vehicle used when backend is unreachable
const DEMO_VEHICLE = {
  vehicle_id: "DEMO-001",
  lat: 17.385044,
  long: 78.486671,
  speed: 0,
  timestamp: new Date().toISOString(),
};

// Sidebar Navigation Component
function Sidebar() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "📊 Live Dashboard", path: "/" },
    { id: "route", label: "🗺️ Route Planning", path: "/route-planning" },
    { id: "tracking", label: "📍 Live Tracking", path: "/live-tracking" },
    { id: "reports", label: "📄 Reports", path: "/reports" },
  ];

  const handleNavigation = (id, path) => {
    setActivePage(id);
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🚚 SmartRoutes</h2>
        <p className="sidebar-subtitle">Traffic Management</p>
      </div>
      <ul className="nav-menu">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`nav-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => handleNavigation(item.id, item.path)}
          >
            {item.label}
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <p>v1.0.0</p>
      </div>
    </div>
  );
}

// Info Panel Component
function InfoPanel({ vehicle, gpsConnected, lastUpdate, mobileGPS }) {
  return (
    <div className="info-panel">
      <h3>🛰️ GPS Status</h3>

      <div className={`card ${gpsConnected ? "green" : "red"}`}>
        <p>
          <b>Backend GPS:</b>{" "}
          {gpsConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </p>

        {vehicle && (
          <>
            <p><b>Vehicle ID:</b> {vehicle.vehicle_id}</p>
            <p><b>Speed:</b> {vehicle.speed ?? "—"} km/h</p>
            <p>
              <b>Lat:</b>{" "}
              {vehicle.lat !== undefined ? vehicle.lat.toFixed(6) : "—"}
            </p>
            <p>
              <b>Lng:</b>{" "}
              {vehicle.long !== undefined ? vehicle.long.toFixed(6) : "—"}
            </p>
            <p><b>Updated:</b> {lastUpdate || "—"}</p>
          </>
        )}
      </div>

      <h3>📱 Mobile GPS</h3>
      <div className={`card ${mobileGPS.available ? "green" : "red"}`}>
        <p>
          <b>Status:</b>{" "}
          {mobileGPS.available ? "🟢 Available" : "🔴 Not Available"}
        </p>
        {mobileGPS.lat && (
          <>
            <p><b>Lat:</b> {mobileGPS.lat.toFixed(6)}</p>
            <p><b>Lng:</b> {mobileGPS.lng.toFixed(6)}</p>
            <p><b>Accuracy:</b> ±{Math.round(mobileGPS.accuracy)}m</p>
          </>
        )}
      </div>

      <h3>📍 Current Route</h3>
      <div className="card">
        <p><b>From:</b> Factory Warehouse</p>
        <p><b>To:</b> Distribution Center</p>
        <p><b>Distance:</b> 12.5 km</p>
        <p><b>Status:</b> <span className="status-badge in-progress">In Progress</span></p>
      </div>

      <h3>📊 Statistics</h3>
      <div className="card stats-card">
        <div className="stat">
          <span className="stat-value">8/12</span>
          <span className="stat-label">Active Vehicles</span>
        </div>
        <div className="stat">
          <span className="stat-value">94%</span>
          <span className="stat-label">On-Time Delivery</span>
        </div>
        <div className="stat">
          <span className="stat-value">240km</span>
          <span className="stat-label">Today's Distance</span>
        </div>
      </div>
    </div>
  );
}

// Main App Layout Component
function AppLayout() {
  const [vehicle, setVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [gpsConnected, setGpsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [mobileGPS, setMobileGPS] = useState({
    available: false,
    lat: null,
    lng: null,
    accuracy: null,
  });

  // Fetch vehicle data from backend, choose probe order based on client host
  useEffect(() => {
    const interval = setInterval(async () => {
      // If user opens the UI from a remote device (not localhost), prefer REMOTE_BACKEND
      const hostname = typeof window !== "undefined" ? window.location.hostname : "";
      const tryUrls = (hostname === "localhost" || hostname === "127.0.0.1")
        ? [LOCAL_BACKEND, REMOTE_BACKEND]
        : [REMOTE_BACKEND, LOCAL_BACKEND];
      let success = false;

      for (const base of tryUrls) {
        try {
          const headers = {};
          // ngrok free tier requires this header to bypass browser warning page
          if (base.includes("ngrok")) {
            headers["ngrok-skip-browser-warning"] = "true";
          }
          const res = await axios.get(`${base}/api/locations`, { timeout: 3000, headers });
          if (Array.isArray(res.data) && res.data.length > 0) {
            // eslint-disable-next-line no-console
            console.log(`✅ Connected to backend at ${base} - ${res.data.length} vehicles`);
            const v = res.data[0];
            setVehicle(v);
            setVehicles(res.data);

            if (v.timestamp) {
              const gpsTime = new Date(v.timestamp);
              const now = new Date();
              const diffSeconds = (now - gpsTime) / 1000;
              const FRESHNESS_THRESHOLD = 300; // 5 minutes - allows initial seed data to show as connected

              if (diffSeconds < FRESHNESS_THRESHOLD) {
                setGpsConnected(true);
                setLastUpdate(gpsTime.toLocaleTimeString());
                // eslint-disable-next-line no-console
                console.log(`🟢 GPS data is fresh (${Math.round(diffSeconds)}s old)`);
              } else {
                setGpsConnected(false);
                setLastUpdate(`${gpsTime.toLocaleTimeString()} (${Math.round(diffSeconds)}s old)`);
                // eslint-disable-next-line no-console
                console.warn(`⚠️ GPS data is stale (${Math.round(diffSeconds)}s old, threshold is ${FRESHNESS_THRESHOLD}s)`);
              }
            } else {
              setGpsConnected(false);
              setLastUpdate("no timestamp");
              // eslint-disable-next-line no-console
              console.warn("⚠️ Vehicle has no timestamp");
            }

            success = true;
            break; // stop trying other backends
          }
        } catch (err) {
          // try next backend
          // eslint-disable-next-line no-console
          console.debug(`❌ Backend not reachable at ${base}:`, err.message || err);
        }
      }

      if (!success) {
        // fallback to demo vehicle so UI remains usable
        setVehicle(DEMO_VEHICLE);
        setVehicles([DEMO_VEHICLE]);
        setGpsConnected(false);
        setLastUpdate("demo (backend offline)");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Request browser GPS permissions and track location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setMobileGPS({
            available: true,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.log("Geolocation error:", error.message);
          setMobileGPS({ available: false, lat: null, lng: null, accuracy: null });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <InfoPanel
        vehicle={vehicle}
        gpsConnected={gpsConnected}
        lastUpdate={lastUpdate}
        mobileGPS={mobileGPS}
      />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard vehicle={vehicle} vehicles={vehicles} gpsConnected={gpsConnected} mobileGPS={mobileGPS} />} />
          <Route path="/live-tracking" element={<LiveTracking vehicle={vehicle} vehicles={vehicles} gpsConnected={gpsConnected} mobileGPS={mobileGPS} />} />
          <Route path="/route-planning" element={<RoutePlanning />} />
          <Route path="/reports" element={<Reports vehicle={vehicle} />} />
        </Routes>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
