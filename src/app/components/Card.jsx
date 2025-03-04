// components/Card.jsx
import React from "react";

export default function Card({ children }) {
  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
      {children}
    </div>
  );
}