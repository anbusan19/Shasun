import { useLocation, useNavigate } from "react-router-dom";
import "./PreviewPage.css"; 

export default function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pdfUrl } = location.state || { pdfUrl: null };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "invite.pdf";
      link.click();
    }
  };

  return (
    <div className="preview-container">
      <h2 className="preview-title">Invite Preview</h2>
      {pdfUrl ? (
        <iframe src={pdfUrl} className="preview-iframe" title="Invite Preview" />
      ) : (
        <p className="preview-message">No preview available. Please go back and generate the invite.</p>
      )}
      <div className="button-container">
        <button onClick={handleDownload} className="download-button">
          Download
        </button>
        <button onClick={() => navigate("/design-invitation")} className="edit-button">
          Edit
        </button>
      </div>
    </div>
  );
}
