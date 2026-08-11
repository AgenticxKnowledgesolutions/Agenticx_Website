import { api } from "./apiService";

export interface FacultyCertificate {
  id: string;
  certificate_number: string;
  faculty_name: string;
  faculty_email?: string | null;
  designation?: string | null;
  organization?: string | null;
  programme_title: string;
  topic: string;
  start_date: string;
  end_date: string;
  duration: string;
  mode?: string | null;
  description?: string | null;
  organization_name: string;
  signatory_name?: string | null;
  signatory_designation?: string | null;
  status: "Draft" | "Generated";
  certificate_url?: string | null;
  created_at: string;
  updated_at: string;
  generated_at?: string | null;
}

export interface FacultyCertificateInput {
  faculty_name: string;
  faculty_email?: string | null;
  designation?: string | null;
  organization?: string | null;
  programme_title: string;
  topic: string;
  start_date: string;
  end_date: string;
  duration: string;
  mode?: string | null;
  description?: string | null;
  organization_name: string;
  signatory_name?: string | null;
  signatory_designation?: string | null;
}

export const listFacultyCertificates = async (search?: string): Promise<FacultyCertificate[]> => {
  const params = search ? { search } : undefined;
  const res = await api.get("/admin/certificates/fdp", { params });
  return res.data;
};

export const getFacultyCertificate = async (id: string): Promise<FacultyCertificate> => {
  const res = await api.get(`/admin/certificates/fdp/${id}`);
  return res.data;
};

export const createFacultyCertificate = async (payload: FacultyCertificateInput): Promise<FacultyCertificate> => {
  const res = await api.post("/admin/certificates/fdp", payload);
  return res.data;
};

export const updateFacultyCertificate = async (id: string, payload: Partial<FacultyCertificateInput>): Promise<FacultyCertificate> => {
  const res = await api.put(`/admin/certificates/fdp/${id}`, payload);
  return res.data;
};

export const deleteFacultyCertificate = async (id: string): Promise<void> => {
  await api.delete(`/admin/certificates/fdp/${id}`);
};

export const generateFacultyCertificate = async (id: string): Promise<FacultyCertificate> => {
  const res = await api.post(`/admin/certificates/fdp/${id}/generate`);
  return res.data;
};

export const previewFacultyCertificateUrl = (id: string): string => {
  return `${api.defaults.baseURL}/admin/certificates/fdp/${id}/preview`;
};

export const downloadFacultyCertificate = async (id: string, certNumber: string): Promise<void> => {
  const res = await api.get(`/admin/certificates/fdp/${id}/download`, {
    responseType: "blob",
  });
  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${certNumber}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
