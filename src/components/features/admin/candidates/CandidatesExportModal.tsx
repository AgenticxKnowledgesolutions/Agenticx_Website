import React, { useState, useEffect } from "react";
import { exportCandidates } from "../../../../services/candidateExportService";
import type { ExportCandidatesPayload } from "../../../../services/candidateExportService";

interface CandidatesExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalCandidates: number;
  filteredCount: number;
  selectedCandidateIds: string[];
  activeFilters: {
    search: string;
    statusFilter: string;
    courseFilter: string;
    startDate: string;
    endDate: string;
  };
  onExportSuccess?: (message: string) => void;
}

export default function CandidatesExportModal({
  isOpen,
  onClose,
  totalCandidates,
  filteredCount,
  selectedCandidateIds,
  activeFilters,
  onExportSuccess,
}: CandidatesExportModalProps) {
  const [scope, setScope] = useState<"filtered" | "all" | "selected">("filtered");
  const [format, setFormat] = useState<"xlsx" | "csv">("xlsx");
  const [startDate, setStartDate] = useState(activeFilters.startDate || "");
  const [endDate, setEndDate] = useState(activeFilters.endDate || "");
  const [isExporting, setIsExporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setStartDate(activeFilters.startDate || "");
    setEndDate(activeFilters.endDate || "");

    if (selectedCandidateIds.length > 0) {
      setScope("selected");
    } else {
      setScope("filtered");
    }
  }, [isOpen, selectedCandidateIds, activeFilters]);

  if (!isOpen) return null;

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);
    setErrorMsg(null);

    try {
      const payload: ExportCandidatesPayload = {
        scope,
        format,
        candidate_ids: scope === "selected" ? selectedCandidateIds : undefined,
        status_filter: scope === "filtered" ? activeFilters.statusFilter || undefined : undefined,
        course_filter: scope === "filtered" ? activeFilters.courseFilter || undefined : undefined,
        search_query: scope === "filtered" ? activeFilters.search || undefined : undefined,
        start_date: scope === "filtered" && startDate ? `${startDate}T00:00:00Z` : undefined,
        end_date: scope === "filtered" && endDate ? `${endDate}T23:59:59Z` : undefined,
      };

      await exportCandidates(payload);
      if (onExportSuccess) {
        onExportSuccess(`Candidate records exported successfully as ${format.toUpperCase()}!`);
      }
      onClose();
    } catch (err: any) {
      console.error("Export error:", err);
      setErrorMsg(err.response?.data?.detail || "Failed to generate export file. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.container} onClick={(e) => e.stopPropagation()} className="admin-export-modal-container">
        {/* Header */}
        <div style={modalStyles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="material-symbols-outlined" style={{ color: "#3b82f6", fontSize: "24px" }}>
              download
            </span>
            <h2 style={modalStyles.title}>Export Candidate Records</h2>
          </div>
          <button style={modalStyles.closeBtn} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleExport} style={modalStyles.body}>
          {errorMsg && <div style={modalStyles.errorBox}>{errorMsg}</div>}

          {/* Export Scope Selector */}
          <div style={modalStyles.section}>
            <label style={modalStyles.sectionTitle}>1. Select Target Candidates Scope</label>
            <div style={modalStyles.optionsGrid}>
              <label
                style={{
                  ...modalStyles.radioCard,
                  ...(scope === "filtered" ? modalStyles.radioCardActive : {}),
                }}
              >
                <input
                  type="radio"
                  name="exportScope"
                  value="filtered"
                  checked={scope === "filtered"}
                  onChange={() => setScope("filtered")}
                  style={modalStyles.radioInput}
                />
                <div>
                  <div style={modalStyles.optionLabel}>Filtered Candidates ({filteredCount} records)</div>
                  <div style={modalStyles.optionSubtext}>
                    Exports records matching active search terms, status, program, and date bounds.
                  </div>
                </div>
              </label>

              <label
                style={{
                  ...modalStyles.radioCard,
                  ...(scope === "all" ? modalStyles.radioCardActive : {}),
                }}
              >
                <input
                  type="radio"
                  name="exportScope"
                  value="all"
                  checked={scope === "all"}
                  onChange={() => setScope("all")}
                  style={modalStyles.radioInput}
                />
                <div>
                  <div style={modalStyles.optionLabel}>All Candidates ({totalCandidates} records)</div>
                  <div style={modalStyles.optionSubtext}>Exports every active candidate application in the system.</div>
                </div>
              </label>

              <label
                style={{
                  ...modalStyles.radioCard,
                  ...(scope === "selected" ? modalStyles.radioCardActive : {}),
                  ...(selectedCandidateIds.length === 0 ? { opacity: 0.5, cursor: "not-allowed" } : {}),
                }}
              >
                <input
                  type="radio"
                  name="exportScope"
                  value="selected"
                  checked={scope === "selected"}
                  disabled={selectedCandidateIds.length === 0}
                  onChange={() => setScope("selected")}
                  style={modalStyles.radioInput}
                />
                <div>
                  <div style={modalStyles.optionLabel}>
                    Selected Candidates ({selectedCandidateIds.length} checked)
                  </div>
                  <div style={modalStyles.optionSubtext}>
                    Exports specific candidate rows selected using table checkboxes.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Date Range Options (Active when Scope == 'filtered') */}
          {scope === "filtered" && (
            <div style={modalStyles.section}>
              <label style={modalStyles.sectionTitle}>Filter Date Range (Registration Date)</label>
              <div style={modalStyles.dateRow}>
                <div style={{ flex: 1 }}>
                  <label style={modalStyles.fieldLabel}>From Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={modalStyles.input}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={modalStyles.fieldLabel}>To Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={modalStyles.input}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Export Output Format */}
          <div style={modalStyles.section}>
            <label style={modalStyles.sectionTitle}>2. Select Export File Format</label>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <label
                style={{
                  ...modalStyles.formatCard,
                  ...(format === "xlsx" ? modalStyles.formatCardActive : {}),
                }}
              >
                <input
                  type="radio"
                  name="exportFormat"
                  value="xlsx"
                  checked={format === "xlsx"}
                  onChange={() => setFormat("xlsx")}
                  style={modalStyles.radioInput}
                />
                <span className="material-symbols-outlined" style={{ color: "#10b981", fontSize: "20px" }}>
                  table_chart
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "#f8fafc" }}>Excel (.xlsx)</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>Formatted workbook with styled headers</div>
                </div>
              </label>

              <label
                style={{
                  ...modalStyles.formatCard,
                  ...(format === "csv" ? modalStyles.formatCardActive : {}),
                }}
              >
                <input
                  type="radio"
                  name="exportFormat"
                  value="csv"
                  checked={format === "csv"}
                  onChange={() => setFormat("csv")}
                  style={modalStyles.radioInput}
                />
                <span className="material-symbols-outlined" style={{ color: "#3b82f6", fontSize: "20px" }}>
                  description
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "#f8fafc" }}>CSV (.csv)</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>Raw CSV file with UTF-8 BOM encoding</div>
                </div>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={modalStyles.footer}>
            <button type="button" onClick={onClose} style={modalStyles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={isExporting} style={modalStyles.submitBtn}>
              {isExporting ? "Generating Export..." : `Download ${format.toUpperCase()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalStyles: Record<string, React.CSSProperties> = {
  overlay: {
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
  container: {
    background: "#1e293b",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "540px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
  },
  header: {
    padding: "18px 24px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.02)",
  },
  title: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
  },
  body: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
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
    gap: "10px",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  optionsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  radioCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "12px 16px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  radioCardActive: {
    background: "rgba(59, 130, 246, 0.12)",
    borderColor: "#3b82f6",
  },
  radioInput: {
    marginTop: "3px",
  },
  optionLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#f8fafc",
  },
  optionSubtext: {
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "2px",
  },
  dateRow: {
    display: "flex",
    gap: "12px",
  },
  fieldLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "4px",
    display: "block",
  },
  input: {
    width: "100%",
    background: "#0f172a",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "#f8fafc",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  },
  formatCard: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "10px",
    cursor: "pointer",
    minWidth: "200px",
  },
  formatCardActive: {
    background: "rgba(16, 185, 129, 0.12)",
    borderColor: "#10b981",
  },
  footer: {
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
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    border: "none",
    color: "#ffffff",
    padding: "10px 22px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
  },
};
