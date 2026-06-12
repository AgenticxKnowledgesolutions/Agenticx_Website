import React, { useState, useEffect } from "react";
import { getImportHistory } from "../../../../services/candidateService";
import type { ImportBatch } from "../../../../services/candidateService";

export default function CandidatesImportHistory() {
  const [batches, setBatches] = useState<ImportBatch[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const list = await getImportHistory();
      setBatches(list);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Excel Batch Import History</h2>
      <p style={styles.subtitle}>Audit logs of past candidate & lead Excel file imports, with stats on new and updated records.</p>

      {loading ? (
        <div style={styles.loader}>Loading audit history logs...</div>
      ) : batches.length === 0 ? (
        <div style={styles.emptyState}>No batch imports performed yet.</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Batch Date</th>
                <th>File Name</th>
                <th>Uploaded By</th>
                <th>Total Rows</th>
                <th>New Records</th>
                <th>Updated Records</th>
                <th>Duplicates</th>
                <th>Failed Rows</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id} style={styles.tr}>
                  <td style={{ fontWeight: "600", color: "#3b82f6" }}>
                    {new Date(b.createdAt).toLocaleString()}
                  </td>
                  <td style={{ fontWeight: "500" }}>{b.fileName}</td>
                  <td>{b.uploadedBy}</td>
                  <td><strong>{b.totalRows}</strong></td>
                  <td style={{ color: "#10b981" }}>{b.newRecords}</td>
                  <td style={{ color: "#3b82f6" }}>{b.updatedRecords}</td>
                  <td style={{ color: "#8b5cf6" }}>{b.duplicateRecords}</td>
                  <td style={{ color: "#ef4444" }}>{b.failedRecords}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
    padding: "20px",
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
  loader: {
    textAlign: "center",
    padding: "40px",
    color: "#94a3b8",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#64748b",
    background: "rgba(255, 255, 255, 0.01)",
    borderRadius: "12px",
    border: "1px dashed rgba(255, 255, 255, 0.08)",
  },
  tableContainer: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "14px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "14px",
  },
  tr: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
  },
};
