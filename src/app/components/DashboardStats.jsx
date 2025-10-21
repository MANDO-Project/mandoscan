export default function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-lg bg-gray-800 p-6">
        <h3 className="text-sm font-medium text-gray-400">Total Scans</h3>
        <p className="mt-2 text-2xl font-semibold text-white">
          {stats.totalScans}
        </p>
      </div>
      <div className="rounded-lg bg-gray-800 p-6">
        <h3 className="text-sm font-medium text-gray-400">
          Vulnerabilities Found
        </h3>
        <p className="mt-2 text-2xl font-semibold text-white">
          {stats.vulnerabilitiesFound}
        </p>
      </div>
      <div className="rounded-lg bg-gray-800 p-6">
        <h3 className="text-sm font-medium text-gray-400">Last Scan</h3>
        <p className="mt-2 text-2xl font-semibold text-white">
          {stats.lastScanDate
            ? new Date(stats.lastScanDate).toLocaleDateString()
            : 'No scans yet'}
        </p>
      </div>
    </div>
  );
}
