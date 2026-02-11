import { useState } from "react";

export default function Reports({ vehicle }) {
  const [dateRange, setDateRange] = useState("today");

  const metrics = {
    today: {
      totalDistance: "240 km",
      totalTime: "8.5 hrs",
      avgSpeed: "28 km/h",
      fuelUsed: "35 L",
      deliveries: 24,
      onTimeRate: 94,
      revenue: "$1,240",
      efficiency: 87,
    },
    week: {
      totalDistance: "1,680 km",
      totalTime: "59.5 hrs",
      avgSpeed: "28.2 km/h",
      fuelUsed: "245 L",
      deliveries: 168,
      onTimeRate: 91,
      revenue: "$8,680",
      efficiency: 85,
    },
    month: {
      totalDistance: "7,200 km",
      totalTime: "255 hrs",
      avgSpeed: "28.2 km/h",
      fuelUsed: "1,050 L",
      deliveries: 720,
      onTimeRate: 89,
      revenue: "$37,200",
      efficiency: 82,
    },
  };

  const currentMetrics = metrics[dateRange];

  const vehicleReports = [
    { id: "VH-001", trips: 12, distance: "145 km", efficiency: "92%", status: "Excellent" },
    { id: "VH-002", trips: 10, distance: "128 km", efficiency: "87%", status: "Good" },
    { id: "VH-003", trips: 8, distance: "102 km", efficiency: "83%", status: "Good" },
    { id: "VH-004", trips: 6, distance: "78 km", efficiency: "79%", status: "Fair" },
    { id: "VH-005", trips: 5, distance: "54 km", efficiency: "75%", status: "Fair" },
  ];

  const deliveryMetrics = [
    { time: "6:00", on_time: 8, late: 1, failed: 0 },
    { time: "9:00", on_time: 12, late: 2, failed: 0 },
    { time: "12:00", on_time: 15, late: 1, failed: 1 },
    { time: "15:00", on_time: 18, late: 2, failed: 0 },
    { time: "18:00", on_time: 10, late: 0, failed: 0 },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📄 Reports & Analytics</h1>
        <p className="page-subtitle">Comprehensive fleet performance metrics</p>
      </div>

      {/* Date Range Selector */}
      <div style={{
        marginBottom: "20px",
        display: "flex",
        gap: "8px",
        background: "white",
        padding: "12px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        width: "fit-content",
      }}>
        {["today", "week", "month"].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            style={{
              padding: "8px 16px",
              background: dateRange === range ? "#1e90ff" : "#f0f4f8",
              color: dateRange === range ? "white" : "#0f172a",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Key Metrics Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "12px",
        marginBottom: "20px",
      }}>
        <div className="metric-card">
          <div className="metric-label">📏 Total Distance</div>
          <div className="metric-value" style={{ color: "#0369a1" }}>{currentMetrics.totalDistance}</div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>vs previous period</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">⏱️ Total Time</div>
          <div className="metric-value" style={{ color: "#0369a1" }}>{currentMetrics.totalTime}</div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>driving hours</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">⚡ Avg Speed</div>
          <div className="metric-value" style={{ color: "#0369a1" }}>{currentMetrics.avgSpeed}</div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>km/h</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">⛽ Fuel Used</div>
          <div className="metric-value" style={{ color: "#0369a1" }}>{currentMetrics.fuelUsed}</div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>liters</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "12px",
        marginBottom: "20px",
      }}>
        <div className="metric-card">
          <div className="metric-label">📦 Total Deliveries</div>
          <div style={{ fontSize: "36px", fontWeight: 700, color: "#059669", margin: "10px 0" }}>
            {currentMetrics.deliveries}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>completed in this period</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">✅ On-Time Delivery Rate</div>
          <div style={{ fontSize: "36px", fontWeight: 700, color: "#0369a1", margin: "10px 0" }}>
            {currentMetrics.onTimeRate}%
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>percentage on time</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">💰 Total Revenue</div>
          <div style={{ fontSize: "36px", fontWeight: 700, color: "#059669", margin: "10px 0" }}>
            {currentMetrics.revenue}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>earned revenue</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">⚙️ Fleet Efficiency</div>
          <div style={{ fontSize: "36px", fontWeight: 700, color: "#0369a1", margin: "10px 0" }}>
            {currentMetrics.efficiency}%
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>overall efficiency score</div>
        </div>
      </div>

      {/* Vehicle Performance Report */}
      <div style={{
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        marginBottom: "20px",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "16px",
          borderBottom: "1px solid #e2e8f0",
          fontWeight: 600,
          fontSize: "14px",
        }}>
          🚛 Vehicle Performance Report
        </div>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
        }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#475569" }}>Vehicle ID</th>
              <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#475569" }}>Trips</th>
              <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#475569" }}>Distance</th>
              <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#475569" }}>Efficiency</th>
              <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#475569" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicleReports.map((report) => (
              <tr key={report.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px", fontSize: "13px", fontWeight: 600 }}>{report.id}</td>
                <td style={{ padding: "12px", fontSize: "13px", color: "#475569" }}>{report.trips}</td>
                <td style={{ padding: "12px", fontSize: "13px", color: "#475569" }}>{report.distance}</td>
                <td style={{ padding: "12px", fontSize: "13px", color: "#475569" }}>{report.efficiency}</td>
                <td style={{ padding: "12px", fontSize: "13px" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 600,
                    background: report.status === "Excellent" ? "#dcfce7" : report.status === "Good" ? "#dbeafe" : "#fef3c7",
                    color: report.status === "Excellent" ? "#166534" : report.status === "Good" ? "#0c4a6e" : "#92400e",
                  }}>
                    {report.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delivery Timeline */}
      <div style={{
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        padding: "16px",
      }}>
        <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "16px" }}>
          📊 Delivery Performance Over Time
        </div>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
        }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#475569" }}>Time Slot</th>
              <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#475569" }}>On-Time</th>
              <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#475569" }}>Late</th>
              <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: 600, color: "#475569" }}>Failed</th>
            </tr>
          </thead>
          <tbody>
            {deliveryMetrics.map((metric, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px", fontSize: "13px", fontWeight: 600 }}>{metric.time}</td>
                <td style={{ padding: "12px", fontSize: "13px" }}>
                  <span style={{ color: "#22c55e", fontWeight: 600 }}>✓ {metric.on_time}</span>
                </td>
                <td style={{ padding: "12px", fontSize: "13px" }}>
                  <span style={{ color: "#f59e0b", fontWeight: 600 }}>⚠ {metric.late}</span>
                </td>
                <td style={{ padding: "12px", fontSize: "13px" }}>
                  <span style={{ color: "#ef4444", fontWeight: 600 }}>✕ {metric.failed}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
