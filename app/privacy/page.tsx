"use client"

import { useRouter } from "next/navigation"
import { FiLock, FiUserCheck, FiBarChart2, FiArrowLeft } from "react-icons/fi"

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-teal-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4">
      <section className="max-w-3xl w-full mx-auto rounded-3xl shadow-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-white/30 dark:border-gray-700/50 p-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-teal-500 rounded-xl p-4 shadow-lg">
            <FiLock className="text-white text-3xl" />
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
        </div>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          Your privacy is important to us. This Privacy Policy explains how Traffic Montenegro collects, uses, and protects your information.
        </p>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2 flex items-center gap-2">
          <FiUserCheck /> What We Collect
        </h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200 space-y-2 mb-4">
          <li>
            <span className="font-semibold">No personal data:</span> We do <span className="underline">not</span> collect or process any personal data from users except for anonymous, aggregated statistics.
          </li>
          <li>
            <span className="font-semibold">Anonymous statistics:</span> We track the number of users, top users (by report count), and general usage data to improve the service. No personally identifiable information is stored or analyzed.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2 flex items-center gap-2">
          <FiBarChart2 /> Use of Data
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          All collected data is used solely for statistical and analytical purposes to enhance the quality and reliability of the service. We do not use your data for marketing or advertising.
        </p>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2">
          GDPR Compliance
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          We are fully committed to the General Data Protection Regulation (GDPR) and other applicable EU data protection laws. Since we do not process personal data, most GDPR rights (such as access or deletion) are not applicable. If you have any questions or concerns, please contact us.
        </p>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2">
          Security
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          We use industry-standard security measures to protect all information on our platform. No personal data is stored.
        </p>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2">
          Changes to This Policy
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          We may update this Privacy Policy from time to time. Changes will be posted on this page.
        </p>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-semibold shadow transition"
          >
            <FiArrowLeft className="text-lg" />
            Back
          </button>
        </div>
      </section>
    </main>
  )
}
