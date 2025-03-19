import { useState, useEffect } from 'react';
import './EventForm.css';
import { useNavigate, useLocation } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import { FaCalendarAlt } from 'react-icons/fa';

export default function CelebrationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    eventTitle: '',
    eventTagline: '',
    eventSlogan: '',
    date: '',
    time: '',
    venue: '',
    organization: '',
    clubName: '',
    collaborator: ''
  });

  const [eventImage, setEventImage] = useState(null);

  // Load form data if passed from preview
  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImage(file);
    }
  };

  const handleClearForm = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to clear all form data?')) {
      setFormData({
        eventTitle: '',
        eventTagline: '',
        eventSlogan: '',
        date: '',
        time: '',
        venue: '',
        organization: '',
        clubName: '',
        collaborator: ''
      });
      setEventImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    let errors = {};
    let hasErrors = false;

    // Validate required fields
    if (!formData.eventTitle) {
      errors.eventTitle = 'Event Title is required';
      hasErrors = true;
    }
    if (!formData.eventTagline) {
      errors.eventTagline = 'Event Tagline is required';
      hasErrors = true;
    }
    if (!formData.date) {
      errors.date = 'Date is required';
      hasErrors = true;
    }
    if (!formData.time) {
      errors.time = 'Time is required';
      hasErrors = true;
    }
    if (!formData.venue) {
      errors.venue = 'Venue is required';
      hasErrors = true;
    }
    if (!eventImage) {
      errors.eventImage = 'Event Image is required';
      hasErrors = true;
    }

    if (hasErrors) {
      setFormErrors(errors);
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsLoading(true);

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    });

    if (eventImage) {
      form.append('eventImage', eventImage);
    }

    try {
      const response = await fetch('https://appsail-50025424145.development.catalystappsail.in/certificate/generate-celebration', {
        method: 'POST',
        body: form
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        navigate('/preview', { 
          state: { 
            pdfUrl: url,
            formType: 'celebration',
            formData: formData
          } 
        });
      } else {
        console.error('Failed to generate celebration invite');
        alert('Failed to generate celebration invite. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while generating the celebration invite.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="text-xl font-bold mb-4">Generate Celebration Invite</h2>
      <div className="flex justify-end mb-4 space-x-4">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Switch to Regular Form
        </button>
        <button
          onClick={handleClearForm}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear Form
        </button>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-popup">
            <div className="loading-spinner"></div>
            <p>Generating Celebration Invite Preview...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Club Name */}
        <div className="space-y-2">
          <label htmlFor="clubName">Department:</label>
          <input 
            type="text" 
            id="clubName"
            name="clubName"
            value={formData.clubName}
            onChange={handleChange} 
            placeholder="Enter Department"
          />
        </div>

        {/* Collaborator */}
        <div className="space-y-2">
          <label htmlFor="collaborator">Additional Information:</label>
          <input 
            type="text" 
            id="collaborator"
            name="collaborator"
            value={formData.collaborator}
            onChange={handleChange} 
            placeholder="Enter Additional Information (if any)"
          />
        </div>

        {/* Event Title */}
        <div className="space-y-2">
          <label htmlFor="eventTitle">Event Name:*</label>
          <input 
            type="text" 
            id="eventTitle"
            name="eventTitle"
            value={formData.eventTitle}
            onChange={handleChange} 
            placeholder="Enter event Name"
            className={formErrors.eventTitle ? 'border-red-500' : ''}
            required
          />
          {formErrors.eventTitle && (
            <p className="text-red-500 text-sm">{formErrors.eventTitle}</p>
          )}
        </div>

        {/* Event Tagline */}
          <div className="space-y-2">
          <label htmlFor="eventTitle">Event Title:*</label>
                <input
                  type="text"
            id="eventTagline"
            name="eventTagline"
            value={formData.eventTagline}
            onChange={handleChange}
            placeholder="Enter event title"
            className={formErrors.eventTagline ? 'border-red-500' : ''}
            required
          />
          {formErrors.eventTagline && (
            <p className="text-red-500 text-sm">{formErrors.eventTagline}</p>
          )}
        </div>

        {/* Event Image */}
        <div className="space-y-2">
          <label htmlFor="eventImage">Event Image:*</label>
          <input
            type="file"
            id="eventImage"
            name="eventImage"
            onChange={handleImageChange}
            accept="image/*"
            className={formErrors.eventImage ? 'border-red-500' : ''}
            required
          />
          {formErrors.eventImage && (
            <p className="text-red-500 text-sm">{formErrors.eventImage}</p>
          )}
      </div>

        {/* Event Slogan */}
        <div className="space-y-2">
          <label htmlFor="eventSlogan">Event Slogan:</label>
          <input
            type="text"
            id="eventSlogan"
            name="eventSlogan"
            value={formData.eventSlogan}
            onChange={handleChange}
            placeholder="Enter event slogan"
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="date">Date:*</label>
            <div className="relative">
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={formErrors.date ? 'border-red-500' : ''}
                required
              />
              <FaCalendarAlt className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
            {formErrors.date && (
              <p className="text-red-500 text-sm">{formErrors.date}</p>
            )}
    </div>

          <div className="space-y-2">
            <label htmlFor="time">Time:*</label>
            <div className="relative">
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
                className={formErrors.time ? 'border-red-500' : ''}
            min="08:00"
            max="18:00"
            required
          />
              <FaClock className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {formErrors.time && (
              <p className="text-red-500 text-sm">{formErrors.time}</p>
            )}
          </div>
        </div>

        {/* Venue */}
        <div className="space-y-2">
          <label htmlFor="venue">Venue:*</label>
        <input 
          type="text" 
            id="venue"
          name="venue" 
          value={formData.venue}
          onChange={handleChange} 
            placeholder="Enter venue"
            className={formErrors.venue ? 'border-red-500' : ''}
          required 
        />
        {formErrors.venue && (
          <p className="text-red-500 text-sm">{formErrors.venue}</p>
        )}
        </div>
        
        {/* Academic Block */}
        <div className="space-y-2">
          <label htmlFor="organization">Academic Block:</label>
       <select 
            id="organization"
         name="organization" 
         value={formData.organization} 
         onChange={handleChange}
       >
        <option value="">Select Academic Block</option>
        <option value="I">I</option>
        <option value="II">II</option>
        <option value="III">III</option>
      </select>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Preview Invite
        </button>
      </form>
    </div>
  );
}