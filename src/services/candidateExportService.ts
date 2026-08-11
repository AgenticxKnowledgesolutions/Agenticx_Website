import { api } from "./apiService";

export interface ExportCandidatesPayload {
  scope: "filtered" | "all" | "selected";
  format: "xlsx" | "csv";
  candidate_ids?: string[];
  status_filter?: string;
  course_filter?: string;
  search_query?: string;
  start_date?: string;
  end_date?: string;
}

export const exportCandidates = async (payload: ExportCandidatesPayload): Promise<void> => {
  const response = await api.post("/candidates/export", payload, {
    responseType: "blob",
  });

  // Extract filename from header or fallback
  const contentDisposition = response.headers["content-disposition"];
  let filename = `candidates_export_${payload.scope}.${payload.format}`;
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }

  // Trigger browser download
  const blob = new Blob([response.data], {
    type: String(response.headers["content-type"] || "application/octet-stream"),
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
