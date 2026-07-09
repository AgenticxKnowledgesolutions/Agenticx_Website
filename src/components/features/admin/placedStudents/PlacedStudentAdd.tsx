import PlacedStudentForm from './PlacedStudentForm';
import '../Admin.css';

export default function PlacedStudentAdd() {
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ color: '#001943' }}>Add Placed Student</h1>
          <p className="admin-page-subtitle">Showcase a student who successfully secured a placement through AgenticX</p>
        </div>
      </div>
      
      <div style={{ marginTop: '24px' }}>
        <PlacedStudentForm mode="create" />
      </div>
    </div>
  );
}
