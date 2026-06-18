import JobForm from "./JobForm";
import "../Admin.css";

export default function JobAdd() {
  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Add Job Posting</h1>
        <p className="admin-page-subtitle">Publish a new job opportunity for prospective candidates.</p>
      </div>

      <JobForm mode="create" />
    </div>
  );
}
