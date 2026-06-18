import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { getJobs, submitJobApplication, type Job } from "@/services/jobService";
import "../styles/careers.css";

export default function Careers() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyMode, setIsApplyMode] = useState(false);
  const { toast } = useToast();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Scroll to top when page opens
    window.scrollTo(0, 0);
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(data.filter((j) => j.is_active));
    } catch (err) {
      console.error("Failed to load jobs:", err);
      toast("Could not load job postings. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetailModal = (job: Job) => {
    setSelectedJob(job);
    setIsApplyMode(false);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
    setIsApplyMode(false);
    resetForm();
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setResumeFile(null);
    setFileError("");
  };

  const handleOpenApplyForm = () => {
    setIsApplyMode(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const files = e.target.files;
    if (!files || files.length === 0) {
      setResumeFile(null);
      return;
    }

    const file = files[0];
    // Validate PDF
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (fileExt !== "pdf" && file.type !== "application/pdf") {
      setFileError("Only PDF files are allowed.");
      setResumeFile(null);
      return;
    }

    // Validate size (5MB = 5 * 1024 * 1024 bytes)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setFileError("File size must be under 5MB.");
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      toast("Please fill in all required fields.", "error");
      return;
    }

    if (!resumeFile) {
      toast("Please upload a valid PDF resume.", "error");
      return;
    }

    setSubmitting(true);
    try {
      await submitJobApplication({
        job_id: selectedJob.id,
        name: fullName,
        email,
        phone,
        resume: resumeFile,
      });

      toast("Application submitted successfully!", "success");
      handleCloseModal();
    } catch (err: any) {
      console.error("Job application error:", err);
      const detail = err.response?.data?.detail || "Failed to submit application. Please try again.";
      toast(detail, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="careers-container">
      {/* Hero Header */}
      <div className="careers-hero">
        <h1 className="careers-title">Careers at AgenticX</h1>
        <p className="careers-subtitle">
          Help us build the next generation of AI-native platforms, autonomous workflows, and intelligent interfaces.
        </p>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <div className="loading-spinner" style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(0,0,0,0.1)",
            borderTop: "3px solid #000000",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : jobs.length === 0 ? (
        /* Empty State: NO jobs. Do NOT show any form */
        <div className="careers-empty-state">
          <span className="careers-empty-icon">💼</span>
          <h2 className="careers-empty-title">No Open Positions Currently</h2>
          <p className="careers-empty-text">
            We currently don’t have any active openings. Please check back later.
          </p>
        </div>
      ) : (
        /* Jobs List */
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div>
                <h3 className="job-card-title">{job.title}</h3>
                <p className="job-card-description">{job.description}</p>
              </div>
              <button
                type="button"
                className="job-apply-btn"
                onClick={() => handleOpenDetailModal(job)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stage 1: Job Detail Modal */}
      {selectedJob && !isApplyMode && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={handleCloseModal}
              aria-label="Close details"
            >
              &times;
            </button>
            <h2 className="modal-title">{selectedJob.title}</h2>
            <p className="modal-subtitle">Open Position Details</p>

            <div className="job-detail-body">
              {selectedJob.description}
            </div>

            <div className="job-detail-footer">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                type="button"
                className="job-apply-btn"
                onClick={handleOpenApplyForm}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage 2: Apply Form Modal */}
      {selectedJob && isApplyMode && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={handleCloseModal}
              aria-label="Close application form"
            >
              &times;
            </button>
            <h2 className="modal-title">Apply for Position</h2>
            <p className="modal-subtitle">Submit details for <strong>{selectedJob.title}</strong></p>

            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label" htmlFor="full-name">Full Name *</label>
                <input
                  type="text"
                  id="full-name"
                  className="form-input"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="resume">Resume (PDF only, max 5MB) *</label>
                <input
                  type="file"
                  id="resume"
                  className="form-input"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  required
                />
                {fileError ? (
                  <span className="form-file-helper error">{fileError}</span>
                ) : (
                  <span className="form-file-helper">Please upload your CV or resume in PDF format.</span>
                )}
              </div>

              <button
                type="submit"
                className="form-submit-btn"
                disabled={submitting}
              >
                {submitting ? "Submitting Application..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
