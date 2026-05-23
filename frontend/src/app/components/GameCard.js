"use client";
import React, { useState } from "react";

export default function GameCard({ messageId, question, optionA, optionB, myVote, theirVote, isDark, onVote }) {
  const handleVote = (vote) => {
    if (myVote) return; // already voted
    onVote(messageId, vote);
  };

  const getPercentage = (opt) => {
    let total = 0;
    if (myVote) total++;
    if (theirVote) total++;
    if (total === 0) return 0;

    let count = 0;
    if (myVote === opt) count++;
    if (theirVote === opt) count++;

    return (count / total) * 100;
  };

  const renderOption = (optId, text, color) => {
    const pct = getPercentage(optId);
    const isSelectedByMe = myVote === optId;
    const isSelectedByThem = theirVote === optId;
    
    return (
      <button
        onClick={() => handleVote(optId)}
        disabled={!!myVote}
        className="relative w-full text-left p-3 rounded-xl border transition-all overflow-hidden group"
        style={{ 
          borderColor: isSelectedByMe ? color : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"),
          background: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.5)",
          cursor: myVote ? "default" : "pointer"
        }}
      >
        {/* Progress Bar Background */}
        {(myVote || theirVote) && (
          <div 
            className="absolute top-0 left-0 h-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%`, background: `${color}20` }}
          />
        )}
        
        <div className="relative z-10 flex justify-between items-center">
          <span style={{ fontSize: "12px", fontWeight: 700, color: isDark ? "#E2E8F0" : "#1E293B" }}>
            {text}
          </span>
          <div className="flex gap-1">
            {isSelectedByThem && <span title="Stranger voted this" className="text-[10px]">👤</span>}
            {isSelectedByMe && <span title="You voted this" className="text-[10px]" style={{ color }}>✓</span>}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl w-[260px] sm:w-[300px]" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.05)" }}>
      <div className="flex items-center gap-2">
        <span className="text-xl">🃏</span>
        <span style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", color: isDark ? "#A78BFA" : "#0284C7" }}>
          Would You Rather
        </span>
      </div>
      
      <p style={{ fontSize: "14px", fontWeight: 800, color: isDark ? "#F8FAFC" : "#0F172A", lineHeight: 1.4, margin: "0 0 4px 0" }}>
        {question}
      </p>

      <div className="flex flex-col gap-2">
        {renderOption("A", optionA, "#F472B6")}
        {renderOption("B", optionB, "#38BDF8")}
      </div>
    </div>
  );
}
