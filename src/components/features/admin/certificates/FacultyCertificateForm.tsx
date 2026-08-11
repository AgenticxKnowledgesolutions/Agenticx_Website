import React, { useState, useEffect } from "react";
import type { FacultyCertificateInput, FacultyCertificate } from "../../../../services/facultyCertificateService";

interface FacultyCertificateFormProps {
  initialData?: FacultyCertificate | null;
  onSubmit: (data: FacultyCertificateInput) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export default function FacultyCertificateForm({
  initialData,
  onSubmit,
  onCancel,
  isSaving,
}: FacultyCertificateFormProps) {
  const [formData, setFormData] = useState<FacultyCertificateInput>({
    faculty_name: "",
    faculty_email: "",
    designation: "",
    organization: "",
    programme_title: "Faculty Development Programme",
    topic: "Artificial Intelligence & Machine Learning",
    start_date: "",
    end_date: "",
    duration: "5 Days",
    mode: "Online",
    description: "",
    organization_name: "AgenticX Knowledge Solutions LLP",
    signatory_name: "",
    signatory_designation: "",
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        faculty_name: initialData.faculty_name,
        faculty_email: initialData.faculty_email || "",
        designation: initialData.designation || "",
        organization: initialData.organization || "",
        programme_title: initialData.programme_title,
        topic: initialData.topic,
        start_date: initialData.start_date ? initialData.start_date.substring(0, 10) : "",
        end_date: initialData.end_date ? initialData.end_date.substring(0, 10) : "",
        duration: initialData.duration,
        mode: initialData.mode || "Online",
        description: initialData.description || "",
        organization_name: initialData.organization_name || "AgenticX Knowledge Solutions LLP",
        signatory_name: initialData.signatory_name || "",
        signatory_designation: initialData.signatory_designation || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Simple date range sequence validation
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end < start) {
        setValidationError("End date cannot be before the start date.");
        return;
      }
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setValidationError(err.response?.data?.detail || "An error occurred while saving the certificate.");
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          {initialData ? `Edit Certificate: ${initialData.certificate_number}` : "Create FDP Certificate"}
        </h3>
        <p style={styles.subtitle}>Enter the details below to configure the faculty appreciation certificate.</p>
      </div>

      <form onSubmit={handleFormSubmit} style={styles.form}>
        {validationError && <div style={styles.errorBox}>{validationError}</div>}

        {/* Section: Faculty Details */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>1. Faculty / Instructor Details</h4>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Faculty Name *</label>
              <input
                type="text"
                name="faculty_name"
                required
                value={formData.faculty_name}
                onChange={handleChange}
                placeholder="e.g. Dr. Sarah Connor"
                style={styles.input}
              />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="faculty_email"
                value={formData.faculty_email || ""}
                onChange={handleChange}
                placeholder="e.g. sarah.connor@university.edu"
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation || ""}
                onChange={handleChange}
                placeholder="e.g. Associate Professor"
                style={styles.input}
              />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Organization / Institution</label>
              <input
                type="text"
                name="organization"
                value={formData.organization || ""}
                onChange={handleChange}
                placeholder="e.g. IIT Bombay"
                style={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Section: FDP Details */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>2. FDP Programme Details</h4>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Programme Title *</label>
              <input
                type="text"
                name="programme_title"
                required
                value={formData.programme_title}
                onChange={handleChange}
                placeholder="e.g. Faculty Development Programme"
                style={styles.input}
              />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Topic Focus Area *</label>
              <input
                type="text"
                name="topic"
                required
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g. Artificial Intelligence & Machine Learning"
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Start Date *</label>
              <input
                type="date"
                name="start_date"
                required
                value={formData.start_date}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>End Date *</label>
              <input
                type="date"
                name="end_date"
                required
                value={formData.end_date}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Duration *</label>
              <input
                type="text"
                name="duration"
                required
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 5 Days"
                style={styles.input}
              />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Training Mode</label>
              <select name="mode" value={formData.mode || "Online"} onChange={handleChange} style={styles.select}>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
          <div style={styles.col}>
            <label style={styles.label}>Description / Syllabus details</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Enter optional description or details about FDP topics covered..."
              style={styles.textarea}
            />
          </div>
        </div>

        {/* Section: Organization & Signatory */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>3. Signature & Branding Details</h4>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Awarding Organization *</label>
              <input
                type="text"
                name="organization_name"
                required
                value={formData.organization_name}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Signatory Name</label>
              <input
                type="text"
                name="signatory_name"
                value={formData.signatory_name || ""}
                onChange={handleChange}
                placeholder="e.g. Anju Muraleedharan"
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.col}>
            <label style={styles.label}>Signatory Designation</label>
            <input
              type="text"
              name="signatory_designation"
              value={formData.signatory_designation || ""}
              onChange={handleChange}
              placeholder="e.g. Managing Partner"
              style={styles.input}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actions}>
          <button type="button" onClick={onCancel} style={styles.cancelBtn} disabled={isSaving}>
            Cancel
          </button>
          <button type="submit" style={styles.submitBtn} disabled={isSaving}>
            {isSaving ? "Saving..." : initialData ? "Update Certificate" : "Create Certificate"}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#1e293b",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "14px",
    padding: "24px",
    width: "100%",
    boxSizing: "border-box",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: "0 0 4px 0",
  },
  subtitle: {
    fontSize: "13px",
    color: "#94a3b8",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  errorBox: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fca5a5",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#3b82f6",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 6px 0",
  },
  row: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  col: {
    flex: 1,
    minWidth: "200px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#94a3b8",
  },
  input: {
    background: "#0f172a",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "#f8fafc",
    fontSize: "13px",
    outline: "none",
  },
  select: {
    background: "#0f172a",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "#f8fafc",
    fontSize: "13px",
    outline: "none",
  },
  textarea: {
    background: "#0f172a",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "#f8fafc",
    fontSize: "13px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "8px",
  },
  cancelBtn: {
    background: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "#94a3b8",
    padding: "10px 18px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    border: "none",
    color: "#ffffff",
    padding: "10px 22px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
  },
};
