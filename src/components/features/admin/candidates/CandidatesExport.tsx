import React, { useState, useEffect } from "react";
import { exportCandidates } from "../../../../services/candidateExportService";
import type { ExportCandidatesPayload } from "../../../../services/candidateExportService";

interface CandidatesExportProps {
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

export default function CandidatesExport({
  totalCandidates,
  filteredCount,
  selectedCandidateIds,
  activeFilters,
  onExportSuccess,
}: CandidatesExportProps) {
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
  }, [selectedCandidateIds, activeFilters]);

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
    } catch (err: any) {
      console.error("Export error:", err);
      setErrorMsg(err.response?.data?.detail || "Failed to generate export file. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={styles.container} className="admin-export-tab-container">
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className="material-symbols-outlined" style={{ color: "#3b82f6", fontSize: "28px" }}>
            download
          </span>
          <div>
            <h2 style={styles.title}>Export Candidate Records</h2>
            <p style={styles.subtitle}>
              Download candidate database records into Microsoft Excel (.xlsx) or CSV format based on scope, search, or registration date ranges.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleExport} style={styles.card}>
        {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}

        {/* 1. Target Scope Selector */}
        <div style={styles.section}>
          <label style={modalStyles.sectionTitle}>1. Select Target Candidate Scope</label>
          <div style={modalStyles.optionsGrid}>
            <label
              style={{
                ...modalStyles.radioCard,
                ...(scope === "filtered" ? modalStyles.radioCardActive : {}),
              }}
            >
              <input
                type="radio"
                name="exportTabScope"
                value="filtered"
                checked={scope === "filtered"}
                onChange={() => setScope("filtered")}
                style={modalStyles.radioInput}
              />
              <div>
                <div style={modalStyles.optionLabel}>Filtered Candidates ({filteredCount} records)</div>
                <div style={modalStyles.optionSubtext}>
                  Exports candidate records matching active search terms, status, program, or date range filters.
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
                name="exportTabScope"
                value="all"
                checked={scope === "all"}
                onChange={() => setScope("all")}
                style={modalStyles.radioInput}
              />
              <div>
                <div style={modalStyles.optionLabel}>All Candidates ({totalCandidates} total records)</div>
                <div style={modalStyles.optionSubtext}>Exports every active candidate application in the database.</div>
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
                name="exportTabScope"
                value="selected"
                checked={scope === "selected"}
                disabled={selectedCandidateIds.length === 0}
                onChange={() => setScope("selected")}
                style={modalStyles.radioInput}
              />
              <div>
                <div style={modalStyles.optionLabel}>
                  Selected Candidates ({selectedCandidateIds.length} checked rows)
                </div>
                <div style={modalStyles.optionSubtext}>
                  Exports specific candidate rows checked using candidate table checkboxes.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Date Range Options */}
        {scope === "filtered" && (
          <div style={styles.section}>
            <label style={modalStyles.sectionTitle}>Filter Date Range (Registration Date)</label>
            <div style={modalStyles.dateRow} className="admin-export-date-row">
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

        {/* 2. Output Format Selector */}
        <div style={styles.section}>
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
                name="exportTabFormat"
                value="xlsx"
                checked={format === "xlsx"}
                onChange={() => setFormat("xlsx")}
                style={modalStyles.radioInput}
              />
              <span className="material-symbols-outlined" style={{ color: "#10b981", fontSize: "22px" }}>
                table_chart
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#f8fafc" }}>Excel Workbook (.xlsx)</div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Styled spreadsheet with header colors & auto column width</div>
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
                name="exportTabFormat"
                value="csv"
                checked={format === "csv"}
                onChange={() => setFormat("csv")}
                style={modalStyles.radioInput}
              />
              <span className="material-symbols-outlined" style={{ color: "#3b82f6", fontSize: "22px" }}>
                description
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#f8fafc" }}>CSV Spreadsheet (.csv)</div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Standard UTF-8 BOM CSV file</div>
              </div>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" disabled={isExporting} style={modalStyles.submitBtn}>
            {isExporting ? "Generating Export File..." : `📥 Download ${format.toUpperCase()} File`}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100%",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  header: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    padding: "20px 24px",
    borderRadius: "14px",
  },
  title: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#f8fafc",
    margin: "0 0 4px 0",
  },
  subtitle: {
    fontSize: "13px",
    color: "#94a3b8",
    margin: 0,
  },
  card: {
    background: "#1e293b",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "14px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  errorBox: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fca5a5",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "13px",
  },
};

const modalStyles: Record<string, React.CSSProperties> = {
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
    gap: "12px",
  },
  radioCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "14px 18px",
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
    gap: "16px",
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
    padding: "10px 14px",
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
    padding: "14px 18px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "10px",
    cursor: "pointer",
    minWidth: "220px",
  },
  formatCardActive: {
    background: "rgba(16, 185, 129, 0.12)",
    borderColor: "#10b981",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    border: "none",
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
  },
};
