import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Global error handler for unhandled promise rejections (like storage errors from extensions)
window.addEventListener("unhandledrejection", (event) => {
  // Suppress storage-related errors from browser extensions/context
  if (event.reason?.message?.includes("Access to storage is not allowed")) {
    event.preventDefault();
    // Silently ignore - this is from browser extensions, not our code
  }
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
