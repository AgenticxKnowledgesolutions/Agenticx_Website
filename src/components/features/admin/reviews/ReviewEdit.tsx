import { useParams } from 'react-router-dom';
import ReviewForm from './ReviewForm';
import '../Admin.css';

export default function ReviewEdit() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Edit Review</h1>
        <p className="admin-page-subtitle">Configure student testimonial, professional title, star rating, and avatar image.</p>
      </div>
      <ReviewForm mode="edit" reviewId={id} />
    </div>
  );
}
