import { api } from "./apiService";
import { useAuthStore } from "../store/useAuthStore";

export interface CandidateNote {
  id: string;
  candidateId: string;
  content: string;
  createdBy?: string;
  createdAt: string;
}

export interface CandidateTimelineEvent {
  id: string;
  candidateId: string;
  eventType: string;
  description: string;
  createdBy?: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  leadId?: string;
  applicationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  address?: string;
  emergencyContact?: string;
  qualification?: string;
  bloodGroup?: string;
  courseApplied?: string;
  modeOfLearning?: string;
  collegeName?: string;
  dateOfBirth?: string;
  gender?: string;
  referenceDetails?: string;
  languagesKnown?: string;
  parentGuardianName?: string;
  parentGuardianOccupation?: string;
  aadhaarNumberEncrypted?: string;
  aadhaarNumberDecrypted?: string;
  aadhaarNumberMasked?: string;
  registrationTransactionId?: string;
  applicationStatus: string;
  documentStatus: string;
  candidateSource: string;
  candidateToken: string;
  nextFollowupAt?: string;
  remarks?: string;
  cvUrl?: string;
  photoUrl?: string;
  aadhaarUrl?: string;
  collegeIdUrl?: string;
  confirmationLetterUrl?: string;
  certificateId?: string;
  certificateUrl?: string;
  certificateStatus?: string;
  importBatchId?: string;
  importTag?: string;
  completedAt?: string;
  courseStartDate?: string;
  courseDuration?: string;
  performance?: string;
  programType?: string;
  createdAt: string;
  updatedAt: string;
  notes?: CandidateNote[];
  timelineEvents?: CandidateTimelineEvent[];
  standardCourseFee?: number;
  scholarshipAmount?: number;
  specialDiscount?: number;
  corporateDiscount?: number;
  promoDiscount?: number;
  bookingAmount?: number;
  finalPayableAmount?: number;
  offerRemarks?: string;
  offerExpiryDate?: string;
  admissionFeeAmount?: number;
  admissionFeePaid?: boolean;
  autoEnrollEnabled?: boolean;
  payments?: CandidatePayment[];
}

export interface CandidatePayment {
  id: string;
  amount: number;
  paymentType: string;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  paymentDate?: string;
  createdAt: string;
}

export interface ImportBatch {
  id: string;
  fileName: string;
  uploadedBy: string;
  totalRows: number;
  newRecords: number;
  updatedRecords: number;
  duplicateRecords: number;
  failedRecords: number;
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  notificationType: string;
  isRead: boolean;
  createdAt: string;
}

const mapCandidate = (c: any): Candidate => {
  return {
    id: c.id,
    leadId: c.lead_id || undefined,
    applicationNumber: c.application_number,
    fullName: c.full_name,
    email: c.email,
    phone: c.phone,
    whatsappNumber: c.whatsapp_number || undefined,
    address: c.address || undefined,
    emergencyContact: c.emergency_contact || undefined,
    qualification: c.qualification || undefined,
    bloodGroup: c.blood_group || undefined,
    courseApplied: c.course_applied || undefined,
    modeOfLearning: c.mode_of_learning || undefined,
    collegeName: c.college_name || undefined,
    dateOfBirth: c.date_of_birth || undefined,
    gender: c.gender || undefined,
    referenceDetails: c.reference_details || undefined,
    languagesKnown: c.languages_known || undefined,
    parentGuardianName: c.parent_guardian_name || undefined,
    parentGuardianOccupation: c.parent_guardian_occupation || undefined,
    aadhaarNumberEncrypted: c.aadhaar_number_encrypted || undefined,
    aadhaarNumberDecrypted: c.aadhaar_number_decrypted || undefined,
    aadhaarNumberMasked: c.aadhaar_number_masked || undefined,
    registrationTransactionId: c.registration_transaction_id || undefined,
    applicationStatus: c.application_status,
    documentStatus: c.document_status,
    candidateSource: c.candidate_source,
    candidateToken: c.candidate_token,
    nextFollowupAt: c.next_followup_at || undefined,
    cvUrl: c.cv_url || undefined,
    photoUrl: c.photo_url || undefined,
    aadhaarUrl: c.aadhaar_url || undefined,
    collegeIdUrl: c.college_id_url || undefined,
    confirmationLetterUrl: c.confirmation_letter_url || undefined,
    certificateId: c.certificate_id || undefined,
    certificateUrl: c.certificate_url || undefined,
    certificateStatus: c.certificate_status || undefined,
    importBatchId: c.import_batch_id || undefined,
    importTag: c.import_tag || undefined,
    completedAt: c.completed_at || undefined,
    courseStartDate: c.course_start_date || undefined,
    courseDuration: c.course_duration || undefined,
    performance: c.performance || undefined,
    programType: c.program_type || undefined,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
    standardCourseFee: c.standard_course_fee,
    scholarshipAmount: c.scholarship_amount,
    specialDiscount: c.special_discount,
    corporateDiscount: c.corporate_discount,
    promoDiscount: c.promo_discount,
    bookingAmount: c.booking_amount,
    finalPayableAmount: c.final_payable_amount,
    offerRemarks: c.offer_remarks || undefined,
    offerExpiryDate: c.offer_expiry_date || undefined,
    admissionFeeAmount: c.admission_fee_amount,
    admissionFeePaid: c.admission_fee_paid,
    autoEnrollEnabled: c.auto_enroll_enabled,
    notes: Array.isArray(c.notes)
      ? c.notes.map((n: any) => ({
          id: n.id,
          candidateId: n.candidate_id,
          content: n.content,
          createdBy: n.created_by || undefined,
          createdAt: n.created_at,
        }))
      : [],
    timelineEvents: Array.isArray(c.timeline_events)
      ? c.timeline_events.map((t: any) => ({
          id: t.id,
          candidateId: t.candidate_id,
          eventType: t.event_type,
          description: t.description,
          createdBy: t.created_by || undefined,
          createdAt: t.created_at,
        }))
      : [],
    payments: Array.isArray(c.payments)
      ? c.payments.map((p: any) => ({
          id: p.id,
          amount: p.amount,
          paymentType: p.payment_type,
          paymentMethod: p.payment_method,
          status: p.status,
          transactionId: p.transaction_id || undefined,
          paymentDate: p.payment_date || undefined,
          createdAt: p.created_at,
        }))
      : [],
  };
};

export interface ConversionTokenDetails {
  valid: boolean;
  name: string;
  email: string;
  phone: string;
  course: string;
  lead_id?: string;
}

export const applyCandidate = async (
  candidateData: Partial<Candidate> & { aadhaarNumber?: string; token?: string }
): Promise<any> => {
  const payload = {
    full_name: candidateData.fullName,
    email: candidateData.email,
    phone: candidateData.phone,
    whatsapp_number: candidateData.whatsappNumber || null,
    address: candidateData.address || null,
    emergency_contact: candidateData.emergencyContact || null,
    qualification: candidateData.qualification || null,
    blood_group: candidateData.bloodGroup || null,
    course_applied: candidateData.courseApplied || null,
    mode_of_learning: candidateData.modeOfLearning || null,
    college_name: candidateData.collegeName || null,
    date_of_birth: candidateData.dateOfBirth || null,
    gender: candidateData.gender || null,
    reference_details: candidateData.referenceDetails || null,
    languages_known: candidateData.languagesKnown || null,
    parent_guardian_name: candidateData.parentGuardianName || null,
    parent_guardian_occupation: candidateData.parentGuardianOccupation || null,
    aadhaar_number: candidateData.aadhaarNumber || null,
    registration_transaction_id: candidateData.registrationTransactionId || null,
    remarks: candidateData.remarks || null,
    lead_id: candidateData.leadId || null,
    next_followup_at: candidateData.nextFollowupAt || null,
    token: candidateData.token || null,
  };
  const res = await api.post("/candidates/apply", payload);
  return res.data;
};

export const listCandidates = async (params: {
  status?: string;
  course?: string;
  qualification?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  limit?: number;
  isDeleted?: boolean;
}): Promise<{ total: number; records: Candidate[] }> => {
  const queryParams: any = {};
  if (params.status) queryParams.status = params.status;
  if (params.course) queryParams.course = params.course;
  if (params.qualification) queryParams.qualification = params.qualification;
  if (params.search) queryParams.search = params.search;
  if (params.startDate) queryParams.start_date = params.startDate;
  if (params.endDate) queryParams.end_date = params.endDate;
  if (params.skip !== undefined) queryParams.skip = params.skip;
  if (params.limit !== undefined) queryParams.limit = params.limit;
  if (params.isDeleted !== undefined) queryParams.is_deleted = params.isDeleted;

  const res = await api.get("/candidates/", { params: queryParams });
  return {
    total: res.data.total,
    records: res.data.records.map(mapCandidate),
  };
};

export const getCandidateById = async (id: string): Promise<Candidate> => {
  const res = await api.get(`/candidates/${id}`);
  return mapCandidate(res.data);
};

export const updateCandidateStatus = async (
  id: string,
  status: string,
  courseStartDate?: string,
  completedAt?: string,
  courseDuration?: string,
  performance?: string,
  programType?: string,
  courseApplied?: string
): Promise<any> => {
  const res = await api.put(`/candidates/${id}/status`, {
    status,
    course_start_date: courseStartDate || null,
    completed_at: completedAt || null,
    course_duration: courseDuration || null,
    performance: performance || null,
    program_type: programType || null,
    course_applied: courseApplied || null,
  });
  return res.data;
};

export const addCandidateNote = async (id: string, content: string): Promise<any> => {
  const res = await api.post(`/candidates/${id}/notes`, { content });
  return res.data;
};

export const uploadCandidateDocument = async (
  id: string,
  docType: "cv" | "photo" | "aadhaar" | "college-id" | "confirmation-letter",
  file: File
): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post(`/candidates/${id}/upload-document?doc_type=${docType}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const previewImportHeaders = async (file: File): Promise<{ headers: string[]; preview_rows: string[][] }> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/candidates/import/preview", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const processImport = async (
  file: File,
  mapping: Record<string, string>,
  mode: "candidate_only" | "lead_only" | "lead_candidate",
  tag?: string
): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("mapping", JSON.stringify(mapping));
  formData.append("mode", mode);
  if (tag) formData.append("tag", tag);

  const token = useAuthStore.getState().accessToken || localStorage.getItem("admin_token");

  const res = await api.post("/candidates/import/process", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    timeout: 60000,
  });
  return res.data;
};

export const getImportHistory = async (): Promise<ImportBatch[]> => {
  const res = await api.get("/candidates/import/history");
  return res.data.map((b: any) => ({
    id: b.id,
    fileName: b.file_name,
    uploadedBy: b.uploaded_by,
    totalRows: b.total_rows,
    newRecords: b.new_records,
    updatedRecords: b.updated_records,
    duplicateRecords: b.duplicate_records,
    failedRecords: b.failed_records,
    createdAt: b.created_at,
  }));
};

export const getNotifications = async (): Promise<AdminNotification[]> => {
  const res = await api.get("/candidates/notifications");
  return res.data.map((n: any) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    notificationType: n.notification_type,
    isRead: n.is_read,
    createdAt: n.created_at,
  }));
};

export const markNotificationsRead = async (): Promise<any> => {
  const res = await api.put("/candidates/notifications/read");
  return res.data;
};

export const softDeleteCandidate = async (id: string): Promise<any> => {
  const res = await api.delete(`/candidates/${id}`);
  return res.data;
};

export const restoreCandidate = async (id: string): Promise<any> => {
  const res = await api.post(`/candidates/${id}/restore`);
  return res.data;
};

export const hardDeleteCandidate = async (id: string): Promise<any> => {
  const res = await api.delete(`/candidates/${id}/permanent`);
  return res.data;
};

export const regenerateCertificate = async (id: string): Promise<any> => {
  const res = await api.post(`/candidates/${id}/regenerate-certificate`);
  return res.data;
};

export const bulkRegenerateCertificates = async (candidateIds: string[]): Promise<any> => {
  const res = await api.post("/candidates/bulk-regenerate-certificates", {
    candidate_ids: candidateIds,
  });
  return res.data;
};

export const bulkHardDeleteCandidates = async (candidateIds: string[]): Promise<any> => {
  const res = await api.delete("/candidates/permanent", {
    data: { candidate_ids: candidateIds },
  });
  return res.data;
};

export const bulkSoftDeleteCandidates = async (candidateIds: string[]): Promise<any> => {
  const res = await api.post("/candidates/bulk-trash", {
    candidate_ids: candidateIds,
  });
  return res.data;
};

/**
 * Public: Validate a single-use conversion token and return lead details.
 * Called on /apply page load when ?token= param is present.
 * Returns lead name/email/phone/course for pre-filling the form.
 * Throws on invalid or already-used token.
 */
export const validateConversionToken = async (
  token: string
): Promise<ConversionTokenDetails> => {
  const res = await api.get("/candidates/validate-token", {
    params: { token },
  });
  return res.data as ConversionTokenDetails;
};

export const updateCandidateOffer = async (
  id: string,
  offerData: {
    standard_course_fee: number;
    scholarship_amount?: number;
    special_discount?: number;
    corporate_discount?: number;
    promo_discount?: number;
    booking_amount?: number;
    offer_remarks?: string;
    offer_expiry_date?: string;
    admission_fee_amount?: number;
    auto_enroll_enabled?: boolean;
  }
): Promise<Candidate> => {
  const res = await api.put(`/candidates/${id}/offer`, offerData);
  return mapCandidate(res.data);
};

export const recordCandidatePayment = async (
  id: string,
  paymentData: {
    amount: number;
    payment_type: string;
    payment_method: string;
    transaction_id?: string;
  }
): Promise<Candidate> => {
  const res = await api.post(`/candidates/${id}/record-payment`, paymentData);
  return mapCandidate(res.data);
};

