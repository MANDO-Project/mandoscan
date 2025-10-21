export default function ActivityTable({ activities }) {
  return (
    <div className="mt-8 rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-xl font-semibold text-white">
        Recent Activities
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                File Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Vulnerabilities
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-b border-gray-700">
                <td className="px-6 py-4 text-sm text-gray-300">
                  {activity.fileName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {activity.vulnerabilities}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      activity.status === 'completed'
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    }`}
                  >
                    {activity.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-blue-400 hover:text-blue-300">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
