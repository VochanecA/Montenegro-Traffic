// components/BackButton.tsx
"use client";

import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi'; // Or FiChevronLeft if you prefer the one you used for 404

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-white dark:text-gray-100 bg-teal-700 dark:bg-teal-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 mb-6"
    >
      <FiArrowLeft className="mr-2 h-4 w-4" />
      Back to Reports
    </button>
  );
}