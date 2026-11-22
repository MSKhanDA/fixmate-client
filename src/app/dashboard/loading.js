export default function DashboardLoading() {
  return (
    <div>
      <div className="skeleton h-8 w-64" />
      <div className="skeleton mt-2 h-4 w-80 max-w-full" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card h-28 p-5">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton mt-3 h-9 w-16" />
          </div>
        ))}
      </div>
      <div className="card mt-6 space-y-3 p-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
