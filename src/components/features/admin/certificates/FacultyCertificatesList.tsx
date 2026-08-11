import { useState, useEffect } from "react";
import {
  listFacultyCertificates,
  createFacultyCertificate,
  updateFacultyCertificate,
  deleteFacultyCertificate,
  generateFacultyCertificate,
  downloadFacultyCertificate,
  previewFacultyCertificate,
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
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
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

  const handlePreview = async (id: string, certNumber: string) => {
    try {
      showToast("Loading preview PDF...");
      const blob = await previewFacultyCertificate(id);
      const url = window.URL.createObjectURL(blob);
      setPreviewBlobUrl(url);
      setPreviewNumber(certNumber);
    } catch (err: any) {
      console.error(err);
      showToast("Failed to load certificate preview.", "error");
    }
  };

  const closePreview = () => {
    if (previewBlobUrl) {
      window.URL.revokeObjectURL(previewBlobUrl);
    }
    setPreviewBlobUrl(null);
    setPreviewNumber(null);
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
    <div className="admin-page-container" style={{ padding: "24px" }}>
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
      <div className="admin-page-header" style={styles.header}>
        <div>
          <h1 className="admin-page-title" style={{ color: "#001943" }}>Faculty Development Programme (FDP)</h1>
          <p className="admin-page-subtitle" style={{ color: "#64748b", margin: 0 }}>
            Create, customize, preview, and generate appreciation certificates for FDP trainers.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => {
              setEditingCert(null);
              setIsFormOpen(true);
            }}
            className="activity-book-btn"
            style={styles.createBtn}
          >
            <span className="material-symbols-outlined">add</span>
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
            <div className="admin-kpi-card glass-panel" style={styles.loadingPlaceholder}>
              <div className="admin-loading-spinner" />
            </div>
          ) : error ? (
            <div className="admin-kpi-card glass-panel" style={styles.errorBox}>{error}</div>
          ) : certs.length === 0 ? (
            <div className="admin-kpi-card glass-panel" style={styles.emptyPlaceholder}>
              <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#94a3b8", marginBottom: "16px" }}>
                workspace_premium
              </span>
              <h3 style={{ color: "#001943", margin: "0 0 8px 0" }}>No FDP Certificates Found</h3>
              <p style={{ color: "#64748b", margin: 0 }}>Click "Create FDP Certificate" to add your first record.</p>
            </div>
          ) : (
            <div className="admin-kpi-card glass-panel" style={{ padding: "0", overflowX: "auto", display: "block" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Cert Number</th>
                    <th>Faculty Name</th>
                    <th>FDP Programme / Topic</th>
                    <th>Duration / Mode</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certs.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: "600", color: "#2563eb" }}>{c.certificate_number}</td>
                      <td style={{ fontWeight: "600", color: "#001943" }}>{c.faculty_name}</td>
                      <td>
                        <div style={{ fontWeight: "500", color: "#334155" }}>{c.programme_title}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{c.topic}</div>
                      </td>
                      <td>
                        <div style={{ color: "#334155" }}>{c.duration}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{c.mode || "Online"}</div>
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
                      <td style={{ fontSize: "12px", color: "#64748b" }}>
                        {new Date(c.updated_at).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={styles.actionsCell}>
                          <button
                            onClick={() => handlePreview(c.id, c.certificate_number)}
                            title="Preview Certificate"
                            className="admin-action-btn edit"
                            style={{ display: "inline-flex", padding: "6px", borderRadius: "6px", background: "#f1f5f9", color: "#475569", border: "none", cursor: "pointer" }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>visibility</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingCert(c);
                              setIsFormOpen(true);
                            }}
                            title="Edit Record"
                            className="admin-action-btn edit"
                            style={{ display: "inline-flex", padding: "6px", borderRadius: "6px", background: "#f1f5f9", color: "#475569", border: "none", cursor: "pointer" }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span>
                          </button>
                          <button
                            onClick={() => handleGenerate(c.id, c.certificate_number)}
                            title="Generate PDF & Save"
                            className="admin-action-btn edit"
                            style={{ display: "inline-flex", padding: "6px", borderRadius: "6px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", cursor: "pointer" }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>settings_suggest</span>
                          </button>
                          {c.status === "Generated" && (
                            <button
                              onClick={() => handleDownload(c.id, c.certificate_number)}
                              title="Download PDF File"
                              className="admin-action-btn edit"
                              style={{ display: "inline-flex", padding: "6px", borderRadius: "6px", background: "#ecfdf5", color: "#059669", border: "none", cursor: "pointer" }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>download</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(c.id, c.certificate_number)}
                            title="Delete Record"
                            className="admin-action-btn delete"
                            style={{ display: "inline-flex", padding: "6px", borderRadius: "6px", background: "#fef2f2", color: "#dc2626", border: "none", cursor: "pointer" }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
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
      {previewBlobUrl && (
        <div style={styles.modalOverlay} onClick={closePreview}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Certificate Preview: {previewNumber}</h3>
              <button
                style={styles.modalCloseBtn}
                onClick={closePreview}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div style={styles.modalBody}>
              <iframe
                src={previewBlobUrl}
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
    marginBottom: "24px",
  },
  createBtn: {
    textDecoration: "none",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    cursor: "pointer",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  searchBar: {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  searchInput: {
    background: "transparent",
    border: "none",
    color: "#001943",
    fontSize: "13px",
    width: "100%",
    outline: "none",
  },
  loadingPlaceholder: {
    padding: "60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
  },
  emptyPlaceholder: {
    padding: "60px 40px",
    textAlign: "center",
    background: "#ffffff",
    border: "1px dashed #cbd5e1",
    borderRadius: "12px",
  },
  errorBox: {
    padding: "12px 16px",
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    color: "#991b1b",
    borderRadius: "8px",
  },
  statusBadge: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "4px 10px",
    borderRadius: "20px",
    textTransform: "uppercase",
  },
  statusDraft: {
    background: "#fef3c7",
    color: "#d97706",
  },
  statusGenerated: {
    background: "#d1fae5",
    color: "#059669",
  },
  actionsCell: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "16px",
  },
  modalContent: {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "800px",
    height: "90%",
    maxHeight: "750px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    padding: "16px 24px",
    borderBottom: "1px solid #cbd5e1",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#001943",
    margin: 0,
  },
  modalCloseBtn: {
    background: "none",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
  },
  modalBody: {
    flex: 1,
    padding: "16px",
    background: "#f1f5f9",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    borderRadius: "8px",
    background: "#fff",
  },
};
