import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [csvFile, setCsvFile] = useState(null);

  const barData = [
    { name: "89", scoreA: 1.2, scoreB: 0.8 },
    { name: "412", scoreA: 0.9, scoreB: 0.4 },
    { name: "78", scoreA: 1.6, scoreB: 1.1 },
    { name: "60", scoreA: 1.1, scoreB: 0.7 },
    { name: "05", scoreA: 0.8, scoreB: 0.5 },
    { name: "9.0", scoreA: 1.5, scoreB: 1.2 },
  ];

  const pieData = [
    { name: "Normal", value: 95 },
    { name: "Anomaly", value: 5 },
  ];
  const COLORS = ["#2ecc71", "#e74c3c"];

  async function runDefaultDetection() {
    setLoading(true);
    setResults(null);
    try {
      const resp = await fetch("http://localhost:8000/detect/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_default: true }),
      });
      const data = await resp.json();
      setResults(data);
    } catch (e) {
      console.error(e);
      setResults({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  async function uploadAndRun(e) {
    e.preventDefault();
    if (!csvFile) return alert("Select a CSV file first");
    setLoading(true);
    setResults(null);
    try {
      const form = new FormData();
      form.append("file", csvFile);
      const resp = await fetch("http://localhost:8000/detect/upload/login", {
        method: "POST",
        body: form,
      });
      const data = await resp.json();
      setResults(data);
    } catch (e) {
      console.error(e);
      setResults({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-indigo-800 mb-6">Login Anomoly Detection Project</h1>

      <section className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={runDefaultDetection}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow"
            >
              🚀 Run Detection on Default Data
            </button>
            <div className="text-sm text-gray-400 mt-1">(Calls: POST http://localhost:8000/detect/login)</div>
          </div>

          <div className="w-72">
            <div className="font-medium">Upload Custom CSV Data</div>
            <form onSubmit={uploadAndRun} className="mt-3 flex gap-2">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-600"
              />
              <button type="submit" disabled={loading} className="bg-emerald-500 text-white px-4 py-2 rounded">
                Upload & Run Detection
              </button>
            </form>
          </div>
        </div>

        {loading && (
          <div className="mt-6 p-6 bg-gray-50 rounded text-center text-gray-600">Processing data and running models...</div>
        )}

        {results && (
          <pre className="mt-6 bg-gray-50 p-4 rounded max-h-48 overflow-auto text-xs">{JSON.stringify(results, null, 2)}</pre>
        )}
      </section>

      <section className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Top 20 Combined Anoomly Scores</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="scoreA" stackId="a" />
                <Bar dataKey="scoreB" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h3 className="mt-6 text-lg font-semibold">Aano mly Ranking Table (Top Combined Scores)</h3>
          <table className="w-full text-sm mt-2 border-collapse">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-2">Index</th>
                <th className="pb-2">Score IF</th>
                <th className="pb-2">Score AE</th>
                <th className="pb-2">Combined</th>
                <th className="pb-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 5, 10].map((i) => (
                <tr key={i} className="border-t">
                  <td className="py-2">{i}</td>
                  <td className="py-2">{Math.round(Math.random() * 300)}</td>
                  <td className="py-2">{(40 + Math.random() * 20).toFixed(3)}</td>
                  <td className="py-2">YES</td>
                  <td className="py-2 text-blue-600">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold mb-4">Aano mly Distribution</h3>
          <div style={{ width: 200, height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} innerRadius={50} dataKey="value">
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-2xl font-bold text-red-500">4.40% Anomy</div>
        </div>
      </section>
    </div>
  );
}
