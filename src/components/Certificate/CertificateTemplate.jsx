import './CertificateTemplate.css';

const CertificateTemplate = ({ certificateData }) => {
  return (
    <div className="certificate-container">
      {/* Left Sidebar with Shapes */}
      <div className="certificate-sidebar">
        <div className="shape circle-yellow"></div>
        <div className="shape circle-coral"></div>
        <div className="shape triangle"></div>
        <div className="shape square"></div>
        <div className="shape rectangle"></div>
      </div>

      <div className="certificate-content">
        {/* Top Section */}
        <div className="certificate-top">
          <div className="medal-icon">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" fill="#FFD700"/>
              <path d="M30 15L35.5 26.5L48 28.5L39 37.5L41 50L30 44L19 50L21 37.5L12 28.5L24.5 26.5L30 15Z" fill="white"/>
            </svg>
          </div>
          <div className="logo-section">
          <img src="/flourish-logo.jpeg" alt="Flourish Logo" className="flourish-logo" />
          </div>
        </div>

        {/* Certificate Title */}
        <h1 className="certificate-title">Certificate of Participation</h1>

        {/* Certificate Body */}
        <div className="certificate-body">
          <p className="presented-text">THIS CERTIFICATE IS PRESENTED TO</p>
          <h2 className="recipient-name">{certificateData.name}</h2>
          
          <p className="participation-text">
            For attending the Flourish training session on
            <span className="date">{certificateData.date}</span>
          </p>
          
          <div className="course-title">
            <h3>Title-</h3>
            <p>{certificateData.courseName}</p>
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="certificate-footer">
          <div className="signature-section">
            <img 
              src={certificateData.signatureImage} 
              alt="Signature" 
              className="signature-image"
            />
            <p className="signature-label">SIGNATURE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate; 