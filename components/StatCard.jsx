export default function StatCard({ title, count, icon, color }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-bold uppercase">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{count}</h3>
      </div>
    </div>
  );
}
