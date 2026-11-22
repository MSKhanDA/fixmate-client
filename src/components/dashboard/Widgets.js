/** Reusable dashboard building blocks: page header, stats cards, chart card. */

export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

const TONES = {
  pine: "bg-pine-50 text-pine-700",
  lime: "bg-lime-200 text-pine-900",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
  emerald: "bg-emerald-50 text-emerald-700",
};

export function StatsCard({ label, value, icon: Icon, tone = "pine", hint, loading }) {
  return (
    <div className="card flex items-start justify-between gap-4 p-5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-muted">{label}</p>
        {loading ? <div className="skeleton mt-2 h-9 w-20" /> : <p className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{value}</p>}
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </div>
      {Icon && (
        <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${TONES[tone]}`}>
          <Icon className="size-6" />
        </span>
      )}
    </div>
  );
}

export function StatsGrid({ children }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

export function ChartCard({ title, description, children, className = "" }) {
  return (
    <div className={`card p-5 ${className}`}>
      <h2 className="text-lg font-bold">{title}</h2>
      {description && <p className="text-sm text-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

/** Small status filter pills used above tables. */
export function FilterPills({ options, value, onChange }) {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            value === o.value ? "bg-pine-700 text-white" : "border border-line bg-white text-ink/75 hover:bg-pine-50"
          }`}
        >
          {o.label}
          {o.count !== undefined && <span className={`ml-1.5 text-xs ${value === o.value ? "text-lime-300" : "text-muted"}`}>{o.count}</span>}
        </button>
      ))}
    </div>
  );
}
