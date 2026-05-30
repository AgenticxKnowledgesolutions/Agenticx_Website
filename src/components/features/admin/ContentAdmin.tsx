import './Admin.css';

export default function ContentAdmin() {
  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Website Content Manager</h1>
        <p className="admin-page-subtitle">Configure global hero titles, banners, phone numbers, and contact addresses.</p>
      </div>

      <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#001943' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#8b5cf6' }}>display_settings</span>
          <h3 style={{ margin: 0 }}>System Note: Dynamic Copy Settings</h3>
        </div>
        <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
          This interface is designed to let marketing editors modify copy without code deployments. Changes made here will write directly to the database layer and propagate immediately to the frontend.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
        {/* HOMEPAGE BANNER SETTINGS */}
        <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', color: '#001943' }}>Homepage Hero Copy</h3>
          
          <form className="admin-login-form" onSubmit={e => e.preventDefault()}>
            <div className="admin-form-group">
              <label>Hero Title Tagline</label>
              <input type="text" defaultValue="Empowering Tomorrow’s Workforce" style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} disabled />
            </div>

            <div className="admin-form-group">
              <label>Hero Subtitle</label>
              <textarea defaultValue="Bridging the gap between education and industry by equipping talent with real-world skills..." style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', minHeight: '80px', borderRadius: '8px', padding: '10px', outline: 'none' }} disabled></textarea>
            </div>

            <button type="button" className="activity-book-btn" style={{ background: '#94a3b8', cursor: 'not-allowed', border: 'none', borderRadius: '8px' }}>Save Hero Copy (Draft)</button>
          </form>
        </div>

        {/* OFFICE & CONTACT SETTINGS */}
        <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', color: '#001943' }}>Corporate Contact Details</h3>
          
          <form className="admin-login-form" onSubmit={e => e.preventDefault()}>
            <div className="admin-form-group">
              <label>Support Email</label>
              <input type="email" defaultValue="support@agenticx.com" style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} disabled />
            </div>

            <div className="admin-form-group">
              <label>Support Phone</label>
              <input type="text" defaultValue="+91 98765 43210" style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }} disabled />
            </div>

            <button type="button" className="activity-book-btn" style={{ background: '#94a3b8', cursor: 'not-allowed', border: 'none', borderRadius: '8px' }}>Save Contact Details (Draft)</button>
          </form>
        </div>
      </div>
    </div>
  );
}
