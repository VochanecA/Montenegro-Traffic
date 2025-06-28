// apppage.tsx
import { Suspense } from "react";
import { sql } from "@/lib/db";
import type { TrafficJam } from "@/lib/db";
import JamForm from "@/components/jam-form";
import StatsCard from "@/components/stats-card";
import MapWrapper from "@/components/map-wrapper";
import TopUsersCard from "@/components/top-users-card";
import JamTypeStatsCard from "@/components/jam-type-stats-card";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Facebook, Twitter, Instagram, Linkedin, MapPin } from 'lucide-react'; // Removed weather icons here
import { CookieBanner } from "@/components/CookieBanner";
import ClientSidebar from "@/components/client-sidebar";
import WeatherTable from '@/components/weather-table';
import { fetchAllCitiesWeather } from '@/lib/weather';

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

async function getTrafficJams(hours: number): Promise<TrafficJam[]> {
  try {
    const rawResult = await sql`
      SELECT tj.*, u.full_name, u.avatar_url
      FROM traffic_jams tj
      LEFT JOIN users u ON tj.user_id = u.id
      WHERE tj.status = 'active'
      AND tj.created_at > NOW() - INTERVAL '1 hour' * ${hours}
      ORDER BY tj.created_at DESC
    `;

    const jams = rawResult as unknown as TrafficJamWithUser[];
    return jams.map((jam) => {
      const { full_name, avatar_url, ...jamData } = jam;
      return {
        ...jamData,
        location: jamData.location || jamData.address || `${jamData.latitude}, ${jamData.longitude}`,
        user: full_name ? { full_name, avatar_url: avatar_url ?? undefined } : undefined,
      };
    });
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
      FROM users WHERE id = ${decoded.userId}
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
  const weatherData = await fetchAllCitiesWeather(); // Fetch weather data
 const initialWeatherData = await fetchAllCitiesWeather();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Traffic Montenegro
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Real-time traffic reports and road conditions
          </p>
        </div>
        <JamForm isAuthenticated={!!user} user={user} />
      </div>

      {/* Time Range Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label htmlFor="hours" className="text-sm text-gray-700 dark:text-gray-300">
          Filter by time range:
        </label>
        <form method="get" className="flex gap-2 flex-1">
          <select
            id="hours"
            name="hours"
            defaultValue={hours}
            className="flex-1 max-w-[200px] px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-black"
          >
            <option value="3">Last 3 Hours</option>
            <option value="6">Last 6 Hours</option>
            <option value="12">Last 12 Hours</option>
            <option value="24">Last 24 Hours</option>
          </select>
          <button
            type="submit"
            className="px-3 py-1.5 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Apply
          </button>
        </form>
      </div>

      {/* Stats Section */}
      <Suspense fallback={<div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />}>
        <StatsCard />
      </Suspense>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Live Traffic Map (Last {hours} hours)
          </h2>
          <div className="h-[400px] mb-6">
            <MapWrapper trafficJams={trafficJams} />
          </div>

          {/* Weather Table - now a Client Component */}
        <WeatherTable initialWeatherData={initialWeatherData} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ClientSidebar trafficJams={trafficJams} />
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopUsersCard />
        <JamTypeStatsCard />
      </div>

      {/* Footer */}
      <footer className="mt-8 bg-gradient-to-r from-teal-600/80 to-blue-600/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-lg border-t border-grey-400/50 shadow-xl text-white rounded-lg">
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="text-teal-200" size={24} />
              <span className="font-bold text-xl text-teal-100">Traffic Montenegro</span>
            </div>
            <p className="text-xs text-teal-50">
              Real-time traffic updates across Montenegro
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-teal-100 mb-3 border-b border-teal-300/50 pb-1">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="/about" className="text-teal-50 hover:text-teal-200">About</a></li>
              <li><a href="/contact" className="text-teal-50 hover:text-teal-200">Contact</a></li>
              <li><a href="/faq" className="text-teal-50 hover:text-teal-200">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-teal-100 mb-3 border-b border-teal-300/50 pb-1">Legal</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="/privacy" className="text-teal-50 hover:text-teal-200">Privacy</a></li>
              <li><a href="/terms" className="text-teal-50 hover:text-teal-200">Terms</a></li>
              <li><a href="/disclaimer" className="text-teal-50 hover:text-teal-200">Disclaimer</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-teal-100 mb-3 border-b border-teal-300/50 pb-1">Connect</h3>
            <div className="flex gap-4">
              <a href="https://facebook.com" className="text-teal-50 hover:text-teal-200"><Facebook size={20} /></a>
              <a href="https://twitter.com" className="text-teal-50 hover:text-teal-200"><Twitter size={20} /></a>
              <a href="https://instagram.com" className="text-teal-50 hover:text-teal-200"><Instagram size={20} /></a>
              <a href="https://linkedin.com" className="text-teal-50 hover:text-teal-200"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>

        <div className="text-center py-3 text-xs text-teal-200 border-t border-teal-800/30">
          © {new Date().getFullYear()} Traffic Montenegro
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}