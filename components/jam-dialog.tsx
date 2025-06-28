'use client';

import { useState } from 'react';
import { X, MapPin, Clock, AlertTriangle, User, Calendar, Image as ImageIcon } from 'lucide-react';

interface TrafficJam {
  id: number;
  location: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  jam_type: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
  status: string;
  image_url?: string;
  user?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface JamDialogProps {
  jam: TrafficJam;
  isOpen: boolean;
  onClose: () => void;
}

export default function JamDialog({ jam, isOpen, onClose }: JamDialogProps) {
  const [imageError, setImageError] = useState(false);

  if (!isOpen) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[10000]">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Traffic Report Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Location and Severity */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="text-teal-600 dark:text-teal-400" size={20} />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {jam.location}
                </span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(jam.severity)}`}>
                <AlertTriangle size={16} className="inline mr-1" />
                {jam.severity.charAt(0).toUpperCase() + jam.severity.slice(1)} Priority
              </div>
            </div>

            {/* Jam Type */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Type:</span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm">
                {jam.jam_type}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {jam.description}
              </p>
            </div>

            {/* Image */}
            {jam.image_url && !imageError && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <ImageIcon size={20} />
                  Photo
                </h3>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={jam.image_url}
                    alt="Traffic jam photo"
                    className="w-full h-auto max-h-64 object-cover"
                    onError={() => setImageError(true)}
                  />
                </div>
              </div>
            )}

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Latitude</span>
                <p className="font-mono text-gray-900 dark:text-white">{jam.latitude}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Longitude</span>
                <p className="font-mono text-gray-900 dark:text-white">{jam.longitude}</p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="text-gray-500" size={16} />
                <span className="text-gray-600 dark:text-gray-400">Reported:</span>
                <span className="text-gray-900 dark:text-white">{formatDate(jam.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="text-gray-500" size={16} />
                <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                <span className="text-gray-900 dark:text-white">{formatDate(jam.updated_at)}</span>
              </div>
            </div>

            {/* Reporter Info */}
            {jam.user && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2">
                  {jam.user.avatar_url ? (
                    <img
                      src={jam.user.avatar_url}
                      alt={jam.user.full_name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                      <User size={16} className="text-teal-600 dark:text-teal-400" />
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Reported by:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{jam.user.full_name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                window.open(`https://www.google.com/maps?q=${jam.latitude},${jam.longitude}`, '_blank');
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
            >
              View on Map
            </button>
          </div>
        </div>
      </div>
    </>
  );
}