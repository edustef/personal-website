"use client";

import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "How I Work", href: "#how-i-work" },
  { label: "Pricing", href: "#pricing", isNew: true },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
  { label: "Back to Modern Site", href: "/" },
];

export function UglyHeader() {
  const [currentTime, setCurrentTime] = useState("");
  const [blinkVisible, setBlinkVisible] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkVisible((v) => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      style={{
        background: "linear-gradient(to bottom, #336699 0%, #224466 100%)",
        borderBottom: "3px ridge #4477aa",
        padding: "0",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: "#1a1a2e",
          padding: "4px 15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #333366",
        }}
      >
        <div
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: "10px",
            color: "#00ff00",
          }}
        >
          {currentTime}
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Verdana, sans-serif",
              fontSize: "9px",
              color: "#cccccc",
            }}
          >
            Select Language:
          </span>
          <select
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "10px",
              padding: "2px 4px",
              background: "#ffffff",
              border: "1px inset #999999",
              cursor: "pointer",
            }}
            defaultValue="en"
          >
            <option value="en">English</option>
            <option value="ro">Romana</option>
            <option value="es">Espanol</option>
          </select>
        </div>
      </div>

      {/* Main header */}
      <div
        style={{
          padding: "12px 20px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "45px",
              height: "45px",
              background: "linear-gradient(135deg, #ffcc00 0%, #ff9900 100%)",
              border: "2px outset #ffdd44",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Impact, sans-serif",
              fontSize: "24px",
              color: "#333366",
              textShadow: "1px 1px 0 #ffffff",
            }}
          >
            ES
          </div>
          <div>
            <h1
              style={{
                fontFamily: "Times New Roman, serif",
                fontSize: "22px",
                color: "#ffffff",
                margin: 0,
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                letterSpacing: "1px",
              }}
            >
              Eduard Stefan
            </h1>
            <p
              style={{
                fontFamily: "Comic Sans MS, cursive, sans-serif",
                fontSize: "10px",
                color: "#ffcc00",
                margin: "2px 0 0",
                fontStyle: "italic",
              }}
            >
              ~ Web Developer Extraordinaire ~
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <input
            type="text"
            placeholder="Search my site..."
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "11px",
              padding: "5px 10px",
              width: "150px",
              border: "2px inset #cccccc",
              background: "#ffffff",
            }}
          />
          <button
            type="button"
            style={{
              fontFamily: "Verdana, sans-serif",
              fontSize: "10px",
              padding: "5px 12px",
              background:
                "linear-gradient(to bottom, #ffcc00 0%, #ff9900 100%)",
              border: "2px outset #ffdd44",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#333333",
            }}
          >
            GO!
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          background: "linear-gradient(to bottom, #4477aa 0%, #335588 100%)",
          borderTop: "1px solid #5588bb",
          borderBottom: "2px groove #223355",
          padding: "0",
        }}
      >
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: "0 10px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2px",
          }}
        >
          {navItems.map((item, index) => (
            <li
              key={item.label}
              style={{
                position: "relative",
              }}
            >
              <a
                href={item.href}
                style={{
                  display: "block",
                  padding: "8px 16px",
                  fontFamily: "Verdana, sans-serif",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#ffffff",
                  textDecoration: "none",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                  borderLeft: index === 0 ? "none" : "1px solid #5588bb",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to bottom, #5588cc 0%, #4477aa 100%)";
                  e.currentTarget.style.color = "#ffcc00";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                {item.label}
                {item.isNew && (
                  <span
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      background: "#ff0000",
                      color: "#ffffff",
                      fontSize: "8px",
                      padding: "1px 4px",
                      borderRadius: "3px",
                      fontWeight: "bold",
                      visibility: blinkVisible ? "visible" : "hidden",
                    }}
                  >
                    NEW!
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Marquee */}
      <div
        style={{
          background: "#ffffcc",
          borderBottom: "2px solid #cccc99",
          padding: "4px 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "11px",
            color: "#990000",
            whiteSpace: "nowrap",
            animation: "marquee 20s linear infinite",
          }}
        >
          <style>
            {`
              @keyframes marquee {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
              }
            `}
          </style>
          *** Welcome to my website! *** Check out my amazing services! ***
          Contact me for a FREE quote! *** Best prices guaranteed! *** Now
          accepting PayPal! ***
        </div>
      </div>
    </header>
  );
}
