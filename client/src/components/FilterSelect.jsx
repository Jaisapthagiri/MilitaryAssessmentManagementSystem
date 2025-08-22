import React from 'react'

const FilterSelect = ({ label, value, options, onChange }) => (
    <div className="grid gap-1">
        <label className="text-sm font-semibold text-gray-800">{label}</label>
        <select
            className="border  border-gray-300 rounded-xl p-3 text-sm bg-white/70 backdrop-blur focus:ring-2 focus:ring-indigo-400 outline-none transition"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">All</option>
            {options.map((opt) => (
                <option key={opt._id} value={opt._id}>
                    {opt.name}
                </option>
            ))}
        </select>
    </div>
);



export default FilterSelect