import { useParams } from 'react-router-dom';
import CourseForm from './CourseForm';
import '../Admin.css';

export default function CourseEdit() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Edit Course Spec</h1>
        <p className="admin-page-subtitle">Configure pricing details, curriculum syllabus, and catalog metadata.</p>
      </div>
      <CourseForm mode="edit" courseId={id} />
    </div>
  );
}
