import { useState, useEffect } from "react";
import {
  listFacultyCertificates,
  createFacultyCertificate,
  updateFacultyCertificate,
  deleteFacultyCertificate,
  generateFacultyCertificate,
  downloadFacultyCertificate,
  previewFacultyCertificateUrl,
} from "../../../../services/facultyCertificateService";
import type {
  FacultyCertificate,
  FacultyCertificateInput,
} from "../../../../services/facultyCertificateService";
import FacultyCertificateForm from "./FacultyCertificateForm";

export default function FacultyCertificatesList() {
  const [certs, setCerts] = useState<FacultyCertificate[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<FacultyCertificate | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Preview State
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewNumber, setPreviewNumber] = useState<string | null>(null);

  // Notification Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listFacultyCertificates(search || undefined);
      setCerts(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load certificate records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, [search]);

  const handleFormSubmit = async (data: FacultyCertificateInput) => {
    setIsSaving(true);
    try {
      if (editingCert) {
        await updateFacultyCertificate(editingCert.id, data);
        showToast("Certificate updated successfully.");
      } else {
        await createFacultyCertificate(data);
        showToast("New FDP certificate created.");
      }
      setIsFormOpen(false);
      setEditingCert(null);
      loadCertificates();
    } catch (err: any) {
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async (id: string, certNumber: string) => {
    try {
      showToast("Generating certificate PDF...");
      await generateFacultyCertificate(id);
      showToast(`Certificate ${certNumber} generated successfully!`);
      loadCertificates();
    } catch (err: any) {
      console.error(err);
      showToast("Failed to generate certificate PDF.", "error");
    }
  };

  const handleDownload = async (id: string, certNumber: string) => {
    try {
      showToast("Downloading certificate...");
      await downloadFacultyCertificate(id, certNumber);
    } catch (err: any) {
      console.error(err);
      showToast("Failed to download certificate file.", "error");
    }
  };

  const handleDelete = async (id: string, certNumber: string) => {
    if (window.confirm(`Are you sure you want to permanently delete certificate ${certNumber}?`)) {
      try {
        await deleteFacultyCertificate(id);
        showToast("Certificate deleted successfully.");
        loadCertificates();
      } catch (err: any) {
        console.error(err);
        showToast("Failed to delete certificate record.", "error");
      }
    }
  };

  return (
    <div style={styles.container} className="admin-fdp-certificates-list-container">
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            ...styles.toast,
            background: toast.type === "success" ? "#10b981" : "#ef4444",
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Faculty Development Programme (FDP)</h2>
          <p style={styles.subtitle}>Create, customize, preview, and generate appreciation certificates for FDP trainers.</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => {
              setEditingCert(null);
              setIsFormOpen(true);
            }}
            style={styles.createBtn}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              add
            </span>
            Create FDP Certificate
          </button>
        )}
      </div>

      {/* Form View / Table View toggle */}
      {isFormOpen ? (
        <FacultyCertificateForm
          initialData={editingCert}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingCert(null);
          }}
          isSaving={isSaving}
        />
      ) : (
        <div style={styles.content}>
          {/* Search bar */}
          <div style={styles.searchBar}>
            <span className="material-symbols-outlined" style={{ color: "#64748b", fontSize: "20px" }}>
              search
            </span>
            <input
              type="text"
              placeholder="Search by faculty name, program, or certificate number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* List Table */}
          {loading ? (
            <div style={styles.loadingPlaceholder}>Loading FDP certificate records...</div>
          ) : error ? (
            <div style={styles.errorBox}>{error}</div>
          ) : certs.length === 0 ? (
            <div style={styles.emptyPlaceholder}>No FDP certificate records found. Click "Create FDP Certificate" to add one.</div>
          ) : (
            <div className="candidate-table-wrapper" style={{ overflowX: "auto" }}>
              <table style={styles.table} className="candidates-table">
                <thead>
                  <tr>
                    <th>Cert Number</th>
                    <th>Faculty Name</th>
                    <th>FDP Programme / Topic</th>
                    <th>Duration / Mode</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certs.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: "600", color: "#3b82f6" }}>{c.certificate_number}</td>
                      <td style={{ fontWeight: "600" }}>{c.faculty_name}</td>
                      <td>
                        <div style={{ fontWeight: "500", color: "#f8fafc" }}>{c.programme_title}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>{c.topic}</div>
                      </td>
                      <td>
                        <div>{c.duration}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>{c.mode || "Online"}</div>
                      </td>
                      <td>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...(c.status === "Generated" ? styles.statusGenerated : styles.statusDraft),
                          }}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {new Date(c.updated_at).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={styles.actionsCell}>
                          <button
                            onClick={() => {
                              setPreviewId(c.id);
                              setPreviewNumber(c.certificate_number);
                            }}
                            title="Preview Certificate"
                            style={styles.actionBtn}
                          >
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingCert(c);
                              setIsFormOpen(true);
                            }}
                            title="Edit Record"
                            style={styles.actionBtn}
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => handleGenerate(c.id, c.certificate_number)}
                            title="Generate PDF & Save"
                            style={styles.actionBtn}
                          >
                            <span className="material-symbols-outlined">settings_suggest</span>
                          </button>
                          {c.status === "Generated" && (
                            <button
                              onClick={() => handleDownload(c.id, c.certificate_number)}
                              title="Download PDF File"
                              style={{ ...styles.actionBtn, color: "#10b981" }}
                            >
                              <span className="material-symbols-outlined">download</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(c.id, c.certificate_number)}
                            title="Delete Record"
                            style={{ ...styles.actionBtn, color: "#ef4444" }}
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PDF Inline Preview Modal */}
      {previewId && (
        <div style={styles.modalOverlay} onClick={() => { setPreviewId(null); setPreviewNumber(null); }}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Certificate Preview: {previewNumber}</h3>
              <button
                style={styles.modalCloseBtn}
                onClick={() => { setPreviewId(null); setPreviewNumber(null); }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div style={styles.modalBody}>
              <iframe
                src={previewFacultyCertificateUrl(previewId)}
                title="Certificate PDF Preview"
                style={styles.iframe}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    color: "#f8fafc",
  },
  toast: {
    position: "fixed",
    top: "24px",
    right: "24px",
    padding: "12px 24px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "600",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
    zIndex: 10000,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: "0 0 4px 0",
  },
  subtitle: {
    fontSize: "13px",
    color: "#94a3b8",
    margin: 0,
  },
  createBtn: {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    border: "none",
    color: "#ffffff",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  searchBar: {
    background: "#1e293b",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "10px",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  searchInput: {
    background: "transparent",
    border: "none",
    color: "#f8fafc",
    fontSize: "13px",
    width: "100%",
    outline: "none",
  },
  loadingPlaceholder: {
    padding: "40px",
    textAlign: "center",
    color: "#94a3b8",
  },
  emptyPlaceholder: {
    background: "#1e293b",
    border: "1px dashed rgba(255, 255, 255, 0.15)",
    borderRadius: "14px",
    padding: "60px 40px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "14px",
  },
  errorBox: {
    background: "rgba(239, 68, 68, 0.15)",
    color: "#fca5a5",
    padding: "12px 16px",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  statusBadge: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "4px 10px",
    borderRadius: "20px",
    textTransform: "uppercase",
  },
  statusDraft: {
    background: "rgba(245, 158, 11, 0.15)",
    color: "#f59e0b",
  },
  statusGenerated: {
    background: "rgba(16, 185, 129, 0.15)",
    color: "#10b981",
  },
  actionsCell: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
  },
  actionBtn: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "none",
    borderRadius: "6px",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#cbd5e1",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "16px",
  },
  modalContent: {
    background: "#1e293b",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "800px",
    height: "90%",
    maxHeight: "750px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    padding: "16px 24px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: 0,
  },
  modalCloseBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
  },
  modalBody: {
    flex: 1,
    padding: "16px",
    background: "#0f172a",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    borderRadius: "8px",
    background: "#fff",
  },
};
