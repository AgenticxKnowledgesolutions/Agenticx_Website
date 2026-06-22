import React, { useState, useEffect, useRef } from "react";
import {
  listCandidates,
  getCandidateById,
  updateCandidateStatus,
  addCandidateNote,
  getNotifications,
  markNotificationsRead,
  uploadCandidateDocument,
  softDeleteCandidate,
  restoreCandidate,
  hardDeleteCandidate,
} from "../../../../services/candidateService";
import type { Candidate, AdminNotification } from "../../../../services/candidateService";
import CandidatesImport from "./CandidatesImport";
import CandidatesImportHistory from "./CandidatesImportHistory";

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

  // Selected Candidate for detail drawer
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Note/Status actions
  const [newNoteContent, setNewNoteContent] = useState("");
  const [statusUpdateVal, setStatusUpdateVal] = useState("");
  const [statusRemarks, setStatusRemarks] = useState("");
  const [courseStartDateVal, setCourseStartDateVal] = useState("");
  const [completedAtVal, setCompletedAtVal] = useState("");
  const [courseDurationVal, setCourseDurationVal] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

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

  // Import tabs
  const [activeTab, setActiveTab] = useState<"list" | "import" | "import-history" | "trash">("list");

  // Notifications
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

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
      setStatusUpdateVal(c.applicationStatus);
      setCourseStartDateVal(c.courseStartDate ? c.courseStartDate.split("T")[0] : "");
      setCompletedAtVal(c.completedAt ? c.completedAt.split("T")[0] : "");
      setCourseDurationVal(c.courseDuration || "");
    } catch (err) {
      console.error("Failed to load candidate detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Trash actions
  const handleSoftDelete = async () => {
    if (!selectedCandidate) return;
    if (!window.confirm("Are you sure you want to move this candidate application to trash?")) {
      return;
    }
    setActionLoading(true);
    try {
      await softDeleteCandidate(selectedCandidate.id);
      setSelectedCandidateId(null);
      await loadCandidates();
    } catch (err) {
      console.error("Failed to soft delete candidate:", err);
      alert("Failed to move candidate to trash.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedCandidate) return;
    setActionLoading(true);
    try {
      await restoreCandidate(selectedCandidate.id);
      setSelectedCandidateId(null);
      await loadCandidates();
    } catch (err) {
      console.error("Failed to restore candidate:", err);
      alert("Failed to restore candidate.");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePermanentDelete = async () => {
    if (!selectedCandidate) return;
    if (!window.confirm("WARNING: Are you sure you want to PERMANENTLY delete this candidate application? This action CANNOT be undone.")) {
      return;
    }
    setActionLoading(true);
    try {
      await hardDeleteCandidate(selectedCandidate.id);
      setSelectedCandidateId(null);
      await loadCandidates();
    } catch (err) {
      console.error("Failed to permanently delete candidate:", err);
      alert("Failed to delete candidate permanently.");
    } finally {
      setActionLoading(false);
    }
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

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || !newNoteContent.trim()) return;
    setActionLoading(true);
    try {
      await addCandidateNote(selectedCandidate.id, newNoteContent);
      setNewNoteContent("");
      await loadSelectedCandidate(selectedCandidate.id);
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    setActionLoading(true);
    try {
      await updateCandidateStatus(
        selectedCandidate.id,
        statusUpdateVal,
        statusRemarks,
        courseStartDateVal ? new Date(courseStartDateVal).toISOString() : undefined,
        completedAtVal ? new Date(completedAtVal).toISOString() : undefined,
        courseDurationVal || undefined
      );
      setStatusRemarks("");
      await loadSelectedCandidate(selectedCandidate.id);
      await loadCandidates();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setActionLoading(false);
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
      {/* Top Navigation & Notifications bar */}
      <div style={styles.topHeader}>
        <div style={styles.tabButtons}>
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

        <div style={styles.notificationWrapper}>
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
          {!selectedCandidateId ? (
            /* Main List Section */
            <div className="list-section" style={{ width: "100%", minWidth: 0 }}>
              {/* Filters Bar */}
              <div style={styles.filterBar}>
                <input
                  type="text"
                  placeholder="Search name, email, phone or app number..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  style={styles.searchInput}
                />
                <select
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
                  value={courseFilter}
                  onChange={(e) => {
                    setCourseFilter(e.target.value);
                    setPage(1);
                  }}
                  style={styles.selectInput}
                >
                  <option value="">All Courses</option>
                  <option value="Artificial Intelligence & Machine Learning">AI & ML</option>
                  <option value="Full Stack Web Development">Full Stack Web Dev</option>
                  <option value="Data Science & Analytics">Data Science</option>
                  <option value="Software Engineering & DevOps">Software Eng</option>
                  <option value="Cyber Security">Cyber Security</option>
                </select>

                <div style={styles.dateRange}>
                  <input
                    type="date"
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
                          <th>App Number</th>
                          <th>Full Name</th>
                          <th>Course</th>
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
                            className={selectedCandidateId === c.id ? "selected" : ""}
                          >
                            <td style={{ fontWeight: "600", color: "#3b82f6" }}>{c.applicationNumber}</td>
                            <td>
                              <div style={{ fontWeight: "500" }}>{c.fullName}</div>
                              <div style={{ fontSize: "12px", color: "#64748b" }}>{c.email} • {c.phone}</div>
                            </td>
                            <td>{c.courseApplied}</td>
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
                          borderColor: selectedCandidateId === c.id ? "#3b82f6" : "rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        <div style={styles.cardHeader}>
                          <span style={styles.cardAppNum}>{c.applicationNumber}</span>
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
                        <div style={styles.cardCourse}>{c.courseApplied}</div>
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

                    {/* Personal Info */}
                    <div className="info-card-section">
                      <h4>Personal Information</h4>
                      <div className="details-grid-two-col">
                        <div className="info-item">
                          <span className="label">Full Name</span>
                          <span className="value">{selectedCandidate.fullName}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Email</span>
                          <span className="value">{selectedCandidate.email}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Phone</span>
                          <span className="value">{selectedCandidate.phone}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">WhatsApp</span>
                          <span className="value">{selectedCandidate.whatsappNumber || "N/A"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Emergency Contact</span>
                          <span className="value">{selectedCandidate.emergencyContact || "N/A"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Date of Birth</span>
                          <span className="value">
                            {selectedCandidate.dateOfBirth ? new Date(selectedCandidate.dateOfBirth).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label">Gender</span>
                          <span className="value">{selectedCandidate.gender || "N/A"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Blood Group</span>
                          <span className="value">{selectedCandidate.bloodGroup || "N/A"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Aadhaar Number</span>
                          <span className="value">{selectedCandidate.aadhaarNumberMasked || "N/A"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Languages Known</span>
                          <span className="value">{selectedCandidate.languagesKnown || "N/A"}</span>
                        </div>
                        <div className="info-item" style={{ gridColumn: "1 / -1" }}>
                          <span className="label">Address</span>
                          <span className="value">{selectedCandidate.address || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Parents & Reference */}
                    <div className="info-card-section">
                      <h4>Parent & Reference Info</h4>
                      <div className="details-grid-two-col">
                        <div className="info-item">
                          <span className="label">Guardian Name</span>
                          <span className="value">{selectedCandidate.parentGuardianName || "N/A"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Guardian Occupation</span>
                          <span className="value">{selectedCandidate.parentGuardianOccupation || "N/A"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Source</span>
                          <span className="value">{selectedCandidate.candidateSource || "N/A"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Reference Details</span>
                          <span className="value">{selectedCandidate.referenceDetails || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Course & Education */}
                    <div className="info-card-section">
                      <h4>Academics & Program</h4>
                      <div className="details-grid-two-col">
                        <div className="info-item">
                          <span className="label">Course Applied</span>
                          <span className="value">{selectedCandidate.courseApplied}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Mode of Learning</span>
                          <span className="value">{selectedCandidate.modeOfLearning}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Qualification</span>
                          <span className="value">{selectedCandidate.qualification || "N/A"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">College Name</span>
                          <span className="value">{selectedCandidate.collegeName || "N/A"}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Course Start Date</span>
                          <span className="value">
                            {selectedCandidate.courseStartDate ? new Date(selectedCandidate.courseStartDate).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label">Course End Date</span>
                          <span className="value">
                            {selectedCandidate.completedAt ? new Date(selectedCandidate.completedAt).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label">Course Duration</span>
                          <span className="value">{selectedCandidate.courseDuration || "N/A"}</span>
                        </div>
                        <div className="info-item" style={{ gridColumn: "1 / -1" }}>
                          <span className="label">Registration Transaction ID</span>
                          <span className="value" style={{ fontFamily: "monospace" }}>{selectedCandidate.registrationTransactionId || "N/A"}</span>
                        </div>
                      </div>
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
                                  <button
                                    type="button"
                                    className="doc-upload-label"
                                    onClick={() => triggerFileUpload(doc.key)}
                                    disabled={actionLoading}
                                  >
                                    {hasDoc ? "🔄 Replace" : "📤 Upload"}
                                  </button>
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
                            disabled={actionLoading}
                            style={{
                              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              border: "none",
                              color: "white",
                              padding: "10px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontWeight: "600",
                              transition: "all 0.2s"
                            }}
                          >
                            {actionLoading ? "Restoring..." : "✨ Restore Candidate"}
                          </button>
                          <button
                            type="button"
                            onClick={handlePermanentDelete}
                            disabled={actionLoading}
                            style={{
                              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                              border: "none",
                              color: "white",
                              padding: "10px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontWeight: "600",
                              transition: "all 0.2s"
                            }}
                          >
                            {actionLoading ? "Deleting..." : "🚨 Permanent Delete"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="info-card-section">
                        <h4>Update Admission Status</h4>
                        <form onSubmit={handleStatusChange} style={styles.inlineForm}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <select
                              value={statusUpdateVal}
                              onChange={(e) => setStatusUpdateVal(e.target.value)}
                              style={{
                                ...styles.selectInput,
                                width: "100%",
                              }}
                            >
                              <option value="Submitted">Submitted</option>
                              <option value="Under Review">Under Review</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Enrolled">Enrolled</option>
                              <option value="Completed">Completed</option>
                            </select>
                            
                            <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "5px" }}>Course Start Date</label>
                            <input
                              type="date"
                              value={courseStartDateVal}
                              onChange={(e) => setCourseStartDateVal(e.target.value)}
                              style={{
                                ...styles.remarksInput,
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "8px 12px",
                                background: "#1e293b",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "6px",
                                color: "#fff"
                              }}
                            />
                            
                            <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "5px" }}>Course End Date (Completed Date)</label>
                            <input
                              type="date"
                              value={completedAtVal}
                              onChange={(e) => setCompletedAtVal(e.target.value)}
                              style={{
                                ...styles.remarksInput,
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "8px 12px",
                                background: "#1e293b",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "6px",
                                color: "#fff"
                              }}
                            />
                            
                            <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "5px" }}>Course Duration</label>
                            <input
                              type="text"
                              placeholder="e.g. 3 Months, 6 Weeks"
                              value={courseDurationVal}
                              onChange={(e) => setCourseDurationVal(e.target.value)}
                              style={{
                                ...styles.remarksInput,
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "8px 12px",
                                background: "#1e293b",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "6px",
                                color: "#fff"
                              }}
                            />

                            <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "5px" }}>Counselor Remarks</label>
                            <input
                              type="text"
                              placeholder="Add counselor remarks..."
                              value={statusRemarks}
                              onChange={(e) => setStatusRemarks(e.target.value)}
                              style={{
                                ...styles.remarksInput,
                                width: "100%",
                                boxSizing: "border-box",
                              }}
                            />
                            <button
                              type="submit"
                              disabled={actionLoading}
                              style={{
                                ...styles.actionBtn,
                                width: "100%",
                              }}
                            >
                              {actionLoading ? "Updating..." : "Update Status"}
                            </button>
                          </div>
                        </form>
                        <button
                          type="button"
                          onClick={handleSoftDelete}
                          disabled={actionLoading}
                          style={{
                            background: "rgba(239, 68, 68, 0.08)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            color: "#ef4444",
                            padding: "10px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                            width: "100%",
                            marginTop: "12px",
                            transition: "all 0.2s"
                          }}
                        >
                          {actionLoading ? "Moving to Trash..." : "🗑️ Move to Trash"}
                        </button>
                      </div>
                    )}



                    {/* Counselor Notes */}
                    <div className="info-card-section">
                      <h4>Counselor Remarks & Notes</h4>
                      {activeTab !== "trash" && (
                        <form onSubmit={handleAddNote} style={styles.noteForm}>
                          <textarea
                            required
                            placeholder="Add counselor remark/note..."
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            rows={2}
                            style={{
                              ...styles.textareaInput,
                              width: "100%",
                              boxSizing: "border-box",
                            }}
                          />
                          <button
                            type="submit"
                            disabled={actionLoading}
                            style={{
                              ...styles.actionBtn,
                              width: "100%",
                            }}
                          >
                            {actionLoading ? "Adding..." : "Add Note"}
                          </button>
                        </form>
                      )}

                      <div style={styles.notesList}>
                        {selectedCandidate.notes?.map((n) => (
                          <div key={n.id} style={styles.noteItem}>
                            <div style={styles.noteHeader}>
                              <strong>{n.createdBy}</strong>
                              <span>{new Date(n.createdAt).toLocaleString()}</span>
                            </div>
                            <div style={styles.noteBody}>{n.content}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
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
};
