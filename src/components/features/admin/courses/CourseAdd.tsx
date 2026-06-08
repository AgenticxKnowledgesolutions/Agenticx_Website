import CourseForm from './CourseForm';
import '../Admin.css';

export default function CourseAdd() {
  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Add Course</h1>
        <p className="admin-page-subtitle">Publish a new cohort specialization curriculum details.</p>
      </div>
      <CourseForm mode="create" />
    </div>
  );
}
