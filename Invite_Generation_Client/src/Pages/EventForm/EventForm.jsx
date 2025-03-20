import { useState, useEffect } from 'react';
import './EventForm.css';
import { useNavigate } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import { FaCalendarAlt } from 'react-icons/fa';

export default function CertificateForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const loadStateFromStorage = (key, defaultValue) => {
    const savedData = localStorage.getItem(key);
    if (!savedData) return defaultValue;
    try {
      return JSON.parse(savedData);
    } catch (error) {
      console.warn(`Error parsing storage data for ${key}:`, error);
      return defaultValue;
    }
  };

  // Initialize states with data from localStorage
  const [formData, setFormData] = useState(
    loadStateFromStorage('formData', {
      recipientName: '',
      eventTitle: '',
      eventType: '',
      date: '',
      endDate: '',
      time: '',
      venue: '',
      organization: '',
      clubName: '',
      department: '',
      course: ''
    })
  );

  const [formErrors, setFormErrors] = useState({});

  const [files, setFiles] = useState({
    clubLogo: null
  });

  const [enableAgenda, setEnableAgenda] = useState(
    loadStateFromStorage('enableAgenda', false)
  );

  const [agendaList, setAgendaList] = useState(
    loadStateFromStorage('agendaList', [])
  );

  const [titles, setTitles] = useState(
    loadStateFromStorage('titles', [])
  );

  const [numChiefGuests, setNumChiefGuests] = useState(
    loadStateFromStorage('numChiefGuests', 0)
  );

  const [chiefGuestsData, setChiefGuestsData] = useState(
    loadStateFromStorage('chiefGuestsData', []).map(guest => ({
      ...guest,
      image: null // Reset image to null since we can't store binary data in localStorage
    }))
  );

  const [numCollaborators, setNumCollaborators] = useState(
    loadStateFromStorage('numCollaborators', 0)
  );

  const [collaboratorsData, setCollaboratorsData] = useState(
    loadStateFromStorage('collaboratorsData', []).map(collab => ({
      ...collab,
      logo: null // Reset logo to null since we can't store binary data in localStorage
    }))
  );

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    // Don't store files in localStorage
  }, [files]);

  useEffect(() => {
    localStorage.setItem('enableAgenda', JSON.stringify(enableAgenda));
  }, [enableAgenda]);

  useEffect(() => {
    localStorage.setItem('agendaList', JSON.stringify(agendaList));
  }, [agendaList]);

  useEffect(() => {
    localStorage.setItem('titles', JSON.stringify(titles));
  }, [titles]);

  useEffect(() => {
    localStorage.setItem('numChiefGuests', JSON.stringify(numChiefGuests));
  }, [numChiefGuests]);

  useEffect(() => {
    // Store chief guest data without the image property
    const dataForStorage = chiefGuestsData.map(({ image, ...rest }) => rest);
    localStorage.setItem('chiefGuestsData', JSON.stringify(dataForStorage));
  }, [chiefGuestsData]);

  useEffect(() => {
    localStorage.setItem('numCollaborators', JSON.stringify(numCollaborators));
  }, [numCollaborators]);

  useEffect(() => {
    // Store collaborator data without the logo property
    const dataForStorage = collaboratorsData.map(({ logo, ...rest }) => rest);
    localStorage.setItem('collaboratorsData', JSON.stringify(dataForStorage));
  }, [collaboratorsData]);

  // Add a clear form function
  const clearForm = () => {
    localStorage.clear();
    setFormData({
      recipientName: '',
      eventTitle: '',
      eventType: '',
      date: '',
      endDate: '',
      time: '',
      venue: '',
      organization: '',
      clubName: '',
      department: '',
      course: ''
    });
    setFiles({ clubLogo: null });
    setEnableAgenda(false);
    setAgendaList([]);
    setTitles([]);
    setNumChiefGuests(0);
    setChiefGuestsData([]);
    setNumCollaborators(0);
    setCollaboratorsData([]);
  };

  // Add a button to clear the form
  const handleClearForm = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to clear all form data?')) {
      clearForm();
    }
  };

  // Dropdown options for courses
  const ugCourses = [
    "BSc - Computer Science",
    "BSc - Mathematics",
    "BSc - Physchology",
    "BSc - Visual Communication",
    "BSc - Home Science Interior Design & Decor",
    "BSc - Commerce Science",
    "B.com - Honours",
    "B.com - General",
    "B.com - Accounting & Finance",
    "B.com - Corporate Secretaryship",
    "B.com - Bank Management",
    "B.com - Computer Application",
    "BBA - Business Administration",
    "BCA - Computer Application",
    "B.A. - English"
  ];

  const pgCourses = [
    "Department of Journalism and Communication",
    "Department of Visual Communication",
    "Department of Psychology",
    "Department of Commerce",
    "Department of Computer Science"
  ];

  const pgResearchCourses = [
    "Department of Commerce",
    "Department of Computer Science"
  ];

  // Event types dropdown options
  const eventTypes = [
    "Guest Lecture",
    "Alumni Guest Lecture",
    "Workshop"
  ];

  // Update course when department changes
  useEffect(() => {
    if (formData.department === 'UG') {
      if (!formData.course) {
        setFormData(prev => ({ ...prev, course: "" }));
      }
    } else if (formData.department === 'PG') {
      if (!formData.course) {
        setFormData(prev => ({ ...prev, course: pgCourses[0] }));
      }
    } else if (formData.department === 'PG & Research') {
      if (!formData.course) {
        setFormData(prev => ({ ...prev, course: pgResearchCourses[0] }));
      }
    }
  }, [formData.department]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const filesArray = e.target.files;
    setFiles(prev => ({
      ...prev,
      [name]:
        name === 'clubLogo' 
          ? filesArray[0]
          : Array.from(filesArray)
    }));
  };

  // Chief Guests Handlers
  const handleNumChiefGuestsChange = (e) => {
    const num = parseInt(e.target.value, 10);
    setNumChiefGuests(num);
    const newData = [];
    for (let i = 0; i < num; i++) {
      newData.push({
        salutation: '',
        name: '',
        designation: '',
        additionalText: '',
        image: null
      });
    }
    setChiefGuestsData(newData);
  };

  const handleChiefGuestChange = (index, field, value) => {
    const updated = [...chiefGuestsData];
    updated[index] = { ...updated[index], [field]: value };
    setChiefGuestsData(updated);
  };

  const handleChiefGuestImageChange = (index, file) => {
    const updated = [...chiefGuestsData];
    updated[index] = { 
      ...updated[index], 
      image: file
    };
    setChiefGuestsData(updated);
  };

  const validateChiefGuestData = () => {
    let errors = {};
    let hasErrors = false;

    if (numChiefGuests > 0) {
      chiefGuestsData.forEach((guest, index) => {
        if (!guest.name || guest.name.trim() === '') {
          errors[`name_${index}`] = `Name is required for Chief Guest ${index + 1}`;
          hasErrors = true;
        }
        if (!guest.designation || guest.designation.trim() === '') {
          errors[`designation_${index}`] = `Designation is required for Chief Guest ${index + 1}`;
          hasErrors = true;
        }
        if (!guest.image) {
          errors[`image_${index}`] = `Image is required for Chief Guest ${index + 1}`;
          hasErrors = true;
        }
      });
    }

    setFormErrors(errors);
    return !hasErrors;
  };

  // Collaborators Handlers
  const handleNumCollaboratorsChange = (e) => {
    const num = parseInt(e.target.value, 10);
    setNumCollaborators(num);
    const newData = [];
    for (let i = 0; i < num; i++) {
      newData.push({ name: '', logo: null });
    }
    setCollaboratorsData(newData);
  };

  const handleCollaboratorChange = (index, value) => {
    const updated = [...collaboratorsData];
    updated[index] = { ...updated[index], name: value };
    setCollaboratorsData(updated);
  };

  const handleCollaboratorLogoChange = (index, file) => {
    const updated = [...collaboratorsData];
    updated[index] = { ...updated[index], logo: file };
    setCollaboratorsData(updated);
  };

  // Agenda Handlers
  const handleAddAgenda = () => {
    if (agendaList.length < 10) {
      setAgendaList([...agendaList, ""]);
    }
  };

  const handleRemoveAgenda = (index) => {
    setAgendaList(agendaList.filter((_, i) => i !== index));
  };

  const handleAgendaChange = (index, value) => {
    const updated = [...agendaList];
    updated[index] = value;
    setAgendaList(updated);
  };

  // Titles Handlers
  const handleAddTitle = () => {
    if (titles.length < 3) {
      setTitles([...titles, ""]);
    }
  };

  const handleRemoveTitle = (index) => {
    setTitles(titles.filter((_, i) => i !== index));
  };

  const handleTitleChange = (index, value) => {
    const updated = [...titles];
    updated[index] = value;
    setTitles(updated);
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();

    // Clear previous errors
    setFormErrors({});

    let errors = {};
    let hasErrors = false;

    // Validate all required fields
    if (!formData.department) {
      errors.department = 'Department is required';
      hasErrors = true;
    }
    if (!formData.course) {
      errors.course = 'Course is required';
      hasErrors = true;
    }
    if (!formData.venue) {
      errors.venue = 'Venue is required';
      hasErrors = true;
    }
    if (!formData.organization) {
      errors.organization = 'Academic Block is required';
      hasErrors = true;
    }
    if (!formData.date) {
      errors.date = 'Start Date is required';
      hasErrors = true;
    }
    if (!formData.time) {
      errors.time = 'Time is required';
      hasErrors = true;
    }
    if (!formData.eventType && !formData.eventTitle) {
      errors.eventType = 'Either Event Type or Event Title is required';
      hasErrors = true;
    }

    // Validate chief guest data
    if (!validateChiefGuestData()) {
      hasErrors = true;
    }

    if (hasErrors) {
      setFormErrors(errors);
      // Scroll to the first error
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsLoading(true);

    const form = new FormData();

    // Append form data
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
      form.append(key, formData[key]);
      }
    });

    // Append agenda list if enabled
    if (enableAgenda && agendaList.length > 0) {
      agendaList.forEach((item) => {
        if (item) form.append('agendaList', item);
      });
    }

    // Append titles
    if (titles.length > 0) {
      titles.forEach((title) => {
        if (title) form.append('titles', title);
      });
    }

    // Handle files
    if (files.clubLogo instanceof File) {
      form.append('clubLogo', files.clubLogo);
    }

    // Append Chief Guests data
    if (chiefGuestsData.length > 0) {
    const guestsDetails = chiefGuestsData.map(guest => ({
        salutation: guest.salutation || '',
        name: guest.name || '',
        designation: guest.designation || '',
        additionalText: guest.additionalText || ''
    }));
    form.append('chiefGuests', JSON.stringify(guestsDetails));

      // Append chief guest images
    chiefGuestsData.forEach((guest, index) => {
        if (guest.image instanceof File) {
          form.append('chiefGuestImages', guest.image);
      }
    });
    }

    // Append Collaborators data
    if (collaboratorsData.length > 0) {
      form.append('collaborators', JSON.stringify(collaboratorsData.map(c => ({
        name: c.name || ''
      }))));

      // Append collaborator logos
    collaboratorsData.forEach((collaborator, index) => {
        if (collaborator.logo instanceof File) {
          form.append('collaboratorLogos', collaborator.logo);
        }
      });
    }

    try {
      const response = await fetch('https://appsail-50025424145.development.catalystappsail.in/certificate/generate-certificate', {
        method: 'POST',
        body: form
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        if (action === 'preview') {
          navigate('/preview', { state: { pdfUrl: url } });
        }
      } else {
        console.error('Failed to generate certificate');
        alert('Failed to generate invite. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while generating the invite.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="text-xl font-bold mb-4">Generate Invite</h2>
      <div className="flex justify-end mb-4 space-x-4">
        <button
          onClick={() => navigate('/celebration-form')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Switch to Celebration Form
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
            <p>Generating Invite Preview...</p>
          </div>
        </div>
      )}
      <form onSubmit={(e) => handleSubmit(e, 'preview')} className="space-y-4">
        <div className="space-y-4">
          <label>Number of Chief Guests:*</label>
          <select 
            value={numChiefGuests} 
            onChange={handleNumChiefGuestsChange} 
            required
          >
            <option value="">Select number of chief guests</option>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
          {chiefGuestsData.map((guest, index) => (
            <div key={index} className="border p-4 rounded">
              <h3>Chief Guest {index + 1}</h3>
              <select
                value={guest.salutation}
                onChange={(e) => handleChiefGuestChange(index, 'salutation', e.target.value)}
              >
                <option value="MR.">MR.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Dr.">Dr.</option>
              </select>
              <div>
              <input
                type="text"
                  placeholder="Name*"
                value={guest.name}
                onChange={(e) => handleChiefGuestChange(index, 'name', e.target.value)}
                  className={formErrors[`name_${index}`] ? 'border-red-500' : ''}
              />
                {formErrors[`name_${index}`] && (
                  <p className="text-red-500 text-sm">{formErrors[`name_${index}`]}</p>
                )}
              </div>
              <div>
              <input
                type="text"
                  placeholder="Designation*"
                value={guest.designation}
                onChange={(e) => handleChiefGuestChange(index, 'designation', e.target.value)}
                  className={formErrors[`designation_${index}`] ? 'border-red-500' : ''}
              />
                {formErrors[`designation_${index}`] && (
                  <p className="text-red-500 text-sm">{formErrors[`designation_${index}`]}</p>
                )}
              </div>
              <input
                type="text"
                placeholder="Additional Text"
                value={guest.additionalText}
                onChange={(e) => handleChiefGuestChange(index, 'additionalText', e.target.value)}
              />
              <div>
              <input
                type="file"
                name="chiefGuestImages"
                onChange={(e) => handleChiefGuestImageChange(index, e.target.files[0])}
                className={formErrors[`image_${index}`] ? 'border-red-500' : ''}
                />
                {formErrors[`image_${index}`] && (
                  <p className="text-red-500 text-sm">{formErrors[`image_${index}`]}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Collaborators Section */}
        <div className="space-y-4">
          <label>Number of Collaborators (Max 2):</label>
          <select 
            value={numCollaborators} 
            onChange={handleNumCollaboratorsChange} 
          >
            <option value="">Select number of collaborators</option>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
          {collaboratorsData.map((collab, index) => (
            <div key={index} className="border p-4 rounded">
              <h3>Collaborator {index + 1}</h3>
              <input
                type="text"
                placeholder="Name (Optional)"
                value={collab.name}
                onChange={(e) => handleCollaboratorChange(index, e.target.value)}
              />
              <input
                type="file"
                name="collaboratorLogos"
                onChange={(e) => handleCollaboratorLogoChange(index, e.target.files[0])}
              />
            </div>
          ))}
        </div>
        
        {/* Club & Club Logo */}
        <div className="flex items-center space-x-2">
          <label htmlFor="clubName" style={{ marginBottom: '4px'}}>Club Name:</label>
          <input 
            type="text" 
            id="clubName"
            name="clubName" 
            placeholder="Club Name" 
            value={formData.clubName}
            onChange={handleChange} 
          />
          <label htmlFor="clubLogo">Club Logo:</label>
          <input 
            type="file" 
            id="clubLogo"
            name="clubLogo" 
            onChange={handleFileChange} 
          />
        </div>

        {/* Agenda */}
        <div>
          <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
            <label><span>Add Agenda</span></label>
            <input 
              type="checkbox" 
              checked={enableAgenda} 
              onChange={() => setEnableAgenda(!enableAgenda)} 
              style={{ transform: 'scale(0.8)', width: '16px', height: '16px' }} 
            />
          </span>
        </div>

        {enableAgenda && (
          <div className="space-y-2">
            {agendaList.map((agenda, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Agenda ${index + 1}`}
                  value={agenda}
                  onChange={(e) => handleAgendaChange(index, e.target.value)}
                  className={formErrors[`agenda_${index}`] ? 'border-red-500' : ''}
                />
                <button type="button" onClick={() => handleRemoveAgenda(index)}>
                  Remove
                </button>
              </div>
            ))}
            {agendaList.length < 10 && (
              <button type="button" onClick={handleAddAgenda}>
                Add Agenda
              </button>
            )}
          </div>
        )}

        {/* Department & Course */}
        <div className="flex flex-col space-y-2">
  <label>Department (UG/PG):*</label>
          <select 
            name="department" 
            value={formData.department || ''} 
            onChange={handleChange}
            required
            className={formErrors.department ? 'border-red-500' : ''}
          >
            <option value="">Select a department</option>
    <option value="UG">UG</option>
    <option value="PG">PG</option>
    <option value="PG & Research">PG & Research</option>
  </select>
  {formErrors.department && (
    <p className="text-red-500 text-sm">{formErrors.department}</p>
  )}

  <label>Course:*</label>
          <select 
            name="course" 
            value={formData.course || ''} 
            onChange={handleChange}
            required
            className={formErrors.course ? 'border-red-500' : ''}
          >
            <option value="">Select a course</option>
    {formData.department === "UG"
      ? ugCourses.map((course, index) => (
          <option key={index} value={course.split(" - ").pop()}>{course}</option>
        ))
      : formData.department === "PG"
      ? pgCourses.map((course, index) => (
          <option key={index} value={course.replace("Department of ", "")}>{course}</option>
        ))
      : pgResearchCourses.map((course, index) => (
          <option key={index} value={course.replace("Department of ", "")}>{course}</option>
        ))}
  </select>
  {formErrors.course && (
    <p className="text-red-500 text-sm">{formErrors.course}</p>
  )}
</div>

         {/* Event Name Dropdown */}
         <div className="space-y-2">
        <label>Event Title:*</label>
        <select
          name="eventType"
            value={formData.eventType || ''}
          onChange={handleChange}
          required
          disabled={formData.eventTitle.trim() !== ""}
            className={formErrors.eventType ? 'border-red-500' : ''}
        >
          <option value="">Select an event type</option>
          {eventTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
          ))}
        </select>

        <input
          type="text"
          name="eventTitle"
          placeholder="Event Title*"
          value={formData.eventTitle}
          onChange={handleChange}
          disabled={formData.eventType !== ""}
            className={formErrors.eventType ? 'border-red-500' : ''}
        />
          {formErrors.eventType && (
            <p className="text-red-500 text-sm">{formErrors.eventType}</p>
          )}
    </div>

        {/* Titles Section */}
        <div className="space-y-4" style={{marginBottom:'1%'}}>
          <label>Titles (up to 3):&nbsp;&nbsp;&nbsp;&nbsp;</label>
          {titles.map((title, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Title ${index + 1}`}
                value={title}
                onChange={(e) => handleTitleChange(index, e.target.value)}
              />
              <button type="button" onClick={() => handleRemoveTitle(index)}>
                Remove
              </button>
            </div>
          ))}
          {titles.length < 3 && (
            <button 
              type="button" 
              onClick={handleAddTitle}
            >
              Add Title
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', marginBottom: '1%' }}>
      {/* Start Date Input */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <label htmlFor="date" style={{ marginBottom: '4px' }}>Start Date:*</label>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <FaCalendarAlt
            style={{
              position: 'absolute',
              right: '-3px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
              pointerEvents: 'none', 
            }}
          />
        </div>
      </div>

      {/* End Date Input */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <label htmlFor="endDate" style={{ marginBottom: '4px' }}>End Date:</label>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
          <FaCalendarAlt
            style={{
              position: 'absolute',
              right: '-3px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
              pointerEvents: 'none', 
            }}
          />
        </div>
      </div>
    </div>

        <div style={{ position: "relative", width: "100%" }}>
          <input
            type="time"
            id="time"
            name="time"
            min="08:00"
            max="18:00"
            value={formData.time}
            onChange={handleChange}
            required
            // style={{
            //   padding: "8px 36px 8px 8px", // Add padding on the right for the icon
            //   height: "36px",
            //   width: "100%",
            //   borderRadius: "4px",
            //   border: "1px solid #ccc",
            // }}
          />
          <FaClock
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#666",
              pointerEvents: "none", 
            }}
          />
        </div>

      <label htmlFor="Venue" style={{ marginBottom: '4px'}}>Venue:*</label>
        <input 
          type="text" 
          name="venue" 
          placeholder="Venue" 
          value={formData.venue}
          onChange={handleChange} 
          required 
          className={formErrors.venue ? 'border-red-500' : ''}
        />
        {formErrors.venue && (
          <p className="text-red-500 text-sm">{formErrors.venue}</p>
        )}
        
        <label htmlFor="organization" style={{ marginBottom: '4px'}}>Academic Block:*</label>
       <select 
         name="organization" 
         value={formData.organization} 
         onChange={handleChange}
         required
         className={formErrors.organization ? 'border-red-500' : ''}
       >
        <option value="">Select Academic Block</option>
        <option value="I">I</option>
        <option value="II">II</option>
        <option value="III">III</option>
      </select>
      {formErrors.organization && (
        <p className="text-red-500 text-sm">{formErrors.organization}</p>
      )}

      <button type="submit">
          Preview Invite
        </button>
        {/* <button type="button" onClick={(e) => handleSubmit(e, 'download')}>
          Download Invite
        </button> */}

      </form>
    </div>
  );
}