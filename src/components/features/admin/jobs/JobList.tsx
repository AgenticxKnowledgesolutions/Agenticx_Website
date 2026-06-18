import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminJobs, updateJob, deleteJob, type Job } from "@/services/jobService";
import { useToast } from "@/components/ui/Toast";
import "../Admin.css";

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await getAdminJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
      toast("Failed to load jobs.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleToggleActive = async (job: Job) => {
    try {
      const updated = await updateJob(job.id, {
        title: job.title,
        description: job.description,
        is_active: !job.is_active,
      });
      toast(`Job "${job.title}" is now ${updated.is_active ? "Active" : "Inactive"}.`, "success");
      // Update local state
      setJobs(jobs.map((j) => (j.id === job.id ? updated : j)));
    } catch (err) {
      console.error(err);
      toast("Failed to update job status.", "error");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the job posting "${title}" permanently?`)) {
      const success = await deleteJob(id);
      if (success) {
        toast("Job deleted successfully", "success");
        setJobs(jobs.filter((j) => j.id !== id));
      } else {
        toast("Failed to delete job", "error");
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Job Postings</h1>
        <p className="admin-page-subtitle">Manage open career opportunities, view status, and update active postings.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => navigate("/admin/jobs/add")}
            className="activity-book-btn"
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", borderRadius: "8px", fontWeight: 600 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span> Add New Job
          </button>
        </div>

        <div className="admin-kpi-card glass-panel" style={{ display: "block", padding: "24px" }}>
          <h3 style={{ marginBottom: "20px", color: "#001943" }}>All Positions</h3>

          <div className="dashboard-table-container">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left", color: "#64748b" }}>
                  <th style={{ padding: "12px 8px" }}>Title</th>
                  <th style={{ padding: "12px 8px" }}>Status</th>
                  <th style={{ padding: "12px 8px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3].map((item) => (
                    <tr key={item} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "16px 8px" }}><div className="skeleton-line" style={{ width: "60%" }} /></td>
                      <td style={{ padding: "16px 8px" }}><div className="skeleton-line" style={{ width: "20%" }} /></td>
                      <td style={{ padding: "16px 8px", textAlign: "right" }}><div className="skeleton-line" style={{ width: "40%", float: "right" }} /></td>
                    </tr>
                  ))
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>No jobs found in database.</td>
                  </tr>
                ) : (
                  jobs.map((j) => (
                    <tr key={j.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "16px 8px", fontWeight: 500, color: "#001943" }}>{j.title}</td>
                      <td style={{ padding: "16px 8px" }}>
                        <span
                          className={`admin-status-badge ${j.is_active ? "status-qualified" : "status-unqualified"}`}
                          style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            userSelect: "none"
                          }}
                          onClick={() => handleToggleActive(j)}
                          title="Click to toggle status"
                        >
                          {j.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ padding: "16px 8px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                          <button
                            onClick={() => handleToggleActive(j)}
                            style={{ background: "#e0f2fe", color: "#0369a1", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}
                          >
                            Toggle Status
                          </button>
                          <button
                            onClick={() => navigate(`/admin/jobs/edit/${j.id}`)}
                            style={{ background: "#f1f5f9", color: "#475569", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(j.id, j.title)}
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
    </div>
  );
}
