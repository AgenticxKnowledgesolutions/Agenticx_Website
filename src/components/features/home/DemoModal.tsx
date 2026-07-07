import { useState, useEffect } from 'react';
import { createLead } from '@/services/leadService';
import { getCourses, type Course } from '@/services/courseService';
import './demoModal.css';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: ''
  });
  
  const [courses, setCourses] = useState<Course[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      const fetchAllCourses = async () => {
        const data = await getCourses();
        setCourses(data);
      };
      fetchAllCourses();
    }
  }, [isOpen]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.course) newErrors.course = 'Please select a course';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setSubmitting(true);
    try {
      const response = await createLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: 'Requested a free demo session via the home page popup.',
        interestedCourse: formData.course,
        sourcePage: 'Home Page Free Demo Popup'
      });
      if (response) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '', phone: '', course: '' });
          onClose();
        }, 2500);
      } else {
        alert('Failed to book demo. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="demo-modal-overlay" onClick={onClose}>
      <div className="demo-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="demo-modal-close" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
        
        {isSubmitted ? (
          <div className="demo-modal-success fade-in-scale">
            <span className="material-symbols-outlined success-icon">check_circle</span>
            <h3>Booking Confirmed!</h3>
            <p>We'll be in touch with you shortly.</p>
          </div>
        ) : (
          <div className="demo-modal-form-container fade-in-scale">
            <h2 className="demo-modal-title">Book a Free Demo</h2>
            <p className="demo-modal-subtitle">Experience the AgenticX difference firsthand.</p>
            
            <form onSubmit={handleSubmit} className="demo-modal-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={errors.name ? 'error-input' : ''}
                  placeholder="John Doe"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={errors.email ? 'error-input' : ''}
                  placeholder="john@example.com"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={errors.phone ? 'error-input' : ''}
                  placeholder="+91 9876543210"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
              
              <div className="form-group">
                <label>Course Interested In</label>
                <select 
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  className={errors.course ? 'error-input' : ''}
                >
                  <option value="" disabled>Select a course</option>
                  {courses && courses.length > 0 ? (
                    courses.map(course => (
                      <option key={course.id} value={course.title}>{course.title}</option>
                    ))
                  ) : null}
                  <option value="Faculty Development Programme (FDP)">Faculty Development Programme (FDP)</option>
                  <option value="General Inquiry">General Enquiry</option>
                </select>
                {errors.course && <span className="error-text">{errors.course}</span>}
              </div>
              
              <button type="submit" disabled={submitting} className="demo-modal-submit glow-button" style={{ opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Booking Demo...' : 'Request Demo'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
