import React, { useState, useEffect } from "react";
import apiHost from "../../utils/api";
import Button from "../../components/Button/button";
import Dropdown from "../../components/dropdown/dropdown";
import "./syllabusentry.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SyllabusEntry = () => {
  const [degree, setDegree] = useState('');
  const [degreeId, setDegreeId] = useState(null);
  const [degreeLabel, setDegreeLabel] = useState("");
  const [branch, setBranch] = useState('');
  const [branchId, setBranchId] = useState(null);
  const [branchLabel, setBranchLabel] = useState("");
  const [regulation, setRegulation] = useState('');
  const [regulationId, setRegulationId] = useState(null);
  const [regulationLabel, setRegulationLabel] = useState("");
  const [course, setCourse] = useState('');
  const [courseId, setCourseId] = useState(null);
  const [courseLabel, setCourseLabel] = useState("");
  const [semester, setSemester] = useState([]);
  const [semesterLabel, setSemesterLabel] = useState("");
  const [showDropdown, setShowDropdown] = useState('');
  const [courseOutcomes, setCourseOutcomes] = useState([]);
  const [poMappings, setPoMappings] = useState([]);
  const [courseContent, setCourseContent] = useState([]);
  const [syllabus, setSyllabus] = useState([]);
  const [key, setKey] = useState(0);  
  const [objective, setObjective] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch(`${apiHost}/api/rf/dropdown/regulation`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.regulation,
        }));
        setRegulation(options);
      })
      .catch((error) => console.error("Error fetching regulation dropdown:", error));

    fetch(`${apiHost}/api/rf/dropdown/semester`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.semester,
        }));
        setSemester(options);
      })
      .catch((error) => console.error("Error fetching semester dropdown:", error));
  }, []);

  const handleDropdownToggle = (dropdownName) => {
    setShowDropdown((prevDropdown) =>
      prevDropdown === dropdownName ? '' : dropdownName
    );
  };

  const handleRegulationChange = (selectedRegulation) => {
    setRegulationId(selectedRegulation.value);
    setRegulationLabel(selectedRegulation.label);
    fetch(`${apiHost}/api/rf/dropdown/degree?regulation=${selectedRegulation.value}`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.degree,
        }));
        setDegree(options);
      })
      .catch((error) => console.error("Error fetching degree dropdown:", error));
  };

  const handleDegreeChange = (selectedDegree) => {
    setDegreeId(selectedDegree.value);
    setDegreeLabel(selectedDegree.label);
    fetch(`${apiHost}/api/rf/dropdown/branch?degree=${selectedDegree.value}`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.branch,
        }));
        setBranch(options);
      })
      .catch((error) => console.error("Error fetching branch dropdown:", error));
  };

  const handleBranchChange = (selectedBranch) => {
    setBranchId(selectedBranch.value);
    setBranchLabel(selectedBranch.label);
  };

  const handleSemesterChange = (selectedSemester) => {
    setSemesterLabel(selectedSemester.label);
    fetch(`${apiHost}/api/rf/dropdown/course?branch=${branchId}&semester=${selectedSemester.value}`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.course,
        }));
        setCourse(options);
      })
      .catch((error) => console.error("Error fetching course dropdown:", error));
  };

  const handleCourseChange = (selectedCourse) => {
    setCourseId(selectedCourse.value);
    setCourseLabel(selectedCourse.label);
    fetch(`${apiHost}/api/rf/syllabus?course=${selectedCourse.value}`)
      .then((response) => response.json())
      .then((data) => setSyllabus(data))
      .catch((error) => console.error("Error fetching syllabus data:", error));
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const dataToSend = {
            course: courseId,
            co_obj_id: objective,
            description: description,
        };

        console.log("Data to be sent:", dataToSend);

        const response = await fetch(`${apiHost}/api/rf/course-objective`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
            toast.success("Objective submitted successfully", {
                position: 'bottom-right'
            });
            console.log("Data submitted successfully");
            // Reset the form fields and dropdown selections
            setRegulationId(null);
            setDegree([]);
            setDegreeId(null);
            setBranch([]);
            setSelectedBranchId(null);
            setSemester([]);
            setSemesterId(null);
            setCourse([]);
            setCourseId(null);
            setObjective("");
            setDescription("");

            // Refetch the dropdown data and force re-render
            setKey(prevKey => prevKey + 1);
        } else {
            toast.error("Failed to submit objective", {
                position: 'bottom-right'
            });
            console.error("Failed to submit data");
        }
    } catch (error) {
        toast.error("Error submitting objective", {
            position: 'bottom-right'
        });
        console.error("Error submitting data:", error);
    }
};

  return (
    <div className='dashboard-container'>
      <div className="syllabus-entry">
        <div className='select-info'>
          <div className='each-info-select'>
            <span className='font'>Regulation</span>
            <Dropdown
              className="syllabus-entry-select"
              options={regulation}
              onChange={handleRegulationChange}
              placeholder="Regulation"
            />
          </div>
          <div className='each-info-select'>
            <span className='font'>Degree</span>
            <Dropdown
              className="syllabus-entry-select"
              options={degree}
              onChange={handleDegreeChange}
              placeholder="Degree"
            />
          </div>
          <div className='each-info-select'>
            <span className='font'>Branch</span>
            <Dropdown
              className="syllabus-entry-select"
              options={branch}
              onChange={handleBranchChange}
              placeholder="Branch"
            />
          </div>
          <div className='each-info-select'>
            <span className='font'>Semester</span>
            <Dropdown
              className="syllabus-entry-select"
              options={semester}
              onChange={handleSemesterChange}
              placeholder="Semester"
            />
          </div>
          <div className='each-info-select'>
            <span className='font'>Course</span>
            <Dropdown
              className="syllabus-entry-select"
              options={course}
              onChange={handleCourseChange}
              placeholder="Course"
            />
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
                    <input
                      className="course-outcome-textarea"
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                    />
                    <input
                      className="course-outcome-textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="course-outcome-buttons">
                      <Button label='Update' onClick={handleSubmit} />
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
                  <span className='font-in-dropdown'>PO Mapping {index + 1}</span>
                  <textarea
                    className="po-mapping-textarea"
                    value={mapping.value1}
                    onChange={(e) =>
                      handlePoMappingChange(mapping.id, 'value1', e.target.value)
                    }
                  />
                  <textarea
                    className="po-mapping-textarea"
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
              <Button label='Add PO Mapping' onClick={handleAddPoMapping} />
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
                  <span className='font-in-dropdown'>Course Content {index + 1}</span>
                  <textarea
                    className="course-content-textarea"
                    value={content.unitTitle}
                    onChange={(e) =>
                      handleCourseContentChange(content.id, 'unitTitle', e.target.value)
                    }
                  />
                  <textarea
                    className="course-content-textarea"
                    value={content.hours}
                    onChange={(e) =>
                      handleCourseContentChange(content.id, 'hours', e.target.value)
                    }
                  />
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
              <Button label='Add Course Content' onClick={handleAddCourseContent} />
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default SyllabusEntry;
