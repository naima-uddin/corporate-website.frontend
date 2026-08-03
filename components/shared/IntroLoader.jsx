"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function IntroLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: .7, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1
        }}
        transition={{
          duration: .8
        }}
      >
        <Image
          src="/Rakibhasan.png"
          alt="Rakibhasan"
          width={150}
          height={150}
        />
      </motion.div>

      <div className="mt-10 w-60 h-[3px] bg-gray-200 rounded-full overflow-hidden">

        <motion.div
          className="h-full bg-[#0C6CF2]"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2.2,
            ease: "easeInOut"
          }}
        />

      </div>

    </motion.div>
  );
}