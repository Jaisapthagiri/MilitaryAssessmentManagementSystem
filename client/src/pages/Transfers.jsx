import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Transfers() {
  const [list, setList] = useState([]);
  const [ref, setRef] = useState({ bases: [], types: [] });
  const [form, setForm] = useState({
    fromBase: "",
    toBase: "",
    equipmentType: "",
    quantity: 0,
    transferredAt: new Date().toISOString(),
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
    const { data } = await api.get("/api/transfers");
    setList(data);
  };

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/api/transfers", form);
    setForm((f) => ({ ...f, quantity: 0, note: "" }));
    refresh();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide">
        🚚 Transfers
      </h1>

      <div className="grid md:grid-cols-2 gap-6 items-center">

        <div className="flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3003/3003208.png"
            alt="transfer illustration"
            className="w-72 md:w-96 drop-shadow-xl"
          />
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-2xl p-6 shadow-xl grid md:grid-cols-6 gap-4"
        >
          <select
            className="border rounded-xl p-3 col-span-3"
            value={form.fromBase}
            onChange={(e) =>
              setForm((f) => ({ ...f, fromBase: e.target.value }))
            }
          >
            <option value="">From Base</option>
            {ref.bases.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            className="border rounded-xl p-3 col-span-3"
            value={form.toBase}
            onChange={(e) => setForm((f) => ({ ...f, toBase: e.target.value }))}
          >
            <option value="">To Base</option>
            {ref.bases.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            className="border rounded-xl p-3 col-span-3"
            value={form.equipmentType}
            onChange={(e) =>
              setForm((f) => ({ ...f, equipmentType: e.target.value }))
            }
          >
            <option value="">Equipment</option>
            {ref.types.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          <input
            className="border rounded-xl p-3 col-span-3"
            type="number"
            placeholder="Qty"
            value={form.quantity}
            onChange={(e) =>
              setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
            }
          />

          <input
            className="border rounded-xl p-3 col-span-3"
            type="datetime-local"
            value={form.transferredAt.slice(0, 16)}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                transferredAt: new Date(e.target.value).toISOString(),
              }))
            }
          />

          <input
            className="border rounded-xl p-3 col-span-3"
            placeholder="Note"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          />

          <button className="md:col-span-6 bg-black text-white rounded-xl py-3 font-semibold hover:bg-gray-800 transition">
            Record Transfer
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="p-2">Date</th>
              <th className="p-2">From</th>
              <th className="p-2">To</th>
              <th className="p-2">Equipment</th>
              <th className="p-2">Qty</th>
              <th className="p-2">By</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item._id} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  {new Date(item.transferredAt).toLocaleString()}
                </td>
                <td className="p-2">{item.fromBase?.name}</td>
                <td className="p-2">{item.toBase?.name}</td>
                <td className="p-2">{item.equipmentType?.name}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">{item.createdBy?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
