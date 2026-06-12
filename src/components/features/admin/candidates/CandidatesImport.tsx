import React, { useState } from "react";
import { previewImportHeaders, processImport } from "../../../../services/candidateService";

interface CandidatesImportProps {
  onImportComplete: () => void;
}

export default function CandidatesImport({ onImportComplete }: CandidatesImportProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Headers and preview data
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  
  // Column Mappings
  const [mappings, setMappings] = useState<Record<string, string>>({
    full_name: "",
    email: "",
    phone: "",
    whatsapp_number: "",
    address: "",
    emergency_contact: "",
    qualification: "",
    blood_group: "",
    course_applied: "",
    mode_of_learning: "",
    college_name: "",
    date_of_birth: "",
    gender: "",
    reference_details: "",
    languages_known: "",
    parent_guardian_name: "",
    parent_guardian_occupation: "",
    aadhaar_number: "",
    remarks: "",
  });

  const [importMode, setImportMode] = useState<"candidate_only" | "lead_only" | "lead_candidate">("candidate_only");
  const [tag, setTag] = useState("");
  const [stats, setStats] = useState<any | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");
    setStats(null);
    setLoading(true);

    try {
      const res = await previewImportHeaders(selectedFile);
      setHeaders(res.headers);
      setPreviewRows(res.preview_rows);

      // Auto-match headers to fields by simple string similarity
      const autoMappings = { ...mappings };
      res.headers.forEach((header) => {
        const cleanHeader = header.toLowerCase().replace(/[\s_-]/g, "");
        if (cleanHeader.includes("name") || cleanHeader === "fullname") {
          autoMappings.full_name = header;
        } else if (cleanHeader.includes("email")) {
          autoMappings.email = header;
        } else if (cleanHeader === "phone" || cleanHeader === "mobile" || cleanHeader.includes("contact")) {
          autoMappings.phone = header;
        } else if (cleanHeader.includes("whatsapp")) {
          autoMappings.whatsapp_number = header;
        } else if (cleanHeader.includes("course") || cleanHeader.includes("interested")) {
          autoMappings.course_applied = header;
        } else if (cleanHeader.includes("college") || cleanHeader.includes("university")) {
          autoMappings.college_name = header;
        } else if (cleanHeader.includes("qualification") || cleanHeader.includes("education")) {
          autoMappings.qualification = header;
        } else if (cleanHeader.includes("aadhaar") || cleanHeader.includes("aadhar")) {
          autoMappings.aadhaar_number = header;
        }
      });
      setMappings(autoMappings);
      // Automatically advance to Step 2 once file is parsed successfully
      setCurrentStep(2);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to parse file headers. Ensure it is a valid format.");
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMappingChange = (field: string, headerVal: string) => {
    setMappings((prev) => ({ ...prev, [field]: headerVal }));
  };

  const validateMappings = () => {
    if (!mappings.full_name) {
      setError("Please map the 'Full Name' field.");
      return false;
    }
    if (!mappings.email && !mappings.phone) {
      setError("Please map at least 'Email Address' or 'Phone Number' to identify records.");
      return false;
    }
    setError("");
    return true;
  };

  const handleGoToStep3 = () => {
    if (validateMappings()) {
      setCurrentStep(3);
    }
  };

  const handleExecuteImport = async () => {
    if (!file) return;

    setCurrentStep(4);
    setLoading(true);
    setError("");

    try {
      const res = await processImport(file, mappings, importMode, tag);
      setStats(res.stats);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "An error occurred during import execution.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Excel/CSV Batch Import Wizard</h2>
      <p style={styles.subtitle}>Import bulk CRM leads and candidate applications via a dynamic field mapping sequence.</p>

      {/* Visual Step Indicator */}
      <div className="import-step-container">
        <div className={`import-step ${currentStep === 1 ? "active" : currentStep > 1 ? "completed" : ""}`}>
          <div className="import-step-number">1</div>
          <span className="import-step-label">Upload File</span>
        </div>
        <div className="import-step-divider"></div>

        <div className={`import-step ${currentStep === 2 ? "active" : currentStep > 2 ? "completed" : ""}`}>
          <div className="import-step-number">2</div>
          <span className="import-step-label">Map Fields</span>
        </div>
        <div className="import-step-divider"></div>

        <div className={`import-step ${currentStep === 3 ? "active" : currentStep > 3 ? "completed" : ""}`}>
          <div className="import-step-number">3</div>
          <span className="import-step-label">Configure & Preview</span>
        </div>
        <div className="import-step-divider"></div>

        <div className={`import-step ${currentStep === 4 ? "active" : currentStep > 4 ? "completed" : ""}`}>
          <div className="import-step-number">4</div>
          <span className="import-step-label">Import Stats</span>
        </div>
      </div>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {/* Step 1: Upload */}
      {currentStep === 1 && (
        <div style={styles.card}>
          <div style={styles.uploadArea}>
            <label style={styles.fileDropZone}>
              <span style={{ fontSize: "40px", marginBottom: "12px" }}>📊</span>
              <strong style={{ fontSize: "16px", color: "#f8fafc" }}>Click to select spreadsheet / CSV</strong>
              <span style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>
                Accepts standard .xlsx, .xls, or .csv files
              </span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
          {loading && <div style={styles.loader}>Reading spreadsheet rows and structure...</div>}
        </div>
      )}

      {/* Step 2: Map Columns */}
      {currentStep === 2 && (
        <div style={styles.card}>
          <div style={styles.mappingSection}>
            <h3 style={styles.sectionHeader}>Map Columns to Database Fields</h3>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "-8px", marginBottom: "20px" }}>
              Align the columns detected in your uploaded spreadsheet to matching system fields. <strong style={{ color: "#ef4444" }}>* Required</strong> fields must be mapped.
            </p>

            <div style={styles.mappingGrid}>
              {Object.keys(mappings).map((field) => (
                <div key={field} style={styles.mappingRow}>
                  <span style={styles.fieldName}>
                    {field.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    {["full_name"].includes(field) && <span style={{ color: "#ef4444" }}> *</span>}
                    {["email", "phone"].includes(field) && <span style={{ color: "#f59e0b" }}> *</span>}
                  </span>
                  <select
                    value={mappings[field]}
                    onChange={(e) => handleMappingChange(field, e.target.value)}
                    style={styles.selectMapping}
                  >
                    <option value="">-- Skip / Ignore Column --</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
            <button
              onClick={() => {
                setFile(null);
                setCurrentStep(1);
              }}
              style={styles.backBtn}
            >
              Back: Re-upload
            </button>
            <button onClick={handleGoToStep3} style={styles.submitBtn}>
              Next: Configure & Preview
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Configure & Preview */}
      {currentStep === 3 && (
        <div style={styles.card}>
          {/* Configurations */}
          <div style={styles.configSection}>
            <h3 style={styles.sectionHeader}>Import Settings</h3>
            <div style={styles.configGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Import Destination Target</label>
                <select
                  value={importMode}
                  onChange={(e: any) => setImportMode(e.target.value)}
                  style={styles.select}
                >
                  <option value="candidate_only">Create/Update Candidate Applications Only</option>
                  <option value="lead_only">Create/Update CRM Leads Only</option>
                  <option value="lead_candidate">Create both CRM Leads & Candidates</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Batch Tag (Optional tag for tracking)</label>
                <input
                  type="text"
                  placeholder="e.g. excels-campus-june-2026"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Preview rows */}
          <div style={{ ...styles.previewSection, marginTop: "20px" }}>
            <h3 style={styles.sectionHeader}>Spreadsheet Preview (First few rows)</h3>
            <div style={styles.previewContainer}>
              <table style={styles.previewTable}>
                <thead>
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
            <button onClick={() => setCurrentStep(2)} style={styles.backBtn}>
              Back: Edit Mappings
            </button>
            <button onClick={handleExecuteImport} style={styles.submitBtn}>
              Run Batch Import 🚀
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Execute & Stats */}
      {currentStep === 4 && (
        <div style={styles.card}>
          {loading && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px", animation: "spin 2s linear infinite" }}>⚙️</div>
              <h3 style={{ color: "#3b82f6" }}>Processing Import batch...</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>Validating mappings, resolving duplicates, and storing records.</p>
            </div>
          )}

          {!loading && stats && (
            <div style={styles.statsCard}>
              <h3 style={{ color: "#10b981", fontSize: "20px", margin: "0 0 8px 0" }}>Import Complete!</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>Excel records successfully processed according to rules.</p>
              
              <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc" }}>{stats.total_rows}</div>
                  <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>Total Rows</div>
                </div>
                <div style={styles.statBox}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#10b981" }}>{stats.new_records}</div>
                  <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>New Created</div>
                </div>
                <div style={styles.statBox}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#3b82f6" }}>{stats.updated_records}</div>
                  <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>Updated</div>
                </div>
                <div style={styles.statBox}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#8b5cf6" }}>{stats.duplicate_records}</div>
                  <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>Duplicates Merged</div>
                </div>
                <div style={styles.statBox}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#ef4444" }}>{stats.failed_records}</div>
                  <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>Failed Rows</div>
                </div>
              </div>

              <button onClick={onImportComplete} style={styles.doneBtn}>
                Return to Candidates List
              </button>
            </div>
          )}

          {!loading && error && (
            <div style={{ textAlign: "center", padding: "24px" }}>
              <button onClick={() => setCurrentStep(3)} style={styles.backBtn}>
                Back: Check Settings
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Styles Object
// -------------------------------------------------------------
const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "24px",
    background: "#1e293b",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 4px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: "0 0 24px 0",
  },
  errorBanner: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fca5a5",
    padding: "16px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  statsCard: {
    background: "rgba(16, 185, 129, 0.03)",
    border: "1px solid rgba(16, 185, 129, 0.15)",
    borderRadius: "14px",
    padding: "28px",
    textAlign: "center",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "16px",
    margin: "24px 0",
  },
  statBox: {
    background: "rgba(15, 23, 42, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "10px",
    padding: "18px 12px",
    textAlign: "center",
  },
  doneBtn: {
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  card: {
    background: "transparent",
  },
  uploadArea: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
    marginBottom: "8px",
  },
  fileDropZone: {
    width: "100%",
    background: "rgba(15, 23, 42, 0.2)",
    border: "2px dashed rgba(255, 255, 255, 0.12)",
    borderRadius: "16px",
    padding: "48px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "center",
  },
  loader: {
    textAlign: "center",
    padding: "20px",
    color: "#3b82f6",
    fontSize: "14px",
  },
  configSection: {
    background: "rgba(15, 23, 42, 0.15)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.04)",
  },
  sectionHeader: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#3b82f6",
    margin: "0 0 16px 0",
  },
  configGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    color: "#cbd5e1",
  },
  select: {
    background: "#0f172a",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    color: "white",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    outline: "none",
  },
  input: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    color: "white",
    padding: "10px 14px",
    borderRadius: "8px",
    outline: "none",
  },
  mappingSection: {
    background: "rgba(15, 23, 42, 0.15)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.04)",
  },
  mappingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "16px",
  },
  mappingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255,255,255,0.02)",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.04)",
  },
  fieldName: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#cbd5e1",
  },
  selectMapping: {
    background: "#0f172a",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    color: "white",
    padding: "8px 12px",
    borderRadius: "6px",
    maxWidth: "180px",
    outline: "none",
  },
  previewSection: {
    background: "rgba(15, 23, 42, 0.15)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.04)",
  },
  previewContainer: {
    overflowX: "auto",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  previewTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
    textAlign: "left",
    background: "rgba(15, 23, 42, 0.1)",
  },
  submitBtn: {
    background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.25)",
  },
  backBtn: {
    background: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "#94a3b8",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
