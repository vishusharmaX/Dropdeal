"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { addProduct } from "@/app/actions";
import { toast } from "sonner";
import AuthModal from "./AuthModal";
import { motion } from "framer-motion";

const AddProductForm = ({ user }) => {
  const [url, seturl] = useState("");
  const [loading, setloading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setloading(true);
    try {
      const formData = new FormData();
      formData.append("url", url);
      const res = await addProduct(formData);
      if (res?.error) {
        toast.error(res.error);
      } else if (res?.success) {
        toast.success(res.message || "Product tracked successfully!");
        seturl("");
      }
    } catch (err) {
      toast.error("Failed to add product");
      console.error(err);
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-full max-w-2xl mx-auto"
      >
        <form onSubmit={handleSubmit} className="relative group">
          <div className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg group-hover:border-orange-500/20 dark:group-hover:border-indigo-500/20 transition-all duration-300 focus-within:border-orange-500/50 dark:focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-orange-500/5 dark:focus-within:ring-indigo-500/5">
            <div className="flex-1 w-full relative flex items-center">
              <Input
                type="url"
                value={url}
                onChange={(e) => seturl(e.target.value)}
                placeholder="Paste product link (Amazon, Walmart, Best Buy, etc.)"
                className="h-12 py-0 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm sm:text-base w-full"
                required
                disabled={loading}
              />
            </div>
            <motion.div whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium h-12 px-6 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-205 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>Track Price</span>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </motion.div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default AddProductForm;
