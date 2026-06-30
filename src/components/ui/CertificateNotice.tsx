import './CertificateNotice.css'

interface CertificateNoticeProps {
  title?: string
  description?: string
  ctaText?: string
  link?: string
}

export default function CertificateNotice({
  title = "🎓 QR-Verified Digital Certificates",
  description = "Every eligible AgenticX Course, Internship, Workshop, and Webinar includes a secure QR-verified digital certificate upon successful completion.",
  ctaText = "Download & Verify Your Certificate →",
  link = "https://certificate.agenticx.co.in"
}: CertificateNoticeProps) {
  return (
    <div className="certificate-notice-banner">
      <div className="certificate-notice-accent-line"></div>
      <div className="certificate-notice-inner">
        <div className="certificate-notice-icon-wrapper">
          <span className="material-symbols-outlined certificate-notice-icon">workspace_premium</span>
        </div>
        
        <div className="certificate-notice-info">
          <h4 className="certificate-notice-title">{title}</h4>
          <p className="certificate-notice-description">{description}</p>
        </div>

        <div className="certificate-notice-action">
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="certificate-notice-btn"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </div>
  )
}
