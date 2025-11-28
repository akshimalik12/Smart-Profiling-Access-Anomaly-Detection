import React from "react";

export default function OverviewPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-800 mb-6">User Anoomly Detection Project</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Project Description</h2>
        <p className="text-gray-600">
          Smart Profiling for Access Anomaly Detection — overview, goals, and brief instructions.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Login Detection</h3>
          <p className="text-sm text-gray-500">Detect suspicious login patterns.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Behavioral Detection</h3>
          <p className="text-sm text-gray-500">Profile behavior anomalies.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Network Detection</h3>
          <p className="text-sm text-gray-500">Monitor network related anomalies.</p>
        </div>
      </div>
    </div>
  );
}
