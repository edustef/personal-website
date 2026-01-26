"use client";

import { useEffect, useState } from "react";

export function UglyVisitorCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Generate a fake visitor count that persists in localStorage
    const stored = localStorage.getItem("ugly-visitor-count");
    if (stored) {
      const newCount = Number.parseInt(stored, 10) + 1;
      localStorage.setItem("ugly-visitor-count", newCount.toString());
      setCount(newCount);
    } else {
      // Start with a believably large number
      const initial = 48234 + Math.floor(Math.random() * 100);
      localStorage.setItem("ugly-visitor-count", initial.toString());
      setCount(initial);
    }
  }, []);

  return (
    <div
      style={{
        display: "inline-block",
        background: "#000000",
        border: "2px inset #444444",
        padding: "8px 20px",
        borderRadius: "4px",
      }}
    >
      <p
        style={{
          fontFamily: "Courier New, monospace",
          fontSize: "10px",
          color: "#00ff00",
          margin: "0 0 4px",
        }}
      >
        You are visitor #
      </p>
      <div
        style={{
          fontFamily: "Digital, Courier New, monospace",
          fontSize: "24px",
          color: "#ff0000",
          background: "#111111",
          padding: "4px 12px",
          border: "1px inset #333333",
          letterSpacing: "2px",
        }}
      >
        {count.toString().padStart(6, "0")}
      </div>
    </div>
  );
}
