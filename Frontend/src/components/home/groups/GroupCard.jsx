export default function GroupCard({ name, users, inviteCode, baseCurrency, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col gap-4"
    >
      {/* Header: Group Name & Invite Code */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{name}</h4>
        {inviteCode && (
          <span className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100 font-medium">
            Code: {inviteCode}
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* Stats Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <span className="font-medium">👥 Users:</span>
          <span>{users?.length || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">💱 Base Currency:</span>
          <span>{baseCurrency || "INR"}</span>
        </div>
      </div>
    </div>
  );
}