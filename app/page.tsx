import { Suspense } from "react";
import { sql } from "@/lib/db";
import type { TrafficJam } from "@/lib/db";
import JamForm from "@/components/jam-form";
import StatsCard from "@/components/stats-card";
import JamDetails from "@/components/jam-details";
import MapWrapper from "@/components/map-wrapper";
import TopUsersCard from "@/components/top-users-card"
import JamTypeStatsCard from "@/components/jam-type-stats-card"

interface TrafficJamWithUser extends TrafficJam {
  full_name: string | null;
  avatar_url: string | null;
}

interface TrafficJamResult extends TrafficJam {
  user?: {
    full_name: string;
    avatar_url?: string;
  };
}

async function getTrafficJams(hours: number): Promise<TrafficJamResult[]> {
  try {
    const rawResult = await sql`
      SELECT
        tj.*,
        u.full_name,
        u.avatar_url
      FROM traffic_jams tj
      LEFT JOIN users u ON tj.user_id = u.id
      WHERE tj.status = 'active'
      AND tj.created_at > NOW() - INTERVAL '1 hour' * ${hours}
      ORDER BY tj.created_at DESC
    `;

    const jams = rawResult as unknown as TrafficJamWithUser[];

    return jams.map((jam) => ({
      ...jam,
      user: jam.full_name
        ? {
            full_name: jam.full_name,
            avatar_url: jam.avatar_url ?? undefined,
          }
        : undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch traffic jams:", error);
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ hours: string }>;
}) {
  const params = await searchParams;
  const hours = parseInt(params.hours) || 6;
  const trafficJams = await getTrafficJams(hours);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Traffic Montenegro
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Real-time traffic reports and road conditions across Montenegro
            </p>
          </div>
          <JamForm />
        </div>
      </div>

      {/* Time Range Selection */}
      <div className="mb-4">
        <form method="get" className="flex gap-2 items-center">
          <label htmlFor="hours" className="text-gray-700 dark:text-gray-300">
            Filter by time range:
          </label>
          <select
            id="hours"
            name="hours"
            defaultValue={hours}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-black"
          >
            <option value="3">Last 3 Hours</option>
            <option value="6">Last 6 Hours</option>
            <option value="12">Last 12 Hours</option>
            <option value="24">Last 24 Hours</option>
            <option value="36">Last 36 Hours</option>
            <option value="48">Last 48 Hours</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Apply
          </button>
        </form>
      </div>

      {/* Stats Section */}
      <div className="mb-8">
        <Suspense
          fallback={
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          }
        >
          <StatsCard />
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Map Section */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Live Traffic Map (Last {hours} hours jams)
            </h2>
            <div className="h-[500px]">
              <MapWrapper trafficJams={trafficJams} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Reports
            </h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {trafficJams.length > 0 ? (
                trafficJams.slice(0, 5).map((jam) => (
                  <div
                    key={jam.id}
                    className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
                  >
                    <JamDetails jam={jam} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No active traffic reports at the moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Padding between main content and stats cards */}
      <div className="py-10" />

      {/* Stats Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <TopUsersCard />
        <JamTypeStatsCard />
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              About
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Traffic Montenegro helps citizens report and stay informed about
              traffic conditions across the country.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>
                <a href="/about" className="hover:text-teal-500">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-teal-500">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-teal-500">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-teal-500">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>
                <a href="/help" className="hover:text-teal-500">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-teal-500">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/report-bug" className="hover:text-teal-500">
                  Report Bug
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Statistics
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>Active Reports: {trafficJams.length}</p>
              {/* <p>Total Users: Loading...</p> */}
              <p>Last Updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-300">
          <p>&copy; 2024 Traffic Montenegro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
