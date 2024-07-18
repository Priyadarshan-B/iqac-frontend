import React, { useState, useEffect } from "react";
import apiHost from "../../utils/api";
import Button from "../../components/Button/button";
import Dropdown from "../../components/dropdown/dropdown";
import InputBox from "../../components/InputBox/inputbox";
import "./syllabusentry.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import RemoveCircleTwoToneIcon from '@mui/icons-material/RemoveCircleTwoTone';

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
  const [co, setCo] = useState([]);
  const [po, setPo] = useState([]);
  const [dropdownSets, setDropdownSets] = useState([{ co: null, po: null, level: "" }]);


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
      fetchPoPso();

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
    console.log(selectedCourse.value)
    // console.log(courseId)
    setCourseLabel(selectedCourse.label);
    console.log(selectedCourse.label)
    fetch(`${apiHost}/api/rf/syllabus?course=${selectedCourse.value}`)
      .then((response) => response.json())
      .then((data) => setSyllabus(data))
      .catch((error) => console.error("Error fetching syllabus data:", error));
      // handleCourseCoPoChange();
      fetch(`${apiHost}/api/rf/course-outcome?course=${selectedCourse.value}`)
      .then((response) => response.json())
      .then((data) => {
          const options = data.map((item) => ({
              value: item.id,
              label: item.course_outcome,
          }));
          setCo(options);
      })
      .catch((error) => console.error("Error fetching outcome dropdown", error));

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
            // setRegulationId(null);
            // setDegree([]);
            // setDegreeId(null);
            // setBranch([]);
            // setSelectedBranchId(null);
            // setSemester([]);
            // setSemesterId(null);
            // setCourse([]);
            // setCourseId(null);
            // setObjective("");
            // setDescription("");

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

const handleCourseCoPoChange = (selectedCoCourse) => {
  // setCourseId(selectedCoCourse);
  // console.log(selectedCoCourse.value)
  // fetch(`${apiHost}/api/rf/course-outcome?course=${selectedCoCourse.value}`)

  //     .then((response) => response.json())
  //     .then((data) => {
  //         const options = data.map((item) => ({
  //             value: item.id,
  //             label: item.course_outcome,
  //         }));
  //         setCo(options);
  //     })
  //     .catch((error) => console.error("Error fetching outcome dropdown", error));
};
const handleDropdownChange = (index, field, value) => {
  const updatedDropdownSets = [...dropdownSets];
  updatedDropdownSets[index][field] = value;
  setDropdownSets(updatedDropdownSets);
};
const handleRemoveDropdown = (index) => {
  const updatedDropdownSets = dropdownSets.filter((_, i) => i !== index);
  setDropdownSets(updatedDropdownSets);
};
const fetchPoPso = () => {
  fetch(`${apiHost}/api/rf/po-pso`)
      .then((response) => response.json())
      .then((data) => {
          const options = data.map((item) => ({
              value: item.id,
              label: item.name,
          }));
          setPo(options);
      })
      .catch((error) => console.error("Error fetching po dropdown:", error));
};


const handleCoPoSubmit = (event) => {
  event.preventDefault();

  // Validate form data
  // if (!regulationId || !degreeId || !selectedBranchId || !semesterId || !courseId) {
  //     toast.error("Please fill in all the fields before submitting.", {
  //         position: 'bottom-right'
  //     });
  //     return;
  // }

  const dataToSend = dropdownSets.map(({ co, po, level }) => ({
      course_outcome: co ? co.value : "",
      program_outcome: po ? po.value : "",
      mapping_level: level,
  }));
console.log(dataToSend)
  // Send data to backend
  fetch(`${apiHost}/api/rf/co-po-mapping`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
  })
      .then((response) => {
          if (!response.ok) {
              throw new Error("Network response was not ok");

          }
          toast.success("Data submitted successfully", {
            position: 'bottom-right'
        });
          return response.json();
          
      })
      .then((data) => {
          toast.success("Data submitted successfully", {
              position: 'bottom-right'
          });

          // Reset form using refs
          // if (regulationRef.current) regulationRef.current.select.clearValue();
          // if (degreeRef.current) degreeRef.current.select.clearValue();
          // if (branchRef.current) branchRef.current.select.clearValue();
          // if (semesterRef.current) semesterRef.current.select.clearValue();
          // if (courseRef.current) courseRef.current.select.clearValue();
          // setDropdownSets([{ co: null, po: null, level: "" }]);

          // Clear state values
          // setRegulationId(null);
          // setDegreeId(null);
          // setSelectedBranchId(null);
          // setSemesterId(null);
          // setCourseId(null);
          // setCo([]);
          // setPo([]);

          // Reset dropdown options
          // setRegulation([]);
          // setDegree([]);
          // setBranch([]);
          // setSemester([]);
          // setCourse([]);

          // Re-fetch data to refresh dropdown options
          // fetchRegulations();
          // fetchSemesters();
          // fetchPoPso();
      })
      .catch((error) => {
          toast.error("Error submitting data", {
              position: 'bottom-right'
          });
          console.error("Error sending data to backend:", error);
      });
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
            Course Outcome & Program Outcome
          </div>
          {showDropdown === 'poMapping' && (
            <div className="additional-dropdowns">
            {dropdownSets.map((set, index) => (
                <div key={index} className="dropdown-set">
                    <div className="flex-box">
                        <Dropdown
                            className="select-field"
                            options={co}
                            placeholder="CO"
                            value={set.co}
                            onChange={(e) => handleDropdownChange(index, "co", e)}
                        />
                        <Dropdown
                            className="select-field"
                            options={po}
                            placeholder="PO"
                            value={set.po}
                            onChange={(e) => handleDropdownChange(index, "po", e)}
                        />
                        <InputBox
                            className="input-field"
                            placeholder="Mapping Level"
                            value={set.level}
                            onChange={(e) => handleDropdownChange(index, "level", e.target.value)}
                        />
                        {/* <button type="button" onClick={() => handleRemoveDropdown(index)}>
                            Remove
                        </button> */}
                        <RemoveCircleTwoToneIcon style={{
                            cursor:'pointer',
                            color:'black'
                        }} onClick={() => handleRemoveDropdown(index)} />
                    </div>
                    <button type="submit" className="button-sub" onClick={handleCoPoSubmit}>
                    Submit
                </button>
                </div>
            ))}
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
