import { type DashboardSummary } from '@/services/dashboardService';

interface InterestAnalyticsChartProps {
  summary: DashboardSummary | null;
}

export default function InterestAnalyticsChart({ summary }: InterestAnalyticsChartProps) {
  return (
    <div className="funnel-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {[
        { label: 'Total Leads', count: summary?.leadFunnel?.totalLeads ?? 0, color: '#3b82f6', icon: 'groups' },
        { label: 'Contacted', count: summary?.leadFunnel?.contacted ?? 0, color: '#6366f1', icon: 'contact_phone' },
        { label: 'Demo Booked', count: summary?.leadFunnel?.demoBooked ?? 0, color: '#f59e0b', icon: 'co_present' },
        { label: 'Enrolled Students', count: summary?.leadFunnel?.enrolled ?? 0, color: '#10b981', icon: 'verified_user' },
      ].map((stage, idx, arr) => {
        const maxCount = arr[0].count || 1;
        const pct = Math.round((stage.count / maxCount) * 100);
        return (
          <div key={idx} className="funnel-stage-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              className="funnel-stage-icon"
              style={{
                backgroundColor: `${stage.color}15`,
                color: stage.color,
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {stage.icon}
              </span>
            </div>
            <div style={{ flexGrow: 1 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '2px',
                }}
              >
                <span>{stage.label}</span>
                <span>
                  {stage.count} <span style={{ color: '#94a3b8', fontSize: '10px' }}>({pct}%)</span>
                </span>
              </div>
              <div className="bar-chart-track" style={{ height: '8px' }}>
                <div className="bar-chart-fill" style={{ width: `${pct}%`, backgroundColor: stage.color }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
