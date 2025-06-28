// app/traffic-reports/[id]/page.tsx
import type { Metadata } from 'next';
import { sql, type TrafficJam } from '@/lib/db';
import TrafficReportMap from '@/components/TrafficReportMap';
import Image from 'next/image'; // Use Next.js Image component for optimization

// Import the new BackButton component
import BackButton from '@/components/BackButton'; // <--- ADD THIS LINE

// React Icons
import {
  FiMapPin,
  FiClock,
  FiUser,
  FiImage,
  FiTrendingUp, // Used for general traffic jam type
  FiZap,
  FiAlertTriangle,
  FiTool,
  FiCloudRain,
  FiCheckCircle,
  FiXCircle,
  FiChevronRight,
  FiAlignJustify, // Used for Description icon
  FiArrowLeft, // <--- ADD THIS LINE for the back button icon
} from "react-icons/fi";

// Assuming you have a Card component like from shadcn/ui
import { Card, CardContent } from "@/components/ui/card";

interface PageProps {
  params: { id: string };
}

// Helper function to fetch traffic jam by ID
async function getTrafficJamById(id: number): Promise<TrafficJam | null> {
  const result = await sql`
    SELECT
      tj.*,
      u.full_name,
      u.avatar_url
    FROM traffic_jams tj
    LEFT JOIN users u ON tj.user_id = u.id
    WHERE tj.id = ${id}
    LIMIT 1
  `;

  const rows = (result as any).rows || result;

  if (!rows || rows.length === 0) return null;

  const jam = rows[0];

  const photoUrls = (jam.photo_urls && Array.isArray(jam.photo_urls))
    ? jam.photo_urls
    : [];

  return {
    ...jam,
    photo_urls: photoUrls,
    user: {
      full_name: jam.full_name || 'Unknown User',
      avatar_url: jam.avatar_url || undefined,
    },
  } as TrafficJam;
}

// --- Metadata generation function ---
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const jam = await getTrafficJamById(Number(props.params.id));
  return {
    title: jam ? jam.title : 'Traffic Report Not Found - TrafficWise Montenegro',
    description: jam ? jam.description : 'Details for a specific traffic report in Montenegro.',
  };
}

// --- Reusable Pill Components ---

interface PillProps {
  label: string;
  className: string;
  icon?: React.ReactNode;
}

const CustomPill: React.FC<PillProps> = ({ label, className, icon }) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${className} transition-colors duration-200`}
  >
    {icon && <span className="mr-1">{icon}</span>}
    {label}
  </span>
);

function SeverityPill({ severity }: { severity: 'high' | 'medium' | 'low' | string }) {
  const props = {
    high: { label: 'High', className: 'bg-red-500 text-white', icon: <FiZap className="h-3 w-3" /> },
    medium: { label: 'Medium', className: 'bg-yellow-500 text-white', icon: <FiZap className="h-3 w-3" /> },
    low: { label: 'Low', className: 'bg-green-500 text-white', icon: <FiZap className="h-3 w-3" /> },
  }[severity as 'high' | 'medium' | 'low'] || { label: severity, className: 'bg-gray-500 text-white', icon: <FiZap className="h-3 w-3" /> };

  return <CustomPill {...props} />;
}

function StatusPill({ status }: { status: 'active' | 'resolved' | string }) {
  const props = {
    active: { label: 'Active', className: 'bg-teal-500 text-white', icon: <FiCheckCircle className="h-3 w-3" /> },
    resolved: { label: 'Resolved', className: 'bg-gray-500 text-white', icon: <FiXCircle className="h-3 w-3" /> },
  }[status as 'active' | 'resolved'] || { label: status, className: 'bg-gray-400 text-white', icon: null };

  return <CustomPill {...props} />;
}

type JamType = 'accident' | 'construction' | 'weather' | 'traffic_jam' | 'other';

function JamTypePill({ type }: { type: string }) {
  const label = type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1);
  const typeProps: Record<JamType, { className: string; icon: React.ReactNode }> = {
    accident: { className: 'bg-red-600 text-white', icon: <FiAlertTriangle className="h-3 w-3" /> },
    construction: { className: 'bg-orange-600 text-white', icon: <FiTool className="h-3 w-3" /> },
    weather: { className: 'bg-blue-600 text-white', icon: <FiCloudRain className="h-3 w-3" /> },
    traffic_jam: { className: 'bg-yellow-600 text-white', icon: <FiTrendingUp className="h-3 w-3" /> },
    other: { className: 'bg-gray-600 text-white', icon: <FiTrendingUp className="h-3 w-3" /> },
  };

  const props = (type in typeProps)
    ? typeProps[type as JamType]
    : { className: 'bg-gray-600 text-white', icon: <FiTrendingUp className="h-3 w-3" /> };

  return <CustomPill label={label} {...props} />;
}

// --- Main Page Component ---
export default async function TrafficReportPage(props: PageProps) {
  const numericId = Number(props.params.id);
  const jam = await getTrafficJamById(numericId);

  if (!jam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-8 mb-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-red-600 dark:text-red-400">404 - Report Not Found</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          The traffic report with ID <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{numericId}</span> could not be found.
        </p>
        <p className="text-md text-gray-500 dark:text-gray-400">It might have been resolved or an incorrect ID was provided.</p>
        {/* The 404 page already has a "Back to Traffic Reports" link */}
        <a href="/" className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2">
          <FiChevronRight className="transform rotate-180" /> Back to Traffic Reports
        </a>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-8 mb-12">
      {/* Add the BackButton component here */}
      <BackButton /> {/* <--- ADD THIS LINE */}

      {/* Header Section: Title & Key Pills */}
      <header className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          {jam.title}
        </h1>
        <div className="flex flex-wrap gap-3">
          <JamTypePill type={jam.jam_type} />
          <SeverityPill severity={jam.severity} />
          <StatusPill status={jam.status} />
        </div>
      </header>

      {/* Description Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <FiAlignJustify className="text-teal-500" /> Description
        </h2>
        {jam.description ? (
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {jam.description}
          </p>
        ) : (
          <p className="italic text-gray-400 dark:text-gray-500">No detailed description provided for this traffic report.</p>
        )}
      </section>

      {/* Details Grid: Reporter/Time/Location & Photos */}
      <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Reporter, Time, Location Details */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FiUser className="text-teal-500" /> Report Information
          </h2>

          {/* Reporter Info Card */}
          <Card className="bg-black-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              {jam.user?.avatar_url ? (
                <Image
                  src={jam.user.avatar_url}
                  alt={jam.user.full_name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-400"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xl">
                  {jam.user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{jam.user?.full_name || 'Anonymous User'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reported this issue</p>
              </div>
            </CardContent>
          </Card>

          {/* Time and Location Details */}
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <FiClock className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
              <p><strong>Reported At:</strong> {new Date(jam.created_at).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</p>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
              <p><strong>Address:</strong> {jam.address || 'Address not specified'}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FiAlignJustify className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
              <p><strong>Coordinates:</strong> {Number(jam.latitude).toFixed(6)}, {Number(jam.longitude).toFixed(6)}</p>
            </div>
          </div>
        </div>

        {/* Photos Section */}
        {jam.photo_urls && jam.photo_urls.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FiImage className="text-teal-500" /> Traffic Jam Photos
            </h2>
            <div className="grid grid-cols-2 gap-4 rounded-lg overflow-hidden shadow-md">
              {jam.photo_urls.map((url, i) => (
                <div key={i} className="relative w-full aspect-video">
                  <Image
                    src={url}
                    alt={`Traffic jam photo ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Map Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <FiMapPin className="text-teal-500" /> Location on Map
        </h2>
        <div className="w-full h-96 rounded-lg overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
          <TrafficReportMap trafficJams={[jam]} />
        </div>
      </section>
    </main>
  );
}