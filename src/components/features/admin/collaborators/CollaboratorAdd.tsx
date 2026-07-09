import CollaboratorForm from './CollaboratorForm';
import '../Admin.css';

export default function CollaboratorAdd() {
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ color: '#001943' }}>Add New Collaborator</h1>
          <p className="admin-page-subtitle">Showcase a partner, institution, or client collaborating with AgenticX</p>
        </div>
      </div>
      
      <div style={{ marginTop: '24px' }}>
        <CollaboratorForm mode="create" />
      </div>
    </div>
  );
}
