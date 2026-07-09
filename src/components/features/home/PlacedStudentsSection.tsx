import { useEffect, useState, useRef } from 'react';
import { getPlacedStudents } from '@/services/placedStudentService';
import type { PlacedStudent } from '@/types/placedStudent';
import { PlacedStudentCardSkeleton } from '@/components/ui/Skeletons';
import './PlacedStudentsSection.css';

function PlacedStudentCard({ student }: { student: PlacedStudent }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="placed-student-card">
      <div className="placed-student-photo-wrapper">
        {imgError || !student.photo ? (
          <div className="placed-student-photo-fallback">
            <span className="material-symbols-outlined fallback-person-icon">person</span>
          </div>
        ) : (
          <img
            src={student.photo}
            alt={student.name}
            className="placed-student-photo"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="placed-student-name">{student.name}</div>
      <div className="placed-student-company">{student.companyName}</div>
      <div className="placed-student-role">{student.role}</div>
    </div>
  );
}

export default function PlacedStudentsSection() {
  const [students, setStudents] = useState<PlacedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getPlacedStudents();
        setStudents(data);
      } catch (err) {
        console.error('Error fetching placed students:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (loading || students.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            entry.target.classList.remove('fade-in-hidden');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    const cards = gridRef.current?.querySelectorAll('.placed-student-card, .placed-student-card-skeleton');
    cards?.forEach((card) => {
      card.classList.add('fade-in-hidden');
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [loading, students]);

  // Hide the section completely if not loading and no active placement records exist
  if (!loading && students.length === 0) {
    return null;
  }

  return (
    <section className="placed-students-section">
      <div className="container">
        <div className="placed-students-header">
          <h2 className="placed-students-title">Our Placed Students</h2>
          <p className="placed-students-subtitle">
            Our learners are building successful careers across leading companies in various industries.
          </p>
        </div>

        <div className="placed-students-grid" ref={gridRef}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <PlacedStudentCardSkeleton key={i} />
              ))
            : students.map((student) => (
                <PlacedStudentCard
                  key={student.id}
                  student={student}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
