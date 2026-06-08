import "./StatsSection.css";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function StatsSection() {
  const settings = useSettingsStore(state => state.settings);

  const stats = [
    {
      value: settings ? `${settings.placementAssistancePercentage}%` : "100%",
      label: "Placement Assistance",
    },
    {
      value: settings ? `${settings.collegePartnersCount}+` : "20+",
      label: "College Partners",
    },
    {
      value: settings ? `${settings.graduatesTrainedCount}+` : "250+",
      label: "Graduates Trained",
    },
    {
      value: settings ? `${settings.studentsTrainedCount}+` : "100+",
      label: "Students Trained",
    },
  ];

  return (
    <section className="stats">

      <div className="container stats-grid">

        {stats.map((item) => (
          <div className="stats-card" key={item.label}>

            <h3 className="stats-value">
              {item.value}
            </h3>

            <p className="stats-label">
              {item.label}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}