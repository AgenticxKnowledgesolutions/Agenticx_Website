import { useParams } from 'react-router-dom';
import CollaboratorForm from './CollaboratorForm';
import '../Admin.css';

export default function CollaboratorEdit() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ color: '#001943' }}>Edit Collaborator</h1>
          <p className="admin-page-subtitle">Update information and visual representation for this collaborator</p>
        </div>
      </div>
      
      <div style={{ marginTop: '24px' }}>
        <CollaboratorForm mode="edit" collaboratorId={id} />
      </div>
    </div>
  );
}
