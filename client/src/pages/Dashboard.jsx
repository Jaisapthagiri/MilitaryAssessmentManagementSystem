import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuthInfo } from "../services/hooks";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ClipboardList,
} from "lucide-react";
import FilterInput from "../components/FilterInput";
import Modal from "../components/Modal";
import MetricCard from "../components/MetricCard";
import FilterSelect from "../components/FilterSelect";

export default function Dashboard() {
  const { baseId } = useAuthInfo();
  const [filters, setFilters] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString(),
    end: new Date().toISOString(),
    baseId: baseId || "",
    equipmentTypeId: "",
  });
  const [ref, setRef] = useState({ bases: [], types: [] });
  const [data, setData] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    const loadRef = async () => {
      const [b, t] = await Promise.all([
        api.get("/api/bases"),
        api.get("/api/equipment-types"),
      ]);
      setRef({ bases: b.data, types: t.data });
    };
    loadRef();
  }, []);

  const load = async () => {
    const { data } = await api.get("/api/dashboard", { params: filters });
    setData(data);
  };

  useEffect(() => {
    load();
  }, [filters.start, filters.end, filters.baseId, filters.equipmentTypeId]);

  return (
    <div className="space-y-8">

      <div
        className="rounded-2xl overflow-hidden relative h-40 flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.h1
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative text-3xl md:text-4xl font-bold text-white tracking-tight"
        >
          📊 Military Asset Dashboard
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-4 gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <FilterInput
          label="Start"
          type="datetime-local"
          value={filters.start.slice(0, 16)}
          onChange={(v) =>
            setFilters((f) => ({ ...f, start: new Date(v).toISOString() }))
          }
        />
        <FilterInput
          label="End"
          type="datetime-local"
          value={filters.end.slice(0, 16)}
          onChange={(v) =>
            setFilters((f) => ({ ...f, end: new Date(v).toISOString() }))
          }
        />
        <FilterSelect
          label="Base"
          value={filters.baseId}
          options={ref.bases}
          onChange={(v) => setFilters((f) => ({ ...f, baseId: v }))}
        />
        <FilterSelect
          label="Equipment Type"
          value={filters.equipmentTypeId}
          options={ref.types}
          onChange={(v) => setFilters((f) => ({ ...f, equipmentTypeId: v }))}
        />
      </motion.div>

      {data && (
        <div className="grid md:grid-cols-5 gap-6">
          <MetricCard
            title="Opening Balance"
            value={data.metrics.opening}
            icon={<Package className="text-blue-500" />}
          />
          <MetricCard
            title="Net Movement"
            value={data.metrics.netMovement}
            icon={<TrendingUp className="text-green-500" />}
            onClick={() => setShowBreakdown(true)}
            clickable
          />
          <MetricCard
            title="Closing Balance"
            value={data.metrics.closing}
            icon={<ClipboardList className="text-indigo-500" />}
          />
          <MetricCard
            title="Assigned"
            value={data.metrics.assigned}
            icon={<TrendingDown className="text-orange-500" />}
          />
          <MetricCard
            title="Expended"
            value={data.metrics.expended}
            icon={<TrendingDown className="text-red-500" />}
          />
        </div>
      )}

      <AnimatePresence>
        {showBreakdown && data && (
          <Modal onClose={() => setShowBreakdown(false)}>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">
                📌 Net Movement Breakdown
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <MetricCard
                  title="Purchases"
                  value={data.breakdown.purchases}
                  icon={<Package className="text-blue-500" />}
                />
                <MetricCard
                  title="Transfer In"
                  value={data.breakdown.transferIn}
                  icon={<TrendingUp className="text-green-500" />}
                />
                <MetricCard
                  title="Transfer Out"
                  value={data.breakdown.transferOut}
                  icon={<TrendingDown className="text-red-500" />}
                />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
