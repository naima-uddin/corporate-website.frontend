"use client";

import { useEffect, useState } from "react";
import IntroLoader from "./IntroLoader"

export default function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const start = Date.now();

    async function initialize() {
      // এখানে চাইলে future API call করতে পারো

      const elapsed = Date.now() - start;
      const minimumTime = 2000;

      if (elapsed < minimumTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minimumTime - elapsed)
        );
      }

      setLoading(false);
    }

    initialize();
  }, []);

  if (loading) return <IntroLoader />;

  return children;
}