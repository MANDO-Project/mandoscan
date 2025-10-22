export default function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-gray-400 text-sm font-medium">Total Scans</h3>
        <p className="text-white text-2xl font-semibold mt-2">{stats.totalScans}</p>
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-gray-400 text-sm font-medium">Vulnerabilities Found</h3>
        <p className="text-white text-2xl font-semibold mt-2">{stats.vulnerabilitiesFound}</p>
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-gray-400 text-sm font-medium">Last Scan</h3>
        <p className="text-white text-2xl font-semibold mt-2">
          {stats.lastScanDate ? new Date(stats.lastScanDate).toLocaleDateString() : 'No scans yet'}
        </p>
      </div>
    </div>
  );
}