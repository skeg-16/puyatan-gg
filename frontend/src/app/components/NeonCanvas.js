"use client";
import React, { useRef, useState, useEffect } from "react";

export default function NeonCanvas({ socket, room, isDark }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(isDark ? "#A78BFA" : "#0284C7");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    // Fill background slightly
    ctx.fillStyle = isDark ? "#09090b" : "#f1f5f9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const onReceiveDraw = (payload) => {
      if (payload.type !== "draw" || payload.room !== room) return;
      const { x0, y0, x1, y1, color } = payload.data;
      drawLine(ctx, x0, y0, x1, y1, color, true);
    };

    socket.on("receive_action", onReceiveDraw);
    return () => {
      socket.off("receive_action", onReceiveDraw);
    };
  }, [socket, room, isDark]);

  const drawLine = (ctx, x0, y0, x1, y1, strokeColor, isRemote = false) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    
    // Neon glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = strokeColor;
    
    ctx.stroke();
    ctx.closePath();

    if (!isRemote) {
      socket.emit("send_action", {
        type: "draw",
        room,
        data: { x0, y0, x1, y1, color: strokeColor }
      });
    }
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    canvasRef.current.lastX = x;
    canvasRef.current.lastY = y;
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault(); // prevent scrolling while drawing
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    
    drawLine(ctx, canvasRef.current.lastX, canvasRef.current.lastY, x, y, color);
    
    canvasRef.current.lastX = x;
    canvasRef.current.lastY = y;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = isDark ? "#09090b" : "#f1f5f9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    socket.emit("send_action", { type: "draw_clear", room });
  };

  useEffect(() => {
    const onClear = (payload) => {
      if (payload.type === "draw_clear" && payload.room === room) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = isDark ? "#09090b" : "#f1f5f9";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };
    socket.on("receive_action", onClear);
    return () => socket.off("receive_action", onClear);
  }, [socket, room, isDark]);

  return (
    <div className="flex flex-col items-center gap-2 p-2 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
      <div className="flex justify-between w-full px-1">
        <div className="flex gap-2">
          {["#A78BFA", "#F472B6", "#38BDF8", "#34D399", "#FBBF24", "#F87171"].map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
              style={{ background: c, borderColor: color === c ? "#fff" : "transparent" }}
            />
          ))}
        </div>
        <button onClick={clearCanvas} className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300">
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="rounded-lg border cursor-crosshair touch-none"
        style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
}
