"use client";

import { useState } from "react";
import { signOut } from "@/app/actions";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthButton({ user }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (user) {
    return (
      <form action={signOut}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="ghost"
            size="sm"
            type="submit"
            className="gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 rounded-xl px-4 py-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            Sign Out
          </Button>
        </motion.div>
      </form>
    );
  }

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={() => setShowAuthModal(true)}
          variant="default"
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 rounded-xl px-5 py-2.5 gap-2 border-none transition-all duration-200 cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
      </motion.div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}