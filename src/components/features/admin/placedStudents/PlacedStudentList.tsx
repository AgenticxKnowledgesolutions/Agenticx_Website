import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminPlacedStudents, deletePlacedStudent, updatePlacedStudent } from '@/services/placedStudentService';
import { useToast } from '@/components/ui/Toast';
import type { PlacedStudent } from '@/types/placedStudent';
import '../Admin.css';

export default function PlacedStudentList() {
  const { toast } = useToast();
  const [students, setStudents] = useState<PlacedStudent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getAdminPlacedStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
      toast('Failed to load placed students.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleToggleActive = async (student: PlacedStudent) => {
    const updatedStatus = !student.isActive;
    try {
      const success = await updatePlacedStudent(student.id, { isActive: updatedStatus });
      if (success) {
        setStudents(prev =>
          prev.map(s => s.id === student.id ? { ...s, isActive: updatedStatus } : s)
        );
        toast(`Student status updated to ${updatedStatus ? 'Active' : 'Inactive'}`, 'success');
      } else {
        toast('Failed to update student status.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Failed to update student status.', 'error');
    }
  };

  const handleDelete = async (studentId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }
    try {
      const success = await deletePlacedStudent(studentId);
      if (success) {
        setStudents(prev => prev.filter(s => s.id !== studentId));
        toast('Placed student deleted successfully!', 'success');
      } else {
        toast('Failed to delete student.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Error deleting student.', 'error');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ color: '#001943' }}>Placed Students</h1>
          <p className="admin-page-subtitle">Manage successful students placed in various companies</p>
        </div>
        <Link 
          to="/admin/placed-students/add" 
          className="activity-book-btn" 
          style={{ textDecoration: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span className="material-symbols-outlined">add</span> Add Placed Student
        </Link>
      </div>

      <div className="admin-controls-bar" style={{ marginTop: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>search</span>
          <input 
            type="text" 
            placeholder="Search students by name, company, or role..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#001943' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="admin-kpi-card glass-panel" style={{ padding: '60px', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <div className="admin-loading-spinner" />
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="admin-kpi-card glass-panel" style={{ padding: '60px', textAlign: 'center', marginTop: '20px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#94a3b8', marginBottom: '16px' }}>group</span>
          <h3 style={{ color: '#001943', margin: '0 0 8px 0' }}>No Placed Students Found</h3>
          <p style={{ color: '#64748b', margin: 0 }}>
            {searchQuery ? 'Adjust your search query to find matching students.' : 'Add your first placed student to get started.'}
          </p>
        </div>
      ) : (
        <div className="admin-kpi-card glass-panel" style={{ padding: '0', marginTop: '20px', overflowX: 'auto', display: 'block' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Photo</th>
                <th>Student Name</th>
                <th>Company</th>
                <th>Job Role</th>
                <th style={{ textAlign: 'center', width: '120px' }}>Display Order</th>
                <th style={{ textAlign: 'center', width: '100px' }}>Active</th>
                <th style={{ textAlign: 'center', width: '140px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>
                    {student.photo ? (
                      <img 
                        src={student.photo} 
                        alt={student.name} 
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} 
                      />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <span className="material-symbols-outlined">person</span>
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#001943' }}>{student.name}</div>
                  </td>
                  <td>
                    <div style={{ color: '#475569' }}>{student.companyName}</div>
                  </td>
                  <td>
                    <span className="admin-badge-leads new" style={{ color: '#0f766e', background: '#ccfbf1', border: '1px solid #99f6e4' }}>
                      {student.role}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#475569' }}>{student.displayOrder ?? 0}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={student.isActive} 
                      onChange={() => handleToggleActive(student)}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }} 
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Link 
                        to={`/admin/placed-students/edit/${student.id}`} 
                        className="admin-action-btn edit" 
                        title="Edit Student"
                        style={{ textDecoration: 'none', display: 'inline-flex', padding: '6px', borderRadius: '6px', background: '#f1f5f9', color: '#475569' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                      </Link>
                      <button 
                        onClick={() => handleDelete(student.id, student.name)} 
                        className="admin-action-btn delete" 
                        title="Delete Student"
                        style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', padding: '6px', borderRadius: '6px', background: '#fef2f2', color: '#dc2626' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
