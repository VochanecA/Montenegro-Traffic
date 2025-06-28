// app/disclaimer/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { FiAlertTriangle, FiInfo, FiFileText, FiArrowLeft } from "react-icons/fi" // Added FiAlertTriangle for disclaimer icon

export default function DisclaimerPage() {
  const router = useRouter();

  return (
    <main className="min-h-[70vh] flex items-center justify-center 
bg-gradient-to-br from-teal-50 via-pink-50 to-blue-50 dark:from-gray-900
 dark:via-gray-800 dark:to-gray-900 py-16 px-4">
      <section className="max-w-3xl w-full mx-auto rounded-3xl 
shadow-2xl bg-white dark:bg-gray-800 border 
border-gray-200 dark:border-gray-700 p-8"> {/* Removed glass effect classes */}
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-orange-500 rounded-xl p-4 shadow-lg"> {/* Changed icon background color for distinction */}
            <FiAlertTriangle className="text-white text-3xl" /> {/* Used FiAlertTriangle icon */}
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 
dark:text-white tracking-tight">
            Disclaimer Policy
          </h1>
        </div>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          This Disclaimer Policy governs your use of the Traffic Montenegro web application ("the App"), provided as a community reporting platform for traffic jams. By using the App, you agree to be bound by the terms and conditions set forth in this policy.
        </p>

        <h2 className="text-xl font-semibold text-orange-700 
dark:text-orange-300 mt-8 mb-2 flex items-center gap-2"> {/* Changed heading color for distinction */}
          <FiInfo /> Information Accuracy and Purpose
        </h2>
        <ul className="list-disc pl-6 text-gray-700 
dark:text-gray-200 space-y-2 mb-4">
          <li>
            <span className="font-semibold">User-Generated Content:</span> All traffic jam reports and related information ("Content") are submitted by users of the App. The App author does not verify the accuracy, completeness, or reliability of any Content.
          </li>
          <li>
            <span className="font-semibold">Informational Use Only:</span> The App and its Content are provided for general informational purposes only. It should not be considered real-time, comprehensive, or authoritative for any critical decisions, including but not limited to travel planning, emergency response, or professional driving.
          </li>
          <li>
            <span className="font-semibold">No Guarantee:</span> We do not guarantee that the App will always be available, accurate, error-free, or free from interruptions. Traffic conditions are dynamic and may change rapidly.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-orange-700 
dark:text-orange-300 mt-8 mb-2 flex items-center gap-2">
          <FiFileText /> Limitation of Liability
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          To the fullest extent permitted by applicable law, the author of Traffic Montenegro shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul className="list-disc pl-6 text-gray-700 
dark:text-gray-200 space-y-2 mb-4">
          <li>Your access to or use of, or inability to access or use the App;</li>
          <li>Any conduct or content of any third party on the App;</li>
          <li>Any content obtained from the App; and</li>
          <li>Unauthorized access, use or alteration of your transmissions or content.</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          This limitation of liability applies whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
        </p>

        <h2 className="text-xl font-semibold text-orange-700 
dark:text-orange-300 mt-8 mb-2">
          User Responsibility
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          Users are solely responsible for the accuracy and legality of the Content they submit. By submitting Content, you grant the App author a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, publish, and distribute such Content on and through the App. You agree not to submit false, misleading, or malicious reports.
        </p>

        <h2 className="text-xl font-semibold text-orange-700 
dark:text-orange-300 mt-8 mb-2">
          No Endorsement
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          The inclusion of any Content in the App does not imply endorsement by the App author.
        </p>

        <h2 className="text-xl font-semibold text-orange-700 
dark:text-orange-300 mt-8 mb-2">
          Governing Law
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          This Disclaimer Policy shall be governed and construed in accordance with the laws of Montenegro, without regard to its conflict of law provisions.
        </p>

        <h2 className="text-xl font-semibold text-orange-700 
dark:text-orange-300 mt-8 mb-2">
          Changes to This Disclaimer
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          We reserve the right to update or change our Disclaimer Policy at any time. Any changes will be effective immediately upon posting the revised policy on this page. Your continued use of the App after any modifications signifies your acceptance of the revised policy.
        </p>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2 rounded-full 
bg-teal-500 hover:bg-teal-600 text-white font-semibold shadow 
transition"
          >
            <FiArrowLeft className="text-lg" />
            Back
          </button>
        </div>
      </section>
    </main>
  )
}