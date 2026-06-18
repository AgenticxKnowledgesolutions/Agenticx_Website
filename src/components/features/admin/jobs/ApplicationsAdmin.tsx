import { useEffect, useState } from "react";
import { getAdminApplications, updateApplicationStatus, softDeleteApplication, type JobApplicationAdmin } from "@/services/jobService";
import { useToast } from "@/components/ui/Toast";
import "../Admin.css";

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dateString;
  }
};


export default function ApplicationsAdmin() {
  const [applications, setApplications] = useState<JobApplicationAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await getAdminApplications();
      // Only keep non-deleted entries
      setApplications(data.filter((app) => !app.is_deleted));
    } catch (err) {
      console.error(err);
      toast("Failed to load applications.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleMarkReviewed = async (id: string, name: string) => {
    try {
      const updated = await updateApplicationStatus(id, "reviewed");
      toast(`Application from ${name} marked as Reviewed.`, "success");
      setApplications(applications.map((app) => (app.id === id ? updated : app)));
    } catch (err) {
      console.error(err);
      toast("Failed to update status.", "error");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the application from "${name}"?`)) {
      const success = await softDeleteApplication(id);
      if (success) {
        toast("Application deleted successfully", "success");
        setApplications(applications.filter((app) => app.id !== id));
      } else {
        toast("Failed to delete application", "error");
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Job Applications</h1>
        <p className="admin-page-subtitle">Review resume submissions, contact information, and job matching details.</p>
      </div>

      <div className="admin-kpi-card glass-panel" style={{ display: "block", padding: "24px", marginTop: "20px" }}>
        <h3 style={{ marginBottom: "20px", color: "#001943" }}>Submissions</h3>

        <div className="dashboard-table-container">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left", color: "#64748b" }}>
                <th style={{ padding: "12px 8px" }}>Name</th>
                <th style={{ padding: "12px 8px" }}>Email</th>
                <th style={{ padding: "12px 8px" }}>Phone</th>
                <th style={{ padding: "12px 8px" }}>Job Title</th>
                <th style={{ padding: "12px 8px" }}>Resume</th>
                <th style={{ padding: "12px 8px" }}>Status</th>
                <th style={{ padding: "12px 8px" }}>Created</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map((item) => (
                  <tr key={item} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "16px 8px" }}><div className="skeleton-line" style={{ width: "60%" }} /></td>
                    <td style={{ padding: "16px 8px" }}><div className="skeleton-line" style={{ width: "50%" }} /></td>
                    <td style={{ padding: "16px 8px" }}><div className="skeleton-line" style={{ width: "40%" }} /></td>
                    <td style={{ padding: "16px 8px" }}><div className="skeleton-line" style={{ width: "60%" }} /></td>
                    <td style={{ padding: "16px 8px" }}><div className="skeleton-line" style={{ width: "30%" }} /></td>
                    <td style={{ padding: "16px 8px" }}><div className="skeleton-line" style={{ width: "20%" }} /></td>
                    <td style={{ padding: "16px 8px" }}><div className="skeleton-line" style={{ width: "30%" }} /></td>
                    <td style={{ padding: "16px 8px", textAlign: "right" }}><div className="skeleton-line" style={{ width: "40%", float: "right" }} /></td>
                  </tr>
                ))
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>No job applications found in database.</td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "16px 8px", fontWeight: 500, color: "#001943" }}>{app.name}</td>
                    <td style={{ padding: "16px 8px", color: "#475569" }}>
                      <a href={`mailto:${app.email}`} style={{ color: "inherit", textDecoration: "none" }}>{app.email}</a>
                    </td>
                    <td style={{ padding: "16px 8px", color: "#475569" }}>
                      <a href={`tel:${app.phone}`} style={{ color: "inherit", textDecoration: "none" }}>{app.phone}</a>
                    </td>
                    <td style={{ padding: "16px 8px", color: "#001943", fontWeight: 500 }}>{app.job_title}</td>
                    <td style={{ padding: "16px 8px" }}>
                      <a
                        href={app.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          color: "#0052fe",
                          fontWeight: 600,
                          textDecoration: "none"
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>description</span>
                        CV / Resume
                      </a>
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <span
                        className={`admin-status-badge ${app.status === "reviewed" ? "status-qualified" : "status-unqualified"}`}
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 600
                        }}
                      >
                        {app.status === "reviewed" ? "Reviewed" : "New"}
                      </span>
                    </td>
                    <td style={{ padding: "16px 8px", color: "#64748b", fontSize: "13px" }}>
                      {formatDate(app.created_at)}
                    </td>
                    <td style={{ padding: "16px 8px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        {app.status === "new" && (
                          <button
                            onClick={() => handleMarkReviewed(app.id, app.name)}
                            style={{ background: "#dcfce7", color: "#15803d", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}
                          >
                            Mark Reviewed
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(app.id, app.name)}
                          style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
