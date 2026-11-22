/**
 * Table on desktop, stacked cards on mobile.
 * columns: [{ key, header, render?(row), className?, hideOnMobile? }]
 */
export default function DataTable({ columns, rows, rowKey = (r) => r._id }) {
  const cell = (col, row) => (col.render ? col.render(row) : row[col.key]);

  return (
    <>
      <div className="card hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-cream/70 text-xs font-bold tracking-wider text-muted uppercase">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className={`px-4 py-3 whitespace-nowrap ${c.className || ""}`}>
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) => (
                <tr key={rowKey(row)} className="align-middle transition hover:bg-cream/50">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3.5 ${c.className || ""}`}>
                      {cell(c, row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)} className="card space-y-2.5 p-4">
            {columns
              .filter((c) => !c.hideOnMobile)
              .map((c) => (
                <div key={c.key} className="flex items-start justify-between gap-4 text-sm">
                  {c.header && <span className="shrink-0 pt-0.5 text-xs font-bold tracking-wider text-muted uppercase">{c.header}</span>}
                  <div className={`min-w-0 text-right ${c.header ? "" : "w-full text-left"}`}>{cell(c, row)}</div>
                </div>
              ))}
          </li>
        ))}
      </ul>
    </>
  );
}

/* eslint-disable @next/next/no-img-element */
export function ServiceCell({ image, title, subtitle }) {
  return (
    <div className="flex min-w-0 items-center gap-3 text-left">
      <img src={image} alt="" className="size-12 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0">
        <p className="line-clamp-2 font-bold">{title}</p>
        {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
