import { Suspense } from "react";
import { sql } from "@/lib/db";
import type { TrafficJam } from "@/lib/db";
import JamForm from "@/components/jam-form";
import StatsCard from "@/components/stats-card";
import JamDetails from "@/components/jam-details";
import MapWrapper from "@/components/map-wrapper";
import TopUsersCard from "@/components/top-users-card";
import JamTypeStatsCard from "@/components/jam-type-stats-card";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Facebook, Twitter, Instagram, Linkedin, MapPin } from 'lucide-react';


interface User {
  id: number;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at?: string;
}

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

async function getCurrentUser(): Promise<User | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return undefined;

  try {
    const decoded = verifyToken(token);
    if (!decoded) return undefined;

    const users = await sql`
      SELECT id, email, full_name, avatar_url, created_at
      FROM users
      WHERE id = ${decoded.userId}
    ` as User[];

    return users[0];
  } catch (error) {
    console.error('Error verifying token:', error);
    return undefined;
  }
}

async function parseSearchParams(searchParams: Promise<{ hours: string }>) {
  const params = await searchParams;
  return parseInt(params.hours) || 6;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ hours: string }>;
}) {
  const hours = await parseSearchParams(searchParams);
  const trafficJams = await getTrafficJams(hours);
  const user = await getCurrentUser();

  console.log("User object:", user); // Debugging log
  console.log("Is authenticated:", !!user); // Debugging log

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
          <JamForm isAuthenticated={!!user} user={user} />
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

      {/* Stats Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 my-16">
        <TopUsersCard />
        <JamTypeStatsCard />
      </section>



 {/* Footer */}
   {/* Footer */}
      <footer className="mt-16 bg-gradient-to-r from-teal-600/80 to-blue-600/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-lg border-t border-grey-400/50 shadow-2xl text-white rounded-t-xl">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand and Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="text-teal-200" size={28} strokeWidth={2.5} /> {/* Reduced size */}
              <span className="font-bold text-2xl text-teal-100 drop-shadow-lg">Traffic Montenegro</span> {/* Reduced size and boldness */}
            </div>
            <p className="text-xs text-teal-50 leading-relaxed max-w-xs"> {/* Reduced text size */}
              Your go-to source for real-time traffic updates and community-driven reports across Montenegro. Stay informed, stay safe.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-teal-100 mb-5 border-b border-teal-300/50 pb-2 inline-block">Quick Links</h3> {/* Reduced heading size */}
            <ul className="space-y-3 text-sm"> {/* Reduced list item text size */}
              <li>
                <a href="/about" className="text-teal-50 hover:text-teal-200 transition-all duration-300 ease-in-out transform hover:translate-x-1 block">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-teal-50 hover:text-teal-200 transition-all duration-300 ease-in-out transform hover:translate-x-1 block">
                  Contact
                </a>
              </li>
              <li>
                <a href="/faq" className="text-teal-50 hover:text-teal-200 transition-all duration-300 ease-in-out transform hover:translate-x-1 block">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-teal-100 mb-5 border-b border-teal-300/50 pb-2 inline-block">Legal</h3> {/* Reduced heading size */}
            <ul className="space-y-3 text-sm"> {/* Reduced list item text size */}
              <li>
                <a href="/privacy" className="text-teal-50 hover:text-teal-200 transition-all duration-300 ease-in-out transform hover:translate-x-1 block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-teal-50 hover:text-teal-200 transition-all duration-300 ease-in-out transform hover:translate-x-1 block">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/disclaimer" className="text-teal-50 hover:text-teal-200 transition-all duration-300 ease-in-out transform hover:translate-x-1 block">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect With Us (Social Media) */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-teal-100 mb-5 border-b border-teal-300/50 pb-2 inline-block">Connect With Us</h3> {/* Reduced heading size */}
            <div className="flex justify-center md:justify-start space-x-5">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                 className="text-teal-50 hover:text-teal-200 transition-transform duration-300 ease-in-out transform hover:-translate-y-1">
                <Facebook size={24} /> {/* Reduced icon size */}
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="text-teal-50 hover:text-teal-200 transition-transform duration-300 ease-in-out transform hover:-translate-y-1">
                <Twitter size={24} /> {/* Reduced icon size */}
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="text-teal-50 hover:text-teal-200 transition-transform duration-300 ease-in-out transform hover:-translate-y-1">
                <Instagram size={24} /> {/* Reduced icon size */}
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="text-teal-50 hover:text-teal-200 transition-transform duration-300 ease-in-out transform hover:-translate-y-1">
                <Linkedin size={24} /> {/* Reduced icon size */}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="text-center py-5 text-xs text-teal-200 border-t border-teal-800/30"> {/* Reduced text size */}
          © {new Date().getFullYear()} Traffic Montenegro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
