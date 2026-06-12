"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getPriceHistory } from "@/app/actions";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PriceChart({ productId, currency }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const history = await getPriceHistory(productId);
        const chartData = history.map((item) => ({
          date: new Date(item.checked_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }),
          price: parseFloat(item.price),
        }));
        setData(chartData);
      } catch (err) {
        console.error("Error loading price history:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400 dark:text-slate-500 w-full">
        <Loader2 className="w-6 h-6 animate-spin mr-3 text-orange-500" />
        <span className="text-sm font-medium">Loading history...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 dark:text-slate-500 w-full border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
        <p className="text-sm font-medium">No price history available yet.</p>
        <p className="text-xs text-slate-400 mt-1">Updates will appear after the first automatic check.</p>
      </div>
    );
  }

  const currencySymbol = currency === "INR" || currency === "₹" ? "₹" : "$";

  // Get lowest and highest price for custom domain
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  // Pad the Y-axis slightly for visual clarity
  const yDomain = [
    Math.max(0, Math.floor(minPrice - (priceRange * 0.15 || 1))),
    Math.ceil(maxPrice + (priceRange * 0.15 || 1)),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Price History & Trends
        </h4>
        <div className="text-xs text-slate-400 dark:text-slate-500">
          Min: <span className="font-semibold text-slate-700 dark:text-slate-200">{currencySymbol}{minPrice.toFixed(2)}</span> • Max:{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">{currencySymbol}{maxPrice.toFixed(2)}</span>
        </div>
      </div>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(249, 115, 22)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="rgb(249, 115, 22)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.4)" className="dark:stroke-slate-800/40" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              dy={10}
            />
            <YAxis
              domain={yDomain}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg shadow-lg">
                      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {payload[0].payload.date}
                      </p>
                      <p className="text-sm font-bold text-orange-500 mt-0.5">
                        {currencySymbol}{payload[0].value.toFixed(2)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="rgb(249, 115, 22)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#priceGradient)"
              activeDot={{ r: 5, strokeWidth: 0, fill: "rgb(249, 115, 22)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}