"use client"

import { motion } from "framer-motion"

export function LiveIndicator() {
  return (
    <motion.div
      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary ml-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        className="h-2 w-2 rounded-full bg-primary mr-1.5"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
      />
      LIVE
    </motion.div>
  )
}

