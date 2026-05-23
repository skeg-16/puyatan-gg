"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import io from "socket.io-client";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [reports, setReports] = useState([]);
  const [bans, setBans] = useState([]);
  const [stats, setStats] = useState({ activeUsers: 0, totalMatches: 0, waitingUsers: 0 });
  const [pwd, setPwd] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const socketRef = useRef(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Connect to Socket.io for Real-time Reports
    const socket = io(backendUrl);
    socketRef.current = socket;
    
    socket.emit("admin_login", pwd);
    
    socket.on("admin_new_report", (newReport) => {
      setReports(prev => [newReport, ...prev]);
    });

    // Initial Fetch
    fetchReports();
    fetchBans();

    // Polling for Live Stats
    const fetchStats = async () => {
      try {
        const res = await fetch(`${backendUrl}/stats`);
        const data = await res.json();
        setStats({
          activeUsers: data.activeUsers || 0,
          totalMatches: data.totalMatches || 0,
          waitingUsers: data.waitingUsers || 0
        });
      } catch (err) {}
    };
    fetchStats();
    const statsInterval = setInterval(fetchStats, 3000);

    return () => {
      clearInterval(statsInterval);
      socket.disconnect();
    };
  }, [isAuthenticated, backendUrl, pwd]);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${backendUrl}/reports`);
      setReports(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchBans = async () => {
    try {
      const res = await fetch(`${backendUrl}/bans`);
      setBans(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleAction = async (id, action) => {
    if (!confirm(`Are you sure you want to mark this report as ${action}?`)) return;
    try {
      await fetch(`${backendUrl}/reports/${id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      fetchReports();
      if (action === "Banned") fetchBans();
    } catch (err) {
      alert("Error updating report.");
    }
  };

  const handleUnban = async (ip) => {
    if (!confirm(`Are you sure you want to unban IP: ${ip}?`)) return;
    try {
      await fetch(`${backendUrl}/bans/unban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip })
      });
      fetchBans();
    } catch (err) {
      alert("Error unbanning user.");
    }
  };

  /* ── Design Tokens ── */
  const D = {
    pageBg: "#0c0406",
    sidebarBg: "#14070a",
    cardBg: "#1a090e",
    cardBdr: "#3b111c",
    textPri: "#fdf2f4",
    textMut: "#fda4af",
    accent: "#e11d48",
    danger: "#f87171",
    success: "#34d399",
  };

  if (!isAuthenticated) {
    return (
      <div style={{ height: "100dvh", width: "100vw", background: D.pageBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: D.sidebarBg, padding: "40px", borderRadius: "12px", textAlign: "center", border: `1px solid ${D.cardBdr}`, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)" }}>
          <h2 style={{ color: D.textPri, marginBottom: "8px", fontSize: "1.5rem", fontWeight: 800 }}>ADMIN PORTAL</h2>
          <p style={{ color: D.textMut, marginBottom: "24px", fontSize: "0.9rem" }}>Please enter your credentials</p>
          <input 
            type="password" 
            value={pwd} 
            onChange={e => setPwd(e.target.value)}
            onKeyDown={e => e.key === "Enter" && pwd === "admin123" && setIsAuthenticated(true)}
            placeholder="Password"
            style={{ padding: "12px 16px", borderRadius: "8px", border: `1px solid ${D.cardBdr}`, background: D.pageBg, color: D.textPri, outline: "none", width: "100%", marginBottom: "16px", boxSizing: "border-box" }}
          />
          <button 
            onClick={() => pwd === "admin123" ? setIsAuthenticated(true) : alert("Invalid Password")}
            style={{ padding: "12px", width: "100%", borderRadius: "8px", background: D.accent, color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", transition: "0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.9} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const pendingReports = reports.filter(r => r.status === "pending");

  return (
    <div style={{ height: "100dvh", width: "100vw", display: "flex", background: D.pageBg, fontFamily: "'Inter', sans-serif", color: D.textPri, overflow: "hidden" }}>
      
      {/* ── SIDEBAR ── */}
      <div style={{ width: "260px", background: D.sidebarBg, borderRight: `1px solid ${D.cardBdr}`, display: "flex", flexDirection: "column", padding: "24px 16px", zIndex: 10 }}>
        <h1 style={{ margin: "0 0 40px 8px", fontSize: "1.2rem", fontWeight: 900, letterSpacing: "0.05em", color: D.accent }}>
          PUYATAN ADMIN
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          <button onClick={() => setActiveTab("overview")} style={{ background: activeTab === "overview" ? D.accent : "transparent", border: "none", padding: "12px 16px", borderRadius: "8px", color: activeTab === "overview" ? "#fff" : D.textMut, textAlign: "left", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "0.2s" }}>
            📊 Dashboard
          </button>
          <button onClick={() => setActiveTab("moderation")} style={{ background: activeTab === "moderation" ? D.accent : "transparent", border: "none", padding: "12px 16px", borderRadius: "8px", color: activeTab === "moderation" ? "#fff" : D.textMut, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "0.2s" }}>
            🛡️ Moderation
            {pendingReports.length > 0 && <span style={{ background: D.danger, color: "#fff", padding: "2px 8px", borderRadius: "99px", fontSize: "11px" }}>{pendingReports.length}</span>}
          </button>
          <button onClick={() => setActiveTab("bans")} style={{ background: activeTab === "bans" ? D.accent : "transparent", border: "none", padding: "12px 16px", borderRadius: "8px", color: activeTab === "bans" ? "#fff" : D.textMut, textAlign: "left", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "0.2s" }}>
            🚫 Ban List
          </button>
        </div>

        <Link href="/" style={{ textDecoration: "none", color: D.textMut, fontSize: "13px", fontWeight: 500, padding: "12px 16px", display: "block", marginTop: "auto", borderTop: `1px solid ${D.cardBdr}` }}>
          ← Exit Admin
        </Link>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        
        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <h2 style={{ margin: "0 0 32px 0", fontSize: "28px", fontWeight: 700 }}>System Overview</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
              <div style={{ background: D.sidebarBg, border: `1px solid ${D.cardBdr}`, padding: "24px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)" }}>
                <span style={{ fontSize: "12px", color: D.textMut, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Active Connections</span>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: D.success, marginTop: "12px" }}>{stats.activeUsers}</div>
              </div>
              <div style={{ background: D.sidebarBg, border: `1px solid ${D.cardBdr}`, padding: "24px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)" }}>
                <span style={{ fontSize: "12px", color: D.textMut, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Users in Queue</span>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: D.textPri, marginTop: "12px" }}>{stats.waitingUsers}</div>
              </div>
              <div style={{ background: D.sidebarBg, border: `1px solid ${D.cardBdr}`, padding: "24px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)" }}>
                <span style={{ fontSize: "12px", color: D.textMut, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Total Matches Today</span>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: D.accent, marginTop: "12px" }}>{stats.totalMatches}</div>
              </div>
              <div style={{ background: D.sidebarBg, border: `1px solid ${D.cardBdr}`, padding: "24px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)" }}>
                <span style={{ fontSize: "12px", color: D.textMut, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Pending Reports</span>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: D.danger, marginTop: "12px" }}>{pendingReports.length}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MODERATION */}
        {activeTab === "moderation" && (
          <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <h2 style={{ margin: "0 0 32px 0", fontSize: "28px", fontWeight: 700 }}>Moderation Queue</h2>
            
            {pendingReports.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px", color: D.textMut, background: D.sidebarBg, borderRadius: "12px", border: `1px solid ${D.cardBdr}` }}>
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎉</div>
                <h3 style={{ fontSize: "1.2rem", color: D.textPri }}>Inbox Zero</h3>
                <p>There are no pending reports to review.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {pendingReports.map((report) => (
                  <div key={report.id} style={{ background: D.sidebarBg, border: `1px solid ${D.cardBdr}`, padding: "24px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                        <span style={{ background: "rgba(239,68,68,0.1)", color: D.danger, padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>REPORT ID: {report.id?.slice(0,8) || "N/A"}</span>
                        <span style={{ fontSize: "13px", color: D.textMut }}>Reported At: {new Date(report.createdAt).toLocaleString()}</span>
                      </div>
                      <div style={{ marginBottom: "16px" }}>
                        <h4 style={{ margin: "0 0 8px 0", color: D.textPri, fontSize: "16px" }}>Violation: {report.reason}</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "13px", color: D.textMut }}>
                          <div><strong>Reported IP:</strong> {report.reportedIp || "Unknown"}</div>
                          <div><strong>Reporter IP:</strong> {report.reporterIp}</div>
                          <div><strong>Room ID:</strong> {report.roomId}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "120px" }}>
                      <button onClick={() => handleAction(report.id, 'Banned')} style={{ background: D.danger, border: "none", color: "#fff", padding: "10px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = 0.9} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                        Ban User IP
                      </button>
                      <button onClick={() => handleAction(report.id, 'Dismissed')} style={{ background: "transparent", border: `1px solid ${D.cardBdr}`, color: D.textPri, padding: "10px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: BANS */}
        {activeTab === "bans" && (
          <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <h2 style={{ margin: "0 0 32px 0", fontSize: "28px", fontWeight: 700 }}>Ban List</h2>
            
            {bans.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px", color: D.textMut, background: D.sidebarBg, borderRadius: "12px", border: `1px solid ${D.cardBdr}` }}>
                <p>No banned users currently.</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", background: D.sidebarBg, borderRadius: "12px", overflow: "hidden", border: `1px solid ${D.cardBdr}` }}>
                <thead style={{ background: "rgba(0,0,0,0.2)" }}>
                  <tr>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: D.textMut, fontWeight: 600, borderBottom: `1px solid ${D.cardBdr}` }}>IP Address</th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: D.textMut, fontWeight: 600, borderBottom: `1px solid ${D.cardBdr}` }}>Reason</th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", color: D.textMut, fontWeight: 600, borderBottom: `1px solid ${D.cardBdr}` }}>Banned At</th>
                    <th style={{ padding: "16px", textAlign: "right", fontSize: "13px", color: D.textMut, fontWeight: 600, borderBottom: `1px solid ${D.cardBdr}` }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bans.map((ban) => (
                    <tr key={ban.ip} style={{ borderBottom: `1px solid ${D.cardBdr}` }}>
                      <td style={{ padding: "16px", fontSize: "14px", fontWeight: 600 }}>{ban.ip}</td>
                      <td style={{ padding: "16px", fontSize: "14px", color: D.danger }}>{ban.reason}</td>
                      <td style={{ padding: "16px", fontSize: "13px", color: D.textMut }}>{new Date(ban.bannedAt).toLocaleString()}</td>
                      <td style={{ padding: "16px", textAlign: "right" }}>
                        <button onClick={() => handleUnban(ban.ip)} style={{ background: "transparent", border: `1px solid ${D.cardBdr}`, color: D.textPri, padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          Revoke Ban
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}