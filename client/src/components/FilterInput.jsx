import React from 'react'

const FilterInput = ({ label, type, value, onChange }) => (
    <div className="grid gap-1">
        <label className="text-sm font-semibold text-gray-800">{label}</label>
        <input
            type={type}
            className="border border-gray-300 rounded-xl p-3 text-sm bg-white/70 backdrop-blur focus:ring-2 focus:ring-indigo-400 outline-none transition"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

export default FilterInput