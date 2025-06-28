"use client"

import { useRouter } from "next/navigation"
import { FiMapPin, FiUsers, FiActivity, FiArrowLeft, FiAlertTriangle, FiGlobe, FiBell, FiSmartphone } from "react-icons/fi"

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-teal-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4">
      <section className="max-w-2xl w-full mx-auto rounded-3xl shadow-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-white/30 dark:border-gray-700/50 p-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-teal-500 rounded-xl p-4 shadow-lg">
            <FiMapPin className="text-white text-3xl" />
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            About Traffic Montenegro
          </h1>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">
          <span className="inline-flex items-center gap-2 font-semibold text-teal-600 dark:text-teal-300">
            <FiActivity className="inline-block" />
            Inspired by real traffic conditions
          </span>{" "}
          in Montenegro, this web application empowers citizens to report, share, and stay informed about road jams, hazards, and travel disruptions in real time. Our platform is designed to be fast, fluid, and easy to use, making it accessible to everyone on any device.
        </p>
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-pink-400/80 rounded-full p-2">
            <FiUsers className="text-white text-xl" />
          </span>
          <span className="text-md text-gray-800 dark:text-gray-100">
            Built for and by the community, Traffic Montenegro thrives on local knowledge and collective action.
          </span>
        </div>
        <p className="text-md text-gray-700 dark:text-gray-300 mb-2">
          Our mission is to make Montenegrin roads safer, journeys smoother, and information accessible to everyone—whether you’re a daily commuter, a tourist, or a transport professional. The app is inspired by the unique challenges and beauty of Montenegro’s roads, and the vibrant community that travels them every day.
        </p>
        <ul className="mt-6 space-y-3">
          <li className="flex items-center gap-2">
            <span className="text-teal-500"><FiMapPin /></span>
            <span className="text-gray-800 dark:text-gray-200">Interactive map for live traffic jams and incident reports</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-pink-400"><FiUsers /></span>
            <span className="text-gray-800 dark:text-gray-200">Community-driven: every user can contribute and help others</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-yellow-500"><FiAlertTriangle /></span>
            <span className="text-gray-800 dark:text-gray-200">Report hazards, accidents, and road closures instantly</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-500"><FiGlobe /></span>
            <span className="text-gray-800 dark:text-gray-200">Accessible from anywhere—desktop, tablet, or smartphone</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500"><FiBell /></span>
            <span className="text-gray-800 dark:text-gray-200 flex items-center gap-2">
              Real-time notifications and updates for safer journeys
              <span className="inline-block bg-yellow-400 text-yellow-900 font-semibold text-xs px-3 py-1 rounded-full ml-2 shadow">
                To be implemented
              </span>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-indigo-500"><FiSmartphone /></span>
            <span className="text-gray-800 dark:text-gray-200">Optimized for speed, modern design, and offline support</span>
          </li>
        </ul>
        <div className="mt-8 text-center">
          <span className="inline-block bg-teal-100 dark:bg-teal-800/40 text-teal-700 dark:text-teal-200 px-6 py-2 rounded-full font-semibold shadow-sm">
            Together, we keep Montenegro moving!
          </span>
        </div>
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
