"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export function Partners() {
  const { theme } = useTheme()

  const partners = [
    { name: "Amazon", logo: "amazon.svg" },
    { name: "Atlassian", logo: "atlassian.svg" },
    { name: "GitHub", logo: "github.svg" },
    { name: "LaunchDarkly", logo: "launchdarkly.svg" },
    { name: "Netflix", logo: "netflix.svg" },
    { name: "Medium", logo: "medium.svg" },
  ]

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h3 className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          TRUSTED BY INDUSTRY LEADERS
        </h3>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {partners.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`h-8 opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 ${theme === "dark" ? "brightness-200" : ""}`}
          >
            <img
              src={`/placeholder.svg?height=32&width=${partner.name.length * 10}`}
              alt={partner.name}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

