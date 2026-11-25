import React from "react";
import { Navigate } from "react-router-dom";

/** The old "/home" route was a stub page. It now just goes to the real home page. */
export default function Home() {
  return <Navigate to="/" replace />;
}
