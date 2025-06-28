// app/traffic-reports/[id]/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-red-600">404 - Report Not Found</h1>
      <p className="text-gray-600 mt-2">The traffic report you are looking for does not exist.</p>
    </div>
  );
}
