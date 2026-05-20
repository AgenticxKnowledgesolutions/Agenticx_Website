import "./StatsSection.css";

export default function StatsSection() {

  const stats = [
    {
      value: "100%",
      label: "Placement Assistance",
    },
    {
      value: "20+",
      label: "College Partners",
    },
    {
      value: "250+",
      label: "Graduates Trained",
    },
    {
      value: "24/7",
      label: "Mentor Access",
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