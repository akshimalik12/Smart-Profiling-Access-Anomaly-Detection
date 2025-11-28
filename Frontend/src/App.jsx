import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";

import OverviewPage from "./pages/OverviewPage";
import LoginPage from "./pages/LoginPage";
import BehaviorPage from "./pages/BehaviorPage";
import TransactionPage from "./pages/TransactionPage";
import NetworkPage from "./pages/NetworkPage";
import InsiderPage from "./pages/InsiderPage";

import logo from "./assets/logo.png"; // put your logo at src/assets/logo.png

export default function App() {
  const activeClass =
    "px-3 py-2 rounded bg-blue-600/90 text-white flex items-center gap-2";
  const normalClass =
    "px-3 py-2 rounded hover:bg-gray-600/40 flex items-center gap-2";

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Smart Profiling Logo" className="h-14 w-14 object-contain" />

          <div>
            <div className="text-2xl font-extrabold text-indigo-700">Smart Profiling</div>
            <div className="text-gray-500 -mt-1 text-sm">
              Smart Profiling for Access Anomaly Detection
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">Powered by React & FASTAPI</div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-700 text-white p-6 min-h-[calc(100vh-96px)]">
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Features</h3>
          </div>

          <nav className="flex flex-col gap-2">
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
            >
              <span>🔒</span>
              <span>login</span>
            </NavLink>

            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
            >
              <span>📊</span>
              <span>overview</span>
            </NavLink>

            <NavLink
              to="/behavior"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
            >
              <span>👤</span>
              <span>behavior</span>
            </NavLink>

            <NavLink
              to="/transaction"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
            >
              <span>💸</span>
              <span>transaction</span>
            </NavLink>

            <NavLink
              to="/network"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
            >
              <span>🌐</span>
              <span>network</span>
            </NavLink>

            <NavLink
              to="/insider"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
            >
              <span>⚠️</span>
              <span>insider</span>
            </NavLink>
          </nav>
        </aside>

        {/* Main content / Routes */}
        <main className="flex-1 p-10">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/behavior" element={<BehaviorPage />} />
            <Route path="/transaction" element={<TransactionPage />} />
            <Route path="/network" element={<NetworkPage />} />
            <Route path="/insider" element={<InsiderPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
