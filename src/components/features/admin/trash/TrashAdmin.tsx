import { useState, useEffect } from 'react';
import { useAdminStore } from '@/services/adminStore';
import { useToast } from '@/components/ui/Toast';
import { restoreLead, hardDeleteLead } from '@/services/leadService';
import { restoreCourse, hardDeleteCourse } from '@/services/courseService';
import { restoreActivity, hardDeleteActivity } from '@/services/activityService';
import { restoreReview, hardDeleteReview } from '@/services/reviewsService';
import '../Admin.css';

export default function TrashAdmin() {
  const {
    trashLeads,
    trashCourses,
    trashActivities,
    trashReviews,
    loadingTrashLeads,
    loadingTrashCourses,
    loadingTrashActivities,
    loadingTrashReviews,
    fetchTrashLeads,
    fetchTrashCourses,
    fetchTrashActivities,
    fetchTrashReviews,
    invalidateLeads,
    invalidateCourses,
    invalidateActivities,
    invalidateReviews,
    invalidateTrashLeads,
    invalidateTrashCourses,
    invalidateTrashActivities,
    invalidateTrashReviews,
    invalidateSummary
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'leads' | 'courses' | 'activities' | 'reviews'>('leads');
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: 'restore' | 'delete';
    itemType: 'lead' | 'course' | 'activity' | 'review';
    itemId: string;
    itemName: string;
  }>({
    show: false,
    type: 'restore',
    itemType: 'lead',
    itemId: '',
    itemName: ''
  });

  const [actionInProgress, setActionInProgress] = useState(false);
  const { toast } = useToast();

  const loadCurrentTabTrash = (force = false) => {
    if (activeTab === 'leads') fetchTrashLeads(force);
    if (activeTab === 'courses') fetchTrashCourses(force);
    if (activeTab === 'activities') fetchTrashActivities(force);
    if (activeTab === 'reviews') fetchTrashReviews(force);
  };

  useEffect(() => {
    loadCurrentTabTrash();
  }, [activeTab]);

  const handleAction = async () => {
    const { type, itemType, itemId } = confirmModal;
    if (!itemId) return;

    setActionInProgress(true);
    try {
      if (type === 'restore') {
        let success = false;
        if (itemType === 'lead') {
          const res = await restoreLead(itemId);
          if (res) {
            success = true;
            invalidateLeads();
            invalidateTrashLeads();
          }
        } else if (itemType === 'course') {
          const res = await restoreCourse(itemId);
          if (res) {
            success = true;
            invalidateCourses();
            invalidateTrashCourses();
          }
        } else if (itemType === 'activity') {
          const res = await restoreActivity(itemId);
          if (res) {
            success = true;
            invalidateActivities();
            invalidateTrashActivities();
          }
        } else if (itemType === 'review') {
          const res = await restoreReview(itemId);
          if (res) {
            success = true;
            invalidateReviews();
            invalidateTrashReviews();
          }
        }

        if (success) {
          toast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} restored successfully.`, 'success');
          invalidateSummary();
        } else {
          toast(`Failed to restore ${itemType}.`, 'error');
        }
      } else {
        // hard-delete
        if (itemType === 'lead') {
          const result = await hardDeleteLead(itemId);
          if (result.success) {
            invalidateTrashLeads();
            invalidateSummary();
            toast('Lead permanently deleted.', 'success');
          } else {
            // 409 Conflict: lead is linked to a Candidate Application
            toast(result.message, 'error');
          }
        } else if (itemType === 'course') {
          const success = await hardDeleteCourse(itemId);
          if (success) {
            invalidateTrashCourses();
            invalidateSummary();
            toast('Course permanently deleted.', 'success');
          } else {
            toast('Failed to permanently delete course.', 'error');
          }
        } else if (itemType === 'activity') {
          const success = await hardDeleteActivity(itemId);
          if (success) {
            invalidateTrashActivities();
            invalidateSummary();
            toast('Activity permanently deleted.', 'success');
          } else {
            toast('Failed to permanently delete activity.', 'error');
          }
        } else if (itemType === 'review') {
          const success = await hardDeleteReview(itemId);
          if (success) {
            invalidateTrashReviews();
            invalidateSummary();
            toast('Review permanently deleted.', 'success');
          } else {
            toast('Failed to permanently delete review.', 'error');
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast('Operation failed.', 'error');
    } finally {
      setActionInProgress(false);
      setConfirmModal({ show: false, type: 'restore', itemType: 'lead', itemId: '', itemName: '' });
      loadCurrentTabTrash(true);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString();
    } catch (e) {
      return dateStr;
    }
  };

  const currentLoading =
    activeTab === 'leads' ? loadingTrashLeads :
    activeTab === 'courses' ? loadingTrashCourses :
    activeTab === 'activities' ? loadingTrashActivities :
    loadingTrashReviews;

  const leadsCount = trashLeads?.length || 0;
  const coursesCount = trashCourses?.length || 0;
  const activitiesCount = trashActivities?.length || 0;
  const reviewsCount = trashReviews?.length || 0;

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header-row" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="admin-title">Trash Management</h1>
          <p className="admin-subtitle">Restore soft-deleted items or permanently remove them from the system.</p>
        </div>
        <button
          onClick={() => loadCurrentTabTrash(true)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '24px', gap: '20px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button
          onClick={() => setActiveTab('leads')}
          style={{
            padding: '12px 4px',
            borderBottom: activeTab === 'leads' ? '2px solid #001943' : '2px solid transparent',
            color: activeTab === 'leads' ? '#001943' : '#64748b',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '15px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>leaderboard</span>
          Leads ({leadsCount})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          style={{
            padding: '12px 4px',
            borderBottom: activeTab === 'courses' ? '2px solid #001943' : '2px solid transparent',
            color: activeTab === 'courses' ? '#001943' : '#64748b',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '15px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>book</span>
          Courses ({coursesCount})
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          style={{
            padding: '12px 4px',
            borderBottom: activeTab === 'activities' ? '2px solid #001943' : '2px solid transparent',
            color: activeTab === 'activities' ? '#001943' : '#64748b',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '15px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>local_activity</span>
          Activities ({activitiesCount})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          style={{
            padding: '12px 4px',
            borderBottom: activeTab === 'reviews' ? '2px solid #001943' : '2px solid transparent',
            color: activeTab === 'reviews' ? '#001943' : '#64748b',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '15px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>rate_review</span>
          Reviews ({reviewsCount})
        </button>
      </div>

      {/* Main Table Panel */}
      <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
        <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
          {activeTab === 'leads' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '12px 8px' }}>Lead Name</th>
                  <th style={{ padding: '12px 8px' }}>Email</th>
                  <th style={{ padding: '12px 8px' }}>Phone</th>
                  <th style={{ padding: '12px 8px' }}>Course Interest</th>
                  <th style={{ padding: '12px 8px' }}>Deleted At</th>
                  <th style={{ padding: '12px 8px' }}>Deleted By</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLoading ? (
                  [1, 2, 3].map((idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '60%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '50%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '40%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '40%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '30%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '30%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '40px', float: 'right' }} /></td>
                    </tr>
                  ))
                ) : leadsCount === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                      Trash is empty. No deleted leads found.
                    </td>
                  </tr>
                ) : (
                  trashLeads.map((lead) => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 8px', fontWeight: 600, color: '#0f172a' }}>{lead.name}</td>
                      <td style={{ padding: '16px 8px', color: '#475569' }}>{lead.email}</td>
                      <td style={{ padding: '16px 8px', color: '#475569' }}>{lead.phone || 'N/A'}</td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                          {lead.interestedCourse || 'General Inquiry'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 8px', color: '#64748b', fontSize: '13px' }}>{formatDate(lead.deletedAt)}</td>
                      <td style={{ padding: '16px 8px', color: '#64748b', fontSize: '13px' }}>{lead.deletedBy || 'System'}</td>
                      <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setConfirmModal({ show: true, type: 'restore', itemType: 'lead', itemId: lead.id, itemName: lead.name })}
                            style={{ background: 'none', border: '1px solid #0284c7', color: '#0284c7', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>restore</span>
                            Restore
                          </button>

                          {lead.hasCandidate ? (
                            // Lead is linked to a Candidate — disable hard delete, show info badge
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{
                                background: '#fef3c7',
                                color: '#92400e',
                                border: '1px solid #fcd34d',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                whiteSpace: 'nowrap',
                              }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>person_check</span>
                                Converted · Delete Candidate First
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmModal({ show: true, type: 'delete', itemType: 'lead', itemId: lead.id, itemName: lead.name })}
                              style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete_forever</span>
                              Delete Forever
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'courses' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '12px 8px' }}>Course Title</th>
                  <th style={{ padding: '12px 8px' }}>Slug</th>
                  <th style={{ padding: '12px 8px' }}>Deleted At</th>
                  <th style={{ padding: '12px 8px' }}>Deleted By</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLoading ? (
                  [1, 2, 3].map((idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '60%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '40%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '30%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '30%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '40px', float: 'right' }} /></td>
                    </tr>
                  ))
                ) : coursesCount === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                      Trash is empty. No deleted courses found.
                    </td>
                  </tr>
                ) : (
                  trashCourses.map((course) => (
                    <tr key={course.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 8px', fontWeight: 600, color: '#0f172a' }}>{course.title}</td>
                      <td style={{ padding: '16px 8px', color: '#475569' }}>{course.slug}</td>
                      <td style={{ padding: '16px 8px', color: '#64748b', fontSize: '13px' }}>{formatDate(course.deletedAt)}</td>
                      <td style={{ padding: '16px 8px', color: '#64748b', fontSize: '13px' }}>{course.deletedBy || 'System'}</td>
                      <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => setConfirmModal({ show: true, type: 'restore', itemType: 'course', itemId: course.id, itemName: course.title })}
                            style={{ background: 'none', border: '1px solid #0284c7', color: '#0284c7', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>restore</span>
                            Restore
                          </button>
                          <button
                            onClick={() => setConfirmModal({ show: true, type: 'delete', itemType: 'course', itemId: course.id, itemName: course.title })}
                            style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete_forever</span>
                            Delete Forever
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'activities' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '12px 8px' }}>Activity Title</th>
                  <th style={{ padding: '12px 8px' }}>Duration</th>
                  <th style={{ padding: '12px 8px' }}>Price</th>
                  <th style={{ padding: '12px 8px' }}>Deleted At</th>
                  <th style={{ padding: '12px 8px' }}>Deleted By</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLoading ? (
                  [1, 2, 3].map((idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '60%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '30%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '20%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '30%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '30%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '40px', float: 'right' }} /></td>
                    </tr>
                  ))
                ) : activitiesCount === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                      Trash is empty. No deleted activities found.
                    </td>
                  </tr>
                ) : (
                  trashActivities.map((activity) => (
                    <tr key={activity.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 8px', fontWeight: 600, color: '#0f172a' }}>{activity.title}</td>
                      <td style={{ padding: '16px 8px', color: '#475569' }}>{activity.duration}</td>
                      <td style={{ padding: '16px 8px', color: '#475569' }}>{activity.isFree ? 'Free' : `₹${activity.price}`}</td>
                      <td style={{ padding: '16px 8px', color: '#64748b', fontSize: '13px' }}>{formatDate(activity.deletedAt)}</td>
                      <td style={{ padding: '16px 8px', color: '#64748b', fontSize: '13px' }}>{activity.deletedBy || 'System'}</td>
                      <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => setConfirmModal({ show: true, type: 'restore', itemType: 'activity', itemId: activity.id, itemName: activity.title })}
                            style={{ background: 'none', border: '1px solid #0284c7', color: '#0284c7', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>restore</span>
                            Restore
                          </button>
                          <button
                            onClick={() => setConfirmModal({ show: true, type: 'delete', itemType: 'activity', itemId: activity.id, itemName: activity.title })}
                            style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete_forever</span>
                            Delete Forever
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'reviews' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '12px 8px' }}>Reviewer Name</th>
                  <th style={{ padding: '12px 8px' }}>Rating</th>
                  <th style={{ padding: '12px 8px' }}>Snippet</th>
                  <th style={{ padding: '12px 8px' }}>Deleted At</th>
                  <th style={{ padding: '12px 8px' }}>Deleted By</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLoading ? (
                  [1, 2, 3].map((idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '40%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '20%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '60%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '30%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '30%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '40px', float: 'right' }} /></td>
                    </tr>
                  ))
                ) : reviewsCount === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                      Trash is empty. No deleted reviews found.
                    </td>
                  </tr>
                ) : (
                  trashReviews.map((review) => (
                    <tr key={review.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 8px', fontWeight: 600, color: '#0f172a' }}>{review.name}</td>
                      <td style={{ padding: '16px 8px', color: '#fbbf24', fontWeight: 600 }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </td>
                      <td style={{ padding: '16px 8px', color: '#475569', fontSize: '13.5px' }}>
                        {review.review.length > 60 ? `${review.review.slice(0, 60)}...` : review.review}
                      </td>
                      <td style={{ padding: '16px 8px', color: '#64748b', fontSize: '13px' }}>{formatDate(review.deletedAt)}</td>
                      <td style={{ padding: '16px 8px', color: '#64748b', fontSize: '13px' }}>{review.deletedBy || 'System'}</td>
                      <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => setConfirmModal({ show: true, type: 'restore', itemType: 'review', itemId: review.id, itemName: review.name })}
                            style={{ background: 'none', border: '1px solid #0284c7', color: '#0284c7', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>restore</span>
                            Restore
                          </button>
                          <button
                            onClick={() => setConfirmModal({ show: true, type: 'delete', itemType: 'review', itemId: review.id, itemName: review.name })}
                            style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete_forever</span>
                            Delete Forever
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 25, 67, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="admin-kpi-card glass-panel" style={{ width: '100%', maxWidth: '420px', background: '#ffffff', padding: '24px', borderRadius: '12px', display: 'block' }}>
            <h3 style={{ margin: 0, color: '#001943', marginBottom: '12px' }}>
              {confirmModal.type === 'restore' ? 'Restore Item?' : 'Delete Permanently?'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
              {confirmModal.type === 'restore'
                ? `Are you sure you want to restore "${confirmModal.itemName}" to the active listings?`
                : `Are you sure you want to permanently delete "${confirmModal.itemName}"? This action CANNOT be undone and will delete it forever from the database.`}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                disabled={actionInProgress}
                onClick={() => setConfirmModal({ show: false, type: 'restore', itemType: 'lead', itemId: '', itemName: '' })}
                style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                disabled={actionInProgress}
                onClick={handleAction}
                style={{
                  background: confirmModal.type === 'restore' ? '#0284c7' : '#ef4444',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  opacity: actionInProgress ? 0.7 : 1
                }}
              >
                {actionInProgress ? 'Processing...' : confirmModal.type === 'restore' ? 'Restore' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
