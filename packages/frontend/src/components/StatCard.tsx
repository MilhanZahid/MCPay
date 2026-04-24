interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  color: "green" | "blue" | "purple" | "teal" | "red";
}

export default function StatCard({ label, value, detail, color }: StatCardProps) {
  return (
    <div className={`card card--glow-${color}`} id={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <p className="stat-card__label">{label}</p>
      <p className={`stat-card__value stat-card__value--${color}`}>{value}</p>
      <p className="stat-card__detail">{detail}</p>
    </div>
  );
}
