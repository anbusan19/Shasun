import { useState, useEffect } from 'react';
import './EventForm.css';
import { useNavigate } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import { FaCalendarAlt } from 'react-icons/fa';

export default function CertificateForm() {
  const navigate = useNavigate();

  const loadStateFromSession = (key, defaultValue) => {
    const savedData = sessionStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : defaultValue;
  };

  const [formData, setFormData] = useState(
    loadStateFromSession('formData', {
      recipientName: '',
      eventTitle: '',
      eventType: '',
      subtitle: '',
      additionalImageDescription: '',
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

  const [files, setFiles] = useState(
    loadStateFromSession('files', {
      clubLogo: null,
    })
  );

  const [additionalImageDescription, setAdditionalImageDescription] = useState(
    loadStateFromSession('additionalImageDescription', '')
  );

  const [enableAgenda, setEnableAgenda] = useState(
    loadStateFromSession('enableAgenda', false)
  );

  const [agendaList, setAgendaList] = useState(
    loadStateFromSession('agendaList', [])
  );

  const [titles, setTitles] = useState(
    loadStateFromSession('titles', [])
  );

  const [numChiefGuests, setNumChiefGuests] = useState(
    loadStateFromSession('numChiefGuests', 0)
  );

  const [chiefGuestsData, setChiefGuestsData] = useState(
    loadStateFromSession('chiefGuestsData', [])
  );

  const [numCollaborators, setNumCollaborators] = useState(
    loadStateFromSession('numCollaborators', 0)
  );

  const [collaboratorsData, setCollaboratorsData] = useState(
    loadStateFromSession('collaboratorsData', [])
  );

  const [previewUrl, setPreviewUrl] = useState(null);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    sessionStorage.setItem('files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    sessionStorage.setItem('additionalImageDescription', additionalImageDescription);
  }, [additionalImageDescription]);

  useEffect(() => {
    sessionStorage.setItem('enableAgenda', enableAgenda);
  }, [enableAgenda]);

  useEffect(() => {
    sessionStorage.setItem('agendaList', JSON.stringify(agendaList));
  }, [agendaList]);

  useEffect(() => {
    sessionStorage.setItem('titles', JSON.stringify(titles));
  }, [titles]);

  useEffect(() => {
    sessionStorage.setItem('numChiefGuests', numChiefGuests);
  }, [numChiefGuests]);

  useEffect(() => {
    sessionStorage.setItem('chiefGuestsData', JSON.stringify(chiefGuestsData));
  }, [chiefGuestsData]);

  useEffect(() => {
    sessionStorage.setItem('numCollaborators', numCollaborators);
  }, [numCollaborators]);

  useEffect(() => {
    sessionStorage.setItem('collaboratorsData', JSON.stringify(collaboratorsData));
  }, [collaboratorsData]);

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
      setFormData(prev => ({ ...prev, course: "" }));
    } else if (formData.department === 'PG') {
      setFormData(prev => ({ ...prev, course: pgCourses[0] }));
    } else if (formData.department === 'PG & Research') {
      setFormData(prev => ({ ...prev, course: pgResearchCourses[0] }));
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

  const handleAdditionalImageDescriptionChange = (e) => {
    setAdditionalImageDescription(e.target.value);
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
    updated[index] = { ...updated[index], image: file };
    setChiefGuestsData(updated);
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
    const form = new FormData();

    // Append form data
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });
    if (enableAgenda) {
      agendaList.forEach((item) => form.append('agendaList', item));
    }
    titles.forEach((title) => form.append('titles', title));
    Object.keys(files).forEach((key) => {
      if (Array.isArray(files[key])) {
        files[key].forEach((file) => form.append(key, file));
      } else if (files[key]) {
        form.append(key, files[key]);
      }
    });

    // Append Chief Guests data
    const guestsDetails = chiefGuestsData.map(guest => ({
      salutation: guest.salutation,
      name: guest.name,
      designation: guest.designation,
      additionalText: guest.additionalText
    }));
    form.append('chiefGuests', JSON.stringify(guestsDetails));
    chiefGuestsData.forEach((guest, index) => {
      if (guest.image) {
        form.append('chiefGuestImages', guest.image, `${index}_${guest.image.name}`);
      }
    });

    // Append Collaborators data
    form.append('collaborators', JSON.stringify(collaboratorsData));
    collaboratorsData.forEach((collaborator, index) => {
      if (collaborator.logo) {
        form.append('collaboratorLogos', collaborator.logo, `${index}_${collaborator.logo.name}`);
      }
    });

    // Append additional image and description
    if (files.additionalImage) {
      form.append('additionalImage', files.additionalImage);
    }
    form.append('additionalImageDescription', additionalImageDescription);

    console.log('Form Data:', {
      ...formData,
      agendaList,
      titles,
      files,
      chiefGuests: guestsDetails,
      collaborators: collaboratorsData,
      additionalImageDescription
    });

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
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-xl font-bold mb-4">Generate Invite</h2>
      <form onSubmit={(e) => handleSubmit(e, 'preview')} className="space-y-4">
        <div className="space-y-4">
          <label>Number of Chief Guests:</label>
          <select 
            value={numChiefGuests} 
            onChange={handleNumChiefGuestsChange} 
          >
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
              <input
                type="text"
                placeholder="Name"
                value={guest.name}
                onChange={(e) => handleChiefGuestChange(index, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Designation"
                value={guest.designation}
                onChange={(e) => handleChiefGuestChange(index, 'designation', e.target.value)}
              />
              <input
                type="text"
                placeholder="Additional Text"
                value={guest.additionalText}
                onChange={(e) => handleChiefGuestChange(index, 'additionalText', e.target.value)}
              />
              <input
                type="file"
                name="chiefGuestImages"
                onChange={(e) => handleChiefGuestImageChange(index, e.target.files[0])}
              />
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
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
          {collaboratorsData.map((collab, index) => (
            <div key={index} className="border p-4 rounded">
              <h3>Collaborator {index + 1}</h3>
              <input
                type="text"
                placeholder="Name"
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
        <label htmlFor="Venue" style={{ marginBottom: '4px'}}>Club Name:</label>
          <input 
            type="text" 
            name="clubName" 
            placeholder="Club Name (Optional)" 
            value={formData.clubName}
            onChange={handleChange} 
          />
          <label>Club Logo:</label>
          <input 
            type="file" 
            name="clubLogo" 
            onChange={handleFileChange} 
          />
        </div>

        {/* Additional Image and Description */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Description for the Festival slogans"
            value={additionalImageDescription}
            onChange={handleAdditionalImageDescriptionChange}
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
  <select name="department" value={formData.department} onChange={handleChange} >
    <option value="" disabled selected default>Select a department</option>
    <option value="UG">UG</option>
    <option value="PG">PG</option>
    <option value="PG & Research">PG & Research</option>
  </select>

  <label>Course:*</label>
  <select name="course" value={formData.course} onChange={handleChange} >
    <option value="" disabled selected>Select a course</option>
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
</div>


         {/* Event Name Dropdown */}
         <div className="space-y-2">
        <label>Event Title:*</label>
        <select
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          required
          disabled={formData.eventTitle.trim() !== ""}
        >
          <option value="">Select an event type</option>
          
          {eventTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="eventTitle"
          placeholder="Event Title*"
          value={formData.eventTitle}
          onChange={handleChange}
          disabled={formData.eventType !== ""}
        />
    </div>
        <input 
          type="text" 
          name="subtitle" 
          placeholder="Subtitle" 
          onChange={handleChange} 
        />
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
        />
        
        <label htmlFor="Venue" style={{ marginBottom: '4px'}}>Academic Block:*</label>
       <select name="organization" value={formData.organization} onChange={handleChange} >
        <option value="" disabled>Select Academic Block</option>
        <option value="I">I</option>
        <option value="II">II</option>
        <option value="III">III</option>
      </select>

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