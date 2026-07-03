import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { 
  type Lead, 
  type LeadNote, 
  type LeadTimelineEvent, 
  type LeadInteraction,
  updateLead, 
  createLead, 
  deleteLead, 
  checkDuplicate, 
  bulkUpdate, 
  bulkDelete, 
  addNote, 
  getLeadById,
  mergeLeads,
  generateConversionToken,
} from '@/services/leadService';
import { useToast } from '@/components/ui/Toast';
import { useAdminStore } from '@/services/adminStore';
import './Admin.css';

export default function LeadsAdmin() {
  const { 
    leads, 
    loadingLeads, 
    fetchLeads, 
    invalidateAll, 
    courses, 
    fetchCourses,
    leadsHasMore,
    loadingMoreLeads,
    fetchMoreLeads
  } = useAdminStore();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Selected IDs for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Detail Modal Edit Form States
  const [status, setStatus] = useState('Pending');
  const [adminNotes, setAdminNotes] = useState('');
  const [nextFollowupDate, setNextFollowupDate] = useState('');
  const [followupNotes, setFollowupNotes] = useState('');
  const [lastContactedAt, setLastContactedAt] = useState('');
  const [leadSource, setLeadSource] = useState('Website');
  const [priority, setPriority] = useState('Cold');
  const [assignedTo, setAssignedTo] = useState('');
  const [notesList, setNotesList] = useState<LeadNote[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<LeadTimelineEvent[]>([]);
  
  // Detail modal sub-panels/tabs
  const [detailTab, setDetailTab] = useState<'details' | 'notes' | 'timeline' | 'interactions'>('details');

  // Merge leads state
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeMasterId, setMergeMasterId] = useState<string>('');
  const [merging, setMerging] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  
  // Creation Form Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCourse, setNewCourse] = useState('General Inquiry');
  const [newSource, setNewSource] = useState('Manual Entry');
  const [newStatus, setNewStatus] = useState('new');
  const [newPriority, setNewPriority] = useState('Cold');
  const [newNotes, setNewNotes] = useState('');
  const [newAssignedTo, setNewAssignedTo] = useState('');
  
  // Confirmation & Warning states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateLead, setDuplicateLead] = useState<Lead | null>(null);
  
  // Bulk controls
  const [bulkActionType, setBulkActionType] = useState<'status' | 'source' | 'priority' | 'assign' | ''>('');
  const [bulkActionValue, setBulkActionValue] = useState('');

  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadLeads = async (force = false) => {
    try {
      await fetchLeads(force);
    } catch (err) {
      console.error(err);
      toast('Failed to load leads.', 'error');
    }
  };

  useEffect(() => {
    loadLeads();
    fetchCourses();
  }, []);

  // Lock background scroll when modal is open
  useEffect(() => {
    const isModalOpen = showAddModal || !!selectedLead || showDuplicateWarning || showDeleteConfirm || showBulkDeleteConfirm;
    if (isModalOpen) {
      document.body.classList.add('modal-open-lock');
    } else {
      document.body.classList.remove('modal-open-lock');
    }
    return () => {
      document.body.classList.remove('modal-open-lock');
    };
  }, [showAddModal, selectedLead, showDuplicateWarning, showDeleteConfirm, showBulkDeleteConfirm]);

  // Infinite scroll listener
  useEffect(() => {
    const container = document.querySelector('.admin-content-area');
    
    const handleScroll = () => {
      let shouldLoad = false;
      
      if (container) {
        // Scroll inside .admin-content-area
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollHeight - scrollTop <= clientHeight + 150) {
          shouldLoad = true;
        }
      } else {
        // Fallback to window scroll
        const { scrollTop, scrollHeight } = document.documentElement;
        if (window.innerHeight + scrollTop >= scrollHeight - 150) {
          shouldLoad = true;
        }
      }
      
      if (shouldLoad && leadsHasMore && !loadingMoreLeads && !loadingLeads && leads.length > 0) {
        fetchMoreLeads();
      }
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [leadsHasMore, loadingMoreLeads, loadingLeads, leads.length, fetchMoreLeads]);



  const handleRowClick = async (lead: Lead) => {
    // Fetch full lead including notes and timeline events
    const fullLead = await getLeadById(lead.id);
    const targetLead = fullLead || lead;
    
    setSelectedLead(targetLead);
    setStatus(targetLead.status);
    setAdminNotes(targetLead.adminNotes || '');
    setNextFollowupDate(targetLead.nextFollowupDate ? targetLead.nextFollowupDate.substring(0, 16) : '');
    setFollowupNotes(targetLead.followupNotes || '');
    setLastContactedAt(targetLead.lastContactedAt ? targetLead.lastContactedAt.substring(0, 16) : '');
    setLeadSource(targetLead.source || 'Website');
    setPriority(targetLead.priority || 'Cold');
    setAssignedTo(targetLead.assignedTo || '');
    setNotesList(targetLead.notes || []);
    setTimelineEvents(targetLead.timelineEvents || []);
    setDetailTab('details');
  };

  const refreshSelectedLead = async () => {
    if (!selectedLead) return;
    const updatedLead = await getLeadById(selectedLead.id);
    if (updatedLead) {
      setSelectedLead(updatedLead);
      setNotesList(updatedLead.notes || []);
      setTimelineEvents(updatedLead.timelineEvents || []);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setSaving(true);
    try {
      const nowIso = new Date().toISOString();
      const updated = await updateLead(
        selectedLead.id,
        status,
        adminNotes,
        lastContactedAt ? new Date(lastContactedAt).toISOString() : nowIso,
        nextFollowupDate ? new Date(nextFollowupDate).toISOString() : null,
        followupNotes || null,
        leadSource || null,
        priority,
        assignedTo || null
      );
      if (updated) {
        toast('Lead updates saved successfully', 'success');
        setSelectedLead(null);
        invalidateAll();
        loadLeads(true);
      } else {
        toast('Failed to save lead updates', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Failed to save lead updates', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleConvertLead = async (lead: Lead) => {
    // STEP 1 — CLIENT-SIDE VALIDATION
    if (lead.status !== "qualified") {
      toast("Only Qualified leads can be converted", "error");
      return;
    }
    if (!lead.email) {
      toast("Recipient email address is missing", "error");
      return;
    }

    setSaving(true);
    try {
      // STEP 2 — GENERATE SECURE SINGLE-USE TOKEN (also updates lead status to 'converted' server-side)
      const { token } = await generateConversionToken(lead.id);

      // STEP 3 — BUILD TOKENIZED LINK (no lead_id, name, email in URL)
      const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "https://www.agenticx.co.in";
      const applicationLink = `${frontendUrl}/apply?token=${token}`;

      // STEP 4 — SEND EMAIL with tokenized link
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_name: lead.name,
          to_email: lead.email,
          application_link: applicationLink,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // STEP 5 — SUCCESS FEEDBACK
      toast("Application link sent to candidate successfully", "success");
      setSelectedLead(null);
      invalidateAll();
      loadLeads(true);
    } catch (err: any) {
      console.error("Convert lead error:", err);
      const detail = err?.response?.data?.detail || err?.message || "Failed to send email or convert lead";
      toast(detail, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;
    try {
      const added = await addNote(selectedLead.id, newNoteText.trim());
      if (added) {
        setNewNoteText('');
        toast('Note added to timeline', 'success');
        await refreshSelectedLead();
      } else {
        toast('Failed to add note', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Error adding note', 'error');
    }
  };

  // Manual Lead Creation Check & Commit
  const handleCreateLeadSubmit = async (e: React.FormEvent, bypassDuplicateCheck = false) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      toast('Name and Email are required fields', 'error');
      return;
    }

    if (!bypassDuplicateCheck) {
      // Run duplicate check first
      setSaving(true);
      const dup = await checkDuplicate(newPhone || null, newEmail, newCourse || null);
      setSaving(false);
      if (dup) {
        setDuplicateLead(dup);
        setShowDuplicateWarning(true);
        return;
      }
    }

    setSaving(true);
    try {
      const created = await createLead({
        name: newName.trim(),
        email: newEmail.trim(),
        phone: newPhone.trim() || undefined,
        message: newNotes.trim() || undefined,
        interestedCourse: newCourse,
        source: newSource,
        status: newStatus,
        priority: newPriority,
        assignedTo: newAssignedTo || undefined,
      });

      if (created) {
        toast('New lead created successfully', 'success');
        setShowAddModal(false);
        resetCreateForm();
        invalidateAll();
        loadLeads(true);
      } else {
        toast('Failed to create new lead', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Error creating new lead', 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetCreateForm = () => {
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewCourse('General Inquiry');
    setNewSource('Manual Entry');
    setNewStatus('Pending');
    setNewPriority('Cold');
    setNewNotes('');
    setNewAssignedTo('');
    setDuplicateLead(null);
    setShowDuplicateWarning(false);
  };

  const handleSingleDelete = async () => {
    if (!selectedLead) return;
    setSaving(true);
    const success = await deleteLead(selectedLead.id);
    setSaving(false);
    if (success) {
      toast('Lead deleted successfully', 'success');
      setSelectedLead(null);
      setShowDeleteConfirm(false);
      invalidateAll();
      loadLeads(true);
    } else {
      toast('Failed to delete lead', 'error');
    }
  };

  // Bulk Operations
  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map(l => l.id));
    }
  };

  const handleApplyBulkAction = async () => {
    if (selectedIds.length === 0 || !bulkActionType || !bulkActionValue) return;
    
    setSaving(true);
    let success = false;
    
    if (bulkActionType === 'status') {
      success = await bulkUpdate(selectedIds, { status: bulkActionValue });
    } else if (bulkActionType === 'source') {
      success = await bulkUpdate(selectedIds, { source: bulkActionValue });
    } else if (bulkActionType === 'priority') {
      success = await bulkUpdate(selectedIds, { priority: bulkActionValue });
    } else if (bulkActionType === 'assign') {
      success = await bulkUpdate(selectedIds, { assignedTo: bulkActionValue });
    }

    setSaving(false);
    if (success) {
      toast(`Successfully updated ${selectedIds.length} leads`, 'success');
      setSelectedIds([]);
      setBulkActionType('');
      setBulkActionValue('');
      invalidateAll();
      loadLeads(true);
    } else {
      toast('Failed to apply bulk update', 'error');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setSaving(true);
    const success = await bulkDelete(selectedIds);
    setSaving(false);
    if (success) {
      toast(`Deleted ${selectedIds.length} leads successfully`, 'success');
      setSelectedIds([]);
      setShowBulkDeleteConfirm(false);
      invalidateAll();
      loadLeads(true);
    } else {
      toast('Failed to delete leads', 'error');
    }
  };

  const handleBulkExport = () => {
    if (selectedIds.length === 0) return;
    
    const selectedLeads = leads.filter(l => selectedIds.includes(l.id));
    
    // Build CSV Content
    const headers = ["Name", "Email", "Phone", "Course Interest", "Source", "Status", "Priority", "Assigned To", "Created Date"];
    const rows = selectedLeads.map(l => [
      l.name,
      l.email,
      l.phone || '',
      l.interestedCourse || 'General Inquiry',
      l.source || 'Website',
      l.status,
      l.priority,
      l.assignedTo || 'Unassigned',
      new Date(l.createdAt).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(",")].concat(rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bulk_selected_leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast(`Exported ${selectedIds.length} selected leads to CSV`, 'success');
  };

  const renderPriorityEmoji = (p: string) => {
    if (p === 'Hot') return '🔥 Hot';
    if (p === 'Warm') return '🟡 Warm';
    return '⚪ Cold';
  };

  const getLeadStatusBadgeStyle = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'new':
      case 'pending':
        return { background: '#fef3c7', color: '#92400e' };
      case 'contacted':
        return { background: '#dbeafe', color: '#1e40af' };
      case 'interested':
        return { background: '#e0f2fe', color: '#0369a1' };
      case 'not interested':
      case 'rejected':
        return { background: '#fee2e2', color: '#991b1b' };
      case 'qualified':
        return { background: '#dcfce7', color: '#166534' };
      case 'converted':
      case 'enrolled':
        return { background: '#f3e8ff', color: '#6b21a8' };
      default:
        return { background: '#f1f5f9', color: '#475569' };
    }
  };

  const sourcesList = [
    "Website", "Contact Form", "Course Enquiry", "Free Demo", "Consultation",
    "WhatsApp", "Phone Call", "Office Visit", "Referral", "Workshop", "Seminar",
    "College Drive", "Instagram", "Facebook", "Google Search", "Google Business",
    "AI Assistant", "Manual Entry"
  ];

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="admin-page-title">Student Leads Manager</h1>
          <p className="admin-page-subtitle">Track and follow up on contact forms, callback requests, and manual enquiries.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="activity-book-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Add Lead
        </button>
      </div>

      {/* KPI Info box */}
      <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', color: '#001943' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#3b82f6' }}>info</span>
          <h3 style={{ margin: 0, fontSize: '16px' }}>Lead Operations Control</h3>
        </div>
        <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
          Manage inbound leads, log history, and execute bulk tasks. Select multiple rows to perform bulk status, source, priority, or deletion operations.
        </p>
      </div>

      {/* Bulk Operations Toolbar */}
      {selectedIds.length > 0 && (
        <div className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 24px', marginBottom: '24px', background: '#eff6ff', borderColor: '#bfdbfe', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: '#1d4ed8' }}>check_box</span>
            <span style={{ fontWeight: 600, color: '#1e3a8a', fontSize: '14px' }}>{selectedIds.length} leads selected</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <select
              value={bulkActionType}
              onChange={e => {
                setBulkActionType(e.target.value as any);
                setBulkActionValue('');
              }}
              style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
            >
              <option value="">Choose Bulk Action...</option>
              <option value="status">Update Status</option>
              <option value="priority">Update Priority</option>
              <option value="source">Update Source</option>
              <option value="assign">Update Assignment</option>
            </select>

            {bulkActionType === 'status' && (
              <select
                value={bulkActionValue}
                onChange={e => setBulkActionValue(e.target.value)}
                style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
              >
                <option value="">Select Status...</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="interested">Interested</option>
                <option value="not interested">Not Interested</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
              </select>
            )}

            {bulkActionType === 'priority' && (
              <select
                value={bulkActionValue}
                onChange={e => setBulkActionValue(e.target.value)}
                style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
              >
                <option value="">Select Priority...</option>
                <option value="Hot">🔥 Hot</option>
                <option value="Warm">🟡 Warm</option>
                <option value="Cold">⚪ Cold</option>
              </select>
            )}

            {bulkActionType === 'source' && (
              <select
                value={bulkActionValue}
                onChange={e => setBulkActionValue(e.target.value)}
                style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
              >
                <option value="">Select Source...</option>
                {sourcesList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}

            {bulkActionType === 'assign' && (
              <select
                value={bulkActionValue}
                onChange={e => setBulkActionValue(e.target.value)}
                style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
              >
                <option value="">Select Assignment...</option>
                <option value="Admin">Admin</option>
                <option value="Counselor">Counselor</option>
                <option value="Trainer">Trainer</option>
              </select>
            )}

            {bulkActionType && bulkActionValue && (
              <button
                onClick={handleApplyBulkAction}
                style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Apply
              </button>
            )}

            <button
              onClick={handleBulkExport}
              style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
              Export
            </button>

            {selectedIds.length >= 2 && (
              <button
                onClick={() => {
                  setMergeMasterId(selectedIds[0]);
                  setShowMergeModal(true);
                }}
                style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>merge</span>
                Merge Leads
              </button>
            )}

            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
              Delete
            </button>

            <button
              onClick={() => setSelectedIds([])}
              style={{ background: '#e2e8f0', color: '#475569', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Table Panel */}
      <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
        <h3 style={{ marginBottom: '20px', color: '#001943' }}>Lead Listings</h3>
        
        <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch', marginBottom: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '12px 8px', width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={leads.length > 0 && selectedIds.length === leads.length}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                </th>
                <th style={{ padding: '12px 8px' }}>Student Name</th>
                <th style={{ padding: '12px 8px' }}>Email</th>
                <th style={{ padding: '12px 8px' }}>Course Interest</th>
                <th style={{ padding: '12px 8px' }}>Source</th>
                <th style={{ padding: '12px 8px' }}>Priority</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loadingLeads ? (
                [1, 2, 3].map((item) => (
                  <tr key={item} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '20px' }} /></td>
                    <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '60%' }} /></td>
                    <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '50%' }} /></td>
                    <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '40%' }} /></td>
                    <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '30%' }} /></td>
                    <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '20%' }} /></td>
                    <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '20%' }} /></td>
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No student inquiries found.</td>
                </tr>
              ) : (
                leads.map(lead => (
                  <tr 
                    key={lead.id} 
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                    className={`lead-row-hover ${selectedIds.includes(lead.id) ? 'admin-selected-row' : ''}`}
                  >
                    <td style={{ padding: '16px 8px' }} onClick={e => e.stopPropagation()}>
                      <input 
                        type="checkbox"
                        checked={selectedIds.includes(lead.id)}
                        onChange={() => handleSelectRow(lead.id)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                    </td>
                    <td style={{ padding: '16px 8px', fontWeight: 500, color: '#001943' }} onClick={() => handleRowClick(lead)}>{lead.name}</td>
                    <td style={{ padding: '16px 8px', color: '#475569' }} onClick={() => handleRowClick(lead)}>{lead.email}</td>
                    <td style={{ padding: '16px 8px', color: '#001943', fontWeight: 500 }} onClick={() => handleRowClick(lead)}>{lead.interestedCourse || 'General Inquiry'}</td>
                    <td style={{ padding: '16px 8px', color: '#64748b' }} onClick={() => handleRowClick(lead)}>{lead.source || 'Website'}</td>
                    <td style={{ padding: '16px 8px' }} onClick={() => handleRowClick(lead)}>
                      <span style={{ fontWeight: 600, fontSize: '13px', color: lead.priority === 'Hot' ? '#dc2626' : lead.priority === 'Warm' ? '#d97706' : '#64748b' }}>
                        {renderPriorityEmoji(lead.priority)}
                      </span>
                    </td>
                    <td style={{ padding: '16px 8px' }} onClick={() => handleRowClick(lead)}>
                      <span style={{ 
                        ...getLeadStatusBadgeStyle(lead.status),
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px', 
                        fontWeight: 'bold' 
                      }}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Infinite Scroll Loading/Status Indicator */}
        {(loadingMoreLeads || !leadsHasMore) && leads.length > 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '16px 0', 
            color: '#64748b', 
            fontSize: '13px', 
            borderTop: '1px solid #f1f5f9',
            marginTop: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px'
          }}>
            {loadingMoreLeads ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #e2e8f0',
                  borderTop: '2px solid #2563eb',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                <span>Loading more leads...</span>
              </div>
            ) : (
              <span>All leads loaded ({leads.length})</span>
            )}
          </div>
        )}
      </div>

      {/* Manual Add Lead Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 25, 67, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
          <div className="admin-modal-card glass-panel" style={{ maxWidth: '550px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px', flexShrink: 0 }}>
              <h3 style={{ margin: 0, color: '#001943' }}>Create New Lead Entry</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={e => handleCreateLeadSubmit(e)} className="admin-login-form" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0, overflow: 'hidden' }}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Student Name *</label>
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)} 
                    required
                    placeholder="Student's Full Name"
                    style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                  />
                </div>

                <div className="admin-form-row" style={{ marginTop: '14px' }}>
                  <div className="admin-form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      value={newEmail} 
                      onChange={e => setNewEmail(e.target.value)} 
                      required
                      placeholder="student@gmail.com"
                      style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      value={newPhone} 
                      onChange={e => setNewPhone(e.target.value)} 
                      placeholder="Phone/WhatsApp number"
                      style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div className="admin-form-row" style={{ marginTop: '14px' }}>
                  <div className="admin-form-group">
                    <label>Interested Course</label>
                    <select 
                      value={newCourse} 
                      onChange={e => setNewCourse(e.target.value)}
                      style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                    >
                      {courses && courses.length > 0 ? (
                        courses.map(c => (
                          <option key={c.id} value={c.title}>{c.title}</option>
                        ))
                      ) : null}
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Lead Source</label>
                    <select 
                      value={newSource} 
                      onChange={e => setNewSource(e.target.value)}
                      style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                    >
                      {sourcesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="admin-form-row" style={{ marginTop: '14px' }}>
                  <div className="admin-form-group">
                    <label>Initial Status</label>
                    <select 
                      value={newStatus} 
                      onChange={e => setNewStatus(e.target.value)}
                      style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="interested">Interested</option>
                      <option value="not interested">Not Interested</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Lead Priority</label>
                    <select 
                      value={newPriority} 
                      onChange={e => setNewPriority(e.target.value)}
                      style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                    >
                      <option value="Cold">⚪ Cold</option>
                      <option value="Warm">🟡 Warm</option>
                      <option value="Hot">🔥 Hot</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginTop: '14px' }}>
                  <label>Assigned Staff Owner</label>
                  <select 
                    value={newAssignedTo} 
                    onChange={e => setNewAssignedTo(e.target.value)}
                    style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                  >
                    <option value="">Unassigned</option>
                    <option value="Admin">Admin</option>
                    <option value="Counselor">Counselor</option>
                    <option value="Trainer">Trainer</option>
                  </select>
                </div>

                <div className="admin-form-group" style={{ marginTop: '14px' }}>
                  <label>Initial Profile Message / Notes</label>
                  <textarea 
                    value={newNotes} 
                    onChange={e => setNewNotes(e.target.value)}
                    placeholder="Record call summary or comments..."
                    style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', minHeight: '80px', borderRadius: '8px', padding: '10px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', flexShrink: 0 }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="activity-book-btn"
                  style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 600, opacity: saving ? 0.7 : 1 }}
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Duplicate Warning Dialog */}
      {showDuplicateWarning && duplicateLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 25, 67, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="admin-kpi-card glass-panel" style={{ width: '100%', maxWidth: '450px', background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', display: 'block', border: '1px solid #fbd38d' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#dd6b20', marginBottom: '16px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>warning</span>
              <h3 style={{ margin: 0 }}>Potential Duplicate Found</h3>
            </div>
            
            <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
              An active lead is already registered with identical info for this course:
            </p>

            <div style={{ background: '#fffaf0', border: '1px solid #feebc8', borderRadius: '8px', padding: '16px', fontSize: '13px', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '6px' }}>
                <span style={{ fontWeight: 600, color: '#7b341e' }}>Name:</span>
                <span style={{ color: '#2d3748' }}>{duplicateLead.name}</span>
                
                <span style={{ fontWeight: 600, color: '#7b341e' }}>Course:</span>
                <span style={{ color: '#2d3748', fontWeight: 600 }}>{duplicateLead.interestedCourse || 'General Inquiry'}</span>
                
                <span style={{ fontWeight: 600, color: '#7b341e' }}>Created:</span>
                <span style={{ color: '#2d3748' }}>{new Date(duplicateLead.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => {
                  setShowDuplicateWarning(false);
                  setDuplicateLead(null);
                }}
                style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
              >
                Cancel
              </button>
              
              <button 
                onClick={() => {
                  setShowDuplicateWarning(false);
                  setShowAddModal(false);
                  handleRowClick(duplicateLead);
                  setDuplicateLead(null);
                }}
                style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
              >
                View Existing
              </button>
              
              <button 
                onClick={(e) => handleCreateLeadSubmit(e, true)}
                style={{ background: '#dd6b20', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
              >
                Create Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Lead Confirm */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 25, 67, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="admin-kpi-card glass-panel" style={{ width: '100%', maxWidth: '400px', background: '#ffffff', padding: '24px', borderRadius: '12px', display: 'block' }}>
            <h3 style={{ margin: 0, color: '#001943', marginBottom: '12px' }}>Delete Lead?</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSingleDelete}
                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirm */}
      {showBulkDeleteConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 25, 67, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="admin-kpi-card glass-panel" style={{ width: '100%', maxWidth: '400px', background: '#ffffff', padding: '24px', borderRadius: '12px', display: 'block' }}>
            <h3 style={{ margin: 0, color: '#001943', marginBottom: '12px' }}>Delete {selectedIds.length} Leads?</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
              Are you sure you want to bulk-delete these {selectedIds.length} leads? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setShowBulkDeleteConfirm(false)}
                style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleBulkDelete}
                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leads Detail & CRM Modal */}
      {selectedLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 25, 67, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
          <div className="admin-modal-card glass-panel" style={{ maxWidth: '650px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px', flexShrink: 0 }}>
              <div>
                <h3 style={{ margin: 0, color: '#001943', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{selectedLead.name}</span>
                  <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: selectedLead.priority === 'Hot' ? '#fee2e2' : selectedLead.priority === 'Warm' ? '#fef3c7' : '#f1f5f9', color: selectedLead.priority === 'Hot' ? '#991b1b' : selectedLead.priority === 'Warm' ? '#92400e' : '#475569' }}>
                    {renderPriorityEmoji(selectedLead.priority)}
                  </span>
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Assigned: {selectedLead.assignedTo || 'Unassigned'}</span>
              </div>
              <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', gap: '16px', flexShrink: 0 }}>
              <button 
                onClick={() => setDetailTab('details')}
                style={{ background: 'none', border: 'none', borderBottom: detailTab === 'details' ? '2px solid #2563eb' : '2px solid transparent', padding: '8px 4px', fontWeight: 600, color: detailTab === 'details' ? '#2563eb' : '#64748b', cursor: 'pointer' }}
              >
                Lead Details
              </button>
              
              <button 
                onClick={() => setDetailTab('notes')}
                style={{ background: 'none', border: 'none', borderBottom: detailTab === 'notes' ? '2px solid #2563eb' : '2px solid transparent', padding: '8px 4px', fontWeight: 600, color: detailTab === 'notes' ? '#2563eb' : '#64748b', cursor: 'pointer' }}
              >
                CRM Notes ({notesList.length})
              </button>
              
              <button 
                onClick={() => setDetailTab('timeline')}
                style={{ background: 'none', border: 'none', borderBottom: detailTab === 'timeline' ? '2px solid #2563eb' : '2px solid transparent', padding: '8px 4px', fontWeight: 600, color: detailTab === 'timeline' ? '#2563eb' : '#64748b', cursor: 'pointer' }}
              >
                Lead Timeline
              </button>

              <button 
                onClick={() => setDetailTab('interactions')}
                style={{ background: 'none', border: 'none', borderBottom: detailTab === 'interactions' ? '2px solid #7c3aed' : '2px solid transparent', padding: '8px 4px', fontWeight: 600, color: detailTab === 'interactions' ? '#7c3aed' : '#64748b', cursor: 'pointer' }}
              >
                Interactions ({(selectedLead.interactions || []).length})
              </button>
            </div>

            {/* TAB 1: Lead Details Form */}
            {detailTab === 'details' && (
              <form onSubmit={handleSaveChanges} className="admin-login-form" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0, overflow: 'hidden' }}>
                <div className="admin-modal-body">
                  <div className="admin-details-grid">
                    <span style={{ fontWeight: 600, color: '#64748b' }}>Name:</span>
                    <span style={{ color: '#001943', fontWeight: 600 }}>{selectedLead.name}</span>

                    <span style={{ fontWeight: 600, color: '#64748b' }}>Phone:</span>
                    <span style={{ color: '#001943' }}>{selectedLead.phone || 'N/A'}</span>

                    <span style={{ fontWeight: 600, color: '#64748b' }}>Email:</span>
                    <a href={`mailto:${selectedLead.email}`} style={{ color: '#2563eb', textDecoration: 'underline' }}>{selectedLead.email}</a>

                    <span style={{ fontWeight: 600, color: '#64748b' }}>Course Interest:</span>
                    <span style={{ color: '#001943', fontWeight: 500 }}>{selectedLead.interestedCourse || 'General Inquiry'}</span>

                    <span style={{ fontWeight: 600, color: '#64748b' }}>Goal:</span>
                    <span style={{ color: '#475569', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{selectedLead.message || 'No goal specified.'}</span>

                    <span style={{ fontWeight: 600, color: '#64748b' }}>Source:</span>
                    <span style={{ color: '#001943', fontWeight: 500 }}>{selectedLead.source || 'Website'}</span>

                    <span style={{ fontWeight: 600, color: '#64748b' }}>Created At:</span>
                    <span style={{ color: '#64748b' }}>{new Date(selectedLead.createdAt).toLocaleString()}</span>
                  </div>

                  {/* CRM Intelligence Section */}
                  {(selectedLead.leadScore !== undefined || selectedLead.interactionCount !== undefined) && (
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#7c3aed' }}>psychology</span>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: '#7c3aed' }}>CRM Intelligence</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
                        <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                          <div style={{ fontSize: '22px', fontWeight: 700, color: '#7c3aed' }}>{selectedLead.leadScore ?? 0}</div>
                          <div style={{ fontSize: '11px', color: '#6d28d9', marginTop: '2px' }}>Lead Score</div>
                          <div style={{ fontSize: '10px', color: '#8b5cf6', marginTop: '2px', fontStyle: 'italic' }}>
                            {(selectedLead.leadScore ?? 0) >= 100 ? '🔥 High Intent' : (selectedLead.leadScore ?? 0) >= 51 ? '🔥 Hot' : (selectedLead.leadScore ?? 0) >= 21 ? '🟡 Warm' : '⚪ Cold'}
                          </div>
                        </div>
                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                          <div style={{ fontSize: '22px', fontWeight: 700, color: '#1d4ed8' }}>{selectedLead.interactionCount ?? 1}</div>
                          <div style={{ fontSize: '11px', color: '#1e40af', marginTop: '2px' }}>Interactions</div>
                        </div>
                        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                          <div style={{ fontSize: '22px', fontWeight: 700, color: '#b45309' }}>{selectedLead.duplicateHits ?? 0}</div>
                          <div style={{ fontSize: '11px', color: '#92400e', marginTop: '2px' }}>Revisits</div>
                        </div>
                      </div>
                      {selectedLead.mergedCourses && selectedLead.mergedCourses.length > 0 && (
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Course Interests: </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                            {selectedLead.mergedCourses.map((c, i) => (
                              <span key={i} style={{ fontSize: '11px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '2px 8px' }}>{c}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedLead.firstSource && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                          <div><span style={{ color: '#64748b' }}>First Source: </span><span style={{ color: '#001943', fontWeight: 500 }}>{selectedLead.firstSource}</span></div>
                          <div><span style={{ color: '#64748b' }}>Latest Source: </span><span style={{ color: '#001943', fontWeight: 500 }}>{selectedLead.latestSource || selectedLead.firstSource}</span></div>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Followup Action Status</label>
                        <select 
                          value={status} 
                          onChange={e => setStatus(e.target.value)}
                          style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="interested">Interested</option>
                          <option value="not interested">Not Interested</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                        </select>
                      </div>

                      <div className="admin-form-group">
                        <label>Lead Origin Source</label>
                        <select 
                          value={leadSource} 
                          onChange={e => setLeadSource(e.target.value)}
                          style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                        >
                          {sourcesList.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="admin-form-row" style={{ marginTop: '14px' }}>
                      <div className="admin-form-group">
                        <label>Lead Priority</label>
                        <select 
                          value={priority} 
                          onChange={e => setPriority(e.target.value)}
                          style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                        >
                          <option value="Cold">⚪ Cold</option>
                          <option value="Warm">🟡 Warm</option>
                          <option value="Hot">🔥 Hot</option>
                        </select>
                      </div>

                      <div className="admin-form-group">
                        <label>Assigned Staff Owner</label>
                        <select 
                          value={assignedTo} 
                          onChange={e => setAssignedTo(e.target.value)}
                          style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                        >
                          <option value="">Unassigned</option>
                          <option value="Admin">Admin</option>
                          <option value="Counselor">Counselor</option>
                          <option value="Trainer">Trainer</option>
                        </select>
                      </div>
                    </div>

                    <div className="admin-form-row" style={{ marginTop: '14px' }}>
                      <div className="admin-form-group">
                        <label>Next Follow-up Date</label>
                        <input
                          type="datetime-local"
                          value={nextFollowupDate}
                          onChange={e => setNextFollowupDate(e.target.value)}
                          style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Last Contacted Date</label>
                        <input
                          type="datetime-local"
                          value={lastContactedAt}
                          onChange={e => setLastContactedAt(e.target.value)}
                          style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginTop: '14px' }}>
                      <label>Admin Background/Permanent Profile Summary</label>
                      <textarea
                        value={adminNotes}
                        onChange={e => setAdminNotes(e.target.value)}
                        placeholder="Record details (education, works in Bangalore, etc.)..."
                        style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', minHeight: '60px', borderRadius: '8px', padding: '10px', outline: 'none' }}
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginTop: '14px' }}>
                      <label>Follow-up Action Notes</label>
                      <textarea
                        value={followupNotes}
                        onChange={e => setFollowupNotes(e.target.value)}
                        placeholder="Response notes, callback instructions..."
                        style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', minHeight: '60px', borderRadius: '8px', padding: '10px', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', flexShrink: 0 }}>
                  <button 
                    type="button" 
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                    Delete Lead
                  </button>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleConvertLead(selectedLead)}
                      style={{ background: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', opacity: saving ? 0.7 : 1 }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>assignment_ind</span>
                      Convert to Candidate
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setSelectedLead(null)}
                      style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="activity-book-btn"
                      style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 600, opacity: saving ? 0.7 : 1 }}
                    >
                      Save Details
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: Notes History */}
            {detailTab === 'notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0, overflow: 'hidden' }}>
                <form onSubmit={handleAddNote} style={{ marginBottom: '20px', flexShrink: 0 }}>
                  <div className="admin-form-group">
                    <label style={{ fontWeight: 600, color: '#001943' }}>Add CRM Note</label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <textarea
                        value={newNoteText}
                        onChange={e => setNewNoteText(e.target.value)}
                        placeholder="Add a new timeline note for this student..."
                        required
                        style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', flex: 1, minHeight: '50px', borderRadius: '6px', padding: '8px', outline: 'none', resize: 'vertical' }}
                      />
                      <button 
                        type="submit"
                        style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </form>

                <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {notesList.length === 0 ? (
                    <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No CRM notes recorded yet.</p>
                  ) : (
                    notesList.map(note => (
                      <div key={note.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '13px' }}>
                        <p style={{ margin: 0, color: '#334155', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{note.content}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: '#94a3b8', fontSize: '11px' }}>
                          <span>By: {note.createdBy || 'System'}</span>
                          <span>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Chronological History Timeline */}
            {detailTab === 'timeline' && (
              <div className="admin-modal-body">
                {timelineEvents.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No history events available.</p>
                ) : (
                  <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid #e2e8f0', marginLeft: '8px' }}>
                    {timelineEvents.map((evt) => (
                      <div key={evt.id} style={{ position: 'relative', marginBottom: '20px' }}>
                        <div style={{
                          position: 'absolute',
                          left: '-27px',
                          top: '2px',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: evt.eventType === 'Converted' ? '#10b981' : evt.eventType === 'Deleted' ? '#ef4444' : '#3b82f6',
                          border: '2px solid #fff'
                        }} />
                        <div style={{ fontSize: '13px' }}>
                          <span style={{ fontWeight: 600, color: '#001943' }}>{evt.eventType}</span>
                          <span style={{ color: '#64748b', fontSize: '11px', marginLeft: '10px' }}>
                            {new Date(evt.createdAt).toLocaleString()}
                          </span>
                          <p style={{ margin: '4px 0 0 0', color: '#475569', lineHeight: '1.4' }}>{evt.description}</p>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>By: {evt.createdBy || 'System'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Interactions History */}
            {detailTab === 'interactions' && (
              <div className="admin-modal-body">
                {(selectedLead.interactions || []).length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No interaction history recorded.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(selectedLead.interactions || []).map((inter: LeadInteraction) => (
                      <div key={inter.id} style={{ background: '#faf5ff', border: '1px solid #ddd6fe', borderRadius: '8px', padding: '12px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#7c3aed' }}>touch_app</span>
                            <span style={{ fontWeight: 700, color: '#6d28d9' }}>{inter.interactionType}</span>
                            {inter.source && (
                              <span style={{ fontSize: '11px', background: '#ede9fe', color: '#7c3aed', borderRadius: '10px', padding: '1px 7px' }}>{inter.source}</span>
                            )}
                          </div>
                          <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{new Date(inter.createdAt).toLocaleString()}</span>
                        </div>
                        {inter.course && (
                          <div style={{ fontSize: '12px', color: '#4c1d95', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600 }}>Course: </span>{inter.course}
                          </div>
                        )}
                        {inter.notes && (
                          <p style={{ margin: '4px 0 0 0', color: '#475569', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>{inter.notes}</p>
                        )}
                        {inter.ipAddress && (
                          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>IP: {inter.ipAddress}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Merge Leads Modal */}
      {showMergeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,25,67,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div className="admin-modal-card glass-panel" style={{ maxWidth: '500px', width: '100%', animation: 'modal-zoom 0.2s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: '#7c3aed', fontSize: '22px' }}>merge</span>
                <h3 style={{ margin: 0, color: '#001943', fontSize: '18px' }}>Merge Leads</h3>
              </div>
              <button onClick={() => setShowMergeModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
              You have selected <strong>{selectedIds.length} leads</strong> to merge. Choose the <strong>Master Record</strong> — all notes, timeline events, and interaction history from the other leads will be consolidated into it.
            </p>

            <div className="admin-form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 600, color: '#001943', display: 'block', marginBottom: '6px' }}>Master Record (Lead ID)</label>
              <select
                value={mergeMasterId}
                onChange={e => setMergeMasterId(e.target.value)}
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', height: '40px', borderRadius: '6px', padding: '0 8px', outline: 'none', fontSize: '13px' }}
              >
                {selectedIds.map(id => {
                  const lead = leads.find(l => l.id === id);
                  return (
                    <option key={id} value={id}>
                      {lead ? `${lead.name} — ${lead.email}` : id}
                    </option>
                  );
                })}
              </select>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>All other selected leads will be soft-deleted after merging.</p>
            </div>

            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px', fontSize: '13px', color: '#92400e' }}>
              ⚠️ This action is <strong>permanent</strong>. The duplicate leads will be moved to Trash and cannot participate in future duplicate detection.
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowMergeModal(false)}
                style={{ background: '#e2e8f0', color: '#475569', border: 'none', padding: '9px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
              >
                Cancel
              </button>
              <button
                disabled={merging || !mergeMasterId}
                onClick={async () => {
                  if (!mergeMasterId) return;
                  const dupIds = selectedIds.filter(id => id !== mergeMasterId);
                  if (dupIds.length === 0) {
                    toast('Please select at least 2 different leads to merge.', 'error');
                    return;
                  }
                  setMerging(true);
                  try {
                    const result = await mergeLeads(mergeMasterId, dupIds);
                    if (result) {
                      toast(`Successfully merged ${dupIds.length} lead(s) into master record.`, 'success');
                      setShowMergeModal(false);
                      setSelectedIds([]);
                      invalidateAll();
                      loadLeads(true);
                    } else {
                      toast('Merge failed. Please try again.', 'error');
                    }
                  } catch (err) {
                    console.error(err);
                    toast('Error during merge.', 'error');
                  } finally {
                    setMerging(false);
                  }
                }}
                style={{ background: merging ? '#a78bfa' : '#7c3aed', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '8px', fontWeight: 600, cursor: merging ? 'not-allowed' : 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>merge</span>
                {merging ? 'Merging...' : 'Confirm Merge'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .lead-row-hover:hover {
          background: #f8fafc !important;
        }
        .admin-selected-row {
          background: #eff6ff !important;
        }
        @keyframes modal-zoom {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

