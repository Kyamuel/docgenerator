export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-mint-50 p-4">Quick Practice</div>
        <div className="rounded-lg bg-primary-50 p-4">Recent Progress</div>
        <div className="rounded-lg bg-white p-4 border">Tips</div>
      </div>
    </div>
  );
}