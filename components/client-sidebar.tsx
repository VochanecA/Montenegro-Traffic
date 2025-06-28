'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TrafficJam } from '@/lib/db';
import { Clock, MapPin, User, ChevronDown, ChevronUp } from 'lucide-react';

interface ClientSidebarProps {
  trafficJams?: TrafficJam[];
}

export default function ClientSidebar({ trafficJams = [] }: ClientSidebarProps) {
  const [selectedJam, setSelectedJam] = useState<TrafficJam | null>(null);
  const router = useRouter();

  // Enhanced severity styling with consistent dark/light variants
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30', // Added opacity for dark mode
          text: 'text-red-800 dark:text-red-300',
          border: 'border-red-200 dark:border-red-800/50',
          pillBg: 'bg-red-100 dark:bg-red-900',
          pillText: 'text-red-800 dark:text-red-300',
          icon: '🔴'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-100 dark:bg-orange-500/30',
          text: 'text-yellow-800 dark:text-yellow-300',
          border: 'border-yellow-200 dark:border-yellow-800/50',
          pillBg: 'bg-yellow-100 dark:bg-yellow-900',
          pillText: 'text-yellow-800 dark:text-yellow-300',
          icon: '🟡'
        };
      case 'low':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-800 dark:text-green-300',
          border: 'border-green-200 dark:border-green-800/50',
          pillBg: 'bg-green-100 dark:bg-green-900',
          pillText: 'text-green-800 dark:text-green-300',
          icon: '🟢'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800/30',
          text: 'text-gray-800 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-700/50',
          pillBg: 'bg-gray-100 dark:bg-gray-800',
          pillText: 'text-gray-800 dark:text-gray-300',
          icon: '⚪'
        };
    }
  };

  const getJamTypeIcon = (jamType: string) => {
    const icons: Record<string, string> = {
      accident: '🚗💥',
      construction: '🚧👷',
      weather: '🌧️☔',
      traffic_jam: '🚗🚗🚗',
      police: '👮‍♂️🚨',
      roadblock: '🚧⛔',
      event: '🎪🎡'
    };
    return icons[jamType] || '⚠️';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Safe coordinate formatting
  const formatCoordinate = (coord: number | string | null | undefined): string => {
    if (coord === null || coord === undefined) return 'N/A'; // Changed from '0.0000' to 'N/A' for clarity
    const num = typeof coord === 'string' ? parseFloat(coord) : coord;
    return isNaN(num) ? 'N/A' : num.toFixed(4);
  };

  const toggleJamDetails = (jam: TrafficJam, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering handleJamClick
    setSelectedJam(selectedJam?.id === jam.id ? null : jam);
  };

  const handleJamClick = (jam: TrafficJam) => {
    router.push(`/traffic-reports/${jam.id}`);
  };

  // Statistics calculation
  const stats = {
    total: trafficJams.length,
    high: trafficJams.filter(jam => jam.severity === 'high').length,
    medium: trafficJams.filter(jam => jam.severity === 'medium').length,
    low: trafficJams.filter(jam => jam.severity === 'low').length,
    types: [...new Set(trafficJams.map(jam => jam.jam_type))]
  };

  return (
    // Main container for the sidebar, ensuring it fits well within a larger layout.
    // Fixed width for medium+ screens, full width for small screens.
    // Added overflow-y-auto to allow scrolling if content exceeds height.
      <div className="w-full md:w-80 lg:w-96 p-4 md:p-6 space-y-6 flex flex-col h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* Reports Section */}
     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Live Traffic Reports
          </h3>
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            {stats.total} active
          </span>
        </div>

        {trafficJams.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <MapPin className="text-gray-400 dark:text-gray-500" size={28} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No active traffic reports in this area. All clear!
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto pr-2 custom-scrollbar"> {/* Adjusted max-height and added custom-scrollbar */}
            {trafficJams.map((jam) => {
              const severity = getSeverityStyles(jam.severity);
              return (
                <div
                  key={jam.id}
                  onClick={() => handleJamClick(jam)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${severity.bg} ${severity.border} ${
                    selectedJam?.id === jam.id ? 'ring-2 ring-teal-500 dark:ring-teal-400' : 'hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-2xl flex-shrink-0">
                      {getJamTypeIcon(jam.jam_type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate text-base">
                          {jam.title}
                        </h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${severity.pillBg} ${severity.pillText} flex-shrink-0`}>
                          {jam.severity.charAt(0).toUpperCase() + jam.severity.slice(1)} {severity.icon}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin size={14} className="flex-shrink-0" />
                        <span className="truncate">{jam.address || 'Unknown location'}</span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Clock size={14} className="flex-shrink-0" />
                          <span>Reported {formatTimeAgo(jam.created_at)}</span>
                        </div>

                        <button
                          onClick={(e) => toggleJamDetails(jam, e)}
                          className="text-xs flex items-center gap-1 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          {selectedJam?.id === jam.id ? (
                            <>
                              <ChevronUp size={16} /> Less
                            </>
                          ) : (
                            <>
                              <ChevronDown size={16} /> More
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedJam?.id === jam.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3 animate-fade-in">
                      {jam.description && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {jam.description}
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                          <div className="text-gray-500 dark:text-gray-400 mb-0.5">Type</div>
                          <div className="font-medium capitalize text-gray-800 dark:text-gray-200">
                            {jam.jam_type.replace('_', ' ')}
                          </div>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                          <div className="text-gray-500 dark:text-gray-400 mb-0.5">Coordinates</div>
                          <div className="font-mono text-xs text-gray-800 dark:text-gray-200">
                            {formatCoordinate(jam.latitude)}, {formatCoordinate(jam.longitude)}
                          </div>
                        </div>
                      </div>

                      {jam.user && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <User size={14} className="flex-shrink-0" />
                          <span>Reported by <span className="font-medium text-gray-800 dark:text-gray-200">{jam.user.full_name}</span></span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 flex-shrink-0">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Traffic Overview
        </h3>

        <div className="space-y-4">
          {/* Severity Breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Severity Levels
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-gray-800 dark:text-gray-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-sm">High</span>
                </div>
                <span className="font-medium">{stats.high}</span>
              </div>

              <div className="flex items-center justify-between text-gray-800 dark:text-gray-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-sm">Medium</span>
                </div>
                <span className="font-medium">{stats.medium}</span>
              </div>

              <div className="flex items-center justify-between text-gray-800 dark:text-gray-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-sm">Low</span>
                </div>
                <span className="font-medium">{stats.low}</span>
              </div>
            </div>
          </div>

          {/* Jam Types */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Incident Types
            </h4>
            <div className="flex flex-wrap gap-2">
              {stats.types.map(type => (
                <span
                  key={type}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 capitalize"
                >
                  {type.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
