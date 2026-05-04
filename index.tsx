import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./src/context/AuthContext";

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
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
