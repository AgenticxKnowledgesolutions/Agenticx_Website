interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="admin-topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: '#fff', borderBottom: '1px solid #e2e8f0', zIndex: 90 }}>
      <button className="admin-menu-btn" onClick={onMenuClick} style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#1e293b' }}>menu</span>
      </button>
      
      <div className="admin-topbar-title" style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>
        Workspace Portal
      </div>

      <div className="admin-topbar-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#64748b' }}>account_circle</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Admin</span>
      </div>
    </header>
  );
}
