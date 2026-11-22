export default function Loading() {
  return (
    <div className="container-x py-14">
      <div className="skeleton h-9 w-72" />
      <div className="skeleton mt-3 h-5 w-96 max-w-full" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="skeleton aspect-[16/10] rounded-none" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-6 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
