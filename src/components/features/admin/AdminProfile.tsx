import React, { useState, useEffect } from "react";
import {
  getAdminProfile,
  requestEmailChange,
  verifyEmailChangeOtp,
  updatePassword,
} from "../../../services/adminProfileService";
import type { AdminProfile as AdminProfileData } from "../../../services/adminProfileService";

export default function AdminProfile() {
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Email update state
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [sandboxCode, setSandboxCode] = useState<string | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await getAdminProfile();
      setProfile(data);
    } catch (err: any) {
      console.error("Failed to load admin profile:", err);
      showToast(err.response?.data?.detail || "Failed to load account profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Handle Email Change Request
  const handleEmailRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes("@")) {
      showToast("Please enter a valid new email address.", "error");
      return;
    }
    setEmailLoading(true);
    setSandboxCode(null);
    try {
      const res = await requestEmailChange(newEmail);
      showToast(res.message, "success");
      if (res.sandbox && res.code) {
        setSandboxCode(res.code);
      }
      setOtpStep(true);
    } catch (err: any) {
      console.error("Email request error:", err);
      showToast(err.response?.data?.detail || "Failed to request email verification code.", "error");
    } finally {
      setEmailLoading(false);
    }
  };

  // Handle OTP Verification
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length === 0) {
      showToast("Please enter the 6-digit verification code.", "error");
      return;
    }
    setOtpLoading(true);
    try {
      const res = await verifyEmailChangeOtp(otpCode);
      showToast("Email address updated successfully!", "success");
      setProfile(res.profile);
      setOtpStep(false);
      setNewEmail("");
      setOtpCode("");
      setSandboxCode(null);
    } catch (err: any) {
      console.error("OTP verification error:", err);
      showToast(err.response?.data?.detail || "Failed to verify OTP code.", "error");
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle Password Update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast("Please enter your current password.", "error");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      showToast("New password must be at least 8 characters long.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New password and confirmation do not match.", "error");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await updatePassword(currentPassword, newPassword);
      showToast(res.message, "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Password change error:", err);
      showToast(err.response?.data?.detail || "Failed to update password.", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loader}>Loading Admin Profile...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {toast && (
        <div
          style={{
            ...styles.toast,
            background:
              toast.type === "success"
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          }}
        >
          {toast.message}
        </div>
      )}

      <div style={styles.header}>
        <h1 style={styles.title}>Admin Profile & Account Settings</h1>
        <p style={styles.subtitle}>
          Manage your authenticated administrator credentials, email address, and security settings.
        </p>
      </div>

      <div style={styles.grid}>
        {/* Account Info Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span className="material-symbols-outlined" style={styles.cardIcon}>
              account_circle
            </span>
            <h2 style={styles.cardTitle}>Account Details</h2>
          </div>
          <div style={styles.cardBody}>
            <div style={styles.infoRow}>
              <span style={styles.label}>Name</span>
              <span style={styles.value}>{profile?.name || "N/A"}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Email Address</span>
              <span style={styles.value}>{profile?.email || "N/A"}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Role</span>
              <span style={styles.roleBadge}>{profile?.role?.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Update Email Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span className="material-symbols-outlined" style={styles.cardIcon}>
              mail
            </span>
            <h2 style={styles.cardTitle}>Update Email Address</h2>
          </div>
          <div style={styles.cardBody}>
            {!otpStep ? (
              <form onSubmit={handleEmailRequest} style={styles.form}>
                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>New Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter new email address..."
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>
                <button type="submit" disabled={emailLoading} style={styles.primaryBtn}>
                  {emailLoading ? "Sending Verification Code..." : "Send Verification Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpVerify} style={styles.form}>
                <div style={styles.noticeBox}>
                  <p style={{ margin: 0, fontSize: "13px", color: "#93c5fd" }}>
                    A 6-digit OTP verification code was sent to <strong>{newEmail}</strong>.
                  </p>
                  {sandboxCode && (
                    <div style={{ marginTop: "8px", fontSize: "12px", color: "#fef08a" }}>
                      ⚠️ <strong>Sandbox Mode:</strong> Your OTP code is <code>{sandboxCode}</code>
                    </div>
                  )}
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.fieldLabel}>Enter 6-Digit OTP Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    style={styles.input}
                    maxLength={6}
                    required
                  />
                </div>

                <div style={styles.buttonRow}>
                  <button type="submit" disabled={otpLoading} style={styles.primaryBtn}>
                    {otpLoading ? "Verifying..." : "Verify OTP & Update Email"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep(false);
                      setOtpCode("");
                      setSandboxCode(null);
                    }}
                    style={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Change Password Card */}
        <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <div style={styles.cardHeader}>
            <span className="material-symbols-outlined" style={styles.cardIcon}>
              lock
            </span>
            <h2 style={styles.cardTitle}>Security & Password Management</h2>
          </div>
          <div style={styles.cardBody}>
            <form onSubmit={handlePasswordUpdate} style={styles.formGrid}>
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password..."
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>New Password</label>
                <input
                  type="password"
                  placeholder="At least 8 characters..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ ...styles.fieldGroup, gridColumn: "1 / -1", marginTop: "8px" }}>
                <button type="submit" disabled={passwordLoading} style={styles.primaryBtn}>
                  {passwordLoading ? "Updating Password..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "24px",
    background: "#0f172a",
    color: "#f8fafc",
    fontFamily: "'Outfit', 'Inter', sans-serif",
    minHeight: "100vh",
  },
  loader: {
    padding: "40px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "16px",
  },
  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "8px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
    zIndex: 99999,
    fontWeight: "600",
  },
  header: {
    marginBottom: "24px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    paddingBottom: "16px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#1e293b",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
  },
  cardHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(255, 255, 255, 0.02)",
  },
  cardIcon: {
    fontSize: "22px",
    color: "#3b82f6",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#f8fafc",
    margin: 0,
  },
  cardBody: {
    padding: "20px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  label: {
    fontSize: "14px",
    color: "#94a3b8",
  },
  value: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#f8fafc",
  },
  roleBadge: {
    background: "rgba(59, 130, 246, 0.15)",
    color: "#60a5fa",
    fontSize: "12px",
    fontWeight: "700",
    padding: "4px 10px",
    borderRadius: "6px",
    border: "1px solid rgba(59, 130, 246, 0.3)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  fieldLabel: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#94a3b8",
  },
  input: {
    background: "#0f172a",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  noticeBox: {
    background: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.25)",
    borderRadius: "8px",
    padding: "12px",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
  },
  primaryBtn: {
    background: "#3b82f6",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  cancelBtn: {
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
};
