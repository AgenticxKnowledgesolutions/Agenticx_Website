import { useParams } from 'react-router-dom';
import PlacedStudentForm from './PlacedStudentForm';
import '../Admin.css';

export default function PlacedStudentEdit() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ color: '#001943' }}>Edit Placed Student</h1>
          <p className="admin-page-subtitle">Update placement details or photo for this student</p>
        </div>
      </div>
      
      <div style={{ marginTop: '24px' }}>
        <PlacedStudentForm mode="edit" studentId={id} />
      </div>
    </div>
  );
}
