export default function SectionHeading({ eyebrow, title, lead, align = "left", action }) {
  const centered = align === "center";
  return (
    <div className={`flex flex-col gap-4 ${centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"}`}>
      <div className={centered ? "flex flex-col items-center" : ""}>
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
        <h2 className="section-title mt-3">{title}</h2>
        {lead && <p className="section-lead">{lead}</p>}
      </div>
      {action}
    </div>
  );
}
