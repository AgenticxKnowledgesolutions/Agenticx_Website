import { type DashboardSummary } from '@/services/dashboardService';

interface LeadStatusPieChartProps {
  summary: DashboardSummary | null;
}

export default function LeadStatusPieChart({ summary }: LeadStatusPieChartProps) {
  if (!summary || !summary.leadStatusBreakdown || summary.leadStatusBreakdown.length === 0) {
    return <div style={{ color: '#64748b' }}>No status logs found.</div>;
  }

  const data = summary.leadStatusBreakdown;
  const totalCount = data.reduce((acc, curr) => acc + curr.count, 0);

  const colorsMap: Record<string, string> = {
    pending: '#ef4444',
    contacted: '#3b82f6',
    'demo booked': '#f59e0b',
    enrolled: '#10b981',
    rejected: '#64748b',
  };

  let accumulatedPercentage = 0;

  return (
    <div className="doughnut-layout">
      <div style={{ position: 'relative', width: '110px', height: '110px' }}>
        <svg viewBox="0 0 42 42" className="doughnut-chart-svg">
          <circle cx="21" cy="21" r="15.915" className="doughnut-circle-bg" />

          {data.map((item, index) => {
            if (item.count === 0 || totalCount === 0) return null;
            const pct = (item.count / totalCount) * 100;
            const dasharray = `${pct} ${100 - pct}`;
            const dashoffset = 100 - accumulatedPercentage;
            accumulatedPercentage += pct;

            const statusLower = item.status.toLowerCase();
            const color = colorsMap[statusLower] || '#8b5cf6';

            return (
              <circle
                key={index}
                cx="21"
                cy="21"
                r="15.915"
                className="doughnut-circle-val"
                stroke={color}
                strokeDasharray={dasharray}
                strokeDashoffset={dashoffset}
              />
            );
          })}
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#001943' }}>{totalCount}</h4>
          <span style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total</span>
        </div>
      </div>

      <div className="doughnut-legend" style={{ gap: '6px' }}>
        {data.map((item, index) => {
          const statusLower = item.status.toLowerCase();
          const color = colorsMap[statusLower] || '#8b5cf6';
          const pct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
          return (
            <div className="legend-item" key={index} style={{ fontSize: '11px' }}>
              <div className="legend-color-label">
                <span className="legend-color-dot" style={{ backgroundColor: color, width: '8px', height: '8px' }} />
                <span style={{ textTransform: 'capitalize' }}>{item.status}</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span className="legend-count" style={{ fontWeight: 600 }}>
                  {item.count}
                </span>
                <span style={{ color: '#94a3b8' }}>({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
