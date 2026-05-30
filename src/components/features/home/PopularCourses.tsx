import analyticsImg from '@/assets/images/courses/analytics.jpg'
import systemsImg from '@/assets/images/courses/systems.jpg'
import aiMlImg from '@/assets/images/courses/ai-ml.jpg'
import NeuralCanvas from '@/components/ui/NeuralCanvas'
import './PopularCourses.css'

export default function PopularCourses() {
  return (
    <section className="courses-section">
      <NeuralCanvas nodeCount={25} />

      <div className="courses-content-wrapper">
        <div className="container">
          <div className="courses-header">
            <h2 className="courses-title">Our Specializations</h2>
            <button className="courses-view-all">View All Courses</button>
          </div>
          <div className="courses-grid">
            {/* Course Card 1 */}
            <div className="course-card">
              <div className="course-img-wrapper">
                <img className="course-img" alt="Close up of a computer screen showing complex data analytics charts and code in a dark room" src={analyticsImg} />
                <div className="course-badge">Data Analytics</div>
              </div>
              <div className="course-content">
                <h4 className="course-card-title">Data Analytics</h4>
                <p className="course-card-desc">Master statistical modeling, data visualization, and predictive analytics using enterprise-grade toolchains.</p>
                <div className="course-footer">
                  <span className="course-duration">8 Weeks</span>
                  <span className="material-symbols-outlined course-icon" data-icon="trending_up">trending_up</span>
                </div>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="course-card">
              <div className="course-img-wrapper">
                <img className="course-img" alt="Server racks in a data center with blue and magenta neon lighting, high-tech infrastructure" src={systemsImg} />
                <div className="course-badge">AI and ML</div>
              </div>
              <div className="course-content">
                <h4 className="course-card-title">AI & Machine Learning</h4>
                <p className="course-card-desc">Build, train, and deploy neural networks. Focus on NLP, computer vision, and scalable ML architecture.</p>
                <div className="course-footer">
                  <span className="course-duration">8 Weeks</span>
                  <span className="material-symbols-outlined course-icon" data-icon="cloud">cloud</span>
                </div>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="course-card">
              <div className="course-img-wrapper">
                <img className="course-img" alt="Abstract representation of AI neural networks with glowing blue nodes and connections on a dark background" src={aiMlImg} />
                <div className="course-badge">Full-stack</div>
              </div>
              <div className="course-content">
                <h4 className="course-card-title">Python Full-Stack</h4>
                <p className="course-card-desc">Full-cycle modern web development. Architect scalable backends and highly responsive React interfaces.</p>
                <div className="course-footer">
                  <span className="course-duration">12 Weeks</span>
                  <span className="material-symbols-outlined course-icon" data-icon="smart_toy">smart_toy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
