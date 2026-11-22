/* eslint-disable @next/next/no-img-element */

const SIZES = { xs: "size-7 text-[10px]", sm: "size-9 text-xs", md: "size-11 text-sm", lg: "size-16 text-lg", xl: "size-24 text-2xl" };

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "U";

export default function Avatar({ src, name, size = "sm", className = "" }) {
  const base = `${SIZES[size]} shrink-0 rounded-full object-cover ring-2 ring-white ${className}`;
  if (src) return <img src={src} alt={name || "User"} className={base} referrerPolicy="no-referrer" />;
  return (
    <span className={`${base} grid place-items-center bg-pine-100 font-bold text-pine-800`} aria-label={name}>
      {initials(name)}
    </span>
  );
}
