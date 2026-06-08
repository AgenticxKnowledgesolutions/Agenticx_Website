import { type DashboardSummary } from '@/services/dashboardService';

interface LeadsGrowthChartProps {
  summary: DashboardSummary | null;
}

export default function LeadsGrowthChart({ summary }: LeadsGrowthChartProps) {
  if (!summary || !summary.monthlyLeads || summary.monthlyLeads.length === 0) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
        No data available
      </div>
    );
  }

  const data = summary.monthlyLeads;
  const maxVal = Math.max(...data.map((d) => d.count), 5);

  const width = 500;
  const height = 150;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = data.map((d, i) => {
    const x = paddingLeft + i * (chartWidth / (data.length - 1 || 1));
    const y = height - paddingBottom - (d.count / maxVal) * chartHeight;
    return { x, y, label: d.month, value: d.count };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathD += ` L ${points[i].x} ${points[i].y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
        const y = height - paddingBottom - ratio * chartHeight;
        const gridVal = Math.round(ratio * maxVal);
        return (
          <g key={index}>
            <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} className="chart-grid-line" />
            <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className="chart-label">
              {gridVal}
            </text>
          </g>
        );
      })}
      <path d={areaD} className="chart-area" />
      <path d={pathD} className="chart-line" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" className="chart-dot" />
          <text x={p.x} y={p.y - 8} textAnchor="middle" className="chart-value-label">
            {p.value}
          </text>
          <text x={p.x} y={height - 8} textAnchor="middle" className="chart-label">
            {p.label}
          </text>
        </g>
      ))}
      <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} className="chart-axis-line" />
    </svg>
  );
}
