import { useLocation, useNavigate } from "react-router-dom";
import "./PreviewPage.css"; 

export default function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pdfUrl, formType, formData } = location.state || { pdfUrl: null, formType: 'regular', formData: null };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "invite.pdf";
      link.click();
    }
  };

  const handleEdit = () => {
    const path = formType === 'celebration' ? '/celebration-form' : '/design-invitation';
    navigate(path, { state: { formData } });
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
        <button onClick={handleEdit} className="edit-button">
          Edit
        </button>
      </div>
    </div>
  );
}
