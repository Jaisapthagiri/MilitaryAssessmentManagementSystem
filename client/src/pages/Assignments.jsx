import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Building2, Wrench, Hash, Calendar, StickyNote } from "lucide-react"; // icon library

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

  const InputBox = ({ icon: Icon, children }) => (
    <div className="relative flex items-center bg-gray-50 rounded-2xl border-2 border-gray-200 px-3 py-2 shadow-sm hover:border-purple-500 focus-within:border-purple-600 transition">
      <Icon className="text-purple-600 mr-2" size={22} />
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-purple-700">⚡ Purchases</h1>

      {/* FORM */}
      <form
        onSubmit={submit}
        className="bg-white rounded-3xl p-6 shadow-2xl grid md:grid-cols-2 gap-4"
      >
        {/* Base */}
        <InputBox icon={Building2}>
          <select
            className="w-full bg-transparent outline-none"
            value={form.base}
            onChange={(e) =>
              setForm((f) => ({ ...f, base: e.target.value }))
            }
          >
            <option value="">Select Base</option>
            {ref.bases.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </InputBox>

        {/* Equipment */}
        <InputBox icon={Wrench}>
          <select
            className="w-full bg-transparent outline-none"
            value={form.equipmentType}
            onChange={(e) =>
              setForm((f) => ({ ...f, equipmentType: e.target.value }))
            }
          >
            <option value="">Select Equipment</option>
            {ref.types.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </InputBox>

        {/* Quantity */}
        <InputBox icon={Hash}>
          <input
            type="number"
            className="w-full bg-transparent outline-none"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
            }
          />
        </InputBox>

        {/* Date */}
        <InputBox icon={Calendar}>
          <input
            type="datetime-local"
            className="w-full bg-transparent outline-none"
            value={form.purchasedAt.slice(0, 16)}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                purchasedAt: new Date(e.target.value).toISOString(),
              }))
            }
          />
        </InputBox>

        {/* Note (full width) */}
        <div className="md:col-span-2">
          <InputBox icon={StickyNote}>
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Note"
              value={form.note}
              onChange={(e) =>
                setForm((f) => ({ ...f, note: e.target.value }))
              }
            />
          </InputBox>
        </div>

        {/* Button */}
        <div className="md:col-span-2 text-center">
          <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-2xl shadow-lg hover:scale-105 transition">
            ➕ Add Purchase
          </button>
        </div>
      </form>

      {/* TABLE */}
      <div className="bg-white rounded-3xl p-6 shadow-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="p-3">Date</th>
              <th className="p-3">Base</th>
              <th className="p-3">Equipment</th>
              <th className="p-3">Qty</th>
              <th className="p-3">By</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr
                key={item._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">
                  {new Date(item.purchasedAt).toLocaleString()}
                </td>
                <td className="p-3">{item.base?.name}</td>
                <td className="p-3">{item.equipmentType?.name}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">{item.createdBy?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
