"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e3dfd3",
  boxShadow: "0 8px 24px -12px rgb(15 31 28 / 0.25)",
  fontSize: 12,
};

/** Donut with a legend; data: [{ name, value, color }]. */
export function DonutChart({ data, centerLabel = "Total" }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const shown = data.filter((d) => d.value > 0);
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative size-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={shown.length ? shown : [{ name: "None", value: 1, color: "#ede9de" }]} dataKey="value" nameKey="name" innerRadius="68%" outerRadius="100%" paddingAngle={shown.length > 1 ? 2 : 0} stroke="none">
              {(shown.length ? shown : [{ color: "#ede9de" }]).map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            {shown.length > 0 && <Tooltip contentStyle={tooltipStyle} />}
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-display text-3xl font-extrabold">{total}</p>
            <p className="text-xs text-muted">{centerLabel}</p>
          </div>
        </div>
      </div>
      <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
        {data.map((d) => (
          <li key={d.name} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-muted">
              <span className="size-2.5 rounded-full" style={{ background: d.color }} /> {d.name}
            </span>
            <span className="font-bold">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Vertical bars; data: [{ label, value }]. */
export function SimpleBarChart({ data, color = "#17634f", height = 240, valueFormatter }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#ede9de" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#5b6b66" }} interval={0} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#5b6b66" }} />
          <Tooltip cursor={{ fill: "#ecf5f1" }} contentStyle={tooltipStyle} formatter={valueFormatter ? (v) => [valueFormatter(v), ""] : undefined} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={44}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color || color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Smooth area chart for revenue over time; data: [{ label, value }]. */
export function RevenueChart({ data, height = 240 }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f7a63" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#1f7a63" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#ede9de" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#5b6b66" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#5b6b66" }} tickFormatter={(v) => `$${v}`} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${Number(v).toFixed(2)}`, "Revenue"]} />
          <Area type="monotone" dataKey="value" stroke="#17634f" strokeWidth={2.5} fill="url(#rev)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
