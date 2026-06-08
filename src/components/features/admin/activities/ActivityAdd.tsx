import ActivityForm from './ActivityForm';
import '../Admin.css';

export default function ActivityAdd() {
  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Add Live Event</h1>
        <p className="admin-page-subtitle">Publish a new webinar, workshop, or interactive coding session.</p>
      </div>
      <ActivityForm mode="create" />
    </div>
  );
}
