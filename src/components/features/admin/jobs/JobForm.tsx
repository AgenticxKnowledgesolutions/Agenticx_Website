import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getJobById, createJob, updateJob } from "@/services/jobService";
import { useToast } from "@/components/ui/Toast";
import "../Admin.css";

interface JobFormProps {
  mode: "create" | "edit";
  jobId?: string;
}

export default function JobForm({ mode, jobId }: JobFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(mode === "edit");
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Load Job data in Edit mode
  useEffect(() => {
    if (mode === "edit" && jobId) {
      const loadJob = async () => {
        try {
          const j = await getJobById(jobId);
          if (j) {
            setTitle(j.title);
            setDescription(j.description);
            setIsActive(j.is_active);
          } else {
            toast("Job position not found", "error");
            navigate("/admin/jobs");
          }
        } catch (err) {
          console.error(err);
          toast("Failed to load job details", "error");
          navigate("/admin/jobs");
        } finally {
          setFetching(false);
        }
      };
      loadJob();
    }
  }, [mode, jobId, navigate, toast]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast("Please fill in all required fields.", "error");
      return;
    }

    setLoading(true);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      is_active: isActive,
    };

    try {
      if (mode === "create") {
        await createJob(payload);
        toast("Job posting published successfully!", "success");
        setIsDirty(false);
        navigate("/admin/jobs");
      } else if (mode === "edit" && jobId) {
        await updateJob(jobId, payload);
        toast("Job posting updated successfully!", "success");
        setIsDirty(false);
        navigate("/admin/jobs");
      }
    } catch (err: any) {
      console.error(err);
      const detail = err.response?.data?.detail || "Operation failed. Please try again.";
      toast(detail, "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="admin-page" style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
        <div className="admin-loading-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-kpi-card glass-panel" style={{ maxWidth: "800px", margin: "0 auto", display: "block", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h3 style={{ margin: 0, color: "#001943" }}>
          {mode === "create" ? "Create New Job Opening" : "Edit Job Posting Details"}
        </h3>
        <button
          onClick={() => {
            if (!isDirty || window.confirm("Discard unsaved changes?")) {
              setIsDirty(false);
              navigate("/admin/jobs");
            }
          }}
          className="admin-back-btn"
          style={{ background: "#f1f5f9", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: 600, color: "#64748b" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_back</span> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-login-form">
        <div className="admin-form-group">
          <label>Job Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setIsDirty(true);
            }}
            required
            placeholder="e.g. AI Integration Specialist"
            style={{ background: "#f8fafc", color: "#001943", border: "1px solid #cbd5e1" }}
          />
        </div>

        <div className="admin-form-group" style={{ marginTop: "16px" }}>
          <label>Job Description & Requirements *</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setIsDirty(true);
            }}
            required
            placeholder="Describe the job role, tasks, responsibilities, and qualifications..."
            style={{
              background: "#f8fafc",
              color: "#001943",
              border: "1px solid #cbd5e1",
              width: "100%",
              minHeight: "240px",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "14px",
              lineHeight: "1.6",
              outline: "none",
              fontFamily: "inherit",
              resize: "vertical"
            }}
          ></textarea>
        </div>

        <div className="admin-form-group" style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "24px" }}>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => {
              setIsActive(e.target.checked);
              setIsDirty(true);
            }}
            style={{ width: "auto", cursor: "pointer" }}
            id="jobActiveToggle"
          />
          <label htmlFor="jobActiveToggle" style={{ margin: 0, color: "#001943", cursor: "pointer", userSelect: "none" }}>
            Make this job posting active and visible to candidates?
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="activity-book-btn"
          style={{ marginTop: "32px", borderRadius: "8px", width: "100%", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        >
          {loading && <div className="admin-loading-spinner" style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff" }} />}
          {mode === "create" ? "Create & Publish Job" : "Save Job Posting Changes"}
        </button>
      </form>
    </div>
  );
}
