import React, { useState } from 'react';
import Button from '../../components/Button/button';
import './syllabusentry.css';

const SyllabusEntry = () => {
  const [degree, setDegree] = useState('');
  const [branch, setBranch] = useState('');
  const [regulation, setRegulation] = useState('');
  const [subject, setSubject] = useState('');
  const [showDropdown, setShowDropdown] = useState('');
  const [courseOutcomes, setCourseOutcomes] = useState([]);
  const [poMappings, setPoMappings] = useState([]);
  const [courseContent, setCourseContent] = useState([]);

  const handleDropdownToggle = (dropdownName) => {
    setShowDropdown((prevDropdown) =>
      prevDropdown === dropdownName ? '' : dropdownName
    );
  };

  const handleAddCourseOutcome = () => {
    setCourseOutcomes([...courseOutcomes, { id: Date.now(), value: '' }]);
  };

  const handleCourseOutcomeChange = (id, value) => {
    setCourseOutcomes(
      courseOutcomes.map((outcome) =>
        outcome.id === id ? { ...outcome, value } : outcome
      )
    );
  };

  const handleDeleteCourseOutcome = (id) => {
    setCourseOutcomes(courseOutcomes.filter((outcome) => outcome.id !== id));
  };

  const handleAddPoMapping = () => {
    setPoMappings([...poMappings, { id: Date.now(), value1: '', value2: '' }]);
  };

  const handlePoMappingChange = (id, field, value) => {
    setPoMappings(
      poMappings.map((mapping) =>
        mapping.id === id ? { ...mapping, [field]: value } : mapping
      )
    );
  };

  const handleDeletePoMapping = (id) => {
    setPoMappings(poMappings.filter((mapping) => mapping.id !== id));
  };

  const handleAddCourseContent = () => {
    setCourseContent([...courseContent, { id: Date.now(), unitTitle: '', hours: 0, details: '' }]);
  };

  const handleCourseContentChange = (id, field, value) => {
    setCourseContent(
      courseContent.map((content) =>
        content.id === id ? { ...content, [field]: value } : content
      )
    );
  };

  const handleDeleteCourseContent = (id) => {
    setCourseContent(courseContent.filter((content) => content.id !== id));
  };

  return (

    <div className='dashboard-container'>
      <div className="syllabus-entry">
        <div className='select-info'>
          <div className='each-info-select'>
            <span className='font'>Degree</span>
            <select
              className="syllabus-entry-select"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            >
              <option className='font' value="">Select Degree</option>
              {/* Add degree options here */}
            </select>
          </div>
          <div className='each-info-select'>
            <span className='font'>Branch</span>
            <select

              className="syllabus-entry-select"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              <option value="">Select Branch</option>
              {/* Add branch options here */}
            </select>
          </div>
          <div className='each-info-select'>
            <span className='font'>Regulation</span>
            <select
              className="syllabus-entry-select"
              value={regulation}
              onChange={(e) => setRegulation(e.target.value)}
            >
              <option value="">Select Regulation</option>
              {/* Add regulation options here */}
            </select>
          </div>
          <div className='each-info-select'>
            <span className='font'>Subject</span>
            <select
              className="syllabus-entry-select"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Select Subject</option>
              {/* Add subject options here */}
            </select>
          </div>
        </div>
        <div className='division-background'>
          <div
            className="dropdown-section"
            onClick={() => handleDropdownToggle('courseObjective')}
          >
            Course Objective Entry
          </div>
          {showDropdown === 'courseObjective' && (
            <div className="dropdown-content">
              {courseOutcomes.map((outcome, index) => (
                <div key={outcome.id} className="course-outcome-item">
                  <span className='font-in-dropdown'>Course Objective {index + 1}</span>
                  <textarea
                    className="course-outcome-textarea"
                    value={outcome.value}
                    onChange={(e) =>
                      handleCourseOutcomeChange(outcome.id, e.target.value)
                    }
                  />
                  <div className="course-outcome-buttons">
                    <Button label='Update' onClick={() => console.log('Update clicked')} />
                    <Button label='Delete' onClick={() => handleDeleteCourseOutcome(outcome.id)} />
                  </div>
                </div>
              ))}

              <Button label='Add Outcome' onClick={handleAddCourseOutcome} />
            </div>
          )}
        </div>
        <div className='division-background'>
          <div
            className="dropdown-section"
            onClick={() => handleDropdownToggle('poMapping')}
          >
            Course Objective Entry & PO Mapping
          </div>
          {showDropdown === 'poMapping' && (
            <div className="dropdown-content">
              {poMappings.map((mapping, index) => (
                <div key={mapping.id} className="po-mapping-item">
                  <span className='font-in-dropdown'>CO-{index + 1}</span>
                  <input
                    type="text"
                    className="po-mapping-input"
                    value={mapping.value1}
                    onChange={(e) =>
                      handlePoMappingChange(mapping.id, 'value1', e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="po-mapping-input"
                    value={mapping.value2}
                    onChange={(e) =>
                      handlePoMappingChange(mapping.id, 'value2', e.target.value)
                    }
                  />
                  <div className="po-mapping-buttons">
                    <Button label='Update' onClick={() => console.log('Update clicked')} />
                    <Button label='Delete' onClick={() => handleDeletePoMapping(mapping.id)} />
                  </div>
                </div>
              ))}
              <Button label='Add Mapping' onClick={handleAddPoMapping} />
            </div>
          )}
        </div>
        <div className='division-background'>
          <div
            className="dropdown-section"
            onClick={() => handleDropdownToggle('courseContent')}
          >
            Course Content Entry
          </div>
          {showDropdown === 'courseContent' && (
            <div className="dropdown-content">
              {courseContent.map((content, index) => (
                <div key={content.id} className="course-content-item">
                  <span className='font-in-dropdown'>Unit Title</span>
                  <input
                    type="text"
                    className="course-content-input"
                    value={content.unitTitle}
                    onChange={(e) =>
                      handleCourseContentChange(content.id, 'unitTitle', e.target.value)
                    }
                  />
                  <span className='font-in-dropdown'>Hours</span>
                  <input
                    type="number"
                    className="course-content-input"
                    value={content.hours}
                    onChange={(e) =>
                      handleCourseContentChange(content.id, 'hours', e.target.value)
                    }
                  />
                  <span className='font-in-dropdown'>Details</span>
                  <textarea
                    className="course-content-textarea"
                    value={content.details}
                    onChange={(e) =>
                      handleCourseContentChange(content.id, 'details', e.target.value)
                    }
                  />
                  <div className="course-content-buttons">
                    <Button label='Update' onClick={() => console.log('Update clicked')} />
                    <Button label='Delete' onClick={() => handleDeleteCourseContent(content.id)} />
                  </div>
                </div>
              ))}

              <Button label='Add Outcome' onClick={handleAddCourseContent} />
            </div>
          )}
        </div>
        <div className='report-div'>
          <span className='font'>Report Download</span>
          <input
            className="syllabus-entry-input"
            type="text"
            placeholder="Include"
          />
          <span>Select any one:</span>
          <label>
            <input type="radio" name="format" value="word" /> MS Word
          </label>
          <label>
            <input type="radio" name="format" value="pdf" /> PDF
          </label>
          <Button label='Genarate' />

        </div>
      </div>
    </div>
  );
};

export default SyllabusEntry;
