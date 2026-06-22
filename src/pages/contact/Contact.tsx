import { useState, useEffect } from 'react';
import { createLead } from '@/services/leadService';
import './Contact.css';
import { useSettingsStore } from '@/store/useSettingsStore';
import SEO from '@/components/seo/SEO';
import { getCourses, Course } from '@/services/courseService';

const COURSE_OPTIONS = {
  Corporate: ['HTD Model', 'Corporate Training', 'Leadership Program'],
  Internship: ['MERN Stack', 'Python Full Stack', 'Data Science'],
  'Student Program': ['AI & ML', 'Cyber Security', 'Cloud Computing']
};

export default function Contact() {
  const settings = useSettingsStore(state => state.settings);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    courseType: '',
    specificCourse: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isSubmitted]);

  useEffect(() => {
    getCourses()
      .then(data => {
        setCourses(data.filter(c => !c.isDeleted));
      })
      .catch(err => console.error("Failed to load courses for contact form:", err));
  }, []);

  const getDynamicCourseOptions = (category: string) => {
    const staticOptions = COURSE_OPTIONS[category as keyof typeof COURSE_OPTIONS] || [];
    
    // Filter dynamic courses matching this category
    const dynamicOptions = courses
      .filter(c => {
        const badgeLower = (c.badge || '').toLowerCase();
        const titleLower = c.title.toLowerCase();
        if (category === 'Corporate') {
          return badgeLower.includes('corporate') || titleLower.includes('corporate');
        }
        if (category === 'Internship') {
          return badgeLower.includes('internship') || titleLower.includes('internship');
        }
        if (category === 'Student Program') {
          return badgeLower.includes('student') || titleLower.includes('student');
        }
        if (category === 'Webinar') {
          return badgeLower.includes('webinar') || badgeLower.includes('workshop') || titleLower.includes('webinar') || titleLower.includes('workshop');
        }
        return false;
      })
      .map(c => c.title);

    // Merge static and dynamic options without duplicates
    const merged = Array.from(new Set([...staticOptions, ...dynamicOptions]));
    
    // Add a custom option
    merged.push("Custom / Other Topic");
    return merged;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await createLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Course Type: ${formData.courseType}. Requested free demo session.`,
        interestedCourse: formData.specificCourse === "Custom / Other Topic" ? customTopic : (formData.specificCourse || `${formData.courseType} Inquiry`),
        sourcePage: 'Contact Us Page'
      });
      if (response) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          courseType: '',
          specificCourse: ''
        });
        setCustomTopic('');
      } else {
        alert('Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="contact-page success-page">
        <SEO 
          title="Contact AgenticX | IT Training & Placement in Kollam"
          description="Get in touch with AgenticX Knowledge Solutions Kollam. Contact us for training inquiries, admissions, placements, or business automation partnerships."
          keywords="Contact AgenticX, IT training Kollam, academic admissions Kerala, business automation Kollam"
        />
        <div className="container contact-success-container">
          <div className="success-card glass-panel contact-shadow">
            <span className="material-symbols-outlined success-icon-large">check_circle</span>
            <h1 className="success-title">Thank You!</h1>
            <p className="success-message">
              Your request has been successfully submitted. Our team will get back to you shortly.
            </p>
            <button className="btn-primary" onClick={() => setIsSubmitted(false)}>
              Back to Contact
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <SEO 
        title="Contact AgenticX | IT Training & Placement in Kollam"
        description="Get in touch with AgenticX Knowledge Solutions Kollam. Contact us for training inquiries, admissions, placements, or business automation partnerships."
        keywords="Contact AgenticX, IT training Kollam, academic admissions Kerala, business automation Kollam"
      />
      {/* HERO SECTION */}
      <section className="contact-hero">
        <div className="container contact-hero-container">
          <span className="contact-hero-subtitle">Get in Touch</span>
          <h1 className="contact-hero-title">Get in Touch with AgenticX</h1>
          <p className="contact-hero-desc">
            Welcome to AgenticX, your trusted partner in career transformation and industry-ready training. Whether you have questions about our programs, need guidance, or want to explore opportunities, our team is here to support you every step of the way. Reach out to us today and take the first step toward your future.
            <br/><br/>
            Thank you for choosing AgenticX. We look forward to connecting with you.
          </p>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="contact-cards-section">
        <div className="container contact-cards-grid">
          
          <div className="contact-card contact-shadow">
            <div className="card-header-strip"></div>
            <div className="card-body">
              <div className="card-header-row">
                <div className="card-icon-wrapper">
                  <span className="material-symbols-outlined card-icon">location_on</span>
                </div>
                <h3 className="card-title">Our Location</h3>
              </div>
              <p className="card-text">
                {settings?.companyName || "AgenticX Knowledge Solutions"}<br/>
                {settings?.addressLine1 || "3rd Floor, Raj Plaza"}<br/>
                {[settings?.addressLine2, settings?.city, settings?.state, settings?.postalCode].filter(Boolean).join(", ") || "Town Limit, Kollam"}
              </p>
            </div>
          </div>

          <div className="contact-card contact-shadow">
            <div className="card-header-strip"></div>
            <div className="card-body">
              <div className="card-header-row">
                <div className="card-icon-wrapper">
                  <span className="material-symbols-outlined card-icon">call</span>
                </div>
                <h3 className="card-title">Call Us</h3>
              </div>
              <p className="card-text">
                {settings?.primaryPhone && <>{settings.primaryPhone}<br/></>}
                {settings?.secondaryPhone && <>{settings.secondaryPhone}</>}
                {!settings && (
                  <>
                    +91 9496552094<br/>
                    +91 9496852094
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="contact-card contact-shadow">
            <div className="card-header-strip"></div>
            <div className="card-body">
              <div className="card-header-row">
                <div className="card-icon-wrapper">
                  <span className="material-symbols-outlined card-icon">mail</span>
                </div>
                <h3 className="card-title">Send Email</h3>
              </div>
              <p className="card-text">
                {settings?.primaryEmail && <>{settings.primaryEmail}<br/></>}
                {settings?.secondaryEmail && <>{settings.secondaryEmail}</>}
                {!settings && (
                  <>
                    anju.muraleedharan@agenticx.co.in<br/>
                    agenticxknowledgesolutions@gmail.com
                  </>
                )}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* BOOK FREE DEMO FORM */}
      <section className="contact-form-section">
        <div className="container form-container">
          <div className="form-card contact-shadow">
            <h2 className="form-title">Book a Free Demo</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Course Type</label>
                <select 
                  required
                  value={formData.courseType}
                  onChange={e => setFormData({...formData, courseType: e.target.value, specificCourse: ''})}
                >
                  <option value="" disabled>Select course type</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Internship">Internship</option>
                  <option value="Student Program">Student Program</option>
                  <option value="Webinar">Webinar</option>
                </select>
              </div>

              {formData.courseType && (
                <div className="form-group slide-down">
                  <label>Specific Course</label>
                  <select 
                    required
                    value={formData.specificCourse}
                    onChange={e => setFormData({...formData, specificCourse: e.target.value})}
                  >
                    <option value="" disabled>Select a course</option>
                    {getDynamicCourseOptions(formData.courseType).map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
              )}

              {formData.specificCourse === "Custom / Other Topic" && (
                <div className="form-group slide-down">
                  <label>Specify Custom Topic / Course Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Webinar on Generative AI"
                    value={customTopic}
                    onChange={e => setCustomTopic(e.target.value)}
                  />
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn-primary form-submit-btn" style={{ opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Submitting Inquiry...' : 'Submit'}
              </button>

            </form>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="contact-map-section">
        <div className="container map-container">
          <div className="map-wrapper contact-shadow">
            <iframe 
              src={settings?.googleMapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d246.36208069536437!2d76.61254242851638!3d8.898800762722871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05fd109874a36b%3A0x26d35fe01fea3245!2sAgenticX%20Knowledge%20Solutions%20LLP!5e0!3m2!1sen!2sin!4v1779083931591!5m2!1sen!2sin"} 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              title="AgenticX Location Map"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
}
