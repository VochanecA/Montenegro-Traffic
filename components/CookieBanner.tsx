"use client"

import { useEffect, useState } from "react"
import { FaCookieBite } from "react-icons/fa"

// CookieBanner component: stays open until user clicks "I Agree"
export function CookieBanner() {
  // consent: "undecided" | "yes"
  const [consent, setConsent] = useState<"undecided" | "yes">("undecided");

  // On mount, check localStorage for consent
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cookieConsent");
      if (stored === "yes") {
        setConsent("yes");
      } else {
        setConsent("undecided");
      }
    }
  }, []);

  // Accept handler
  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "yes");
    setConsent("yes");
  };

  // Only show banner if consent is not given
  if (consent !== "undecided") return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="flex items-center gap-3 bg-gradient-to-br from-sky-200 via-blue-200 to-cyan-100 dark:from-blue-900/80 dark:via-cyan-900/80 dark:to-sky-900/70 border border-blue-300 dark:border-blue-700 rounded-2xl shadow-2xl p-5 backdrop-blur-xl">
        <FaCookieBite className="text-sky-500 text-2xl drop-shadow" />
        <div className="flex-1 text-sm text-blue-900 dark:text-blue-100">
          We use only essential cookies for anonymous statistics and GDPR compliance. Enjoy a smooth, summer-bright experience!{" "}
          <a href="/privacy" className="underline hover:text-sky-600 ml-1 transition">Learn more</a>
        </div>
        <button
          onClick={handleAccept}
          className="ml-2 px-4 py-1 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow transition"
        >
          I Agree
        </button>
      </div>
    </div>
  )
}
