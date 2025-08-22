import React from 'react'
import { motion, AnimatePresence } from "framer-motion";


const MetricCard = ({ title, value, icon, onClick, clickable }) => (
    <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={`rounded-3xl p-6 bg-gradient-to-br from-indigo-50 to-white shadow-lg border border-indigo-100/50 
      ${clickable ? "cursor-pointer hover:shadow-2xl" : ""}`}
        onClick={onClick}
    >
        <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500">{title}</div>
            <div className="text-indigo-600">{icon}</div>
        </div>
        <div className="text-4xl font-extrabold mt-3 text-gray-900">{value}</div>
    </motion.div>
);

export default MetricCard