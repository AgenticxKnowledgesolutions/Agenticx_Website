import { api } from "./apiService";

export interface Job {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface JobCreate {
  title: string;
  description: string;
  is_active: boolean;
}

export interface JobApplicationCreate {
  name: string;
  email: string;
  phone: string;
  resume_url: string;
}

export const getJobs = async (): Promise<Job[]> => {
  const response = await api.get<Job[]>("/jobs/");
  return response.data;
};

export interface JobApplicationSubmit {
  job_id: string;
  name: string;
  email: string;
  phone: string;
  resume: File;
}

export const submitJobApplication = async (data: JobApplicationSubmit): Promise<any> => {
  const formData = new FormData();
  formData.append("job_id", data.job_id);
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("resume", data.resume);

  const response = await api.post("/applications/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Admin job services
export const getAdminJobs = async (): Promise<Job[]> => {
  const response = await api.get<Job[]>("/jobs/admin");
  return response.data;
};

export const createJob = async (data: JobCreate): Promise<Job> => {
  const response = await api.post<Job>("/jobs/", data);
  return response.data;
};

export const getJobById = async (id: string): Promise<Job> => {
  const response = await api.get<Job>(`/jobs/${id}`);
  return response.data;
};

export const updateJob = async (id: string, data: JobCreate): Promise<Job> => {
  const response = await api.put<Job>(`/jobs/${id}`, data);
  return response.data;
};

export const deleteJob = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/jobs/${id}`);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export interface JobApplicationAdmin {
  id: string;
  job_id: string;
  name: string;
  email: string;
  phone: string;
  resume_url: string;
  status: string;
  is_deleted: boolean;
  created_at: string;
  job_title: string;
}

export const getAdminApplications = async (): Promise<JobApplicationAdmin[]> => {
  const response = await api.get<JobApplicationAdmin[]>("/applications/admin");
  return response.data;
};

export const updateApplicationStatus = async (id: string, status: string): Promise<JobApplicationAdmin> => {
  const formData = new FormData();
  formData.append("status_str", status);
  const response = await api.put<JobApplicationAdmin>(`/applications/${id}/status`, formData);
  return response.data;
};

export const softDeleteApplication = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/applications/${id}`);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
