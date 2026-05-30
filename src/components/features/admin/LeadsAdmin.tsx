import './Admin.css';

export default function LeadsAdmin() {
  const mockLeads = [
    { id: '1', name: 'John Doe', email: 'john@example.com', course: 'Advanced AI Development', date: '2026-05-30', status: 'Pending' },
    { id: '2', name: 'Alice Smith', email: 'alice@example.com', course: 'Full Stack Next.js & React', date: '2026-05-29', status: 'Contacted' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', course: 'Data Engineering Fundamentals', date: '2026-05-28', status: 'Enrolled' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Student Leads Manager</h1>
        <p className="admin-page-subtitle">Track and follow up on contact forms, callback requests, and course inquiries.</p>
      </div>

      <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#001943' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#3b82f6' }}>info</span>
          <h3 style={{ margin: 0 }}>System Note: Client Form Integration</h3>
        </div>
        <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
          This page acts as a staging queue. Student inquiries submitted through public forms (like the Course Enquiry sidebar or the Contact Us form) are automatically captured. In the future, this queue will connect directly to your CRM platform or email notification service.
        </p>
      </div>

      <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
        <h3 style={{ marginBottom: '20px', color: '#001943' }}>Inbound Enquiries</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
              <th style={{ padding: '12px 8px' }}>Student Name</th>
              <th style={{ padding: '12px 8px' }}>Email</th>
              <th style={{ padding: '12px 8px' }}>Course Interest</th>
              <th style={{ padding: '12px 8px' }}>Date</th>
              <th style={{ padding: '12px 8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockLeads.map(lead => (
              <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 8px', fontWeight: 500, color: '#001943' }}>{lead.name}</td>
                <td style={{ padding: '16px 8px', color: '#475569' }}>{lead.email}</td>
                <td style={{ padding: '16px 8px', color: '#001943', fontWeight: 500 }}>{lead.course}</td>
                <td style={{ padding: '16px 8px', color: '#64748b' }}>{lead.date}</td>
                <td style={{ padding: '16px 8px' }}>
                  <span style={{ 
                    background: lead.status === 'Pending' ? '#fef3c7' : lead.status === 'Contacted' ? '#dbeafe' : '#dcfce7', 
                    color: lead.status === 'Pending' ? '#92400e' : lead.status === 'Contacted' ? '#1e40af' : '#166534', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    fontWeight: 'bold' 
                  }}>
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
