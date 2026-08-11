import { api } from "./apiService";

export interface AdminProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

export const getAdminProfile = async (): Promise<AdminProfile> => {
  const res = await api.get("/admin/profile");
  return res.data;
};

export const requestEmailChange = async (
  newEmail: string
): Promise<{ success: boolean; message: string; sandbox?: boolean; code?: string }> => {
  const res = await api.post("/admin/profile/email/request", { new_email: newEmail });
  return res.data;
};

export const verifyEmailChangeOtp = async (
  otp: string
): Promise<{ success: boolean; message: string; profile: AdminProfile }> => {
  const res = await api.post("/admin/profile/email/verify", { otp });
  return res.data;
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const res = await api.post("/admin/profile/password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return res.data;
};
