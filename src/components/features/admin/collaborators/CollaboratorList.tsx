import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminCollaborators, deleteCollaborator, updateCollaborator } from '@/services/collaboratorService';
import { useToast } from '@/components/ui/Toast';
import type { Collaborator } from '@/types/collaborator';
import '../Admin.css';

export default function CollaboratorList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState<string>('');

  const loadCollaborators = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const list = await getAdminCollaborators();
      setCollaborators(list);
    } catch (err) {
      console.error(err);
      toast('Failed to load collaborators list.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCollaborators(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [loadCollaborators]);

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirmId(id);
    setDeleteConfirmName(name);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    const success = await deleteCollaborator(deleteConfirmId);
    if (success) {
      toast('Collaborator deleted successfully', 'success');
      loadCollaborators(true);
    } else {
      toast('Failed to delete collaborator', 'error');
    }
    setDeleteConfirmId(null);
  };

  const handleToggleActive = async (col: Collaborator) => {
    try {
      const success = await updateCollaborator(col.id, { is_active: !col.isActive });
      if (success) {
        toast(`Collaborator "${col.name}" status updated.`, 'success');
        // Update local state immediately
        setCollaborators(prev =>
          prev.map(item =>
            item.id === col.id ? { ...item, isActive: !item.isActive } : item
          )
        );
      } else {
        toast('Failed to update status.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Failed to update status.', 'error');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Collaborating Organizations</h1>
        <p className="admin-page-subtitle">Manage external companies, institutions, and brand partners shown on the homepage.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => navigate('/admin/collaborators/add')} 
            className="activity-book-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', fontWeight: 600 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span> Add Collaborator
          </button>
        </div>

        <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', color: '#001943' }}>All Collaborators</h3>

          <div className="dashboard-table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '12px 8px' }}>Logo</th>
                  <th style={{ padding: '12px 8px' }}>Name</th>
                  <th style={{ padding: '12px 8px' }}>Display Order</th>
                  <th style={{ padding: '12px 8px' }}>Active Status</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3].map((item) => (
                    <tr key={item} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '40px', height: '40px', borderRadius: '4px' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '60%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '30%' }} /></td>
                      <td style={{ padding: '16px 8px' }}><div className="skeleton-line" style={{ width: '40px' }} /></td>
                      <td style={{ padding: '16px 8px', textAlign: 'right' }}><div className="skeleton-line" style={{ width: '50%', float: 'right' }} /></td>
                    </tr>
                  ))
                ) : collaborators.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No collaborators found. Add one to show on the public page.</td>
                  </tr>
                ) : (
                  collaborators.map(col => (
                    <tr key={col.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 8px' }}>
                        <div style={{
                          width: '80px',
                          height: '40px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px',
                          overflow: 'hidden'
                        }}>
                          <img 
                            src={col.logo} 
                            alt={col.name} 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            onError={(e) => {
                              // Fallback if image fails to load
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="22" y2="7"></line><line x1="2" y1="17" x2="22" y2="17"></line></svg>';
                            }}
                          />
                        </div>
                      </td>
                      <td style={{ padding: '16px 8px', fontWeight: 500, color: '#001943' }}>
                        {col.name}
                      </td>
                      <td style={{ padding: '16px 8px', color: '#001943', fontWeight: 600 }}>
                        {col.displayOrder}
                      </td>
                      <td style={{ padding: '16px 8px' }}>
                        <label className="admin-form-group" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', margin: 0 }}>
                          <input 
                            type="checkbox" 
                            checked={col.isActive}
                            onChange={() => handleToggleActive(col)}
                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                          />
                        </label>
                      </td>
                      <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => navigate(`/admin/collaborators/edit/${col.id}`)}
                            style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(col.id, col.name)}
                            style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {deleteConfirmId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 25, 67, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="admin-kpi-card glass-panel" style={{ width: '100%', maxWidth: '420px', background: '#ffffff', padding: '24px', borderRadius: '12px', display: 'block' }}>
            <h3 style={{ margin: 0, color: '#001943', marginBottom: '12px' }}>Delete Collaborator?</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
              Are you sure you want to delete collaborator "{deleteConfirmName}"? This action is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
