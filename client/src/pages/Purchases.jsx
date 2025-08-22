import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

export default function Purchases() {
  const [list, setList] = useState([]);
  const [ref, setRef] = useState({ bases: [], types: [] });
  const [form, setForm] = useState({
    base: "",
    equipmentType: "",
    quantity: 0,
    purchasedAt: new Date().toISOString(),
    note: "",
  });

  useEffect(() => {
    const loadRef = async () => {
      const [b, t] = await Promise.all([
        api.get("/api/bases"),
        api.get("/api/equipment-types"),
      ]);
      setRef({ bases: b.data, types: t.data });
    };
    loadRef();
    refresh();
  }, []);

  const refresh = async () => {
    const { data } = await api.get("/api/purchases");
    setList(data);
  };

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/api/purchases", form);
    setForm((f) => ({ ...f, quantity: 0, note: "" }));
    refresh();
  };

  return (
    <div className="space-y-8 p-4 md:p-10">

      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          Purchases Dashboard
        </h1>
        <span className="text-gray-500 text-sm hidden md:block">
          Manage all purchases in one place ✨
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">

        <div className="flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2331/2331966.png"
            alt="purchase illustration"
            className="w-72 md:w-96 drop-shadow-2xl"
          />
        </div>

        <form
          onSubmit={submit}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-200 grid gap-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <select
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={form.base}
              onChange={(e) => setForm((f) => ({ ...f, base: e.target.value }))}
            >
              <option value="">🏢 Select Base</option>
              {ref.bases.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={form.equipmentType}
              onChange={(e) =>
                setForm((f) => ({ ...f, equipmentType: e.target.value }))
              }
            >
              <option value="">⚙️ Select Equipment</option>
              {ref.types.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              type="number"
              placeholder="🔢 Quantity"
              value={form.quantity}
              onChange={(e) =>
                setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
              }
            />

            <input
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              type="datetime-local"
              value={form.purchasedAt.slice(0, 16)}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  purchasedAt: new Date(e.target.value).toISOString(),
                }))
              }
            />
          </div>

          <textarea
            className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
            placeholder="📝 Note"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          />

          <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 px-5 font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200">
            <PlusCircle className="w-5 h-5" /> Add Purchase
          </button>
        </form>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 text-gray-700 text-left">
              <th className="p-4">📅 Date</th>
              <th className="p-4">🏢 Base</th>
              <th className="p-4">⚙️ Equipment</th>
              <th className="p-4">🔢 Qty</th>
              <th className="p-4">👤 By</th>
              <th className="p-4 text-center">⚡ Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, i) => (
              <tr
                key={item._id}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-indigo-50 hover:shadow transition`}
              >
                <td className="p-4 font-medium">
                  {new Date(item.purchasedAt).toLocaleString()}
                </td>
                <td className="p-4">{item.base?.name}</td>
                <td className="p-4">{item.equipmentType?.name}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4">{item.createdBy?.name}</td>
                <td className="p-4 flex justify-center gap-3">
                  <button className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  🚫 No purchases found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
