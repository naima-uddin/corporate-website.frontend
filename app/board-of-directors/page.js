import BoardOfDirectorsFull from "@/components/about-page-compoent/BoardOfDirectorsFull";
import React from "react";

export const metadata = {
  title: "Board of Directors | A2IT Ltd",
  description:
    "Meet the full board of directors behind M/S. MD. RAKIB HASAN.",
  alternates: {
    canonical: "https://a2itltd.com/board-of-directors",
  },
};

export default function Page() {
  return <BoardOfDirectorsFull />;
}
