"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // Ito yung ginawa nating tulay

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ activeUsers: 142, totalMatches: 1250 }); // Fake stats muna

  // Kukunin natin ang mga "Pending" reports mula sa database kapag nag-load ang page
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('status', 'Pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
    } else {
      setReports(data || []);
    }
  };

  // Papalitan nito ang status sa database kapag may pinindot ka
  const handleAction = async (id, action) => {
    const { error } = await supabase
      .from('reports')
      .update({ status: action })
      .eq('id', id);

    if (error) {
      alert("May error sa server: " + error.message);
    } else {
      setReports(reports.filter(r => r.id !== id));
      alert(`Report successfully marked as ${action}!`);
    }
  };

  /* ── Design Tokens ── */
  const D = {
    pageBg: "#030008",
    blob1: "#6D28D9", blob2: "#9D174D", blob3: "#0E7490",
    cardBg: "rgba(255,255,255,0.04)",
    cardBdr: "rgba(255,255,255,0.09)",
    cardShadow: "0 0 1px rgba(109,40,217,0.12), 0 32px 80px rgba(3,0,8,0.9), inset 0 1px 0 rgba(255,255,255,0.07)",
    panelBg: "rgba(255,255,255,0.04)",
    panelBdr: "rgba(255,255,255,0.08)",
    textPri: "#EDE9FE", textMut: "rgba(196,181,253,0.45)",
    accent: "#A78BFA",
    logoGrad: "linear-gradient(90deg, #C4B5FD 0%, #F9A8D4 50%, #67E8F9 100%)",
  };

  return (
    <div style={{ height: "100dvh", width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", position: "relative", overflow: "hidden", background: D.pageBg, fontFamily: "'Figtree', sans-serif", boxSizing: "border-box" }}>
      
      {/* ── AURORA BACKGROUND ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(90px)", opacity: 0.3, width: "500px", height: "500px", top: "10%", left: "10%", background: D.blob1 }} />
        <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(90px)", opacity: 0.3, width: "400px", height: "400px", bottom: "10%", right: "-5%", background: D.blob2 }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
      </div>

      {/* ── MAIN ADMIN WINDOW ── */}
      <div style={{ width: "100%", maxWidth: "1100px", height: "min(90vh, 800px)", borderRadius: "24px", background: D.cardBg, backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", border: `1px solid ${D.cardBdr}`, boxShadow: D.cardShadow, display: "flex", zIndex: 10, overflow: "hidden" }}>
        
        {/* ── SIDEBAR ── */}
        <div style={{ width: "240px", borderRight: `1px solid ${D.panelBdr}`, display: "flex", flexDirection: "column", padding: "24px 16px", background: "rgba(0,0,0,0.2)" }}>
          <h1 style={{ margin: "0 0 30px 8px", fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.1em", backgroundImage: D.logoGrad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            PUYATAN ADMIN
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            <button onClick={() => setActiveTab("overview")} style={{ background: activeTab === "overview" ? "rgba(255,255,255,0.08)" : "transparent", border: "none", padding: "12px 16px", borderRadius: "12px", color: activeTab === "overview" ? D.textPri : D.textMut, textAlign: "left", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "0.2s" }}>
              📊 Overview
            </button>
            <button onClick={() => setActiveTab("moderation")} style={{ background: activeTab === "moderation" ? "rgba(255,255,255,0.08)" : "transparent", border: "none", padding: "12px 16px", borderRadius: "12px", color: activeTab === "moderation" ? D.textPri : D.textMut, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "0.2s" }}>
              🛡️ Moderation
              {reports.length > 0 && <span style={{ background: "#E11D48", color: "#fff", padding: "2px 8px", borderRadius: "99px", fontSize: "10px" }}>{reports.length}</span>}
            </button>
          </div>

          <Link href="/" style={{ textDecoration: "none", color: D.textMut, fontSize: "12px", fontWeight: 600, padding: "12px 16px", display: "block", marginTop: "auto", borderTop: `1px dashed ${D.panelBdr}` }}>
            ← Back to App
          </Link>
        </div>

        {/* ── MAIN CONTENT AREA ── */}
        <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          
          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div style={{ animation: "fadeIn 0.3s ease-out" }}>
              <h2 style={{ margin: "0 0 24px 0", color: D.textPri, fontSize: "24px" }}>System Overview</h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
                <div style={{ background: D.panelBg, border: `1px solid ${D.panelBdr}`, padding: "20px", borderRadius: "16px" }}>
                  <span style={{ fontSize: "11px", color: D.textMut, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>Active Users</span>
                  <div style={{ fontSize: "2.5rem", fontFamily: "'Bebas Neue', sans-serif", color: "#4ADE80", marginTop: "8px" }}>{stats.activeUsers}</div>
                </div>
                <div style={{ background: D.panelBg, border: `1px solid ${D.panelBdr}`, padding: "20px", borderRadius: "16px" }}>
                  <span style={{ fontSize: "11px", color: D.textMut, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>Total Matches Today</span>
                  <div style={{ fontSize: "2.5rem", fontFamily: "'Bebas Neue', sans-serif", color: "#60A5FA", marginTop: "8px" }}>{stats.totalMatches}</div>
                </div>
                <div style={{ background: D.panelBg, border: `1px solid ${D.panelBdr}`, padding: "20px", borderRadius: "16px" }}>
                  <span style={{ fontSize: "11px", color: D.textMut, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>Pending Reports</span>
                  <div style={{ fontSize: "2.5rem", fontFamily: "'Bebas Neue', sans-serif", color: "#F43F5E", marginTop: "8px" }}>{reports.length}</div>
                </div>
              </div>

              <div style={{ background: D.panelBg, border: `1px solid ${D.panelBdr}`, padding: "40px", borderRadius: "16px", textAlign: "center", color: D.textMut, fontSize: "12px", borderStyle: "dashed" }}>
                [ Chart Placeholder: Ilalagay natin dito ang Recharts kapag may database na tayo ]
              </div>
            </div>
          )}

          {/* TAB: MODERATION */}
          {activeTab === "moderation" && (
            <div style={{ animation: "fadeIn 0.3s ease-out" }}>
              <h2 style={{ margin: "0 0 24px 0", color: D.textPri, fontSize: "24px" }}>Active Reports</h2>
              
              {reports.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", color: D.textMut, background: D.panelBg, borderRadius: "16px", border: `1px solid ${D.panelBdr}` }}>
                  🎉 Wala nang pasaway. Linis ng chat natin boss!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {reports.map((report) => (
                    <div key={report.id} style={{ background: D.panelBg, border: `1px solid ${D.panelBdr}`, padding: "16px 20px", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                          <span style={{ background: "rgba(244,63,94,0.1)", color: "#F43F5E", padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 800 }}>{report.id.slice(0,8)}</span>
                          <span style={{ fontSize: "14px", color: D.textPri, fontWeight: 700 }}>{report.reported_user}</span>
                          <span style={{ fontSize: "12px", color: D.textMut }}>reported by {report.reporter}</span>
                        </div>
                        <div style={{ fontSize: "12px", color: D.textMut }}>
                          <strong style={{ color: D.accent }}>Reason:</strong> {report.reason} &nbsp;|&nbsp; <strong>Room:</strong> {report.room_id}
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => handleAction(report.id, 'Dismissed')} style={{ background: "transparent", border: `1px solid ${D.panelBdr}`, color: D.textMut, padding: "8px 16px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                          Dismiss
                        </button>
                        <button onClick={() => handleAction(report.id, 'Banned')} style={{ background: "rgba(225,29,72,0.15)", border: "1px solid rgba(225,29,72,0.3)", color: "#FDA4AF", padding: "8px 16px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.background="rgba(225,29,72,0.3)"} onMouseLeave={e => e.currentTarget.style.background="rgba(225,29,72,0.15)"}>
                          Ban User
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}