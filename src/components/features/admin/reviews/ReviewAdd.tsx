import ReviewForm from './ReviewForm';
import '../Admin.css';

export default function ReviewAdd() {
  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Add Testimonial</h1>
        <p className="admin-page-subtitle">Publish a new student review or import external client feedback.</p>
      </div>
      <ReviewForm mode="create" />
    </div>
  );
}
