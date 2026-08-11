import React, { useState, useEffect, useRef } from "react";
import {
  listCandidates,
  getCandidateById,
  updateCandidateStatus,
  getNotifications,
  markNotificationsRead,
  uploadCandidateDocument,
  softDeleteCandidate,
  restoreCandidate,
  hardDeleteCandidate,
  regenerateCertificate,
  bulkRegenerateCertificates,
  bulkHardDeleteCandidates,
  bulkSoftDeleteCandidates,
  recordCandidatePayment,
  updateCandidatePersonalInfo,
  updateCandidateAcademicInfo,
  updateCandidateProfessionalInfo,
  updateCandidateProgramInfo,
  updateCandidateFeeInfo,
  updateCandidateCertificateInfo,
  getProgramOptions,
} from "../../../../services/candidateService";
import type { Candidate, AdminNotification, ProgramOption } from "../../../../services/candidateService";
import { getCourses } from "../../../../services/courseService";
import type { Course } from "../../../../services/courseService";
import CandidatesImport from "./CandidatesImport";
import CandidatesImportHistory from "./CandidatesImportHistory";
import CandidatesExportModal from "./CandidatesExportModal";

export default function CandidatesAdmin() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [programOptions, setProgramOptions] = useState<ProgramOption[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Selected Candidate for detail drawer
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Note/Status actions
  const [statusUpdateVal, setStatusUpdateVal] = useState("");
  const [courseStartDateVal, setCourseStartDateVal] = useState("");
  const [completedAtVal, setCompletedAtVal] = useState("");
  const [courseDurationVal, setCourseDurationVal] = useState("");
  const [performanceVal, setPerformanceVal] = useState("");
  const [programTypeVal, setProgramTypeVal] = useState("");
  const [courseAppliedVal, setCourseAppliedVal] = useState("");
  const [programmeDomainVal, setProgrammeDomainVal] = useState("");
  const [collegeNameVal, setCollegeNameVal] = useState("");

  const [coursesList, setCoursesList] = useState<Course[]>([]);

  // Manual payment fields
  const [paymentAmountVal, setPaymentAmountVal] = useState("");
  const [paymentTypeVal, setPaymentTypeVal] = useState("Admission Fee");
  const [paymentMethodVal, setPaymentMethodVal] = useState("Cash");
  const [paymentTransactionIdVal, setPaymentTransactionIdVal] = useState("");
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);

  // Section-based Editing State & Form Data
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState<any>({});
  const [savingPersonal, setSavingPersonal] = useState(false);

  const [editingAcademic, setEditingAcademic] = useState(false);
  const [academicForm, setAcademicForm] = useState<any>({});
  const [savingAcademic, setSavingAcademic] = useState(false);

  const [editingProfessional, setEditingProfessional] = useState(false);
  const [professionalForm, setProfessionalForm] = useState<any>({});
  const [savingProfessional, setSavingProfessional] = useState(false);

  const [editingProgram, setEditingProgram] = useState(false);
  const [programForm, setProgramForm] = useState<any>({});
  const [savingProgram, setSavingProgram] = useState(false);
  const [isCustomCourseInProgram, setIsCustomCourseInProgram] = useState(false);

  const [editingFee, setEditingFee] = useState(false);
  const [feeForm, setFeeForm] = useState<any>({});
  const [savingFee, setSavingFee] = useState(false);

  const [editingCertMeta, setEditingCertMeta] = useState(false);
  const [certMetaForm, setCertMetaForm] = useState<any>({});
  const [savingCertMeta, setSavingCertMeta] = useState(false);

  const initSectionForms = (c: Candidate) => {
    setPersonalForm({
      fullName: c.fullName || "",
      preferredName: c.preferredName || "",
      gender: c.gender || "",
      dateOfBirth: c.dateOfBirth ? c.dateOfBirth.split("T")[0] : "",
      email: c.email || "",
      phone: c.phone || "",
      whatsappNumber: c.whatsappNumber || "",
      aadhaarNumber: "",
      panNumber: c.panNumber || "",
      address: c.address || "",
      city: c.city || "",
      district: c.district || "",
      state: c.state || "",
      country: c.country || "",
      pincode: c.pincode || "",
      emergencyContact: c.emergencyContact || "",
      parentGuardianName: c.parentGuardianName || "",
      parentGuardianOccupation: c.parentGuardianOccupation || "",
      parentGuardianPhone: c.parentGuardianPhone || "",
      parentGuardianRelationship: c.parentGuardianRelationship || "",
    });

    setAcademicForm({
      sslcDetails: c.sslcDetails || "",
      plusTwoDetails: c.plusTwoDetails || "",
      diplomaDetails: c.diplomaDetails || "",
      ugDetails: c.ugDetails || "",
      pgDetails: c.pgDetails || "",
      universityName: c.universityName || "",
      collegeName: c.collegeName || "",
      qualification: c.qualification || "",
      academicPercentage: c.academicPercentage != null ? String(c.academicPercentage) : "",
      academicCgpa: c.academicCgpa != null ? String(c.academicCgpa) : "",
      passingYear: c.passingYear || "",
      academicStatus: c.academicStatus || "Passed Out",
    });

    setProfessionalForm({
      experienceYears: c.experienceYears || "",
      companyName: c.companyName || "",
      skills: c.skills || "",
      cvUrl: c.cvUrl || "",
      linkedinUrl: c.linkedinUrl || "",
      portfolioUrl: c.portfolioUrl || "",
    });

    setProgramForm({
      programType: c.programType || "",
      courseApplied: c.courseApplied || "",
      batchName: c.batchName || "",
      trainerName: c.trainerName || "",
      courseStartDate: c.courseStartDate ? c.courseStartDate.split("T")[0] : "",
      completedAt: c.completedAt ? c.completedAt.split("T")[0] : "",
      courseDuration: c.courseDuration || "",
      modeOfLearning: c.modeOfLearning || "Offline",
      trainingLocation: c.trainingLocation || "",
      programmeDomain: c.programmeDomain || "",
    });
    if (c.courseApplied && coursesList.length > 0) {
      setIsCustomCourseInProgram(!coursesList.some(crs => crs.title === c.courseApplied));
    }

    setFeeForm({
      standardCourseFee: c.standardCourseFee || 0,
      scholarshipAmount: c.scholarshipAmount || 0,
      specialDiscount: c.specialDiscount || 0,
      corporateDiscount: c.corporateDiscount || 0,
      promoDiscount: c.promoDiscount || 0,
      gstPercentage: c.gstPercentage || 0,
      gstAmount: c.gstAmount || 0,
      convenienceFee: c.convenienceFee || 0,
      bookingAmount: c.bookingAmount || 0,
      admissionFeeAmount: c.admissionFeeAmount || 250,
      offerRemarks: c.offerRemarks || "",
      offerExpiryDate: c.offerExpiryDate ? c.offerExpiryDate.split("T")[0] : "",
      admissionFeePaid: c.admissionFeePaid === true,
      autoEnrollEnabled: c.autoEnrollEnabled !== false,
    });

    setCertMetaForm({
      certificateProgramType: c.certificateProgramType || "",
      certificateCourseName: c.certificateCourseName || "",
      certificatePartner: c.certificatePartner || "",
      certificateTopics: c.certificateTopics || "",
      certificateDomain: c.certificateDomain || "",
      certificateDuration: c.certificateDuration || "",
      certificateMode: c.certificateMode || "",
      certificateTitleOverride: c.certificateTitleOverride || "",
      certificateBodyOverride: c.certificateBodyOverride || "",
      certificateCompletionDate: c.certificateCompletionDate ? c.certificateCompletionDate.split("T")[0] : "",
      certificateIssueDate: c.certificateIssueDate ? c.certificateIssueDate.split("T")[0] : "",
    });
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Document Uploads
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileUpload = (docType: string) => {
    setUploadingDocType(docType);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChangeAction = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCandidate || !uploadingDocType) return;

    setActionLoading(true);
    try {
      await uploadCandidateDocument(selectedCandidate.id, uploadingDocType as any, file);
      // Reload candidate detail
      await loadSelectedCandidate(selectedCandidate.id);
      // Reload list to update document status badge
      await loadCandidates();
    } catch (err) {
      console.error("Failed to upload document:", err);
      alert("Failed to upload document. Please try again.");
    } finally {
      setActionLoading(false);
      setUploadingDocType(null);
    }
  };

  const [activeTab, setActiveTab] = useState<"list" | "import" | "import-history" | "trash">("list");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab]);

  // Notifications
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadProgramOptions = async () => {
    try {
      const options = await getProgramOptions();
      setProgramOptions(options);
    } catch (err) {
      console.error("Failed to load program options:", err);
    }
  };

  // Load candidate list
  const loadCandidates = async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * limit;
      const res = await listCandidates({
        search,
        status: statusFilter,
        course: courseFilter,
        startDate,
        endDate,
        skip,
        limit,
        isDeleted: activeTab === "trash",
      });
      setCandidates(res.records);
      setTotal(res.total);
      await loadProgramOptions();
    } catch (err) {
      console.error("Failed to load candidates:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load detailed candidate
  const loadSelectedCandidate = async (id: string) => {
    setDetailLoading(true);
    try {
      const c = await getCandidateById(id);
      setSelectedCandidate(c);
      initSectionForms(c);
      setStatusUpdateVal((c.applicationStatus || "").toLowerCase());
      setCourseStartDateVal(c.courseStartDate ? c.courseStartDate.split("T")[0] : "");
      setCompletedAtVal(c.completedAt ? c.completedAt.split("T")[0] : "");
      setCourseDurationVal(c.courseDuration || "");
      const normalizePerformance = (p?: string) => {
        if (!p) return "";
        const lower = p.toLowerCase();
        if (lower === "excellent") return "Excellent";
        if (lower === "good") return "Good";
        if (lower === "average") return "Average";
        if (lower === "satisfactory") return "Satisfactory";
        return p;
      };
      const normalizeProgramType = (pt?: string) => {
        if (!pt) return "";
        const lower = pt.toLowerCase();
        if (lower === "course") return "Course";
        if (lower === "internship") return "Internship";
        if (lower === "crash course") return "Crash Course";
        if (lower === "webinar") return "Webinar";
        if (lower === "workshop") return "Workshop";
        if (lower === "faculty development programme" || lower === "faculty development program" || lower === "fdp") return "Faculty Development Programme";
        return pt;
      };
      setPerformanceVal(normalizePerformance(c.performance));
      setProgramTypeVal(normalizeProgramType(c.programType));
      setCourseAppliedVal(c.courseApplied || "");
      setProgrammeDomainVal(c.programmeDomain || "");
      setCollegeNameVal(c.collegeName || "");


    } catch (err) {
      console.error("Failed to load candidate detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSavePersonalSection = async () => {
    if (!selectedCandidate) return;
    setSavingPersonal(true);
    try {
      const payload: any = {
        full_name: personalForm.fullName,
        preferred_name: personalForm.preferredName || null,
        gender: personalForm.gender || null,
        date_of_birth: personalForm.dateOfBirth ? new Date(personalForm.dateOfBirth).toISOString() : null,
        email: personalForm.email,
        phone: personalForm.phone,
        whatsapp_number: personalForm.whatsappNumber || null,
        pan_number: personalForm.panNumber || null,
        address: personalForm.address || null,
        city: personalForm.city || null,
        district: personalForm.district || null,
        state: personalForm.state || null,
        country: personalForm.country || null,
        pincode: personalForm.pincode || null,
        emergency_contact: personalForm.emergencyContact || null,
        parent_guardian_name: personalForm.parentGuardianName || null,
        parent_guardian_occupation: personalForm.parentGuardianOccupation || null,
        parent_guardian_phone: personalForm.parentGuardianPhone || null,
        parent_guardian_relationship: personalForm.parentGuardianRelationship || null,
      };
      if (personalForm.aadhaarNumber && personalForm.aadhaarNumber.trim()) {
        payload.aadhaar_number = personalForm.aadhaarNumber.trim();
      }

      const updated = await updateCandidatePersonalInfo(selectedCandidate.id, payload);
      setSelectedCandidate(updated);
      initSectionForms(updated);
      setEditingPersonal(false);
      showToast("Personal information updated successfully!", "success");
      await loadCandidates();
    } catch (err: any) {
      console.error("Failed to update personal info:", err);
      alert(err.response?.data?.detail || "Failed to update personal info.");
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleSaveAcademicSection = async () => {
    if (!selectedCandidate) return;
    setSavingAcademic(true);
    try {
      const payload: any = {
        sslc_details: academicForm.sslcDetails || null,
        plus_two_details: academicForm.plusTwoDetails || null,
        diploma_details: academicForm.diplomaDetails || null,
        ug_details: academicForm.ugDetails || null,
        pg_details: academicForm.pgDetails || null,
        university_name: academicForm.universityName || null,
        college_name: academicForm.collegeName || null,
        qualification: academicForm.qualification || null,
        academic_percentage: academicForm.academicPercentage ? parseFloat(academicForm.academicPercentage) : null,
        academic_cgpa: academicForm.academicCgpa ? parseFloat(academicForm.academicCgpa) : null,
        passing_year: academicForm.passingYear || null,
        academic_status: academicForm.academicStatus || null,
      };

      const updated = await updateCandidateAcademicInfo(selectedCandidate.id, payload);
      setSelectedCandidate(updated);
      initSectionForms(updated);
      setEditingAcademic(false);
      showToast("Academic information updated successfully!", "success");
      await loadCandidates();
    } catch (err: any) {
      console.error("Failed to update academic info:", err);
      alert(err.response?.data?.detail || "Failed to update academic info.");
    } finally {
      setSavingAcademic(false);
    }
  };

  const handleSaveProfessionalSection = async () => {
    if (!selectedCandidate) return;
    setSavingProfessional(true);
    try {
      const payload: any = {
        experience_years: professionalForm.experienceYears || null,
        company_name: professionalForm.companyName || null,
        skills: professionalForm.skills || null,
        cv_url: professionalForm.cvUrl || null,
        linkedin_url: professionalForm.linkedinUrl || null,
        portfolio_url: professionalForm.portfolioUrl || null,
      };

      const updated = await updateCandidateProfessionalInfo(selectedCandidate.id, payload);
      setSelectedCandidate(updated);
      initSectionForms(updated);
      setEditingProfessional(false);
      showToast("Professional information updated successfully!", "success");
      await loadCandidates();
    } catch (err: any) {
      console.error("Failed to update professional info:", err);
      alert(err.response?.data?.detail || "Failed to update professional info.");
    } finally {
      setSavingProfessional(false);
    }
  };

  const handleSaveProgramSection = async () => {
    if (!selectedCandidate) return;
    setSavingProgram(true);
    try {
      const payload: any = {
        program_type: programForm.programType || null,
        course_applied: programForm.courseApplied || null,
        batch_name: programForm.batchName || null,
        trainer_name: programForm.trainerName || null,
        course_start_date: programForm.courseStartDate ? new Date(programForm.courseStartDate).toISOString() : null,
        completed_at: programForm.completedAt ? new Date(programForm.completedAt).toISOString() : null,
        course_duration: programForm.courseDuration || null,
        mode_of_learning: programForm.modeOfLearning || null,
        training_location: programForm.trainingLocation || null,
        programme_domain: programForm.programmeDomain || null,
      };

      const updated = await updateCandidateProgramInfo(selectedCandidate.id, payload);
      setSelectedCandidate(updated);
      initSectionForms(updated);
      setEditingProgram(false);
      showToast("Program information updated successfully!", "success");
      await loadCandidates();
    } catch (err: any) {
      console.error("Failed to update program info:", err);
      alert(err.response?.data?.detail || "Failed to update program info.");
    } finally {
      setSavingProgram(false);
    }
  };

  const handleSaveFeeSection = async () => {
    if (!selectedCandidate) return;
    setSavingFee(true);
    try {
      const payload: any = {
        standard_course_fee: parseFloat(feeForm.standardCourseFee || 0),
        scholarship_amount: parseFloat(feeForm.scholarshipAmount || 0),
        special_discount: parseFloat(feeForm.specialDiscount || 0),
        corporate_discount: parseFloat(feeForm.corporateDiscount || 0),
        promo_discount: parseFloat(feeForm.promoDiscount || 0),
        gst_percentage: parseFloat(feeForm.gstPercentage || 0),
        gst_amount: parseFloat(feeForm.gstAmount || 0),
        convenience_fee: parseFloat(feeForm.convenienceFee || 0),
        booking_amount: parseFloat(feeForm.bookingAmount || 0),
        admission_fee_amount: parseFloat(feeForm.admissionFeeAmount || 250),
        offer_remarks: feeForm.offerRemarks || null,
        offer_expiry_date: feeForm.offerExpiryDate ? new Date(feeForm.offerExpiryDate).toISOString() : null,
        admission_fee_paid: feeForm.admissionFeePaid === true,
        auto_enroll_enabled: feeForm.autoEnrollEnabled !== false,
      };

      const updated = await updateCandidateFeeInfo(selectedCandidate.id, payload);
      setSelectedCandidate(updated);
      initSectionForms(updated);
      setEditingFee(false);
      showToast("Fee details updated successfully!", "success");
      await loadCandidates();
    } catch (err: any) {
      console.error("Failed to update fee info:", err);
      alert(err.response?.data?.detail || "Failed to update fee info.");
    } finally {
      setSavingFee(false);
    }
  };

  const handleSaveCertMetaSection = async () => {
    if (!selectedCandidate) return;
    setSavingCertMeta(true);
    try {
      const payload: any = {
        certificate_program_type: certMetaForm.certificateProgramType || null,
        certificate_course_name: certMetaForm.certificateCourseName || null,
        certificate_partner: certMetaForm.certificatePartner || null,
        certificate_topics: certMetaForm.certificateTopics || null,
        certificate_domain: certMetaForm.certificateDomain || null,
        certificate_duration: certMetaForm.certificateDuration || null,
        certificate_mode: certMetaForm.certificateMode || null,
        certificate_title_override: certMetaForm.certificateTitleOverride || null,
        certificate_body_override: certMetaForm.certificateBodyOverride || null,
        certificate_completion_date: certMetaForm.certificateCompletionDate ? new Date(certMetaForm.certificateCompletionDate).toISOString() : null,
        certificate_issue_date: certMetaForm.certificateIssueDate ? new Date(certMetaForm.certificateIssueDate).toISOString() : null,
      };

      const updated = await updateCandidateCertificateInfo(selectedCandidate.id, payload);
      setSelectedCandidate(updated);
      initSectionForms(updated);
      setEditingCertMeta(false);
      showToast("Certificate overrides updated successfully!", "success");
      await loadCandidates();
    } catch (err: any) {
      console.error("Failed to update certificate metadata overrides:", err);
      alert(err.response?.data?.detail || "Failed to update certificate overrides.");
    } finally {
      setSavingCertMeta(false);
    }
  };

  // Custom confirm dialog trigger helper
  const showConfirm = (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void | Promise<void>;
  }) => {
    setConfirmDialog({
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
      isDanger: options.isDanger || false,
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        await options.onConfirm();
      }
    });
  };

  // Trash actions
  const handleSoftDelete = async () => {
    if (!selectedCandidate) return;
    showConfirm({
      title: "Move to Trash",
      message: "Are you sure you want to move this candidate application to trash?",
      confirmText: "Move to Trash",
      isDanger: true,
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await softDeleteCandidate(selectedCandidate.id);
          setSelectedCandidateId(null);
          await loadCandidates();
          showToast("Candidate moved to trash", "success");
        } catch (err) {
          console.error("Failed to soft delete candidate:", err);
          alert("Failed to move candidate to trash.");
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  const handleRestore = async () => {
    if (!selectedCandidate) return;
    setIsRestoring(true);
    try {
      await restoreCandidate(selectedCandidate.id);
      setSelectedCandidateId(null);
      await loadCandidates();
      showToast("Candidate restored successfully", "success");
    } catch (err) {
      console.error("Failed to restore candidate:", err);
      alert("Failed to restore candidate.");
    } finally {
      setIsRestoring(false);
    }
  };

  const handlePermanentDelete = async () => {
    if (!selectedCandidate) return;
    showConfirm({
      title: "⚠️ Permanent Deletion",
      message: "WARNING: Are you sure you want to PERMANENTLY delete this candidate application? This action CANNOT be undone.",
      confirmText: "Delete Permanently",
      isDanger: true,
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await hardDeleteCandidate(selectedCandidate.id);
          setSelectedCandidateId(null);
          await loadCandidates();
          showToast("Candidate permanently deleted", "success");
        } catch (err) {
          console.error("Failed to permanently delete candidate:", err);
          alert("Failed to delete candidate permanently.");
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (candidates.length === 0) return;
    if (selectedIds.length === candidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(candidates.map((c) => c.id));
    }
  };

  const handleBulkRegenerateCertificates = async () => {
    if (selectedIds.length === 0) return;
    showConfirm({
      title: "Regenerate Certificates",
      message: `Are you sure you want to regenerate certificates for the ${selectedIds.length} selected candidate(s)?`,
      confirmText: "Regenerate",
      onConfirm: async () => {
        setIsRegenerating(true);
        try {
          const res = await bulkRegenerateCertificates(selectedIds);
          alert(`Bulk certificate regeneration complete.\nProcessed: ${res.processed}\nSuccessful: ${res.success_count}\nFailed: ${res.failed_count}`);
          setSelectedIds([]);
          await loadCandidates();
        } catch (err) {
          console.error("Failed bulk certificate regeneration:", err);
          alert("Failed to run bulk certificate regeneration.");
        } finally {
          setIsRegenerating(false);
        }
      }
    });
  };

  const handleBulkPermanentDelete = async () => {
    if (selectedIds.length === 0) return;
    showConfirm({
      title: "⚠️ Bulk Permanent Deletion",
      message: `WARNING: Are you sure you want to PERMANENTLY delete the ${selectedIds.length} selected candidate(s)? This action is IRREVERSIBLE and will also delete all uploaded candidate documents and generated certificates from storage!`,
      confirmText: "Delete Permanently",
      isDanger: true,
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await bulkHardDeleteCandidates(selectedIds);
          alert(`Successfully deleted the selected candidates and cleaned up all associated storage files.`);
          setSelectedIds([]);
          await loadCandidates();
        } catch (err) {
          console.error("Failed bulk permanent delete:", err);
          alert("Failed to permanently delete the selected candidates.");
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  const handleBulkSoftDelete = async () => {
    if (selectedIds.length === 0) return;
    showConfirm({
      title: "Move Selected to Trash",
      message: `Are you sure you want to move the ${selectedIds.length} selected candidate(s) to trash?`,
      confirmText: "Move to Trash",
      isDanger: true,
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await bulkSoftDeleteCandidates(selectedIds);
          alert(`Successfully moved ${selectedIds.length} candidates to trash.`);
          setSelectedIds([]);
          await loadCandidates();
        } catch (err) {
          console.error("Failed bulk soft delete:", err);
          alert("Failed to move selected candidates to trash.");
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  const handleRegenerateSingle = async (id: string) => {
    showConfirm({
      title: "Regenerate Certificate",
      message: "Are you sure you want to regenerate the certificate for this candidate?",
      confirmText: "Regenerate",
      onConfirm: async () => {
        setIsRegenerating(true);
        try {
          await regenerateCertificate(id);
          showToast("Certificate regenerated successfully.", "success");
          // Refresh selected candidate detail
          if (selectedCandidateId === id) {
            const updated = await getCandidateById(id);
            setSelectedCandidate(updated);
          }
          await loadCandidates();
        } catch (err: any) {
          console.error("Failed to regenerate certificate:", err);
          const detail = err.response?.data?.detail || "Failed to regenerate certificate.";
          alert(detail);
        } finally {
          setIsRegenerating(false);
        }
      }
    });
  };

  // Load Notifications
  const loadNotifications = async () => {
    try {
      const list = await getNotifications();
      setNotifications(list);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [search, statusFilter, courseFilter, startDate, endDate, page, activeTab]);

  useEffect(() => {
    if (selectedCandidateId) {
      loadSelectedCandidate(selectedCandidateId);
    } else {
      setSelectedCandidate(null);
    }
  }, [selectedCandidateId]);

  useEffect(() => {
    loadNotifications();
    const timer = setInterval(loadNotifications, 30000); // refresh notifications every 30 seconds
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const list = await getCourses();
        setCoursesList(list || []);
      } catch (err) {
        console.error("Failed to fetch courses for prefilling:", err);
      }
    };
    fetchCourses();
  }, []);

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    if (statusUpdateVal.toLowerCase() === "completed") {
      if (!programTypeVal) {
        alert("Program Type is required before marking status as Completed.");
        return;
      }
      if (programTypeVal !== "Faculty Development Programme" && !performanceVal) {
        alert("Performance is required before marking status as Completed.");
        return;
      }
      if (programTypeVal === "Faculty Development Programme") {
        if (!programmeDomainVal || !programmeDomainVal.trim()) {
          alert("Programme Domain is required for Faculty Development Programme.");
          return;
        }
        if (!collegeNameVal || !collegeNameVal.trim()) {
          alert("College / Institution Name is required for Faculty Development Programme.");
          return;
        }
      }
    }
    setIsUpdatingStatus(true);
    try {
      await updateCandidateStatus(
        selectedCandidate.id,
        statusUpdateVal,
        courseStartDateVal ? new Date(courseStartDateVal).toISOString() : undefined,
        completedAtVal ? new Date(completedAtVal).toISOString() : undefined,
        courseDurationVal || undefined,
        performanceVal || undefined,
        programTypeVal || undefined,
        courseAppliedVal || undefined,
        programmeDomainVal || undefined,
        collegeNameVal || undefined
      );
      await loadSelectedCandidate(selectedCandidate.id);
      await loadCandidates();
      showToast("Admission status updated successfully!", "success");
    } catch (err: any) {
      console.error("Failed to update status:", err);
      const detail = err.response?.data?.detail || "Failed to update status.";
      alert(detail);
    } finally {
      setIsUpdatingStatus(false);
    }
  };



  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    const amountNum = parseFloat(paymentAmountVal);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid positive payment amount.");
      return;
    }
    setIsRecordingPayment(true);
    try {
      const updated = await recordCandidatePayment(selectedCandidate.id, {
        amount: amountNum,
        payment_type: paymentTypeVal,
        payment_method: paymentMethodVal,
        transaction_id: paymentTransactionIdVal || undefined,
      });
      setSelectedCandidate(updated);
      setPaymentAmountVal("");
      setPaymentTransactionIdVal("");
      await loadCandidates();
      showToast("Payment recorded successfully!", "success");
    } catch (err: any) {
      console.error("Failed to record payment:", err);
      const detail = err.response?.data?.detail || "Failed to record payment.";
      alert(detail);
    } finally {
      setIsRecordingPayment(false);
    }
  };

  const handleMarkNotificationsRead = async () => {
    try {
      await markNotificationsRead();
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={styles.adminContainer}>
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: toast.type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          zIndex: 99999,
          fontWeight: '600'
        }}>
          {toast.message}
        </div>
      )}
      {/* Top Navigation & Notifications bar */}
      <div className="admin-top-header">
        <div className="admin-tab-buttons">
          <button
            onClick={() => {
              setActiveTab("list");
              setSelectedCandidateId(null);
            }}
            style={{
              ...styles.tabBtn,
              ...(activeTab === "list" ? styles.activeTabBtn : {}),
            }}
          >
            Candidates List
          </button>
          <button
            onClick={() => {
              setActiveTab("import");
              setSelectedCandidateId(null);
            }}
            style={{
              ...styles.tabBtn,
              ...(activeTab === "import" ? styles.activeTabBtn : {}),
            }}
          >
            Excel Batch Import
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            style={{
              ...styles.tabBtn,
              background: "rgba(59, 130, 246, 0.12)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              color: "#60a5fa",
              fontWeight: 600,
            }}
          >
            📥 Export Candidates
          </button>
          <button
            onClick={() => {
              setActiveTab("import-history");
              setSelectedCandidateId(null);
            }}
            style={{
              ...styles.tabBtn,
              ...(activeTab === "import-history" ? styles.activeTabBtn : {}),
            }}
          >
            Import History
          </button>
          <button
            onClick={() => {
              setActiveTab("trash");
              setSelectedCandidateId(null);
            }}
            style={{
              ...styles.tabBtn,
              ...(activeTab === "trash" ? styles.activeTabBtn : {}),
            }}
          >
            🗑️ Trash Bin
          </button>
        </div>

        <div className="admin-notif-wrapper">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) {
                handleMarkNotificationsRead();
              }
            }}
            style={styles.notifBtn}
          >
            🔔
            {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div style={styles.notifDropdown}>
              <div style={styles.notifHeader}>
                <strong>Admin Notifications</strong>
                {unreadCount > 0 && (
                  <button onClick={handleMarkNotificationsRead} style={styles.markReadBtn}>
                    Mark all read
                  </button>
                )}
              </div>
              <div style={styles.notifList}>
                {notifications.length === 0 ? (
                  <div style={styles.emptyNotif}>No notifications yet.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        ...styles.notifItem,
                        backgroundColor: n.isRead ? "transparent" : "rgba(59, 130, 246, 0.08)",
                      }}
                    >
                      <div style={styles.notifTitle}>{n.title}</div>
                      <div style={styles.notifMessage}>{n.message}</div>
                      <div style={styles.notifTime}>
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {activeTab === "import" && (
        <CandidatesImport onImportComplete={() => {
          setActiveTab("list");
          loadCandidates();
        }} />
      )}

      {activeTab === "import-history" && <CandidatesImportHistory />}
      {(activeTab === "list" || activeTab === "trash") && (
        <div style={{ width: "100%" }}>
          {selectedIds.length > 0 && !selectedCandidateId && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              padding: '16px 24px',
              marginBottom: '24px',
              background: activeTab === 'trash' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
              border: activeTab === 'trash' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              color: '#fff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: activeTab === 'trash' ? '#ef4444' : '#3b82f6' }}>check_box</span>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{selectedIds.length} candidate{selectedIds.length > 1 ? 's' : ''} selected</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {activeTab === 'list' && (
                  <>
                    <button
                      onClick={handleBulkRegenerateCertificates}
                      disabled={isRegenerating}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: isRegenerating ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        opacity: isRegenerating ? 0.7 : 1
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>workspace_premium</span>
                      {isRegenerating ? "Regenerating..." : "Regenerate Certificates"}
                    </button>
                    <button
                      onClick={handleBulkSoftDelete}
                      disabled={isDeleting}
                      style={{
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        opacity: isDeleting ? 0.7 : 1
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                      {isDeleting ? "Deleting..." : "Move to Trash"}
                    </button>
                  </>
                )}

                {activeTab === 'trash' && (
                  <button
                    onClick={handleBulkPermanentDelete}
                    disabled={isDeleting}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: isDeleting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      opacity: isDeleting ? 0.7 : 1
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete_forever</span>
                    {isDeleting ? "Deleting..." : "Delete Permanently"}
                  </button>
                )}

                <button
                  onClick={() => setSelectedIds([])}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#94a3b8',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {!selectedCandidateId ? (
            /* Main List Section */
            <div className="list-section" style={{ width: "100%", minWidth: 0 }}>
              {/* Filters Bar */}
              <div className="admin-candidates-filter-bar" style={styles.filterBar}>
                <input
                  type="text"
                  className="admin-filter-search"
                  placeholder="Search name, email, phone or app number..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  style={styles.searchInput}
                />
                <select
                  className="admin-filter-select"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  style={styles.selectInput}
                >
                  <option value="">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Enrolled">Enrolled</option>
                </select>

                <select
                  className="admin-filter-select admin-course-filter-select"
                  value={courseFilter}
                  onChange={(e) => {
                    setCourseFilter(e.target.value);
                    setPage(1);
                  }}
                  style={styles.selectInput}
                >
                  <option value="">All Programs</option>
                  {programOptions.map((opt) => (
                    <option key={`${opt.name}-${opt.type}`} value={opt.name}>
                      {opt.name} {opt.type ? `(${opt.type})` : ""}
                    </option>
                  ))}
                </select>

                <div className="admin-filter-date-range" style={styles.dateRange}>
                  <input
                    type="date"
                    className="admin-filter-date-input"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setPage(1);
                    }}
                    style={styles.dateInput}
                  />
                  <span style={{ color: "#94a3b8" }}>to</span>
                  <input
                    type="date"
                    className="admin-filter-date-input"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setPage(1);
                    }}
                    style={styles.dateInput}
                  />
                </div>
              </div>

              {loading ? (
                <div style={styles.loader}>Loading candidates list...</div>
              ) : candidates.length === 0 ? (
                <div style={styles.emptyState}>No candidate records found.</div>
              ) : (
                <>
                  {/* Desktop View Table */}
                  <div className="candidate-table-wrapper candidate-table-container">
                    <table className="candidates-table">
                      <thead>
                        <tr>
                          <th style={{ width: "40px", textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={candidates.length > 0 && selectedIds.length === candidates.length}
                              onChange={handleSelectAll}
                              style={{ cursor: "pointer", width: "16px", height: "16px" }}
                            />
                          </th>
                          <th>App Number</th>
                          <th>Full Name</th>
                          <th>Course</th>
                          <th>Program</th>
                          <th>Status</th>
                          <th>Documents</th>
                          <th>Source</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map((c) => (
                          <tr
                            key={c.id}
                            onClick={() => setSelectedCandidateId(c.id)}
                            className={`${selectedCandidateId === c.id ? "selected" : ""} ${selectedIds.includes(c.id) ? "admin-selected-row" : ""}`}
                            style={selectedIds.includes(c.id) ? { background: "rgba(59, 130, 246, 0.05)" } : {}}
                          >
                            <td style={{ width: "40px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(c.id)}
                                onChange={() => handleSelectRow(c.id)}
                                style={{ cursor: "pointer", width: "16px", height: "16px" }}
                              />
                            </td>
                            <td style={{ fontWeight: "600", color: "#3b82f6" }}>{c.applicationNumber}</td>
                            <td>
                              <div style={{ fontWeight: "500" }}>{c.fullName}</div>
                              <div style={{ fontSize: "12px", color: "#64748b" }}>{c.email} • {c.phone}</div>
                            </td>
                            <td>{c.courseApplied}</td>
                            <td>{c.programType || "-"}</td>
                            <td>
                              <span
                                style={{
                                  ...styles.badgeStatus,
                                  ...getStatusBadgeStyle(c.applicationStatus),
                                }}
                              >
                                {c.applicationStatus}
                              </span>
                            </td>
                            <td>
                              <span
                                style={{
                                  ...styles.badgeDoc,
                                  ...getDocBadgeStyle(c.documentStatus),
                                }}
                              >
                                {c.documentStatus}
                              </span>
                            </td>
                            <td>{c.candidateSource}</td>
                            <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Responsive List Cards */}
                  <div className="candidate-mobile-cards">
                    {candidates.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCandidateId(c.id)}
                        style={{
                          ...styles.mobileCard,
                          borderColor: selectedCandidateId === c.id ? "#3b82f6" : selectedIds.includes(c.id) ? "rgba(59, 130, 246, 0.4)" : "rgba(255, 255, 255, 0.08)",
                          background: selectedIds.includes(c.id) ? "rgba(59, 130, 246, 0.03)" : styles.mobileCard.background,
                        }}
                      >
                        <div style={styles.cardHeader}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(c.id)}
                              onChange={() => handleSelectRow(c.id)}
                              style={{ cursor: "pointer", width: "16px", height: "16px" }}
                            />
                            <span style={styles.cardAppNum}>{c.applicationNumber}</span>
                          </div>
                          <span
                            style={{
                              ...styles.badgeStatus,
                              ...getStatusBadgeStyle(c.applicationStatus),
                            }}
                          >
                            {c.applicationStatus}
                          </span>
                        </div>
                        <div style={styles.cardName}>{c.fullName}</div>
                        <div style={styles.cardInfo}>{c.email} | {c.phone}</div>
                        <div style={styles.cardCourse}>
                          {c.courseApplied}
                          {c.programType && (
                            <span style={{
                              marginLeft: '8px',
                              padding: '2px 6px',
                              background: 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '4px',
                              fontSize: '11px',
                              color: '#94a3b8'
                            }}>
                              {c.programType}
                            </span>
                          )}
                        </div>
                        <div style={styles.cardFooter}>
                          <span
                            style={{
                              ...styles.badgeDoc,
                              ...getDocBadgeStyle(c.documentStatus),
                            }}
                          >
                            {c.documentStatus}
                          </span>
                          <span style={styles.cardDate}>
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div style={styles.pagination}>
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      style={styles.pageBtn}
                    >
                      Previous
                    </button>
                    <span style={styles.pageLabel}>
                      Page {page} of {Math.ceil(total / limit) || 1} ({total} total)
                    </span>
                    <button
                      disabled={page >= Math.ceil(total / limit)}
                      onClick={() => setPage(page + 1)}
                      style={styles.pageBtn}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Redesigned Full-Page Candidate Detail View */
            <div className="candidate-detail-view-container">
              {/* Sticky Header with Back Button */}
              <div className="candidate-detail-sticky-header">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCandidateId(null);
                  }}
                  className="candidate-detail-back-btn"
                >
                  ← Back to Candidates List
                </button>
                <h3 className="candidate-detail-title">Candidate Profile Details</h3>
              </div>

              {/* Summary Card - Primary UI Block */}
              <div className="candidate-primary-detail-card">
                {/* Top Row */}
                <div className="candidate-card-top-row">
                  <div className="candidate-caf-id">
                    {selectedCandidate?.applicationNumber || "CAF-N/A"}
                  </div>
                  <div className="candidate-card-badges">
                    <span
                      style={{
                        ...styles.badgeStatus,
                        ...getStatusBadgeStyle(selectedCandidate?.applicationStatus || ""),
                      }}
                    >
                      {selectedCandidate?.applicationStatus}
                    </span>
                    <span className="candidate-card-meta-label">
                      Created: {selectedCandidate ? new Date(selectedCandidate.createdAt).toLocaleDateString() : ""}
                    </span>
                    <span className="candidate-card-meta-label">
                      Source: {selectedCandidate?.candidateSource}
                    </span>
                  </div>
                </div>

                {/* Middle Row */}
                <div className="candidate-card-middle-section">
                  <h2 className="candidate-card-name-large">{selectedCandidate?.fullName}</h2>
                  <div className="candidate-card-contact-info">
                    <span>📧 {selectedCandidate?.email}</span>
                    <span className="candidate-contact-divider">•</span>
                    <span>📞 {selectedCandidate?.phone}</span>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="candidate-card-bottom-section">
                  <div className="candidate-card-course-container">
                    <span className="candidate-course-label">Course Applied For:</span>
                    <span className="candidate-course-value-highlight">
                      {selectedCandidate?.courseApplied}
                    </span>
                  </div>
                  <div className="candidate-card-doc-badge">
                    <span style={{ fontSize: "13px", color: "#cbd5e1" }}>Documents Status:</span>
                    <span
                      style={{
                        ...styles.badgeDoc,
                        ...getDocBadgeStyle(selectedCandidate?.documentStatus || ""),
                      }}
                    >
                      {selectedCandidate?.documentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {detailLoading ? (
                <div style={styles.drawerLoader}>Loading details...</div>
              ) : !selectedCandidate ? (
                <div style={styles.drawerLoader}>No candidate selected.</div>
              ) : (
                <div className="candidate-detail-columns">
                  {/* Left Column */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Status & Quick Actions */}
                    <div className="info-card-section">
                      <h4 style={{ color: "#8b5cf6" }}>Application Status</h4>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                        <span
                          style={{
                            ...styles.badgeStatus,
                            ...getStatusBadgeStyle(selectedCandidate.applicationStatus),
                          }}
                        >
                          Status: {selectedCandidate.applicationStatus}
                        </span>
                        <span
                          style={{
                            ...styles.badgeDoc,
                            ...getDocBadgeStyle(selectedCandidate.documentStatus),
                          }}
                        >
                          Docs: {selectedCandidate.documentStatus}
                        </span>
                        {selectedCandidate.nextFollowupAt && (
                          <span style={{ fontSize: "12px", color: "#f59e0b" }}>
                            Next Follow-up: {new Date(selectedCandidate.nextFollowupAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 1. Personal Information Card */}
                    <div className="info-card-section">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <h4 style={{ color: "#38bdf8", margin: 0 }}>Personal Information</h4>
                        {activeTab !== "trash" && (
                          !editingPersonal ? (
                            <button
                              type="button"
                              onClick={() => setEditingPersonal(true)}
                              style={{ background: "rgba(56, 189, 248, 0.12)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38bdf8", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                            >
                              ✏️ Edit Section
                            </button>
                          ) : (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                type="button"
                                onClick={() => { setEditingPersonal(false); initSectionForms(selectedCandidate); }}
                                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#94a3b8", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleSavePersonalSection}
                                disabled={savingPersonal}
                                style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", border: "none", color: "#fff", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                              >
                                {savingPersonal ? "Saving..." : "Save Personal"}
                              </button>
                            </div>
                          )
                        )}
                      </div>

                      {!editingPersonal ? (
                        <div className="details-grid-two-col">
                          <div className="info-item"><span className="label">Full Name</span><span className="value">{selectedCandidate.fullName}</span></div>
                          <div className="info-item"><span className="label">Preferred Name</span><span className="value">{selectedCandidate.preferredName || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Email</span><span className="value">{selectedCandidate.email}</span></div>
                          <div className="info-item"><span className="label">Mobile</span><span className="value">{selectedCandidate.phone}</span></div>
                          <div className="info-item"><span className="label">WhatsApp / Alt Mobile</span><span className="value">{selectedCandidate.whatsappNumber || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Emergency Contact</span><span className="value">{selectedCandidate.emergencyContact || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Date of Birth</span><span className="value">{selectedCandidate.dateOfBirth ? new Date(selectedCandidate.dateOfBirth).toLocaleDateString() : "N/A"}</span></div>
                          <div className="info-item"><span className="label">Gender</span><span className="value">{selectedCandidate.gender || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Blood Group</span><span className="value">{selectedCandidate.bloodGroup || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Aadhaar Number</span><span className="value">{selectedCandidate.aadhaarNumberMasked || "N/A"}</span></div>
                          <div className="info-item"><span className="label">PAN Number</span><span className="value">{selectedCandidate.panNumber || "N/A"}</span></div>
                          <div className="info-item"><span className="label">City</span><span className="value">{selectedCandidate.city || "N/A"}</span></div>
                          <div className="info-item"><span className="label">District</span><span className="value">{selectedCandidate.district || "N/A"}</span></div>
                          <div className="info-item"><span className="label">State</span><span className="value">{selectedCandidate.state || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Country</span><span className="value">{selectedCandidate.country || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Pincode</span><span className="value">{selectedCandidate.pincode || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Guardian Name</span><span className="value">{selectedCandidate.parentGuardianName || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Guardian Occupation</span><span className="value">{selectedCandidate.parentGuardianOccupation || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Guardian Phone</span><span className="value">{selectedCandidate.parentGuardianPhone || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Guardian Relationship</span><span className="value">{selectedCandidate.parentGuardianRelationship || "N/A"}</span></div>
                          <div className="info-item" style={{ gridColumn: "1 / -1" }}><span className="label">Address</span><span className="value">{selectedCandidate.address || "N/A"}</span></div>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Full Name *</label><input type="text" value={personalForm.fullName} onChange={e => setPersonalForm({...personalForm, fullName: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Preferred Name</label><input type="text" value={personalForm.preferredName} onChange={e => setPersonalForm({...personalForm, preferredName: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Email *</label><input type="email" value={personalForm.email} onChange={e => setPersonalForm({...personalForm, email: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Mobile Phone *</label><input type="text" value={personalForm.phone} onChange={e => setPersonalForm({...personalForm, phone: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>WhatsApp / Alt Mobile</label><input type="text" value={personalForm.whatsappNumber} onChange={e => setPersonalForm({...personalForm, whatsappNumber: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Emergency Contact</label><input type="text" value={personalForm.emergencyContact} onChange={e => setPersonalForm({...personalForm, emergencyContact: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Date of Birth</label><input type="date" value={personalForm.dateOfBirth} onChange={e => setPersonalForm({...personalForm, dateOfBirth: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Gender</label><select value={personalForm.gender} onChange={e => setPersonalForm({...personalForm, gender: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }}><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>New Aadhaar Number (12 Digits)</label><input type="text" placeholder="Update Aadhaar" value={personalForm.aadhaarNumber} onChange={e => setPersonalForm({...personalForm, aadhaarNumber: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>PAN Number</label><input type="text" placeholder="e.g. ABCDE1234F" value={personalForm.panNumber} onChange={e => setPersonalForm({...personalForm, panNumber: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>City</label><input type="text" value={personalForm.city} onChange={e => setPersonalForm({...personalForm, city: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>District</label><input type="text" value={personalForm.district} onChange={e => setPersonalForm({...personalForm, district: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>State</label><input type="text" value={personalForm.state} onChange={e => setPersonalForm({...personalForm, state: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Country</label><input type="text" value={personalForm.country} onChange={e => setPersonalForm({...personalForm, country: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Pincode</label><input type="text" value={personalForm.pincode} onChange={e => setPersonalForm({...personalForm, pincode: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Guardian Name</label><input type="text" value={personalForm.parentGuardianName} onChange={e => setPersonalForm({...personalForm, parentGuardianName: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Guardian Occupation</label><input type="text" value={personalForm.parentGuardianOccupation} onChange={e => setPersonalForm({...personalForm, parentGuardianOccupation: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Guardian Phone</label><input type="text" value={personalForm.parentGuardianPhone} onChange={e => setPersonalForm({...personalForm, parentGuardianPhone: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Guardian Relationship</label><input type="text" value={personalForm.parentGuardianRelationship} onChange={e => setPersonalForm({...personalForm, parentGuardianRelationship: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div style={{ gridColumn: "1 / -1" }}><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Address</label><textarea rows={2} value={personalForm.address} onChange={e => setPersonalForm({...personalForm, address: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px", resize: "none" }} /></div>
                        </div>
                      )}
                    </div>

                    {/* 2. Academic Information Card */}
                    <div className="info-card-section">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <h4 style={{ color: "#a855f7", margin: 0 }}>Academic Information</h4>
                        {activeTab !== "trash" && (
                          !editingAcademic ? (
                            <button
                              type="button"
                              onClick={() => setEditingAcademic(true)}
                              style={{ background: "rgba(168, 85, 247, 0.12)", border: "1px solid rgba(168, 85, 247, 0.3)", color: "#c084fc", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                            >
                              ✏️ Edit Section
                            </button>
                          ) : (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                type="button"
                                onClick={() => { setEditingAcademic(false); initSectionForms(selectedCandidate); }}
                                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#94a3b8", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveAcademicSection}
                                disabled={savingAcademic}
                                style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", border: "none", color: "#fff", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                              >
                                {savingAcademic ? "Saving..." : "Save Academic"}
                              </button>
                            </div>
                          )
                        )}
                      </div>

                      {!editingAcademic ? (
                        <div className="details-grid-two-col">
                          <div className="info-item"><span className="label">Qualification</span><span className="value">{selectedCandidate.qualification || "N/A"}</span></div>
                          <div className="info-item"><span className="label">College Name</span><span className="value">{selectedCandidate.collegeName || "N/A"}</span></div>
                          <div className="info-item"><span className="label">University</span><span className="value">{selectedCandidate.universityName || "N/A"}</span></div>
                          <div className="info-item"><span className="label">SSLC</span><span className="value">{selectedCandidate.sslcDetails || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Plus Two</span><span className="value">{selectedCandidate.plusTwoDetails || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Diploma</span><span className="value">{selectedCandidate.diplomaDetails || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Undergraduate (UG)</span><span className="value">{selectedCandidate.ugDetails || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Postgraduate (PG)</span><span className="value">{selectedCandidate.pgDetails || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Percentage (%)</span><span className="value">{selectedCandidate.academicPercentage != null ? `${selectedCandidate.academicPercentage}%` : "N/A"}</span></div>
                          <div className="info-item"><span className="label">CGPA</span><span className="value">{selectedCandidate.academicCgpa != null ? selectedCandidate.academicCgpa : "N/A"}</span></div>
                          <div className="info-item"><span className="label">Passing Year</span><span className="value">{selectedCandidate.passingYear || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Academic Status</span><span className="value">{selectedCandidate.academicStatus || "N/A"}</span></div>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Highest Qualification</label><input type="text" value={academicForm.qualification} onChange={e => setAcademicForm({...academicForm, qualification: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>College / Institution Name</label><input type="text" value={academicForm.collegeName} onChange={e => setAcademicForm({...academicForm, collegeName: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>University Name</label><input type="text" value={academicForm.universityName} onChange={e => setAcademicForm({...academicForm, universityName: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>SSLC Details / %</label><input type="text" placeholder="e.g. 88%" value={academicForm.sslcDetails} onChange={e => setAcademicForm({...academicForm, sslcDetails: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Plus Two Details / %</label><input type="text" placeholder="e.g. 92%" value={academicForm.plusTwoDetails} onChange={e => setAcademicForm({...academicForm, plusTwoDetails: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Diploma Details</label><input type="text" value={academicForm.diplomaDetails} onChange={e => setAcademicForm({...academicForm, diplomaDetails: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>UG Degree & Major</label><input type="text" placeholder="e.g. B.Tech Computer Science" value={academicForm.ugDetails} onChange={e => setAcademicForm({...academicForm, ugDetails: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>PG Degree & Major</label><input type="text" placeholder="e.g. M.Tech AI" value={academicForm.pgDetails} onChange={e => setAcademicForm({...academicForm, pgDetails: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Percentage (%)</label><input type="number" step="0.1" value={academicForm.academicPercentage} onChange={e => setAcademicForm({...academicForm, academicPercentage: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>CGPA (out of 10)</label><input type="number" step="0.01" value={academicForm.academicCgpa} onChange={e => setAcademicForm({...academicForm, academicCgpa: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Passing Year</label><input type="text" placeholder="e.g. 2024" value={academicForm.passingYear} onChange={e => setAcademicForm({...academicForm, passingYear: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Academic Status</label><select value={academicForm.academicStatus} onChange={e => setAcademicForm({...academicForm, academicStatus: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }}><option value="Passed Out">Passed Out</option><option value="Pursuing">Pursuing</option><option value="Discontinued">Discontinued</option></select></div>
                        </div>
                      )}
                    </div>

                    {/* 3. Professional Information Card */}
                    <div className="info-card-section">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <h4 style={{ color: "#f59e0b", margin: 0 }}>Professional Information</h4>
                        {activeTab !== "trash" && (
                          !editingProfessional ? (
                            <button
                              type="button"
                              onClick={() => setEditingProfessional(true)}
                              style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.3)", color: "#fbbf24", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                            >
                              ✏️ Edit Section
                            </button>
                          ) : (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                type="button"
                                onClick={() => { setEditingProfessional(false); initSectionForms(selectedCandidate); }}
                                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#94a3b8", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveProfessionalSection}
                                disabled={savingProfessional}
                                style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", border: "none", color: "#fff", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                              >
                                {savingProfessional ? "Saving..." : "Save Professional"}
                              </button>
                            </div>
                          )
                        )}
                      </div>

                      {!editingProfessional ? (
                        <div className="details-grid-two-col">
                          <div className="info-item"><span className="label">Experience</span><span className="value">{selectedCandidate.experienceYears || "Fresher"}</span></div>
                          <div className="info-item"><span className="label">Current Company</span><span className="value">{selectedCandidate.companyName || "N/A"}</span></div>
                          <div className="info-item" style={{ gridColumn: "1 / -1" }}><span className="label">Skills</span><span className="value">{selectedCandidate.skills || "N/A"}</span></div>
                          <div className="info-item"><span className="label">LinkedIn Profile</span><span className="value">{selectedCandidate.linkedinUrl ? <a href={selectedCandidate.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: "#3b82f6" }}>View Profile</a> : "N/A"}</span></div>
                          <div className="info-item"><span className="label">Portfolio URL</span><span className="value">{selectedCandidate.portfolioUrl ? <a href={selectedCandidate.portfolioUrl} target="_blank" rel="noreferrer" style={{ color: "#3b82f6" }}>View Portfolio</a> : "N/A"}</span></div>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Experience (Years / Level)</label><input type="text" placeholder="e.g. 2 Years / Fresher" value={professionalForm.experienceYears} onChange={e => setProfessionalForm({...professionalForm, experienceYears: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Company Name</label><input type="text" value={professionalForm.companyName} onChange={e => setProfessionalForm({...professionalForm, companyName: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>LinkedIn URL</label><input type="url" placeholder="https://linkedin.com/in/username" value={professionalForm.linkedinUrl} onChange={e => setProfessionalForm({...professionalForm, linkedinUrl: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Portfolio / Website URL</label><input type="url" placeholder="https://portfolio.dev" value={professionalForm.portfolioUrl} onChange={e => setProfessionalForm({...professionalForm, portfolioUrl: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div style={{ gridColumn: "1 / -1" }}><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Skills (Comma Separated)</label><textarea rows={2} placeholder="React, Node.js, Python..." value={professionalForm.skills} onChange={e => setProfessionalForm({...professionalForm, skills: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px", resize: "none" }} /></div>
                        </div>
                      )}
                    </div>

                    {/* Payment History & Manual Entry */}
                    <div className="info-card-section">
                      <h4 style={{ color: "#10b981" }}>Payment History & Manual Entry</h4>
                      
                      {/* Payments List */}
                      <div style={{ marginBottom: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {(!selectedCandidate.payments || selectedCandidate.payments.length === 0) ? (
                          <div style={{ color: "#64748b", fontSize: "13px", fontStyle: "italic" }}>
                            No payments recorded yet.
                          </div>
                        ) : (
                          <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                              <thead>
                                <tr style={{ background: "#1e293b", color: "#94a3b8" }}>
                                  <th style={{ padding: "8px" }}>Type</th>
                                  <th style={{ padding: "8px" }}>Method</th>
                                  <th style={{ padding: "8px" }}>Amount</th>
                                  <th style={{ padding: "8px" }}>Status</th>
                                  <th style={{ padding: "8px" }}>Txn ID / Date</th>
                                  <th style={{ padding: "8px" }}>Receipt</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedCandidate.payments.map((p) => (
                                  <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)" }}>
                                    <td style={{ padding: "8px", fontWeight: "600" }}>{p.paymentType}</td>
                                    <td style={{ padding: "8px" }}>{p.paymentMethod}</td>
                                    <td style={{ padding: "8px", color: "#10b981", fontWeight: "600" }}>₹{p.amount}</td>
                                    <td style={{ padding: "8px" }}>
                                      <span style={{
                                        padding: "2px 6px",
                                        borderRadius: "4px",
                                        fontSize: "10px",
                                        fontWeight: "700",
                                        background: p.status === "Paid" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                                        color: p.status === "Paid" ? "#10b981" : "#f59e0b"
                                      }}>
                                        {p.status}
                                      </span>
                                    </td>
                                    <td style={{ padding: "8px", color: "#94a3b8", fontSize: "11px" }}>
                                      <div>{p.transactionId || "N/A"}</div>
                                      <div style={{ fontSize: "9px" }}>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : ""}</div>
                                    </td>
                                    <td style={{ padding: "8px" }}>
                                      {p.status === "Paid" && p.receiptUrl ? (
                                        <a
                                          href={p.receiptUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            color: "#3b82f6",
                                            textDecoration: "none",
                                            fontWeight: "500",
                                            fontSize: "11px"
                                          }}
                                        >
                                          {p.receiptNumber || "Download"}
                                        </a>
                                      ) : (
                                        <span style={{ color: "#475569" }}>—</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Record Payment Form */}
                      {activeTab !== "trash" && (
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px" }}>
                          <h5 style={{ color: "#fff", marginBottom: "10px", fontSize: "14px" }}>Record Offline Payment</h5>
                          <form onSubmit={handleRecordPaymentSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                              <div>
                                <label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Payment Type</label>
                                <select
                                  value={paymentTypeVal}
                                  onChange={(e) => setPaymentTypeVal(e.target.value)}
                                  style={{ ...styles.selectInput, width: "100%", height: "38px", padding: "6px 10px" }}
                                >
                                  <option value="Admission Fee">Admission Fee</option>
                                  <option value="Booking Amount">Booking Amount</option>
                                  <option value="Installment">Installment</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Payment Method</label>
                                <select
                                  value={paymentMethodVal}
                                  onChange={(e) => setPaymentMethodVal(e.target.value)}
                                  style={{ ...styles.selectInput, width: "100%", height: "38px", padding: "6px 10px" }}
                                >
                                  <option value="Cash">Cash</option>
                                  <option value="UPI">UPI</option>
                                  <option value="Bank Transfer">Bank Transfer</option>
                                  <option value="Razorpay">Razorpay (Manual)</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Amount (₹)</label>
                                <input
                                  type="number"
                                  placeholder="e.g. 250"
                                  value={paymentAmountVal}
                                  onChange={(e) => setPaymentAmountVal(e.target.value)}
                                  style={styles.formInput}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Transaction / Receipt ID</label>
                                <input
                                  type="text"
                                  placeholder="Optional receipt #"
                                  value={paymentTransactionIdVal}
                                  onChange={(e) => setPaymentTransactionIdVal(e.target.value)}
                                  style={styles.formInput}
                                />
                              </div>
                            </div>
                            <button
                              type="submit"
                              disabled={isRecordingPayment}
                              style={{
                                ...styles.actionBtn,
                                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                width: "100%",
                                marginTop: "5px",
                                opacity: isRecordingPayment ? 0.5 : 1,
                                cursor: isRecordingPayment ? "not-allowed" : "pointer"
                              }}
                            >
                              {isRecordingPayment ? "Recording Payment..." : "Record Payment"}
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* 4. Program Information Card */}
                    <div className="info-card-section">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <h4 style={{ color: "#ec4899", margin: 0 }}>Program & Course Details</h4>
                        {activeTab !== "trash" && (
                          !editingProgram ? (
                            <button
                              type="button"
                              onClick={() => setEditingProgram(true)}
                              style={{ background: "rgba(236, 72, 153, 0.12)", border: "1px solid rgba(236, 72, 153, 0.3)", color: "#f472b6", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                            >
                              ✏️ Edit Section
                            </button>
                          ) : (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                type="button"
                                onClick={() => { setEditingProgram(false); initSectionForms(selectedCandidate); }}
                                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#94a3b8", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveProgramSection}
                                disabled={savingProgram}
                                style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", border: "none", color: "#fff", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                              >
                                {savingProgram ? "Saving..." : "Save Program"}
                              </button>
                            </div>
                          )
                        )}
                      </div>

                      {!editingProgram ? (
                        <div className="details-grid-two-col">
                          <div className="info-item"><span className="label">Program Type</span><span className="value">{selectedCandidate.programType || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Course Applied</span><span className="value">{selectedCandidate.courseApplied || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Batch</span><span className="value">{selectedCandidate.batchName || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Trainer</span><span className="value">{selectedCandidate.trainerName || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Joining / Start Date</span><span className="value">{selectedCandidate.courseStartDate ? new Date(selectedCandidate.courseStartDate).toLocaleDateString() : "N/A"}</span></div>
                          <div className="info-item"><span className="label">Completion Date</span><span className="value">{selectedCandidate.completedAt ? new Date(selectedCandidate.completedAt).toLocaleDateString() : "N/A"}</span></div>
                          <div className="info-item"><span className="label">Duration</span><span className="value">{selectedCandidate.courseDuration || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Mode of Learning</span><span className="value">{selectedCandidate.modeOfLearning || "N/A"}</span></div>
                          <div className="info-item"><span className="label">In Association With</span><span className="value">{selectedCandidate.trainingLocation || selectedCandidate.collegeName || "N/A"}</span></div>
                          <div className="info-item"><span className="label">Topics Covered</span><span className="value">{selectedCandidate.programmeDomain || "N/A"}</span></div>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div>
                            <label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Program Type</label>
                            <select value={programForm.programType} onChange={e => setProgramForm({...programForm, programType: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }}>
                              <option value="">-- Select --</option>
                              <option value="Course">Course</option>
                              <option value="Internship">Internship</option>
                              <option value="Workshop">Workshop</option>
                              <option value="Faculty Development Programme">Faculty Development Programme (FDP)</option>
                              <option value="Bootcamp">Bootcamp</option>
                              <option value="Certification">Certification</option>
                              <option value="Custom">Custom</option>
                            </select>
                          </div>
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                              <label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Course Applied</label>
                              <button
                                type="button"
                                onClick={() => setIsCustomCourseInProgram(!isCustomCourseInProgram)}
                                style={{ background: "none", border: "none", color: "#38bdf8", fontSize: "11px", cursor: "pointer", textDecoration: "underline", padding: 0 }}
                              >
                                {isCustomCourseInProgram ? "📋 Select from list" : "✏️ Type custom course"}
                              </button>
                            </div>
                            {isCustomCourseInProgram ? (
                              <input
                                type="text"
                                placeholder="Enter custom course name..."
                                value={programForm.courseApplied || ""}
                                onChange={(e) => setProgramForm({ ...programForm, courseApplied: e.target.value })}
                                style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }}
                              />
                            ) : (
                              <select
                                value={programForm.courseApplied || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "__custom__") {
                                    setIsCustomCourseInProgram(true);
                                  } else {
                                    setProgramForm({ ...programForm, courseApplied: val });
                                  }
                                }}
                                style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }}
                              >
                                <option value="">-- Select Course --</option>
                                {coursesList.map((c) => (
                                  <option key={c.id} value={c.title}>{c.title}</option>
                                ))}
                                {programForm.courseApplied && !coursesList.some((c) => c.title === programForm.courseApplied) && (
                                  <option value={programForm.courseApplied}>{programForm.courseApplied}</option>
                                )}
                                <option value="__custom__">✏️ Custom / Other Course...</option>
                              </select>
                            )}
                          </div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Batch Name</label><input type="text" placeholder="e.g. Batch #2026-A" value={programForm.batchName} onChange={e => setProgramForm({...programForm, batchName: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Trainer Name</label><input type="text" value={programForm.trainerName} onChange={e => setProgramForm({...programForm, trainerName: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Joining / Start Date</label><input type="date" value={programForm.courseStartDate} onChange={e => setProgramForm({...programForm, courseStartDate: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Completion Date</label><input type="date" value={programForm.completedAt} onChange={e => setProgramForm({...programForm, completedAt: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Duration</label><input type="text" placeholder="e.g. 3 Months, 5 Hours" value={programForm.courseDuration} onChange={e => setProgramForm({...programForm, courseDuration: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div>
                            <label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Mode of Learning</label>
                            <select value={programForm.modeOfLearning} onChange={e => setProgramForm({...programForm, modeOfLearning: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }}>
                              <option value="Offline">Offline</option>
                              <option value="Online">Online</option>
                              <option value="Hybrid">Hybrid</option>
                            </select>
                          </div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>In Association With</label><input type="text" placeholder="e.g. Younus College of Engineering" value={programForm.trainingLocation} onChange={e => setProgramForm({...programForm, trainingLocation: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Topics Covered</label><input type="text" placeholder="e.g. Artificial Intelligence, Agentic Systems" value={programForm.programmeDomain} onChange={e => setProgramForm({...programForm, programmeDomain: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                        </div>
                      )}
                    </div>

                    {/* Document Manager */}
                    <div className="info-card-section">
                      <h4>Uploaded Documents (Document Manager)</h4>
                      <div className="doc-manager-list">
                        {[
                          { label: "Resume / CV", url: selectedCandidate.cvUrl, key: "cv" as const },
                          { label: "Passport Photo", url: selectedCandidate.photoUrl, key: "photo" as const },
                          { label: "Aadhaar Card", url: selectedCandidate.aadhaarUrl, key: "aadhaar" as const },
                          { label: "College ID Card", url: selectedCandidate.collegeIdUrl, key: "college-id" as const },
                          { label: "Confirmation Letter", url: selectedCandidate.confirmationLetterUrl, key: "confirmation-letter" as const },
                          { label: "Experience Certificate", url: selectedCandidate.certificateUrl, key: "certificate" as const },
                        ].map((doc) => {
                          const hasDoc = !!doc.url;
                          return (
                            <div key={doc.key} className="doc-manager-row">
                              <div className="doc-info">
                                <span className="doc-icon">{hasDoc ? "📄" : "❌"}</span>
                                <div className="doc-meta">
                                  <span className="doc-name">{doc.label}</span>
                                  <div className="doc-badge-group">
                                    <span
                                      style={{
                                        ...styles.badgeDoc,
                                        ...(hasDoc ? getDocBadgeStyle("Complete") : getDocBadgeStyle("Missing")),
                                      }}
                                    >
                                      {hasDoc ? "Complete" : "Missing"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="doc-actions">
                                {hasDoc && (
                                  <>
                                    <a
                                      href={doc.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="doc-action-btn"
                                    >
                                      👁️ Preview
                                    </a>
                                    <a
                                      href={doc.url}
                                      download
                                      className="doc-action-btn"
                                    >
                                      📥 Download
                                    </a>
                                  </>
                                )}
                                {activeTab !== "trash" && (
                                  doc.key === "certificate" ? (
                                    selectedCandidate.applicationStatus === "Completed" && (
                                      <button
                                        type="button"
                                        className="doc-upload-label"
                                        onClick={() => handleRegenerateSingle(selectedCandidate.id)}
                                        disabled={isRegenerating}
                                        style={{
                                          background: "rgba(59, 130, 246, 0.1)",
                                          border: "1px solid rgba(59, 130, 246, 0.2)",
                                          color: "#3b82f6",
                                          cursor: isRegenerating ? "not-allowed" : "pointer"
                                        }}
                                      >
                                        {isRegenerating ? "Regenerating..." : "🔄 Regenerate"}
                                      </button>
                                    )
                                  ) : (
                                    <button
                                      type="button"
                                      className="doc-upload-label"
                                      onClick={() => triggerFileUpload(doc.key)}
                                      disabled={actionLoading}
                                    >
                                      {hasDoc ? "🔄 Replace" : "📤 Upload"}
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChangeAction}
                        style={{ display: "none" }}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </div>

                    {/* Counselor Status Update Form or Trash Actions */}
                    {activeTab === "trash" ? (
                      <div className="info-card-section" style={{ border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                        <h4 style={{ color: "#ef4444", marginBottom: "15px" }}>Trash Actions</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <button
                            type="button"
                            onClick={handleRestore}
                            disabled={isRestoring || isDeleting}
                            style={{
                              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              border: "none",
                              color: "white",
                              padding: "10px",
                              borderRadius: "8px",
                              cursor: (isRestoring || isDeleting) ? "not-allowed" : "pointer",
                              fontWeight: "600",
                              transition: "all 0.2s",
                              opacity: (isRestoring || isDeleting) ? 0.7 : 1
                            }}
                          >
                            {isRestoring ? "Restoring..." : "✨ Restore Candidate"}
                          </button>
                          <button
                            type="button"
                            onClick={handlePermanentDelete}
                            disabled={isDeleting || isRestoring}
                            style={{
                              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                              border: "none",
                              color: "white",
                              padding: "10px",
                              borderRadius: "8px",
                              cursor: (isDeleting || isRestoring) ? "not-allowed" : "pointer",
                              fontWeight: "600",
                              transition: "all 0.2s",
                              opacity: (isDeleting || isRestoring) ? 0.7 : 1
                            }}
                          >
                            {isDeleting ? "Deleting..." : "🚨 Permanent Delete"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="info-card-section">
                        <h4>Update Admission Status</h4>
                        <form onSubmit={handleStatusChange} style={styles.inlineForm}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div>
                              <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Application Status</label>
                              <select
                                value={statusUpdateVal}
                                onChange={(e) => setStatusUpdateVal(e.target.value)}
                                style={{
                                  ...styles.selectInput,
                                  width: "100%",
                                }}
                              >
                                <option value="submitted">Submitted</option>
                                <option value="under review">Under Review</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="enrolled">Enrolled</option>
                                <option value="completed">Completed</option>
                              </select>
                            </div>

                            <div>
                              <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Performance Grade</label>
                              <select
                                value={performanceVal}
                                onChange={(e) => setPerformanceVal(e.target.value)}
                                style={{
                                  ...styles.selectInput,
                                  width: "100%",
                                  boxSizing: "border-box",
                                  padding: "8px 12px",
                                  background: "#1e293b",
                                  border: "1px solid rgba(255,255,255,0.1)",
                                  borderRadius: "6px",
                                  color: "#fff"
                                }}
                              >
                                <option value="">Select Performance...</option>
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Average">Average</option>
                                <option value="Satisfactory">Satisfactory</option>
                              </select>
                            </div>

                            {(() => {
                              const getDbPerformance = (p?: string) => {
                                if (!p) return "";
                                const lower = p.toLowerCase();
                                if (lower === "excellent") return "Excellent";
                                if (lower === "good") return "Good";
                                if (lower === "average") return "Average";
                                if (lower === "satisfactory") return "Satisfactory";
                                return p;
                              };

                              const isStatusChanged = statusUpdateVal.toLowerCase() !== (selectedCandidate?.applicationStatus || "").toLowerCase();
                              const isPerformanceChanged = performanceVal !== getDbPerformance(selectedCandidate?.performance);

                              const isAnyFieldChanged = isStatusChanged || isPerformanceChanged;
                              const isDisabled = isUpdatingStatus || !isAnyFieldChanged;
                              return (
                                <button
                                  type="submit"
                                  disabled={isDisabled}
                                  style={{
                                    ...styles.actionBtn,
                                    width: "100%",
                                    opacity: isDisabled ? 0.5 : 1,
                                    cursor: isDisabled ? "not-allowed" : "pointer"
                                  }}
                                >
                                  {isUpdatingStatus ? "Saving..." : "Save Status"}
                                </button>
                              );
                            })()}
                          </div>
                        </form>
                        <button
                          type="button"
                          onClick={handleSoftDelete}
                          disabled={isDeleting}
                          style={{
                            background: "rgba(239, 68, 68, 0.08)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            color: "#ef4444",
                            padding: "10px",
                            borderRadius: "8px",
                            cursor: isDeleting ? "not-allowed" : "pointer",
                            fontWeight: "600",
                            width: "100%",
                            marginTop: "12px",
                            transition: "all 0.2s",
                            opacity: isDeleting ? 0.7 : 1
                          }}
                        >
                          {isDeleting ? "Moving to Trash..." : "🗑️ Move to Trash"}
                        </button>
                        {(selectedCandidate.applicationStatus || "").toLowerCase() === "completed" && (
                          <button
                            type="button"
                            onClick={() => handleRegenerateSingle(selectedCandidate.id)}
                            disabled={isRegenerating}
                            style={{
                              background: "rgba(59, 130, 246, 0.08)",
                              border: "1px solid rgba(59, 130, 246, 0.2)",
                              color: "#3b82f6",
                              padding: "10px",
                              borderRadius: "8px",
                              cursor: isRegenerating ? "not-allowed" : "pointer",
                              fontWeight: "600",
                              width: "100%",
                              marginTop: "12px",
                              transition: "all 0.2s",
                              opacity: isRegenerating ? 0.7 : 1
                            }}
                          >
                            {isRegenerating ? "Regenerating..." : "🎓 Regenerate Certificate"}
                          </button>
                        )}
                      </div>
                    )}

                    {/* 6. Fee Details Card */}
                    <div className="info-card-section">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <h4 style={{ color: "#10b981", margin: 0 }}>Fee & Financial Structure</h4>
                        {activeTab !== "trash" && (
                          !editingFee ? (
                            <button
                              type="button"
                              onClick={() => setEditingFee(true)}
                              style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34d399", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                            >
                              ✏️ Edit Fee Details
                            </button>
                          ) : (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                type="button"
                                onClick={() => { setEditingFee(false); initSectionForms(selectedCandidate); }}
                                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#94a3b8", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveFeeSection}
                                disabled={savingFee}
                                style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", border: "none", color: "#fff", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                              >
                                {savingFee ? "Saving..." : "Save Fee Details"}
                              </button>
                            </div>
                          )
                        )}
                      </div>

                      {!editingFee ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          <div className="details-grid-two-col">
                            <div className="info-item"><span className="label">Standard Course Fee</span><span className="value">₹{selectedCandidate.standardCourseFee || 0}</span></div>
                            <div className="info-item"><span className="label">Scholarship</span><span className="value" style={{ color: "#ef4444" }}>-₹{selectedCandidate.scholarshipAmount || 0}</span></div>
                            <div className="info-item"><span className="label">Special Discount</span><span className="value" style={{ color: "#ef4444" }}>-₹{selectedCandidate.specialDiscount || 0}</span></div>
                            <div className="info-item"><span className="label">Corporate Discount</span><span className="value" style={{ color: "#ef4444" }}>-₹{selectedCandidate.corporateDiscount || 0}</span></div>
                            <div className="info-item"><span className="label">Promo Discount</span><span className="value" style={{ color: "#ef4444" }}>-₹{selectedCandidate.promoDiscount || 0}</span></div>
                            <div className="info-item"><span className="label">GST (%)</span><span className="value">{selectedCandidate.gstPercentage || 0}% (₹{selectedCandidate.gstAmount || 0})</span></div>
                            <div className="info-item"><span className="label">Convenience Fee</span><span className="value">+₹{selectedCandidate.convenienceFee || 0}</span></div>
                            <div className="info-item"><span className="label">Admission Fee Amount</span><span className="value">₹{selectedCandidate.admissionFeeAmount || 250}</span></div>
                            <div className="info-item"><span className="label">Booking Amount</span><span className="value">₹{selectedCandidate.bookingAmount || 0}</span></div>
                            <div className="info-item"><span className="label">Admission Fee Status</span><span className="value" style={{ color: selectedCandidate.admissionFeePaid ? "#10b981" : "#f59e0b" }}>{selectedCandidate.admissionFeePaid ? "Paid" : "Pending"}</span></div>
                            <div className="info-item"><span className="label">Offer Expiry Date</span><span className="value">{selectedCandidate.offerExpiryDate ? new Date(selectedCandidate.offerExpiryDate).toLocaleDateString() : "N/A"}</span></div>
                            <div className="info-item"><span className="label">Offer Remarks</span><span className="value">{selectedCandidate.offerRemarks || "N/A"}</span></div>
                          </div>
                          <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "8px", padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <span style={{ fontSize: "12px", color: "#94a3b8", display: "block" }}>Net Final Payable Amount</span>
                              <span style={{ fontSize: "20px", fontWeight: "800", color: "#10b981" }}>₹{selectedCandidate.finalPayableAmount || 0}</span>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>Auto-Enroll Enabled</span>
                              <span style={{ fontSize: "13px", fontWeight: "700", color: selectedCandidate.autoEnrollEnabled !== false ? "#10b981" : "#ef4444" }}>
                                {selectedCandidate.autoEnrollEnabled !== false ? "Yes" : "No"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Standard Course Fee (₹)</label><input type="number" min="0" value={feeForm.standardCourseFee} onChange={e => setFeeForm({...feeForm, standardCourseFee: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                            <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Scholarship Amount (₹)</label><input type="number" min="0" value={feeForm.scholarshipAmount} onChange={e => setFeeForm({...feeForm, scholarshipAmount: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                            <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Special Discount (₹)</label><input type="number" min="0" value={feeForm.specialDiscount} onChange={e => setFeeForm({...feeForm, specialDiscount: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                            <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Corporate Discount (₹)</label><input type="number" min="0" value={feeForm.corporateDiscount} onChange={e => setFeeForm({...feeForm, corporateDiscount: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                            <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Promo Discount (₹)</label><input type="number" min="0" value={feeForm.promoDiscount} onChange={e => setFeeForm({...feeForm, promoDiscount: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                            <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>GST (%)</label><input type="number" min="0" max="100" value={feeForm.gstPercentage} onChange={e => setFeeForm({...feeForm, gstPercentage: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                            <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Convenience Fee (₹)</label><input type="number" min="0" value={feeForm.convenienceFee} onChange={e => setFeeForm({...feeForm, convenienceFee: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                            <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Booking Amount (₹)</label><input type="number" min="0" value={feeForm.bookingAmount} onChange={e => setFeeForm({...feeForm, bookingAmount: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                            <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Admission Fee Amount (₹)</label><input type="number" min="0" value={feeForm.admissionFeeAmount} onChange={e => setFeeForm({...feeForm, admissionFeeAmount: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                            <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Offer Expiry Date</label><input type="date" value={feeForm.offerExpiryDate} onChange={e => setFeeForm({...feeForm, offerExpiryDate: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px" }} /></div>
                          </div>
                          <div><label style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>Offer Remarks</label><textarea rows={2} value={feeForm.offerRemarks} onChange={e => setFeeForm({...feeForm, offerRemarks: e.target.value})} style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "13px", resize: "none" }} /></div>
                          <div style={{ display: "flex", gap: "20px", alignItems: "center", margin: "5px 0" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#fff", cursor: "pointer" }}>
                              <input type="checkbox" checked={feeForm.admissionFeePaid} onChange={e => setFeeForm({...feeForm, admissionFeePaid: e.target.checked})} />
                              Admission Fee Paid
                            </label>
                            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#fff", cursor: "pointer" }}>
                              <input type="checkbox" checked={feeForm.autoEnrollEnabled} onChange={e => setFeeForm({...feeForm, autoEnrollEnabled: e.target.checked})} />
                              Auto-Enroll on Admission Fee Payment
                            </label>
                          </div>

                          {/* Live Recalculation Summary Box */}
                          {(() => {
                            const std = parseFloat(feeForm.standardCourseFee || 0);
                            const disc = parseFloat(feeForm.scholarshipAmount || 0) + parseFloat(feeForm.specialDiscount || 0) + parseFloat(feeForm.corporateDiscount || 0) + parseFloat(feeForm.promoDiscount || 0);
                            const taxable = Math.max(0, std - disc);
                            const gstPct = parseFloat(feeForm.gstPercentage || 0);
                            const gstAmt = gstPct > 0 ? Math.round(taxable * (gstPct / 100) * 100) / 100 : parseFloat(feeForm.gstAmount || 0);
                            const conv = parseFloat(feeForm.convenienceFee || 0);
                            const net = Math.round((taxable + gstAmt + conv) * 100) / 100;
                            return (
                              <div style={{ background: "rgba(139, 92, 246, 0.06)", border: "1px solid rgba(139, 92, 246, 0.2)", borderRadius: "8px", padding: "12px", marginTop: "5px" }}>
                                <div style={{ fontSize: "12px", color: "#a78bfa", fontWeight: "700", marginBottom: "6px" }}>⚡ Dynamic Recalculation Preview</div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#cbd5e1" }}><span>Course Fee: ₹{std}</span><span>Total Discounts: -₹{disc}</span><span>GST: +₹{gstAmt}</span></div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "800", color: "#10b981", marginTop: "6px", borderTop: "1px dashed rgba(255,255,255,0.1)", paddingTop: "6px" }}>
                                  <span>Recalculated Payable Amount:</span>
                                  <span>₹{net}</span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    {/* 7. Certificate Overrides & Metadata Card */}
                    <div className="info-card-section">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <h4 style={{ color: "#a855f7", margin: 0 }}>Certificate Details & Overrides (V2)</h4>
                        {activeTab !== "trash" && (
                          !editingCertMeta ? (
                            <button
                              type="button"
                              onClick={() => setEditingCertMeta(true)}
                              style={{ background: "rgba(168, 85, 247, 0.12)", border: "1px solid rgba(168, 85, 247, 0.3)", color: "#c084fc", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                            >
                              ✏️ Edit Certificate Overrides
                            </button>
                          ) : (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                type="button"
                                onClick={() => { setEditingCertMeta(false); initSectionForms(selectedCandidate); }}
                                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#94a3b8", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveCertMetaSection}
                                disabled={savingCertMeta}
                                style={{ background: "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)", border: "none", color: "white", padding: "4px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: savingCertMeta ? "not-allowed" : "pointer" }}
                              >
                                {savingCertMeta ? "Saving..." : "Save Overrides"}
                              </button>
                            </div>
                          )
                        )}
                      </div>

                      {editingCertMeta ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <div>
                            <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Certificate Course Name</label>
                            <input
                              type="text"
                              value={certMetaForm.certificateCourseName}
                              onChange={(e) => setCertMetaForm({ ...certMetaForm, certificateCourseName: e.target.value })}
                              placeholder="e.g. Artificial Intelligence & Agentic Systems"
                              style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "#1e293b", color: "#f8fafc", fontSize: "13px" }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Program Type</label>
                            <input
                              type="text"
                              value={certMetaForm.certificateProgramType}
                              onChange={(e) => setCertMetaForm({ ...certMetaForm, certificateProgramType: e.target.value })}
                              placeholder="e.g. Faculty Development Programme (FDP)"
                              style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "#1e293b", color: "#f8fafc", fontSize: "13px" }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>In Association With (Partner)</label>
                            <input
                              type="text"
                              value={certMetaForm.certificatePartner}
                              onChange={(e) => setCertMetaForm({ ...certMetaForm, certificatePartner: e.target.value })}
                              placeholder="e.g. Younus College of Engineering"
                              style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "#1e293b", color: "#f8fafc", fontSize: "13px" }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Topics Covered</label>
                            <input
                              type="text"
                              value={certMetaForm.certificateTopics}
                              onChange={(e) => setCertMetaForm({ ...certMetaForm, certificateTopics: e.target.value })}
                              placeholder="e.g. Machine Learning, LLMs, RAG, Agentic AI"
                              style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "#1e293b", color: "#f8fafc", fontSize: "13px" }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Domain</label>
                            <input
                              type="text"
                              value={certMetaForm.certificateDomain}
                              onChange={(e) => setCertMetaForm({ ...certMetaForm, certificateDomain: e.target.value })}
                              placeholder="e.g. Artificial Intelligence"
                              style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "#1e293b", color: "#f8fafc", fontSize: "13px" }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Duration</label>
                            <input
                              type="text"
                              value={certMetaForm.certificateDuration}
                              onChange={(e) => setCertMetaForm({ ...certMetaForm, certificateDuration: e.target.value })}
                              placeholder="e.g. 5 Hours / 4 Weeks"
                              style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "#1e293b", color: "#f8fafc", fontSize: "13px" }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Mode of Learning</label>
                            <input
                              type="text"
                              value={certMetaForm.certificateMode}
                              onChange={(e) => setCertMetaForm({ ...certMetaForm, certificateMode: e.target.value })}
                              placeholder="e.g. Online / Hybrid / On-Campus"
                              style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "#1e293b", color: "#f8fafc", fontSize: "13px" }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Title Override</label>
                            <input
                              type="text"
                              value={certMetaForm.certificateTitleOverride}
                              onChange={(e) => setCertMetaForm({ ...certMetaForm, certificateTitleOverride: e.target.value })}
                              placeholder="e.g. CERTIFICATE OF EXCELLENCE"
                              style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "#1e293b", color: "#f8fafc", fontSize: "13px" }}
                            />
                          </div>

                          <div style={{ gridColumn: "span 2" }}>
                            <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Custom Body Template Override</label>
                            <textarea
                              rows={3}
                              value={certMetaForm.certificateBodyOverride}
                              onChange={(e) => setCertMetaForm({ ...certMetaForm, certificateBodyOverride: e.target.value })}
                              placeholder="Optional custom paragraph text..."
                              style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "#1e293b", color: "#f8fafc", fontSize: "13px" }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="info-grid">
                          <div>
                            <span className="info-label">Cert Course Name</span>
                            <span className="info-value">{selectedCandidate.certificateCourseName || selectedCandidate.courseApplied || "Default"}</span>
                          </div>
                          <div>
                            <span className="info-label">Cert Program Type</span>
                            <span className="info-value">{selectedCandidate.certificateProgramType || selectedCandidate.programType || "Default"}</span>
                          </div>
                          <div>
                            <span className="info-label">In Association With</span>
                            <span className="info-value">{selectedCandidate.certificatePartner || selectedCandidate.trainingLocation || "N/A"}</span>
                          </div>
                          <div>
                            <span className="info-label">Topics Covered</span>
                            <span className="info-value">{selectedCandidate.certificateTopics || selectedCandidate.programmeDomain || "Default"}</span>
                          </div>
                          <div>
                            <span className="info-label">Domain</span>
                            <span className="info-value">{selectedCandidate.certificateDomain || selectedCandidate.programmeDomain || "Default"}</span>
                          </div>
                          <div>
                            <span className="info-label">Mode & Duration</span>
                            <span className="info-value">{selectedCandidate.certificateMode || selectedCandidate.modeOfLearning || "Online"} ({selectedCandidate.certificateDuration || selectedCandidate.courseDuration || "N/A"})</span>
                          </div>
                          <div>
                            <span className="info-label">Title Override</span>
                            <span className="info-value">{selectedCandidate.certificateTitleOverride || "Standard Template Title"}</span>
                          </div>
                          <div>
                            <span className="info-label">Body Override</span>
                            <span className="info-value">{selectedCandidate.certificateBodyOverride ? "Custom Body Set" : "Standard Wording"}</span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {confirmDialog.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
            color: '#fff'
          }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '18px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: confirmDialog.isDanger ? '#ef4444' : '#3b82f6'
            }}>
              <span className="material-symbols-outlined">
                {confirmDialog.isDanger ? 'warning' : 'help'}
              </span>
              {confirmDialog.title}
            </h3>
            
            <p style={{
              margin: '0 0 24px 0',
              fontSize: '14px',
              color: '#94a3b8',
              lineHeight: '1.6'
            }}>
              {confirmDialog.message}
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                type="button"
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#94a3b8',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {confirmDialog.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => confirmDialog.onConfirm()}
                style={{
                  background: confirmDialog.isDanger
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: confirmDialog.isDanger
                    ? '0 4px 12px rgba(239, 68, 68, 0.25)'
                    : '0 4px 12px rgba(59, 130, 246, 0.25)',
                  transition: 'all 0.2s'
                }}
              >
                {confirmDialog.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidates Export Modal */}
      <CandidatesExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        totalCandidates={total}
        filteredCount={candidates.length}
        selectedCandidateIds={selectedIds}
        activeFilters={{
          search,
          statusFilter,
          courseFilter,
          startDate,
          endDate,
        }}
        onExportSuccess={(msg) => {
          setToast({ message: msg, type: "success" });
          setTimeout(() => setToast(null), 4000);
        }}
      />
    </div>
  );
}

// -------------------------------------------------------------
// Helper style status resolver
// -------------------------------------------------------------
const getStatusBadgeStyle = (status: string): React.CSSProperties => {
  switch (status) {
    case "Submitted":
      return { backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" };
    case "Under Review":
      return { backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" };
    case "Approved":
      return { backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981" };
    case "Rejected":
      return { backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444" };
    case "Enrolled":
      return { backgroundColor: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" };
    case "Completed":
      return { backgroundColor: "rgba(16, 185, 129, 0.25)", color: "#10b981" };
    default:
      return { backgroundColor: "rgba(148, 163, 184, 0.15)", color: "#94a3b8" };
  }
};

const getDocBadgeStyle = (status: string): React.CSSProperties => {
  switch (status) {
    case "Complete":
    case "Completed":
      return { backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981" };
    case "Partial":
    case "Missing":
    case "Missing Docs":
      return { backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" };
    default:
      return { backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444" };
  }
};

/*
const renderDocLink = (label: string, url?: string) => {
  if (!url) {
    return (
      <div style={styles.docLinkRow}>
        <span>❌ {label}</span>
        <span style={{ color: "#ef4444", fontSize: "12px" }}>Missing</span>
      </div>
    );
  }
  return (
    <div style={styles.docLinkRow}>
      <span>✅ {label}</span>
      <a href={url} target="_blank" rel="noopener noreferrer" style={styles.viewLink}>
        View File ↗
      </a>
    </div>
  );
};
*/

// -------------------------------------------------------------
// Styles object
// -------------------------------------------------------------
const styles: Record<string, React.CSSProperties> = {
  adminContainer: {
    padding: "20px",
    background: "#0f172a",
    color: "#f8fafc",
    fontFamily: "'Outfit', 'Inter', sans-serif",
    minHeight: "100vh",
  },
  topHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    paddingBottom: "16px",
  },
  tabButtons: {
    display: "flex",
    gap: "12px",
  },
  tabBtn: {
    background: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "#94a3b8",
    padding: "10px 18px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  activeTabBtn: {
    background: "#3b82f6",
    borderColor: "#3b82f6",
    color: "#ffffff",
  },
  notificationWrapper: {
    position: "relative",
  },
  notifBtn: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "white",
    fontSize: "20px",
    padding: "10px",
    borderRadius: "50%",
    cursor: "pointer",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    background: "#ef4444",
    color: "white",
    fontSize: "10px",
    fontWeight: "bold",
    borderRadius: "50%",
    padding: "2px 6px",
  },
  notifDropdown: {
    position: "absolute",
    right: 0,
    top: "48px",
    width: "360px",
    maxHeight: "450px",
    background: "#1e293b",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
  },
  notifHeader: {
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
  },
  markReadBtn: {
    background: "transparent",
    border: "none",
    color: "#3b82f6",
    fontSize: "12px",
    cursor: "pointer",
  },
  notifList: {
    overflowY: "auto",
    flex: 1,
  },
  emptyNotif: {
    padding: "20px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
  },
  notifItem: {
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    transition: "background-color 0.2s",
  },
  notifTitle: {
    fontWeight: "600",
    fontSize: "13px",
    color: "#3b82f6",
  },
  notifMessage: {
    fontSize: "12px",
    color: "#cbd5e1",
    marginTop: "4px",
  },
  notifTime: {
    fontSize: "10px",
    color: "#64748b",
    marginTop: "6px",
    textAlign: "right",
  },
  mainGrid: {
    display: "flex",
    gap: "24px",
    alignItems: "flex-start",
    position: "relative",
  },
  listSection: {
    flex: 1,
    minWidth: 0,
  },
  filterBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "center",
    marginBottom: "20px",
    background: "rgba(255, 255, 255, 0.02)",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  searchInput: {
    flex: 1,
    minWidth: "220px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
  },
  selectInput: {
    background: "#1e293b",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
    maxWidth: "100%",
    boxSizing: "border-box",
    textOverflow: "ellipsis",
  },
  dateRange: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  dateInput: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "#f8fafc",
    fontSize: "13px",
    outline: "none",
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
    display: "block",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "14px",
  },
  tr: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  badgeStatus: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  },
  badgeDoc: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  },
  mobileCardList: {
    display: "none",
    flexDirection: "column",
    gap: "16px",
  },
  mobileCard: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "14px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    cursor: "pointer",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardAppNum: {
    fontWeight: "700",
    color: "#3b82f6",
  },
  cardName: {
    fontSize: "16px",
    fontWeight: "600",
  },
  cardInfo: {
    fontSize: "13px",
    color: "#94a3b8",
  },
  cardCourse: {
    fontSize: "14px",
    color: "#3b82f6",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    paddingTop: "10px",
  },
  cardDate: {
    fontSize: "12px",
    color: "#64748b",
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  pageBtn: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
  },
  pageLabel: {
    fontSize: "13px",
    color: "#94a3b8",
  },
  drawer: {
    width: "420px",
    background: "#1e293b",
    borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
    height: "calc(100vh - 100px)",
    position: "sticky",
    top: "80px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
  },
  drawerHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#ef4444",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
  },
  drawerLoader: {
    padding: "40px",
    textAlign: "center",
    color: "#94a3b8",
  },
  drawerContent: {
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    flex: 1,
  },
  drawerCard: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "12px",
    padding: "16px",
  },
  appRef: {
    fontSize: "15px",
    color: "#cbd5e1",
  },
  cardHeaderTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#3b82f6",
    margin: "0 0 12px 0",
    textTransform: "uppercase",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "10px",
    fontSize: "13px",
    color: "#cbd5e1",
  },
  docChecklist: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  docLinkRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
  },
  viewLink: {
    color: "#3b82f6",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "600",
  },
  inlineForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  remarksInput: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#f8fafc",
    fontSize: "13px",
    outline: "none",
  },
  actionBtn: {
    background: "#3b82f6",
    border: "none",
    color: "white",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  noteForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "16px",
  },
  textareaInput: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#f8fafc",
    fontSize: "13px",
    outline: "none",
    resize: "none",
  },
  notesList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  noteItem: {
    background: "rgba(255, 255, 255, 0.01)",
    border: "1px solid rgba(255, 255, 255, 0.04)",
    borderRadius: "8px",
    padding: "10px 12px",
  },
  noteHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#64748b",
    marginBottom: "4px",
  },
  noteBody: {
    fontSize: "13px",
    color: "#cbd5e1",
    whiteSpace: "pre-line",
  },
  formInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 12px",
    background: "#1e293b",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "13px",
    outline: "none",
  },
};
