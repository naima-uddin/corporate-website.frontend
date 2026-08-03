"use client";

import { motion } from "framer-motion";

const YELLOW = "#F5B301";
const DARK = "#2B2118";

// Skyline bars — the building rising while the site loads
const BUILDING_BARS = [30, 54, 78, 58, 40];

const cycle = { duration: 3, repeat: Infinity, ease: "easeInOut" };

function Excavator() {
  return (
    <div className="absolute left-[8px] top-[102px]">
      {/* tracks */}
      <div
        className="absolute top-[40px] h-[14px] w-[74px] rounded-full"
        style={{ background: DARK }}
      />
      {[10, 30, 50, 64].map((x) => (
        <div
          key={x}
          className="absolute top-[43px] h-[8px] w-[8px] rounded-full"
          style={{ left: x, background: YELLOW }}
        />
      ))}
      {/* cab */}
      <div
        className="absolute left-[16px] top-[4px] h-[36px] w-[38px] rounded-[3px]"
        style={{ background: YELLOW, border: `2px solid ${DARK}` }}
      />
      <div
        className="absolute left-[22px] top-[10px] h-[14px] w-[14px] rounded-[2px]"
        style={{ background: "#fff", border: `1.5px solid ${DARK}` }}
      />

      {/* arm assembly, pivoting from top of cab */}
      <motion.div
        className="absolute left-[38px] top-[4px] h-[7px] w-[44px] origin-left rounded-full"
        style={{ background: DARK }}
        animate={{ rotate: [-30, -58, -58, -12, -30] }}
        transition={{ ...cycle, times: [0, 0.3, 0.55, 0.8, 1] }}
      >
        <motion.div
          className="absolute left-[40px] top-[-1px] h-[6px] w-[34px] origin-left rounded-full"
          style={{ background: DARK }}
          animate={{ rotate: [55, 90, 25, -10, 55] }}
          transition={{ ...cycle, times: [0, 0.3, 0.55, 0.8, 1] }}
        >
          <motion.div
            className="absolute left-[30px] top-[-2px] h-[14px] w-[18px] origin-left rounded-bl-[12px] rounded-tr-[3px]"
            style={{ background: YELLOW, border: `2px solid ${DARK}` }}
            animate={{ rotate: [15, -65, 75, 15, 15] }}
            transition={{ ...cycle, times: [0, 0.3, 0.55, 0.8, 1] }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function Crane() {
  return (
    <>
      <div
        className="absolute left-[228px] top-[16px] h-[140px] w-[3px]"
        style={{ background: DARK }}
      />
      <motion.div
        className="absolute left-[128px] top-[16px] h-[3px] w-[103px] origin-right"
        style={{ background: DARK }}
        animate={{ rotate: [0, -3, 0, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[152px] top-[19px] flex w-[2px] flex-col items-center"
        animate={{ height: [30, 48, 30] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-px flex-1" style={{ background: "#9a9a9a" }} />
        <div
          className="h-[10px] w-[12px] rounded-[2px]"
          style={{ background: YELLOW, border: `1.5px solid ${DARK}` }}
        />
      </motion.div>
    </>
  );
}

function Building() {
  return (
    <div className="absolute left-[132px] top-[78px] flex h-[78px] items-end gap-[4px]">
      {BUILDING_BARS.map((h, i) => (
        <motion.div
          key={i}
          className="w-[12px] rounded-t-[2px] bg-[var(--color-primary)]"
          style={{ opacity: 0.55 + i * 0.08 }}
          initial={{ height: 0 }}
          animate={{ height: h }}
          transition={{ duration: 0.5, delay: 0.25 + i * 0.15, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function HammerAndBricks() {
  return (
    <div className="absolute left-[266px] top-[70px]">
      {/* bricks */}
      <motion.div
        className="absolute top-[62px] flex flex-col-reverse gap-[2px]"
        animate={{ x: [0, 0, -2, 2, 0, 0] }}
        transition={{ duration: 1.3, repeat: Infinity, times: [0, 0.42, 0.47, 0.52, 0.58, 1] }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-[9px] w-[32px] rounded-[1px]"
            style={{ background: "#B65C1F", border: `1.5px solid ${DARK}` }}
          />
        ))}
      </motion.div>

      {/* debris on impact */}
      {[-10, 0, 10].map((dx, i) => (
        <motion.div
          key={i}
          className="absolute top-[60px] h-[3px] w-[3px] rounded-full"
          style={{ left: 15 + dx, background: YELLOW }}
          animate={{
            opacity: [0, 0, 1, 0],
            x: [0, 0, dx, dx * 1.6],
            y: [0, 0, -6, 2],
          }}
          transition={{ duration: 1.3, repeat: Infinity, times: [0, 0.44, 0.55, 0.75] }}
        />
      ))}

      {/* hammer — pivots near the grip (top), head strikes down onto the bricks */}
      <motion.div
        className="absolute left-[5px] top-[26px] h-[36px] w-[22px]"
        style={{ transformOrigin: "50% 8%" }}
        animate={{ rotate: [-38, -38, 8, -12, -38] }}
        transition={{ duration: 1.3, repeat: Infinity, times: [0, 0.32, 0.46, 0.6, 1] }}
      >
        <div
          className="absolute left-1/2 top-0 h-[25px] w-[4px] -translate-x-1/2 rounded-full"
          style={{ background: DARK }}
        />
        <div
          className="absolute bottom-0 left-1/2 h-[10px] w-[20px] -translate-x-1/2 rounded-[2px]"
          style={{ background: YELLOW, border: `2px solid ${DARK}` }}
        />
      </motion.div>
    </div>
  );
}

function DumpTruck() {
  return (
    <motion.div
      className="absolute top-[124px]"
      animate={{ x: [-60, 380] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    >
      <motion.div
        className="relative h-[26px] w-[54px]"
        animate={{ y: [0, -1.5, 0] }}
        transition={{ duration: 0.25, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* cab */}
        <div
          className="absolute left-0 top-[4px] h-[18px] w-[16px] rounded-[2px]"
          style={{ background: "#fff", border: `2px solid ${DARK}` }}
        />
        {/* bed */}
        <div
          className="absolute left-[16px] top-0 h-[20px] w-[36px] rounded-[2px]"
          style={{ background: YELLOW, border: `2px solid ${DARK}` }}
        />
        <div className="absolute left-[22px] top-[4px] h-[12px] w-[1.5px]" style={{ background: DARK }} />
        <div className="absolute left-[32px] top-[4px] h-[12px] w-[1.5px]" style={{ background: DARK }} />
        <div className="absolute left-[42px] top-[4px] h-[12px] w-[1.5px]" style={{ background: DARK }} />
        {/* wheels */}
        {[6, 40].map((x) => (
          <div
            key={x}
            className="absolute top-[18px] h-[10px] w-[10px] rounded-full"
            style={{ left: x, background: DARK }}
          >
            <div
              className="absolute left-1/2 top-1/2 h-[4px] w-[4px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: YELLOW }}
            />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function IntroLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative h-[190px] w-[340px] overflow-hidden">
        <div className="absolute left-0 right-0 top-[156px] h-[2px] bg-gray-200" />
        <Building />
        <Crane />
        <Excavator />
        <HammerAndBricks />
        <DumpTruck />
      </div>

      <motion.h1
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-2 text-center text-xl font-semibold text-[var(--color-heading)] sm:text-2xl"
      >
        M/s Md. Rakib Hasan
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-body)] sm:text-sm"
      >
        Contractor &bull; Supplier &bull; Auctioneer
      </motion.p>

      <div className="mt-8 h-[3px] w-60 overflow-hidden rounded-full bg-gray-200">
        <motion.div
          className="h-full bg-[var(--color-primary)]"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
