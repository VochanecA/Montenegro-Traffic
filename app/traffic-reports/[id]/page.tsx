import type { Metadata } from 'next';
import { sql, type TrafficJam } from '@/lib/db';
import TrafficReportMap from '@/components/TrafficReportMap';

interface PageProps {
  params: { id: string };
}

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

  // Ensure photo_urls is treated as a string array, even if it's null or an empty JSONB array
  const photoUrls = (jam.photo_urls && Array.isArray(jam.photo_urls))
    ? jam.photo_urls
    : [];


  return {
    ...jam,
    photo_urls: photoUrls, // Set the processed photo_urls
    user: {
      full_name: jam.full_name || 'Unknown User',
      avatar_url: jam.avatar_url || undefined,
    },
  } as TrafficJam;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Destructure id directly to address Next.js warning
  const { id } = params;
  const jam = await getTrafficJamById(Number(id));
  return {
    title: jam ? jam.title : 'Traffic Report Not Found',
  };
}

// Moved these components BEFORE the default export
function SeverityPill({ severity }: { severity: 'high' | 'medium' | 'low' | string }) {
  const colors: Record<'high' | 'medium' | 'low', string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${(colors as any)[severity] || 'bg-gray-100 text-gray-700'}`}
    >
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

function StatusPill({ status }: { status: 'active' | 'resolved' | string }) {
  const colors: Record<'active' | 'resolved', string> = {
    active: 'bg-teal-100 text-teal-700',
    resolved: 'bg-gray-200 text-gray-600',
  };
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors[status as 'active' | 'resolved'] || 'bg-gray-100 text-gray-700'}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function JamTypePill({ type }: { type: string }) {
  const colors = {
    accident: 'bg-red-200 text-red-800',
    construction: 'bg-orange-200 text-orange-800',
    weather: 'bg-blue-200 text-blue-800',
    traffic_jam: 'bg-yellow-200 text-yellow-800',
    other: 'bg-gray-200 text-gray-800',
  };
  const label = type.replace('_', ' ');
  const colorClass =
    colors[type as keyof typeof colors] || colors.other;
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}
    >
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  );
}

export default async function TrafficReportPage({ params }: PageProps) {
  // Destructure id directly to address Next.js warning
  const { id } = params;
  const numericId = Number(id);

  const jam = await getTrafficJamById(numericId);

  if (!jam) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Traffic Report Not Found</h1>
        <p className="text-gray-600">No traffic report with ID {numericId} exists.</p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-8 mb-12">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white flex-1">{jam.title}</h1>
        <div className="flex flex-wrap gap-2">
          <JamTypePill type={jam.jam_type} />
          <SeverityPill severity={jam.severity} />
          <StatusPill status={jam.status} />
        </div>
      </header>

      <section className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        {jam.description || (
          <p className="italic text-gray-400 dark:text-gray-500">No description provided.</p>
        )}
      </section>

      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {jam.user?.avatar_url ? (
              <img
                src={jam.user.avatar_url}
                alt={jam.user.full_name}
                className="w-12 h-12 rounded-full object-cover shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold">
                {jam.user?.full_name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{jam.user?.full_name || 'Unknown User'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reported this issue</p>
            </div>
          </div>

          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Reported At:</strong> {new Date(jam.created_at).toLocaleString()}</p>
            <p>
              <strong>Coordinates:</strong> {jam.latitude && !isNaN(Number(jam.latitude)) ? Number(jam.latitude).toFixed(4) : 'N/A'}, {jam.longitude && !isNaN(Number(jam.longitude)) ? Number(jam.longitude).toFixed(4) : 'N/A'}
            </p>
            {jam.address && <p><strong>Address:</strong> {jam.address}</p>}
          </div>
        </div>

        {jam.photo_urls && jam.photo_urls.length > 0 && (
          <div className="grid grid-cols-2 gap-4 rounded-lg overflow-hidden shadow-md">
            {jam.photo_urls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Traffic jam photo ${i + 1}`}
                className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Location</h2>
        <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
          <TrafficReportMap trafficJams={[jam]} />
        </div>
      </section>
    </main>
  );
}