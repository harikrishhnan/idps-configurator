import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState({
    source: "",
    dest: "",
    port: "",
    action: "ACCEPT",
  });

  const fetchRules = async () => {
    const res = await axios.get("http://127.0.0.1:8000/rules");
    setRules(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/add_rule", form);
    setForm({ source: "", dest: "", port: "", action: "ACCEPT" });
    fetchRules();
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">IDPS Configurator</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md space-y-4"
      >
        <input
          type="text"
          placeholder="Source IP"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Destination IP"
          value={form.dest}
          onChange={(e) => setForm({ ...form, dest: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Port"
          value={form.port}
          onChange={(e) => setForm({ ...form, port: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <select
          value={form.action}
          onChange={(e) => setForm({ ...form, action: e.target.value })}
          className="border p-2 rounded w-full"
        >
          <option value="ACCEPT">ACCEPT</option>
          <option value="DROP">DROP</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Rule
        </button>
      </form>

      <h2 className="text-xl font-bold mt-6">Current Rules</h2>
      <table className="w-full bg-white rounded shadow-md mt-4">
        <thead>
          <tr>
            <th className="p-2">Source</th>
            <th className="p-2">Destination</th>
            <th className="p-2">Port</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule, index) => (
            <tr key={index} className="text-center">
              <td className="p-2">{rule.source}</td>
              <td className="p-2">{rule.dest}</td>
              <td className="p-2">{rule.port}</td>
              <td className="p-2">{rule.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
