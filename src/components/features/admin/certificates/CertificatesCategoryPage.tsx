import { useNavigate } from "react-router-dom";

export default function CertificatesCategoryPage() {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Faculty Development Programme (FDP)",
      code: "FDP",
      description: "Manage appreciation certificates for resource persons, trainers, and mentors contributing to FDP programs.",
      icon: "school",
      active: true,
      path: "/admin/certificates/fdp",
    },
    {
      title: "Workshop Training",
      code: "Workshop",
      description: "Appreciation and participation certificates for technical workshops and lab courses.",
      icon: "handyman",
      active: false,
    },
    {
      title: "Seminars & Webinars",
      code: "Seminar",
      description: "Appreciation certs for tech webinars and speaker sessions.",
      icon: "present_to_all",
      active: false,
    },
    {
      title: "Mentorship & Guest Lectures",
      code: "Mentorship",
      description: "Certificates acknowledging external speakers, advisors, and mentors.",
      icon: "diversity_3",
      active: false,
    },
  ];

  return (
    <div className="admin-page-container" style={{ padding: "24px" }}>
      <div className="admin-page-header" style={{ marginBottom: "28px" }}>
        <div>
          <h1 className="admin-page-title" style={{ color: "#001943" }}>Faculty & Trainer Certificates</h1>
          <p className="admin-page-subtitle" style={{ color: "#64748b", margin: 0 }}>
            Create and manage appreciation certificates for faculty members, trainers, and external contributors.
          </p>
        </div>
      </div>

      <div style={styles.grid}>
        {categories.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => cat.active && cat.path && navigate(cat.path)}
            className="admin-kpi-card glass-panel"
            style={{
              ...styles.card,
              ...(cat.active ? styles.cardActive : styles.cardInactive),
            }}
          >
            <div style={styles.cardHeader}>
              <span className="material-symbols-outlined" style={{
                fontSize: "36px",
                color: cat.active ? "#2563eb" : "#94a3b8",
              }}>
                {cat.icon}
              </span>
              {!cat.active && <span style={styles.badge}>Coming Soon</span>}
            </div>

            <h3 style={{ ...styles.cardTitle, color: "#001943" }}>{cat.title}</h3>
            <p style={{ ...styles.cardDesc, color: "#475569" }}>{cat.description}</p>

            {cat.active && (
              <span style={styles.actionLink}>
                Manage Certificates →
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    transition: "all 0.2s ease-in-out",
    padding: "24px",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
  },
  cardActive: {
    cursor: "pointer",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  cardInactive: {
    cursor: "not-allowed",
    opacity: 0.6,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    fontSize: "11px",
    fontWeight: "600",
    background: "#f1f5f9",
    color: "#64748b",
    padding: "4px 10px",
    borderRadius: "20px",
    textTransform: "uppercase",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
  },
  cardDesc: {
    fontSize: "13px",
    lineHeight: "1.5",
    margin: 0,
    flexGrow: 1,
  },
  actionLink: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#2563eb",
    marginTop: "8px",
  },
};
