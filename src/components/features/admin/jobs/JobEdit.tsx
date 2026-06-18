import { useParams } from "react-router-dom";
import JobForm from "./JobForm";
import "../Admin.css";

export default function JobEdit() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="admin-page">
      <div className="admin-dashboard-header">
        <h1 className="admin-page-title">Edit Job Posting</h1>
        <p className="admin-page-subtitle">Modify the details or requirements of an existing job opening.</p>
      </div>

      <JobForm mode="edit" jobId={id} />
    </div>
  );
}
