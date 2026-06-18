import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { applyCandidate, uploadCandidateDocument } from "../services/candidateService";
import { getLeadById } from "../services/leadService";

export default function CandidateApply() {
  const [searchParams] = useSearchParams();
  
  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [qualification, setQualification] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [courseApplied, setCourseApplied] = useState("");
  const [modeOfLearning, setModeOfLearning] = useState("Offline");
  const [collegeName, setCollegeName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [referenceDetails, setReferenceDetails] = useState("");
  const [languagesKnown, setLanguagesKnown] = useState("");
  const [parentGuardianName, setParentGuardianName] = useState("");
  const [parentGuardianOccupation, setParentGuardianOccupation] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [registrationTransactionId, setRegistrationTransactionId] = useState("");
  const [remarks, setRemarks] = useState("");

  // Lead Conversion support
  const leadId = searchParams.get("lead_id") || undefined;

  // File states
  const [files, setFiles] = useState<{
    cv?: File;
    photo?: File;
    aadhaar?: File;
    "college-id"?: File;
    "confirmation-letter"?: File;
  }>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [appNumber, setAppNumber] = useState("");
  const [uploadingFilesStatus, setUploadingFilesStatus] = useState("");

  // Pre-fill query parameters or fetch lead details by ID
  useEffect(() => {
    const fetchLeadAndPrefill = async () => {
      const qName = searchParams.get("name");
      const qEmail = searchParams.get("email");
      const qPhone = searchParams.get("phone");
      const qCourse = searchParams.get("course");
      
      if (qName) setFullName(qName);
      if (qEmail) setEmail(qEmail);
      if (qPhone) setPhone(qPhone);
      if (qCourse) setCourseApplied(qCourse);

      if (leadId) {
        try {
          const lead = await getLeadById(leadId);
          if (lead) {
            if (lead.name) setFullName(lead.name);
            if (lead.email) setEmail(lead.email);
            if (lead.phone) setPhone(lead.phone);
            if (lead.interestedCourse) setCourseApplied(lead.interestedCourse);
          }
        } catch (err) {
          console.error("Failed to prefill lead info:", err);
        }
      }
    };

    fetchLeadAndPrefill();
  }, [searchParams, leadId]);

  const handleFileChange = (type: keyof typeof files, file: File | null) => {
    if (!file) return;
    // Validate size: 5MB for images/docs, 20MB for CVs
    const maxSize = type === "cv" ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File size exceeds the limit (${type === "cv" ? "20MB" : "5MB"})`);
      return;
    }
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    setUploadingFilesStatus("");

    // Validation
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      setError("Please enter a valid mobile number (10-15 digits)");
      setLoading(false);
      return;
    }

    if (aadhaar && aadhaar.replace(/\D/g, "").length !== 12) {
      setError("Aadhaar number must be exactly 12 digits");
      setLoading(false);
      return;
    }

    try {
      // Create Candidate
      const res = await applyCandidate({
        fullName,
        email,
        phone,
        whatsappNumber,
        address,
        emergencyContact,
        qualification,
        bloodGroup,
        courseApplied,
        modeOfLearning,
        collegeName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : undefined,
        gender,
        referenceDetails,
        languagesKnown,
        parentGuardianName,
        parentGuardianOccupation,
        aadhaarNumber: aadhaar || undefined,
        registrationTransactionId,
        remarks,
        leadId,
      });

      const candId = res.id;
      setAppNumber(res.application_number);

      // Upload files sequentially
      const fileTypes: (keyof typeof files)[] = ["cv", "photo", "aadhaar", "college-id", "confirmation-letter"];
      for (const type of fileTypes) {
        const fileObj = files[type];
        if (fileObj) {
          setUploadingFilesStatus(`Uploading ${type.toUpperCase()}...`);
          await uploadCandidateDocument(candId, type, fileObj);
        }
      }

      setSuccessMsg("Application Submitted Successfully!");
      setUploadingFilesStatus("");
      
      // Clear form
      setFullName("");
      setEmail("");
      setPhone("");
      setWhatsappNumber("");
      setAddress("");
      setEmergencyContact("");
      setQualification("");
      setBloodGroup("");
      setCourseApplied("");
      setCollegeName("");
      setDateOfBirth("");
      setGender("");
      setReferenceDetails("");
      setLanguagesKnown("");
      setParentGuardianName("");
      setParentGuardianOccupation("");
      setAadhaar("");
      setRegistrationTransactionId("");
      setRemarks("");
      setFiles({});
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <div style={styles.header}>
          <h1 style={styles.title}>Candidate Admission Form</h1>
          <p style={styles.subtitle}>Fill in your details to apply for training & internship placement</p>
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}
        {successMsg && (
          <div style={styles.successBanner}>
            <h3 style={{ margin: "0 0 8px 0" }}>{successMsg}</h3>
            <p style={{ margin: 0, fontSize: "16px" }}>
              Your Application Number: <strong>{appNumber}</strong>
            </p>
            <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
              Please keep this reference number for future communication.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* PERSONAL DETAILS SECTION */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>1. Personal Information</h3>
            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  style={styles.input}
                />
              </div>

              <div style={styles.grid2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter mobile number"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.grid2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>WhatsApp Number</label>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Same as mobile or different"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Emergency Contact</label>
                  <input
                    type="tel"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="Emergency contact number"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.grid3}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Blood Group</label>
                  <input
                    type="text"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    placeholder="e.g. O+ve"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Permanent Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, State, ZIP code"
                  rows={2}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.grid2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Aadhaar Number (12 Digits)</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 12-digit Aadhaar number"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Languages Known</label>
                  <input
                    type="text"
                    value={languagesKnown}
                    onChange={(e) => setLanguagesKnown(e.target.value)}
                    placeholder="e.g. English, Hindi, Malayalam"
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ACADEMICS & COURSE SECTION */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>2. Course & Education</h3>
            <div style={styles.grid}>
              <div style={styles.grid2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Course Applied For *</label>
                  <select
                    required
                    value={courseApplied}
                    onChange={(e) => setCourseApplied(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select a Course</option>
                    <option value="Artificial Intelligence & Machine Learning">AI & Machine Learning</option>
                    <option value="Full Stack Web Development">Full Stack Web Development</option>
                    <option value="Data Science & Analytics">Data Science & Analytics</option>
                    <option value="Software Engineering & DevOps">Software Engineering & DevOps</option>
                    <option value="Cyber Security">Cyber Security</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Mode of Learning *</label>
                  <select
                    value={modeOfLearning}
                    onChange={(e) => setModeOfLearning(e.target.value)}
                    style={styles.select}
                  >
                    <option value="Offline">Offline / Classroom</option>
                    <option value="Online">Online / Live Virtual</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div style={styles.grid2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Highest Qualification</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. B.Tech CSE, MCA, BCA"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>College / Institution Name</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="Enter college name"
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GUARDIAN & REFERENCES */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>3. Guardian & References</h3>
            <div style={styles.grid}>
              <div style={styles.grid2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={parentGuardianName}
                    onChange={(e) => setParentGuardianName(e.target.value)}
                    placeholder="Guardian's full name"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Guardian's Occupation</label>
                  <input
                    type="text"
                    value={parentGuardianOccupation}
                    onChange={(e) => setParentGuardianOccupation(e.target.value)}
                    placeholder="Guardian's profession"
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.grid2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Registration Transaction ID (If Paid)</label>
                  <input
                    type="text"
                    value={registrationTransactionId}
                    onChange={(e) => setRegistrationTransactionId(e.target.value)}
                    placeholder="e.g. UPI / Bank Transaction ID"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>How did you hear about us?</label>
                  <input
                    type="text"
                    value={referenceDetails}
                    onChange={(e) => setReferenceDetails(e.target.value)}
                    placeholder="Google, Friend referral, Campus drive etc."
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DOCUMENT UPLOADS */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>4. Documents (PDF or Images, Max 5MB / CV 20MB)</h3>
            <div style={styles.grid}>
              <div style={styles.fileGrid}>
                <div style={styles.fileBox}>
                  <label style={styles.fileLabel}>Resume / CV (PDF Only)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange("cv", e.target.files?.[0] || null)}
                    style={styles.fileInput}
                  />
                  {files.cv && <span style={styles.fileName}>{files.cv.name}</span>}
                </div>

                <div style={styles.fileBox}>
                  <label style={styles.fileLabel}>Passport Photo (JPG/PNG)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("photo", e.target.files?.[0] || null)}
                    style={styles.fileInput}
                  />
                  {files.photo && <span style={styles.fileName}>{files.photo.name}</span>}
                </div>

                <div style={styles.fileBox}>
                  <label style={styles.fileLabel}>Aadhaar Card (PDF/Image)</label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange("aadhaar", e.target.files?.[0] || null)}
                    style={styles.fileInput}
                  />
                  {files.aadhaar && <span style={styles.fileName}>{files.aadhaar.name}</span>}
                </div>

                <div style={styles.fileBox}>
                  <label style={styles.fileLabel}>College ID Card (Optional)</label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange("college-id", e.target.files?.[0] || null)}
                    style={styles.fileInput}
                  />
                  {files["college-id"] && <span style={styles.fileName}>{files["college-id"].name}</span>}
                </div>

                <div style={styles.fileBox}>
                  <label style={styles.fileLabel}>Confirmation Letter (Optional)</label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange("confirmation-letter", e.target.files?.[0] || null)}
                    style={styles.fileInput}
                  />
                  {files["confirmation-letter"] && <span style={styles.fileName}>{files["confirmation-letter"].name}</span>}
                </div>
              </div>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Additional Remarks / Cover Note</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Any other message for the admissions team..."
              rows={3}
              style={styles.textarea}
            />
          </div>

          {uploadingFilesStatus && (
            <div style={styles.uploadProgress}>
              <div style={styles.spinner}></div>
              <span>{uploadingFilesStatus}</span>
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Submitting Application..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Styling System
// -------------------------------------------------------------
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    fontFamily: "'Outfit', 'Inter', sans-serif",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  glassCard: {
    width: "100%",
    maxWidth: "900px",
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
    color: "#f8fafc",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    paddingBottom: "24px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    margin: "0 0 8px 0",
    background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "16px",
    color: "#94a3b8",
    margin: 0,
  },
  errorBanner: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fca5a5",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "32px",
    fontSize: "15px",
  },
  successBanner: {
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    color: "#a7f3d0",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "32px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#3b82f6",
    margin: "0 0 8px 0",
    borderLeft: "4px solid #3b82f6",
    paddingLeft: "12px",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#cbd5e1",
  },
  input: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#f8fafc",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s, background-color 0.2s",
  },
  select: {
    background: "#1e293b",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#f8fafc",
    fontSize: "15px",
    outline: "none",
    cursor: "pointer",
  },
  textarea: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#f8fafc",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  fileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
  },
  fileBox: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px dashed rgba(255, 255, 255, 0.15)",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center",
    textAlign: "center",
  },
  fileLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#94a3b8",
  },
  fileInput: {
    width: "100%",
    fontSize: "12px",
    color: "#94a3b8",
    cursor: "pointer",
  },
  fileName: {
    fontSize: "12px",
    color: "#3b82f6",
    wordBreak: "break-all",
  },
  uploadProgress: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    color: "#94a3b8",
    fontSize: "14px",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255,255,255,0.1)",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s infinite linear",
  },
  submitBtn: {
    background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "16px 32px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
    transition: "transform 0.1s, box-shadow 0.2s",
    textAlign: "center",
    marginTop: "16px",
  },
};
