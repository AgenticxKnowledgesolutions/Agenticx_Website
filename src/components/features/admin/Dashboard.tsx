import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '@/store/useSettingsStore';
import { type DashboardLead } from '@/services/dashboardService';
import { updateLead } from '@/services/leadService';
import { api } from '@/services/apiService';
import { useToast } from '@/components/ui/Toast';
import { useAdminStore } from '@/services/adminStore';
import { ChartSkeleton } from '@/components/ui/Skeletons';
import './Admin.css';

// Lazy load SVG chart sub-components
const LeadsGrowthChart = lazy(() => import('./charts/LeadsGrowthChart'));
const LeadStatusPieChart = lazy(() => import('./charts/LeadStatusPieChart'));
const InterestAnalyticsChart = lazy(() => import('./charts/InterestAnalyticsChart'));


export default function Dashboard() {
  const { toast } = useToast();
  const settings = useSettingsStore(state => state.settings);
  const { summary, loadingSummary, fetchSummary, invalidateAll } = useAdminStore();

  // Report filters state
  const [reportFilter, setReportFilter] = useState('7days');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [exporting, setExporting] = useState<string | null>(null);

  // Lead modal state
  const [selectedLead, setSelectedLead] = useState<DashboardLead | null>(null);
  const [status, setStatus] = useState('Pending');
  const [adminNotes, setAdminNotes] = useState('');
  const [nextFollowupDate, setNextFollowupDate] = useState('');
  const [followupNotes, setFollowupNotes] = useState('');
  const [lastContactedAt, setLastContactedAt] = useState('');
  const [leadSource, setLeadSource] = useState('Website');
  const [priority, setPriority] = useState('Cold');
  const [assignedTo, setAssignedTo] = useState('');
  const [savingLead, setSavingLead] = useState(false);

  const loadSummary = async (force = false) => {
    try {
      await fetchSummary(force);
    } catch (err) {
      console.error(err);
      toast('Failed to load dashboard summary.', 'error');
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  // Format date helper
  const formatDate = (isoString?: string) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  // Get dates for export based on filter option
  const getFilterDates = () => {
    const now = new Date();
    let fromDate: Date | null = null;
    let toDate: Date = now;

    switch (reportFilter) {
      case 'today':
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        break;
      case 'yesterday':
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
        toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
        break;
      case '7days':
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'thismonth':
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'prevmonth':
        fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        toDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        break;
      case 'custom':
        if (customFrom) fromDate = new Date(customFrom);
        if (customTo) toDate = new Date(customTo);
        break;
      default:
        break;
    }

    return {
      fromStr: fromDate ? fromDate.toISOString() : undefined,
      toStr: toDate ? toDate.toISOString() : undefined
    };
  };

  // Trigger export file download
  const handleExport = async (format: string) => {
    setExporting(format);
    const { fromStr, toStr } = getFilterDates();
    try {
      const res = await api.get('/reports/leads/export', {
        params: {
          format,
          date_from: fromStr,
          date_to: toStr
        },
        responseType: 'blob'
      });
      
      const fileExtension = format === 'xlsx' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv';
      const blob = new Blob([res.data], { type: (res.headers['content-type'] as string) || undefined });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_report_${new Date().toISOString().slice(0, 10)}.${fileExtension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast(`Leads ${format.toUpperCase()} report downloaded.`, 'success');
    } catch (err) {
      console.error(err);
      toast('Failed to download lead report.', 'error');
    } finally {
      setExporting(null);
    }
  };

  // Open lead detail modal
  const handleOpenLead = (lead: DashboardLead) => {
    setSelectedLead(lead);
    setStatus(lead.status);
    setAdminNotes(lead.adminNotes || '');
    setNextFollowupDate(lead.nextFollowupDate ? lead.nextFollowupDate.substring(0, 16) : '');
    setFollowupNotes(lead.followupNotes || '');
    setLastContactedAt(lead.lastContactedAt ? lead.lastContactedAt.substring(0, 16) : '');
    setLeadSource(lead.source || 'Website');
    setPriority(lead.priority || 'Cold');
    setAssignedTo(lead.assignedTo || '');
  };

  // Save changes to lead
  const handleSaveLeadChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setSavingLead(true);
    try {
      const nowIso = new Date().toISOString();
      const updated = await updateLead(
        selectedLead.id,
        status,
        adminNotes,
        lastContactedAt ? new Date(lastContactedAt).toISOString() : nowIso,
        nextFollowupDate ? new Date(nextFollowupDate).toISOString() : null,
        followupNotes || null,
        leadSource || null,
        priority,
        assignedTo || null
      );
      if (updated) {
        toast('Lead updates successfully saved.', 'success');
        setSelectedLead(null);
        // Reload summary figures
        invalidateAll();
        loadSummary(true);
      } else {
        toast('Failed to update lead.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Failed to save updates.', 'error');
    } finally {
      setSavingLead(false);
    }
  };



  // Skeleton loading screen
  if (loadingSummary && !summary) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <div className="skeleton-box" style={{ width: '220px', height: '36px', marginBottom: '8px' }} />
          <div className="skeleton-box" style={{ width: '380px', height: '18px', marginBottom: '32px' }} />
        </div>
        <div className="admin-kpi-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="admin-kpi-card glass-panel" key={i} style={{ height: '100px', border: '1px solid #e2e8f0' }}>
              <div className="skeleton-box" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
                <div className="skeleton-box" style={{ width: '70px', height: '12px' }} />
                <div className="skeleton-box" style={{ width: '35px', height: '20px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Identify top performing course
  const topCourse = summary?.coursePerformance && summary.coursePerformance.length > 0 
    ? summary.coursePerformance[0] 
    : null;

  return (
    <div className="admin-dashboard">
      
      {/* 1. Top Operational Alerts Panel */}
      {summary?.alerts && summary.alerts.length > 0 && (
        <div className="operational-alerts-bar" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {summary.alerts.map((alert, idx) => {
            const isNoAlerts = alert.includes("No critical");
            return (
              <div 
                key={idx} 
                className="alert-pill"
                style={{
                  background: isNoAlerts ? '#ecfdf5' : '#fef2f2',
                  border: `1px solid ${isNoAlerts ? '#10b981' : '#f87171'}`,
                  color: isNoAlerts ? '#065f46' : '#991b1b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '30px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  {isNoAlerts ? 'check_circle' : 'warning'}
                </span>
                {alert}
              </div>
            );
          })}
        </div>
      )}

      {/* Duplicate warning bar */}
      {summary?.potentialDuplicatesCount && summary.potentialDuplicatesCount > 0 ? (
        <div className="duplicate-warning-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b45309', minWidth: 0 }}>
            <span className="material-symbols-outlined" style={{ flexShrink: 0 }}>warning_amber</span>
            <span style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>Attention: {summary.potentialDuplicatesCount} duplicate lead records detected in CRM system.</span>
          </div>
          <Link to="/admin/leads" style={{ fontSize: '12px', color: '#1d4ed8', fontWeight: 700, textDecoration: 'underline', flexShrink: 0 }}>
            Resolve & Check Duplicates
          </Link>
        </div>
      ) : null}

      <div className="admin-dashboard-header" style={{ marginBottom: '20px' }}>
        <h1 className="admin-page-title">Operational Control Center</h1>
        <p className="admin-page-subtitle">Real-time Admissions Pipeline, Lead Follow-ups, and Reporting System</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid" style={{ marginBottom: '24px' }}>
        
        {/* Total Leads */}
        <div className="admin-kpi-card glass-panel" style={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
          <div className="kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <span className="material-symbols-outlined">leaderboard</span>
          </div>
          <div className="kpi-content">
            <h3>Total Leads</h3>
            <p className="kpi-value">{summary?.totalLeads ?? 0}</p>
            <span className="kpi-trend positive">
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>trending_up</span>
              +12% this month
            </span>
          </div>
        </div>

        {/* New Leads This Month */}
        <div className="admin-kpi-card glass-panel" style={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
          <div className="kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <span className="material-symbols-outlined">how_to_reg</span>
          </div>
          <div className="kpi-content">
            <h3>New Leads</h3>
            <p className="kpi-value">{summary?.newLeads ?? 0}</p>
            <span className="kpi-trend neutral" style={{ fontSize: '10px' }}>Current month</span>
          </div>
        </div>

        {/* Lead Conversion */}
        <div className="admin-kpi-card glass-panel" style={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
          <div className="kpi-icon" style={{ backgroundColor: '#faf5ff', color: '#8b5cf6' }}>
            <span className="material-symbols-outlined">query_stats</span>
          </div>
          <div className="kpi-content">
            <h3>Conversion Rate</h3>
            <p className="kpi-value">{summary?.conversionRate ?? 0}%</p>
            <span className="kpi-trend neutral" style={{ fontSize: '10px' }}>Enrolled vs total</span>
          </div>
        </div>

        {/* Leads Requiring Follow-up (Phase 2 Addition) */}
        <div className="admin-kpi-card glass-panel" style={{ border: '1px solid #e2e8f0', boxShadow: 'none', minWidth: '220px' }}>
          <div className="kpi-icon" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
            <span className="material-symbols-outlined">phone_in_talk</span>
          </div>
          <div className="kpi-content">
            <h3>Follow-ups Actions</h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginTop: '4px' }}>
              <span className="kpi-value" style={{ fontSize: '20px', color: '#ea580c' }} title="Due Today">
                {summary?.leadsRequiringFollowup?.today ?? 0}
              </span>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>today</span>
              <span className="kpi-value" style={{ fontSize: '20px', color: '#ef4444', marginLeft: '6px' }} title="Overdue">
                {summary?.leadsRequiringFollowup?.overdue ?? 0}
              </span>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>overdue</span>
            </div>
            <span className="kpi-trend neutral" style={{ fontSize: '10px', color: '#64748b' }}>
              Pending scheduled: {summary?.leadsRequiringFollowup?.pending ?? 0}
            </span>
          </div>
        </div>

        {/* Top Performing Course Card (Phase 2 Addition) */}
        <div className="admin-kpi-card glass-panel" style={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
          <div className="kpi-icon" style={{ backgroundColor: '#fef9c3', color: '#ca8a04' }}>
            <span className="material-symbols-outlined">military_tech</span>
          </div>
          <div className="kpi-content">
            <h3>Top Demand Course</h3>
            <p className="kpi-value" style={{ fontSize: '15px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px', marginTop: '4px' }}>
              🏆 {topCourse?.courseName || 'N/A'}
            </p>
            <span className="kpi-trend neutral" style={{ fontSize: '11px', fontWeight: 600 }}>
              {topCourse?.leadCount || 0} Leads | {topCourse?.conversionRate || 0}% Conv.
            </span>
          </div>
        </div>

        {/* Database Assets Stats */}
        <div className="admin-kpi-card glass-panel" style={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
          <div className="kpi-icon" style={{ backgroundColor: '#fdf2f8', color: '#db2777' }}>
            <span className="material-symbols-outlined">database</span>
          </div>
          <div className="kpi-content">
            <h3>Active Content</h3>
            <div style={{ fontSize: '11px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
              <span>• Courses: <strong>{summary?.totalCourses ?? 0}</strong></span>
              <span>• Activities: <strong>{summary?.totalActivities ?? 0}</strong></span>
              <span>• Reviews: <strong>{summary?.totalReviews ?? 0}</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Charts & Analytics Panels */}
      <div className="dashboard-grid-layout">
        
        {/* Left Column: Analytics, Tables, Filters */}
        <div className="dashboard-card-column">
          
          {/* Feature 1: Lead Export & Reporting Center */}
          <div className="analytics-panel" style={{ border: '1px solid #e2e8f0', padding: '20px' }}>
            <div className="analytics-header" style={{ marginBottom: '14px' }}>
              <h3 className="analytics-title">
                <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>download_for_offline</span>
                Lead Export & Reporting Center
              </h3>
            </div>
            
            <div className="reporting-filters-container">
              <div className="filter-group">
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>REPORT TIMEFRAME</span>
                <select 
                  value={reportFilter}
                  onChange={e => setReportFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="thismonth">This Month</option>
                  <option value="prevmonth">Previous Month</option>
                  <option value="custom">Custom Date Range</option>
                </select>
              </div>

              {reportFilter === 'custom' && (
                <>
                  <div className="filter-group">
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>FROM DATE</span>
                    <input 
                      type="date"
                      value={customFrom}
                      onChange={e => setCustomFrom(e.target.value)}
                      className="filter-input"
                    />
                  </div>
                  <div className="filter-group">
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>TO DATE</span>
                    <input 
                      type="date"
                      value={customTo}
                      onChange={e => setCustomTo(e.target.value)}
                      className="filter-input"
                    />
                  </div>
                </>
              )}

              <div className="export-buttons-group">
                <button 
                  onClick={() => handleExport('csv')}
                  disabled={exporting !== null}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>csv</span>
                  {exporting === 'csv' ? 'Exporting...' : 'Export CSV'}
                </button>

                <button 
                  onClick={() => handleExport('xlsx')}
                  disabled={exporting !== null}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>table_view</span>
                  {exporting === 'xlsx' ? 'Exporting...' : 'Export Excel'}
                </button>

                <button 
                  onClick={() => handleExport('pdf')}
                  disabled={exporting !== null}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>picture_as_pdf</span>
                  {exporting === 'pdf' ? 'Exporting...' : 'Export PDF'}
                </button>
              </div>
            </div>
          </div>

          {/* Combined Trend & Funnel Row */}
          <div className="admin-analytics-grid-3" style={{ marginBottom: '20px' }}>
            
            {/* Monthly Leads Trend */}
            <div className="analytics-panel">
              <div className="analytics-header" style={{ marginBottom: '10px' }}>
                <h3 className="analytics-title">
                  <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>show_chart</span>
                  Leads Growth Trend
                </h3>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>6 Months</span>
              </div>
              <div className="chart-container" style={{ height: '150px' }}>
                <Suspense fallback={<ChartSkeleton />}>
                  <LeadsGrowthChart summary={summary} />
                </Suspense>
              </div>
            </div>

            {/* Admissions Status Breakdown (Doughnut Chart) */}
            <div className="analytics-panel">
              <div className="analytics-header" style={{ marginBottom: '12px' }}>
                <h3 className="analytics-title">
                  <span className="material-symbols-outlined" style={{ color: '#ef4444' }}>donut_large</span>
                  Lead Status Share
                </h3>
              </div>
              <div className="status-pie-container">
                <Suspense fallback={<ChartSkeleton />}>
                  <LeadStatusPieChart summary={summary} />
                </Suspense>
              </div>
            </div>

            {/* Feature 2: Lead Funnel Analytics Widget */}
            <div className="analytics-panel">
              <div className="analytics-header" style={{ marginBottom: '12px' }}>
                <h3 className="analytics-title">
                  <span className="material-symbols-outlined" style={{ color: '#8b5cf6' }}>filter_alt</span>
                  Admissions Funnel
                </h3>
              </div>
              <div className="funnel-chart-container">
                <Suspense fallback={<ChartSkeleton />}>
                  <InterestAnalyticsChart summary={summary} />
                </Suspense>
              </div>
            </div>

          </div>

          {/* Combined Course Performance & Source Row */}
          <div className="admin-analytics-grid-3" style={{ marginBottom: '20px' }}>
            
            {/* Feature 5 & 6: Course Performance Analytics */}
            <div className="analytics-panel">
              <div className="analytics-header" style={{ marginBottom: '12px' }}>
                <h3 className="analytics-title">
                  <span className="material-symbols-outlined" style={{ color: '#059669' }}>analytics</span>
                  Course Demand Leaderboard
                </h3>
              </div>
              
              <div className="leaderboard-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(!summary?.coursePerformance || summary.coursePerformance.length === 0) ? (
                  <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748b' }}>No course data recorded</div>
                ) : (
                  summary.coursePerformance.slice(0, 4).map((item, idx) => {
                    return (
                      <div key={idx} style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 0, gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                          <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.courseName}>{item.courseName}</span>
                          <span style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.leadCount} leads • {item.enrollmentCount} enrollments
                          </span>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#059669' }}>{item.conversionRate}%</span>
                          <span style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Conversion</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Feature 7: Lead Source Analytics */}
            <div className="analytics-panel">
              <div className="analytics-header" style={{ marginBottom: '12px' }}>
                <h3 className="analytics-title">
                  <span className="material-symbols-outlined" style={{ color: '#db2777' }}>ads_click</span>
                  Lead Acquisition Channel
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(!summary?.leadSources || summary.leadSources.length === 0) ? (
                  <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748b' }}>No lead sources tracked</div>
                ) : (
                  summary.leadSources.slice(0, 4).map((item, idx) => {
                    const maxCount = summary.leadSources[0]?.count || 1;
                    const pct = Math.round((item.count / maxCount) * 100);
                    return (
                      <div className="bar-chart-item" key={idx} style={{ margin: 0 }}>
                        <div className="bar-chart-info" style={{ fontSize: '12px', marginBottom: '2px' }}>
                          <span className="bar-chart-name" style={{ fontWeight: 600 }}>{item.source}</span>
                          <span className="bar-chart-count" style={{ color: '#475569' }}>{item.count}</span>
                        </div>
                        <div className="bar-chart-track" style={{ height: '6px' }}>
                          <div className="bar-chart-fill" style={{ width: `${pct}%`, backgroundColor: '#db2777' }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Lead Priority Breakdown Widget */}
            <div className="analytics-panel">
              <div className="analytics-header" style={{ marginBottom: '12px' }}>
                <h3 className="analytics-title">
                  <span className="material-symbols-outlined" style={{ color: '#ea580c' }}>priority_high</span>
                  Lead Priority Breakdown
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Hot', 'Warm', 'Cold'].map((p) => {
                  const count = summary?.priorityBreakdown?.[p] ?? 0;
                  const total = Object.values(summary?.priorityBreakdown || {}).reduce((a, b) => a + b, 0) || 1;
                  const pct = Math.round((count / total) * 100);
                  const color = p === 'Hot' ? '#ef4444' : p === 'Warm' ? '#f59e0b' : '#3b82f6';
                  const emoji = p === 'Hot' ? '🔥' : p === 'Warm' ? '🟡' : '⚪';
                  
                  return (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>{emoji}</span>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '2px' }}>
                          <span>{p} Priority</span>
                          <span>{count} <span style={{ color: '#94a3b8', fontSize: '10px' }}>({pct}%)</span></span>
                        </div>
                        <div className="bar-chart-track" style={{ height: '6px' }}>
                          <div className="bar-chart-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Latest Leads Table with communication shortcuts */}
          <div className="analytics-panel">
            <div className="analytics-header" style={{ marginBottom: '12px' }}>
              <h3 className="analytics-title">
                <span className="material-symbols-outlined" style={{ color: '#d97706' }}>group_add</span>
                Latest Leads Log
              </h3>
              <Link to="/admin/leads" style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                Manage All
              </Link>
            </div>
            
            <div className="dashboard-table-container">
              {(!summary?.recentLeads || summary.recentLeads.length === 0) ? (
                <div style={{ padding: '30px 0', textAlign: 'center', color: '#64748b' }}>No leads received yet.</div>
              ) : (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Course Inquiry</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'center' }}>Quick Connect</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.recentLeads.map((lead) => {
                      const statusClass = lead.status.toLowerCase().replace(" ", "-");
                      return (
                        <tr key={lead.id} style={{ cursor: 'pointer' }}>
                          <td style={{ fontWeight: 600, color: '#0f172a' }} onClick={() => handleOpenLead(lead)}>
                            {lead.name}
                          </td>
                          <td onClick={() => handleOpenLead(lead)}>{lead.interestedCourse || 'General Info'}</td>
                          <td onClick={() => handleOpenLead(lead)}>{lead.source || 'Website'}</td>
                          <td onClick={() => handleOpenLead(lead)}>
                            <span className={`status-pill ${statusClass}`}>{lead.status}</span>
                          </td>
                          <td style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                            {lead.phone ? (
                              <>
                                <a href={`tel:${lead.phone}`} title={`Call ${lead.name}`} style={{ color: '#2563eb', display: 'flex' }} onClick={e => e.stopPropagation()}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>phone</span>
                                </a>
                                <a 
                                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  title={`WhatsApp ${lead.name}`} 
                                  style={{ color: '#10b981', display: 'flex' }} 
                                  onClick={e => e.stopPropagation()}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
                                </a>
                              </>
                            ) : (
                              <span style={{ fontSize: '11px', color: '#94a3b8' }}>No phone</span>
                            )}
                            <a href={`mailto:${lead.email}`} title={`Email ${lead.name}`} style={{ color: '#ea580c', display: 'flex' }} onClick={e => e.stopPropagation()}>
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Actions Feed & Settings Snapshot */}
        <div className="dashboard-card-column">
          
          {/* Feature 10: Today's Follow-ups Panel */}
          <div className="analytics-panel" style={{ border: '1px solid #ea580c', background: '#fffbeb' }}>
            <div className="analytics-header" style={{ marginBottom: '12px' }}>
              <h3 className="analytics-title" style={{ color: '#d97706' }}>
                <span className="material-symbols-outlined">schedule</span>
                Today's Follow-up Calendar
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(!summary?.followups || summary.followups.length === 0) ? (
                <div style={{ padding: '15px 0', textAlign: 'center', color: '#d97706', fontSize: '12px', fontWeight: 500 }}>
                  🎉 No follow-ups scheduled for today.
                </div>
              ) : (
                summary.followups.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => {
                      const fullLead = summary.recentLeads.find(l => l.id === item.id);
                      if (fullLead) {
                        handleOpenLead(fullLead);
                      } else {
                        // Create basic lead object if not in recent list
                        handleOpenLead({
                          id: item.id,
                          name: item.name,
                          email: '',
                          phone: item.phone,
                          interestedCourse: item.course,
                          status: 'Contacted',
                          priority: item.priority
                        });
                      }
                    }}
                    style={{ background: '#ffffff', border: '1px solid #fcd34d', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 0, gap: '10px' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                        <span style={{ fontWeight: 600, color: '#78350f', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.name}>{item.name}</span>
                        <span style={{ fontSize: '10px', flexShrink: 0 }} title={`${item.priority} Priority`}>
                          {item.priority === 'Hot' ? '🔥' : item.priority === 'Warm' ? '🟡' : '⚪'}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#b45309', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={`${item.course} • ${item.phone}`}>{item.course} • {item.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 600 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>alarm</span>
                      {item.dueTime}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Feature 4: Upcoming Activities Widget */}
          <div className="analytics-panel">
            <div className="analytics-header" style={{ marginBottom: '12px' }}>
              <h3 className="analytics-title">
                <span className="material-symbols-outlined" style={{ color: '#db2777' }}>event_note</span>
                Upcoming Corporate Activities
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(!summary?.upcomingActivities || summary.upcomingActivities.length === 0) ? (
                <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748b' }}>No upcoming activities.</div>
              ) : (
                summary.upcomingActivities.map((act) => (
                  <div key={act.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '75%' }}>
                      <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {act.title}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {formatDate(act.date)} • {act.seats}
                      </span>
                    </div>
                    <span style={{ background: '#ecfdf5', color: '#065f46', fontSize: '10px', padding: '3px 8px', borderRadius: '20px', fontWeight: 600 }}>
                      {act.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Feature 8: Recent Enrollments Widget */}
          <div className="analytics-panel">
            <div className="analytics-header" style={{ marginBottom: '12px' }}>
              <h3 className="analytics-title">
                <span className="material-symbols-outlined" style={{ color: '#10b981' }}>assignment_turned_in</span>
                Recently Enrolled Students
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(!summary?.recentEnrollments || summary.recentEnrollments.length === 0) ? (
                <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748b' }}>No recent enrollments.</div>
              ) : (
                summary.recentEnrollments.map((enr) => (
                  <div key={enr.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 0, gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={enr.name}>{enr.name}</span>
                      <span style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={enr.course}>{enr.course}</span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0 }}>
                      {formatDate(enr.enrollmentDate)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="analytics-panel">
            <div className="analytics-header" style={{ marginBottom: '12px' }}>
              <h3 className="analytics-title">
                <span className="material-symbols-outlined" style={{ color: '#ef4444' }}>bolt</span>
                Quick Actions
              </h3>
            </div>
            <div className="quick-actions-panel">
              <Link to="/admin/courses/add" className="quick-action-btn">
                <span className="material-symbols-outlined">add_circle</span>
                Add New Course
              </Link>
              <Link to="/admin/activities/add" className="quick-action-btn">
                <span className="material-symbols-outlined">event_available</span>
                Add New Activity
              </Link>
              <Link to="/admin/reviews/add" className="quick-action-btn">
                <span className="material-symbols-outlined">rate_review</span>
                Add New Review
              </Link>
              <Link to="/admin/leads" className="quick-action-btn">
                <span className="material-symbols-outlined">format_list_bulleted</span>
                View & Manage Leads
              </Link>
              <Link to="/admin/settings" className="quick-action-btn">
                <span className="material-symbols-outlined">settings_suggest</span>
                Update Settings
              </Link>
            </div>
          </div>

          {/* Company Snapshot Info */}
          <div className="analytics-panel">
            <div className="analytics-header" style={{ marginBottom: '12px' }}>
              <h3 className="analytics-title">
                <span className="material-symbols-outlined" style={{ color: '#3b82f6' }}>domain</span>
                Company Snapshot
              </h3>
            </div>
            
            <div className="snapshot-list" style={{ gap: '10px' }}>
              <div className="snapshot-item" style={{ fontSize: '12px' }}>
                <span className="material-symbols-outlined icon">corporate_fare</span>
                <span>Name</span>
                <span className="val">{settings?.companyName || 'AgenticX'}</span>
              </div>
              <div className="snapshot-item" style={{ fontSize: '12px' }}>
                <span className="material-symbols-outlined icon">phone</span>
                <span>Phone</span>
                <span className="val">{settings?.primaryPhone || '+91 9496552094'}</span>
              </div>
              <div className="snapshot-item" style={{ fontSize: '12px' }}>
                <span className="material-symbols-outlined icon">group</span>
                <span>Trained</span>
                <span className="val">{settings?.studentsTrainedCount || '100'}+</span>
              </div>
              <div className="snapshot-item" style={{ fontSize: '12px' }}>
                <span className="material-symbols-outlined icon">handshake</span>
                <span>Colleges</span>
                <span className="val">{settings?.collegePartnersCount || '20'}+</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* CRM Lead Follow-up details modal */}
      {selectedLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 25, 67, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
          <div className="admin-kpi-card glass-panel" style={{ width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', animation: 'modal-zoom 0.25s cubic-bezier(0.16, 1, 0.3, 1)', display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#001943' }}>Lead Follow-up Scheduler</h3>
              <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px 16px', fontSize: '13px', marginBottom: '16px' }}>
              <span style={{ fontWeight: 600, color: '#64748b' }}>Student Name:</span>
              <span style={{ color: '#001943', fontWeight: 600 }}>{selectedLead.name}</span>
              <span style={{ fontWeight: 600, color: '#64748b' }}>Course Interest:</span>
              <span style={{ color: '#001943', fontWeight: 600 }}>{selectedLead.interestedCourse || 'General Inquiry'}</span>
              <span style={{ fontWeight: 600, color: '#64748b' }}>Email:</span>
              <a href={`mailto:${selectedLead.email}`} style={{ color: '#2563eb', textDecoration: 'underline' }}>{selectedLead.email}</a>
              <span style={{ fontWeight: 600, color: '#64748b' }}>Phone Number:</span>
              <span>{selectedLead.phone || 'N/A'}</span>
              <span style={{ fontWeight: 600, color: '#64748b' }}>Last Contacted:</span>
              <span>{selectedLead.lastContactedAt ? new Date(selectedLead.lastContactedAt).toLocaleString() : 'Never'}</span>
            </div>

            <form onSubmit={handleSaveLeadChanges} className="admin-login-form" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="admin-form-group">
                  <label>Followup Action Status</label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value)}
                    style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '38px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Demo Booked">Demo Booked</option>
                    <option value="Enrolled">Enrolled</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Lead Origin Source</label>
                  <select 
                    value={leadSource} 
                    onChange={e => setLeadSource(e.target.value)}
                    style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '38px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                  >
                    <option value="Website">Website</option>
                    <option value="Contact Form">Contact Form</option>
                    <option value="Course Page">Course Page</option>
                    <option value="Free Demo">Free Demo</option>
                    <option value="Consultation">Consultation</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="AI Assistant">AI Assistant</option>
                    <option value="Manual Entry">Manual Entry</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                <div className="admin-form-group">
                  <label>Lead Priority</label>
                  <select 
                    value={priority} 
                    onChange={e => setPriority(e.target.value)}
                    style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '38px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                  >
                    <option value="Cold">⚪ Cold</option>
                    <option value="Warm">🟡 Warm</option>
                    <option value="Hot">🔥 Hot</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Assigned Staff Owner</label>
                  <select 
                    value={assignedTo} 
                    onChange={e => setAssignedTo(e.target.value)}
                    style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '38px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                  >
                    <option value="">Unassigned</option>
                    <option value="Admin">Admin</option>
                    <option value="Counselor">Counselor</option>
                    <option value="Trainer">Trainer</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                <div className="admin-form-group">
                  <label>Next Follow-up Date</label>
                  <input
                    type="datetime-local"
                    value={nextFollowupDate}
                    onChange={e => setNextFollowupDate(e.target.value)}
                    style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '38px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Last Contacted Date</label>
                  <input
                    type="datetime-local"
                    value={lastContactedAt}
                    onChange={e => setLastContactedAt(e.target.value)}
                    style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '38px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginTop: '12px' }}>
                <label>Admin Profile Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Record permanent profile background details..."
                  style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', minHeight: '50px', borderRadius: '8px', padding: '8px', outline: 'none' }}
                />
              </div>

              <div className="admin-form-group" style={{ marginTop: '12px' }}>
                <label>Specific Follow-up Log/Notes</label>
                <textarea
                  value={followupNotes}
                  onChange={e => setFollowupNotes(e.target.value)}
                  placeholder="Record call responses, specific action plans..."
                  style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', minHeight: '50px', borderRadius: '8px', padding: '8px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setSelectedLead(null)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" disabled={savingLead} className="activity-book-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, opacity: savingLead ? 0.7 : 1 }}>
                  {savingLead && <div className="admin-loading-spinner" style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modal-zoom {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

    </div>
  );
}
