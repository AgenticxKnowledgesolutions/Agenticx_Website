import { useParams } from 'react-router-dom';
import ActivityForm from './ActivityForm';
import '../Admin.css';

export default function ActivityEdit() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Edit Activity</h1>
        <p className="admin-page-subtitle">Configure webinar content, ticket prices, schedules, and duration.</p>
      </div>
      <ActivityForm mode="edit" activityId={id} />
    </div>
  );
}
