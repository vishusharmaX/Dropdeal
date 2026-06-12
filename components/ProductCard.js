"use client";

import { useState } from "react";
import { deleteProduct } from "@/app/actions";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const PriceChart = dynamic(() => import("./PriceChart"), {
  ssr: false,
});
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Trash2,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const [showChart, setShowChart] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Remove this product from tracking?")) return;

    setDeleting(true);
    try {
      const res = await deleteProduct(product.id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Product removed from tracking.");
      }
    } catch (err) {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  // Extract merchant name from URL if possible for display badge
  let merchantName = "Merchant";
  try {
    const parsedUrl = new URL(product.url);
    const host = parsedUrl.hostname.replace("www.", "");
    merchantName = host.split(".")[0];
    merchantName = merchantName.charAt(0).toUpperCase() + merchantName.slice(1);
  } catch (err) {
    // Ignore invalid url parse
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 hover:shadow-xl dark:hover:shadow-indigo-950/20 hover:border-orange-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between overflow-hidden">
        <div>
          <CardHeader className="pb-3">
            <div className="flex gap-4">
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-20 h-20 object-contain p-1 rounded-lg border border-slate-100 dark:border-slate-800 bg-white"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-400">
                  No Image
                </div>
              )}

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                      {merchantName}
                    </span>
                    <Badge variant="secondary" className="bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-none font-semibold text-[10px] py-0.5 px-2 gap-1 rounded-full">
                      <TrendingDown className="w-2.5 h-2.5 animate-pulse" />
                      Live
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    {product.currency === "INR" || product.currency === "₹" ? "₹" : "$"}
                    {product.current_price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChart(!showChart)}
                className="h-8 text-xs gap-1 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850"
              >
                {showChart ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 text-orange-500" />
                    Hide History
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    Price History
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 text-xs gap-1 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850"
              >
                <Link href={product.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Store
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="h-8 text-xs text-red-500 dark:text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 gap-1 ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </Button>
            </div>
          </CardContent>
        </div>

        <AnimatePresence initial={false}>
          {showChart && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CardFooter className="pt-2 pb-4 px-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10">
                <PriceChart productId={product.id} currency={product.currency} />
              </CardFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}