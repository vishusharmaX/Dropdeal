"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingDown,
  Shield,
  Bell,
  Rabbit,
  ArrowRight,
  Plus,
  Percent,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  History
} from "lucide-react";
import Image from "next/image";
import AuthButton from "./AuthButton";
import ThemeToggle from "./ThemeToggle";
import AddProductForm from "./AddProductForm";
import ProductCard from "./ProductCard";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area
} from "recharts";

const SIMULATED_PRODUCTS = [
  {
    name: "Sony WH-1000XM5 Headphones",
    merchant: "Amazon",
    initialPrice: 398.0,
    currentPrice: 328.0,
    history: [
      { date: "Jun 1", price: 398 },
      { date: "Jun 3", price: 398 },
      { date: "Jun 5", price: 379 },
      { date: "Jun 7", price: 379 },
      { date: "Jun 9", price: 348 },
      { date: "Jun 12", price: 328 },
    ],
  },
  {
    name: "iPad Pro 11-inch (M4)",
    merchant: "Best Buy",
    initialPrice: 999.0,
    currentPrice: 899.0,
    history: [
      { date: "Jun 1", price: 999 },
      { date: "Jun 4", price: 999 },
      { date: "Jun 6", price: 949 },
      { date: "Jun 8", price: 949 },
      { date: "Jun 10", price: 929 },
      { date: "Jun 12", price: 899 },
    ],
  },
];

const COLORS = ["#f97316", "#6366f1", "#10b981", "#ec4899", "#8b5cf6"];

export default function DashboardClient({ user, initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [simIndex, setSimIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  // Sync state if initialProducts changes
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Simulate price drop alert animation for landing page
  useEffect(() => {
    if (user) return;
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [simIndex, user]);

  const activeSim = SIMULATED_PRODUCTS[simIndex];

  // Calculate stats for logged-in user
  const totalTracked = products.length;

  // Dynamically calculate estimated savings based on currency of tracked products
  const hasInrProduct = products.some(p => p.currency === "INR" || p.currency === "₹");
  const currencySymbol = hasInrProduct ? "₹" : "$";
  const multiplier = hasInrProduct ? 1000 : 12.5; // ₹1000 or $12.50 per tracked item
  const estimatedSaved = `${currencySymbol}${(totalTracked * multiplier).toFixed(2)}`;

  const merchantStats = products.reduce((acc, product) => {
    try {
      const parsedUrl = new URL(product.url);
      const host = parsedUrl.hostname.replace("www.", "");
      let merchant = host.split(".")[0];
      merchant = merchant.charAt(0).toUpperCase() + merchant.slice(1);
      acc[merchant] = (acc[merchant] || 0) + 1;
    } catch {
      acc["Other"] = (acc["Other"] || 0) + 1;
    }
    return acc;
  }, {});

  const merchantChartData = Object.entries(merchantStats).map(([name, value]) => ({
    name,
    value,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-orange-200/30 dark:bg-orange-950/10 blur-3xl" />
        <div className="absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-indigo-200/30 dark:bg-indigo-950/10 blur-3xl" />
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/60 dark:border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image
              src="/image.png"
              alt="Deal Drop Logo"
              width={180}
              height={50}
              className="h-9 w-auto dark:invert dark:opacity-90"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <ThemeToggle />
            <AuthButton user={user} />
          </motion.div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 relative z-10">
        {!user ? (
          /* Landing Page (Signed out) */
          <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Hero Left */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/30">
                    <TrendingDown className="w-3.5 h-3.5" /> Made with ❤️ by Vishwajeet Sharma
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
                >
                  Never Miss a <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                    Price Drop
                  </span>{" "}
                  Again.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0"
                >
                  Paste any product URL. We track prices in real-time and send
                  instant alerts straight to your inbox when prices drop. Save
                  money effortlessly.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="pt-2"
                >
                  <AddProductForm user={user} />
                </motion.div>
              </div>

              {/* Hero Right: Price Drop Simulator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="lg:col-span-5 relative"
              >
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                  {/* Selector tabs */}
                  <div className="flex gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                    {SIMULATED_PRODUCTS.map((prod, index) => (
                      <button
                        key={prod.name}
                        onClick={() => {
                          setSimIndex(index);
                          setShowNotification(false);
                        }}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                          simIndex === index
                            ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850"
                        }`}
                      >
                        {prod.merchant}
                      </button>
                    ))}
                  </div>

                  {/* Simulated Card Info */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-bold text-sm sm:text-base leading-tight">
                          {activeSim.name}
                        </h3>
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-500">
                          {activeSim.merchant}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-2xl font-extrabold text-orange-500">
                          ${activeSim.currentPrice}
                        </span>
                        <span className="text-sm text-slate-400 line-through">
                          ${activeSim.initialPrice}
                        </span>
                        <span className="text-xs text-green-500 font-semibold bg-green-500/10 px-2 py-0.5 rounded-md">
                          Save ${activeSim.initialPrice - activeSim.currentPrice}
                        </span>
                      </div>
                    </div>

                    {/* Simulated Recharts Area Chart */}
                    <div className="h-[120px] w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={activeSim.history}
                          margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="simGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#f97316"
                                stopOpacity={0.2}
                              />
                              <stop
                                offset="95%"
                                stopColor="#f97316"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-md shadow text-[10px]">
                                    <p className="font-bold text-orange-500">
                                      ${payload[0].value}
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
                            stroke="#f97316"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#simGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Simulated Notification Toast Popout */}
                  <AnimatePresence>
                    {showNotification && (
                      <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bottom-4 left-4 right-4 bg-slate-900 text-white p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10"
                      >
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                          <Bell className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                            Price Drop Alert!
                          </p>
                          <p className="text-xs truncate font-medium">
                            {activeSim.name} dropped to ${activeSim.currentPrice}!
                          </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Landing Features Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24"
            >
              {[
                {
                  icon: Rabbit,
                  title: "Lightning Fast scraping",
                  desc: "Deal Drop analyzes details in seconds using advanced AI scraping methods.",
                },
                {
                  icon: Shield,
                  title: "100% Reliable Tracking",
                  desc: "Includes anti-bot bypass to track prices smoothly across global e-commerce portals.",
                },
                {
                  icon: Bell,
                  title: "Instant Email Alerts",
                  desc: "Automated alerts directly to your inbox the moment a price drops.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={itemVariants}
                  className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center mb-4 text-orange-500 dark:text-orange-400">
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          /* Dashboard Layout (Signed in) */
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Header Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 dark:border-slate-800/80 pb-6"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome back,{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    {user.email.split("@")[0]}
                  </span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Keep track of your shopping lists and price savings.
                </p>
              </div>
            </motion.div>

            {/* Dashboard Statistics Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[
                {
                  label: "Tracked Items",
                  value: totalTracked,
                  icon: History,
                  color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30",
                },
                {
                  label: "Active Alerts",
                  value: totalTracked,
                  icon: Bell,
                  color: "text-orange-500 bg-orange-50 dark:bg-orange-950/30",
                },
                {
                  label: "Savings Triggered",
                  value: `${products.length > 0 ? "18%" : "0%"}`,
                  icon: Percent,
                  color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                },
                {
                  label: "Est. Total Saved",
                  value: estimatedSaved,
                  icon: TrendingDown,
                  color: "text-pink-500 bg-pink-50 dark:bg-pink-950/30",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Paste product link input centered */}
            <div className="w-full py-2">
              <AddProductForm user={user} />
            </div>

            {/* Dashboard Content Split Layout */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Products Section */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                    Your Monitored Products
                  </h3>
                  <span className="text-xs bg-slate-100 dark:bg-slate-850 px-2.5 py-1 rounded-lg text-slate-500 dark:text-slate-400 font-semibold">
                    {totalTracked} {totalTracked === 1 ? "Product" : "Products"}
                  </span>
                </div>

                {products.length > 0 ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid gap-4 md:grid-cols-2"
                  >
                    {products.map((product) => (
                      <motion.div key={product.id} variants={itemVariants}>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  /* Empty state card */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/40 dark:bg-slate-900/40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center"
                  >
                    <TrendingDown className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                      No products added yet
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                      Paste a product URL above to begin tracking price changes and history!
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Analytics Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                {/* Merchants Donut Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs"
                >
                  <h4 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 mb-4">
                    Merchant Distribution
                  </h4>
                  {products.length > 0 ? (
                    <div className="h-[200px] w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={merchantChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {merchantChartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg shadow-sm text-xs">
                                    <span className="font-bold text-slate-800 dark:text-slate-100">
                                      {payload[0].name}
                                    </span>
                                    : {payload[0].value} items
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Middle text */}
                      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                        <span className="text-2xl font-black">{totalTracked}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Total
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-slate-400 text-xs">
                      No distribution data yet
                    </div>
                  )}

                  {/* Custom Legend */}
                  {products.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
                      {merchantChartData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span>
                            {entry.name} ({entry.value})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Notifications & Recent Activity Mock Feed */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
                      Recent System Actions
                    </h4>
                    <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                      Active
                    </span>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Background check ran successfully",
                        time: "5 minutes ago",
                        icon: CheckCircle,
                        color: "text-green-500 bg-green-50 dark:bg-green-950/20",
                      },
                      {
                        action: "Firecrawl AI scraper parsed schema",
                        time: "2 hours ago",
                        icon: Rabbit,
                        color: "text-orange-500 bg-orange-50 dark:bg-orange-950/20",
                      },
                      {
                        action: "Daily cron price review scheduled",
                        time: "12 hours ago",
                        icon: Shield,
                        color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
                      },
                    ].map((item, index) => (
                       <div key={index} className="flex gap-3 items-start text-xs leading-normal">
                         <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                           <item.icon className="w-4 h-4" />
                         </div>
                         <div className="space-y-0.5">
                           <p className="font-semibold text-slate-700 dark:text-slate-200">
                             {item.action}
                           </p>
                          <p className="text-[10px] text-slate-400">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
