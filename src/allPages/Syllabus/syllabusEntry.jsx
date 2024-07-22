import React, { useState, useEffect } from "react";
import apiHost from "../../utils/api";
import Button from "../../components/Button/button";
import Dropdown from "../../components/dropdown/dropdown";
import InputBox from "../../components/InputBox/inputbox";
import "./syllabusentry.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ForkLeft } from "@mui/icons-material";
import jsPDF from "jspdf";

const SyllabusEntry = () => {
  const [degree, setDegree] = useState("");
  const [degreeId, setDegreeId] = useState(null);
  const [degreeLabel, setDegreeLabel] = useState("");
  const [branch, setBranch] = useState("");
  const [branchId, setBranchId] = useState(null);
  const [branchLabel, setBranchLabel] = useState("");
  const [regulation, setRegulation] = useState("");
  const [regulationId, setRegulationId] = useState(null);
  const [regulationLabel, setRegulationLabel] = useState("");
  const [course, setCourse] = useState("");
  const [courseId, setCourseId] = useState(null);
  const [courseLabel, setCourseLabel] = useState("");
  const [semester, setSemester] = useState([]);
  const [semesterLabel, setSemesterLabel] = useState("");
  const [showDropdown, setShowDropdown] = useState("");
  const [courseOutcomes, setCourseOutcomes] = useState([{objective:"",description:""}]);
  const [poMappings, setPoMappings] = useState([]);
  const [courseContent, setCourseContent] = useState([]);
  const [syllabus, setSyllabus] = useState([]);
  const [key, setKey] = useState(0);
  const [objective, setObjective] = useState("");
  const [description, setDescription] = useState("");
  const [co, setCo] = useState([]);
  const [po, setPo] = useState([]);
  const [unit, setUnit] = useState("");
  const [unitname, setUnitname] = useState("");
  const [hours, setHours] = useState("");
  const [units, setUnits] = useState([
    { unit: "", unitname: "", description: "", hours: "" },
  ]);
  const [dropdownSets, setDropdownSets] = useState([
    { co: null, po: null, level: "" },
  ]);
  const [showcontent, setShowContent] = useState(false);
  const [showCoPocontent, setShowCoPoContent] = useState(false);
  const [showunitcontent, setShowUnitContent] = useState(false);

  const handleShowContent = () => {
    setShowContent((prevShowContent) => !prevShowContent);
  };
  const handleShowCoPoContent = () => {
    setShowCoPoContent((prevShowCoPoContent) => !prevShowCoPoContent);
  };
  const handleShowUnitContent = () => {
    setShowUnitContent((prevShowUnitContent) => !prevShowUnitContent);
  };

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
      .catch((error) =>
        console.error("Error fetching regulation dropdown:", error)
      );

    fetch(`${apiHost}/api/rf/dropdown/semester`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.semester,
        }));
        setSemester(options);
      })
      .catch((error) =>
        console.error("Error fetching semester dropdown:", error)
      );
    fetchPoPso();
  }, []);

  const handleDropdownToggle = (dropdownName) => {
    setShowDropdown((prevDropdown) =>
      prevDropdown === dropdownName ? "" : dropdownName
    );
  };

  const handleRegulationChange = (selectedRegulation) => {
    setRegulationId(selectedRegulation.value);
    setRegulationLabel(selectedRegulation.label);
    fetch(
      `${apiHost}/api/rf/dropdown/degree?regulation=${selectedRegulation.value}`
    )
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.degree,
        }));
        setDegree(options);
      })
      .catch((error) =>
        console.error("Error fetching degree dropdown:", error)
      );
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
      .catch((error) =>
        console.error("Error fetching branch dropdown:", error)
      );
  };

  const handleBranchChange = (selectedBranch) => {
    setBranchId(selectedBranch.value);
    setBranchLabel(selectedBranch.label);
  };

  const handleSemesterChange = (selectedSemester) => {
    setSemesterLabel(selectedSemester.label);
    fetch(
      `${apiHost}/api/rf/dropdown/course?branch=${branchId}&semester=${selectedSemester.value}`
    )
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.course,
        }));
        setCourse(options);
      })
      .catch((error) =>
        console.error("Error fetching course dropdown:", error)
      );
  };

  const handleCourseChange = (selectedCourse) => {
    setCourseId(selectedCourse.value);
    console.log(selectedCourse.value);
    // console.log(courseId)
    setCourseLabel(selectedCourse.label);
    console.log(selectedCourse.label);
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
      .catch((error) =>
        console.error("Error fetching outcome dropdown", error)
      );
  };

  const handleAddCourseOutcome = () => {
    setCourseOutcomes([...courseOutcomes, { objective: "", description: "" }]);
  };

  const handleCourseOutcomeChange = (index, field, value) => {
    const updatedCourseOutcomes = [...courseOutcomes];
    updatedCourseOutcomes[index][field] = value;
    setCourseOutcomes(updatedCourseOutcomes);
  };

  const handleDeleteCourseOutcome = (index) => {
    const updatedCourseOutcomes = courseOutcomes.filter((_, i) => i !== index);
    setCourseOutcomes(updatedCourseOutcomes);
  };
  const handleAddPoMapping = () => {
    setPoMappings([...poMappings, { id: Date.now(), value1: "", value2: "" }]);
  };

  const handlePoMappingChange = (id, field, value) => {
    setPoMappings(
      poMappings.map((mapping) =>
        mapping.id === id ? { ...mapping, [field]: value } : mapping
      )
    );
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
  const handleSubmitCourseOutcomes = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = courseOutcomes.map((outcome) => ({
        course: courseId,
        objective: outcome.objective,
        description: outcome.description,
      }));
      console.log("Data to be sent:", dataToSend);
      const response = await fetch(`${apiHost}/api/rf/course-objective`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      if (response.ok) {
        toast.success("Objectives submitted successfully", {
          position: "bottom-right",
        });
        console.log("Data submitted successfully");
        setCourseOutcomes([{ objective: "", description: "" }]);
        setObjective("");
        setDescription("");
        setDropdownSets([]);
        setDropdownSets("");
        handleCourseChange({ value: courseId, label: courseLabel });
      } else {
        toast.error("Failed to submit objectives", {
          position: "bottom-right",
        });
        console.error("Failed to submit data");
      }
    } catch (error) {
      toast.error("Error submitting objectives", {
        position: "bottom-right",
      });
      console.error("Error submitting data:", error);
    }
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

  const handleAddDropdown = () => {
    setDropdownSets([...dropdownSets, { co: null, po: null, level: "" }]);
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

    const dataToSend = dropdownSets.map(({ co, po, level }) => ({
      course_outcome: co ? co.value : "",
      program_outcome: po ? po.value : "",
      mapping_level: parseInt(level),
    }));
    console.log(dataToSend);
    fetch(`${apiHost}/api/rf/co-po-mapping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (!response.ok) {
          toast.error("Failed to submit objective", {
            position: "bottom-right",
          });
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        toast.success("Data submitted successfully", {
          position: "bottom-right",
        });
        console.log(dropdownSets);
        setDropdownSets([{ co: null, po: null, level: "" }]);
      })
      .catch((error) => {
        toast.error("Error submitting data", {
          position: "bottom-right",
        });
        console.error("Error sending data to backend:", error);
      });
  };

  const handleAddUnit = () => {
    setUnits([
      ...units,
      { unit: "", unitname: "", description: "", hours: "" },
    ]);
  };

  const handleUnitChange = (index, field, value) => {
    const updatedUnits = [...units];
    updatedUnits[index][field] = value;
    setUnits(updatedUnits);
  };

  const handleDeleteUnit = (index) => {
    setUnits(units.filter((_, i) => i !== index));
  };
  const handleSubmitUnit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = units.map((unit) => ({
        course: courseId,
        unit: unit.unit,
        unit_name: unit.unitname,
        description: unit.description,
        hours: parseInt(unit.hours),
      }));

      console.log("Data to be sent:", dataToSend);

      const response = await fetch(`${apiHost}/api/rf/course-unit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success("Units submitted successfully", {
          position: "bottom-right",
        });
        console.log("Data submitted successfully");
        setUnits([{ unit: "", unitname: "", description: "", hours: "" }]);
      } else {
        toast.error("Failed to submit units", {
          position: "bottom-right",
        });
        console.error("Failed to submit data");
      }
    } catch (error) {
      toast.error("Error submitting units", {
        position: "bottom-right",
      });
      console.error("Error submitting data:", error);
    }
  };

  const handleFetchAndDownloadPDF = async () => {
    console.log(courseId);
    try {
      const responseObjectives = await fetch(
        `${apiHost}/api/rf/course-objective?course=${courseId}`
      );
      const courseObjectives = await responseObjectives.json();

      const responseOutcomes = await fetch(
        `${apiHost}/api/rf/co-po-mapping?course=${courseId}`
      );
      const programOutcomes = await responseOutcomes.json();

      const responseUnit = await fetch(
        `${apiHost}/api/rf/course-unit?course=${courseId}`
      );
      const courseUnit = await responseUnit.json();

      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.setFont("times", "normal");

      doc.setFontSize(14);
      doc.setFont("times", "bold");
      doc.text("Course Objectives", 10, 10);

      doc.setFontSize(12);
      doc.setFont("times", "normal");

      let yPos = 20;

      const checkAddPage = () => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 10;
        }
      };

      courseObjectives.forEach((item) => {
        const lines = doc.splitTextToSize(`• ${item.description}`, 180);
        lines.forEach((line) => {
          doc.text(line, 10, yPos);
          yPos += 10;
          checkAddPage();
        });
      });

      yPos += 10;

      doc.setFontSize(14);
      doc.setFont("times", "bold");
      doc.text("Program Outcomes", 10, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setFont("times", "normal");

      programOutcomes.forEach((item) => {
        const lines = doc.splitTextToSize(`• ${item.program_outcome}`, 180);
        lines.forEach((line) => {
          doc.text(line, 10, yPos);
          yPos += 10;
          checkAddPage();
        });
      });

      yPos += 10;

      doc.setFontSize(14);
      doc.setFont("times", "bold");
      doc.text("Course Outcomes", 10, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setFont("times", "normal");

      programOutcomes.forEach((item) => {
        const lines = doc.splitTextToSize(`• ${item.course_outcome}`, 180);
        lines.forEach((line) => {
          doc.text(line, 10, yPos);
          yPos += 10;
          checkAddPage();
        });
      });

      yPos += 10;
      doc.setFontSize(14);
      doc.setFont("times", "bold");
      doc.text("Course Unit", 10, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setFont("times", "normal");

      courseUnit.forEach((item) => {
        const unitText = `UNIT ${item.unit}`;
        const unitNameText = item.unit_name;
        const descriptionText = item.description;
        const hoursText = `${item.hours} Hours`;

        doc.setFont("times", "bold");
        doc.text(unitText, 10, yPos);
        yPos += 10;

        doc.text(unitNameText, 10, yPos);
        yPos += 10;

        doc.setFont("times", "normal");
        doc.text(descriptionText, 10, yPos);
        yPos += 10;

        doc.text(hoursText, 10, yPos);
        yPos += 10;

        checkAddPage();
      });

      // Save the PDF
      doc.save("syllabus.pdf");
      toast.success("PDF downloaded successfully!",{
        position: "bottom-right",

      });
      
    } catch (error) {
      toast.error("An error occurred while downloading the PDF.",{
        position: "bottom-right",

      });
      console.error("Error fetching and downloading PDF:", error);
     
    }
  };

  return (
    <div className="dashboard-container">
      <div className="syllabus-entry">
        <div className="select-info">
          <div className="each-info-select">
            <span className="font">Regulation</span>
            <Dropdown
              className="syllabus-entry-select"
              options={regulation}
              onChange={handleRegulationChange}
              placeholder="Regulation"
            />
          </div>
          <div className="each-info-select">
            <span className="font">Degree</span>
            <Dropdown
              className="syllabus-entry-select"
              options={degree}
              onChange={handleDegreeChange}
              placeholder="Degree"
            />
          </div>
          <div className="each-info-select">
            <span className="font">Branch</span>
            <Dropdown
              className="syllabus-entry-select"
              options={branch}
              onChange={handleBranchChange}
              placeholder="Branch"
            />
          </div>
          <div className="each-info-select">
            <span className="font">Semester</span>
            <Dropdown
              className="syllabus-entry-select"
              options={semester}
              onChange={handleSemesterChange}
              placeholder="Semester"
            />
          </div>
          <div className="each-info-select">
            <span className="font">Course</span>
            <Dropdown
              className="syllabus-entry-select"
              options={course}
              onChange={handleCourseChange}
              placeholder="Course"
            />
          </div>
        </div>

        <div
          className="division-background"
          // onClick={handleShowContent}
        >
          <div
            className="dropdown-section"
            onClick={() => handleDropdownToggle("courseContent")}
          >
            <div>Course Objectives</div>
            {showcontent ? (
              <ArrowDropUpIcon onClick={handleShowContent} />
            ) : (
              <ArrowDropDownIcon onClick={handleShowContent} />
            )}
          </div>

          {showcontent && (
            <div>
              <ToastContainer />
              <form onSubmit={handleSubmitCourseOutcomes}>
                 
                 {console.log(courseOutcomes)}
                {courseOutcomes.map((outcome, index) => (
                  <div key={index} className="course-outcome">
                    <InputBox
                      className="input-box"
                      type="text"
                      value={outcome.objective}
                      onChange={(e) =>
                        handleCourseOutcomeChange(
                          index,
                          "objective",
                          e.target.value
                        )
                      }
                      placeholder="Enter Objective"
                    />
                    <InputBox
                      className="input-box"
                      type="text"
                      value={outcome.description}
                      onChange={(e) =>
                        handleCourseOutcomeChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Enter Description"
                    />
                    <div
                      style={{
                        display: "flex",
                        margin: "10px 10px 10px 30px",
                      }}
                    >
                      <RemoveCircleTwoToneIcon
                        style={{ cursor: "pointer", color: "black" }}
                        onClick={() => handleDeleteCourseOutcome(index)}
                      />
                    </div>
                  </div>
                ))}

                  <div
                  style={{
                    display: "flex",
                    margin: "20px 10px 10px 30px",
                  }}
                >
                  <AddCircleTwoToneIcon
                    style={{
                      cursor: "pointer",
                      color: "black",
                    }}
                    onClick={handleAddCourseOutcome}
                  />
                </div>

                <button type="submit" className="button-submit">
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
        <div className="division-background">
          <div
            className="dropdown-section"
            onClick={() => handleDropdownToggle("courseContent")}
          >
            <div>Course Outcome & Program Outcome</div>
            {showCoPocontent ? (
              <ArrowDropUpIcon onClick={handleShowCoPoContent} />
            ) : (
              <ArrowDropDownIcon onClick={handleShowCoPoContent} />
            )}
          </div>

          {showCoPocontent && (
            <form onSubmit={handleCoPoSubmit}>
              <ToastContainer />
              

              {dropdownSets.map((set, index) => (
                <div key={index}>
                  <div className="flex-boxco">
                    <Dropdown
                      label="CO"
                      options={co}
                      value={set.co}
                      onChange={(value) =>
                        handleDropdownChange(index, "co", value)
                      }
                    />
                    <Dropdown
                      label="PO"
                      options={po}
                      value={set.po}
                      onChange={(value) =>
                        handleDropdownChange(index, "po", value)
                      }
                    />
                    <InputBox
                      className="copo"
                      placeholder="Mapping Level"
                      value={set.level}
                      onChange={(e) =>
                        handleDropdownChange(index, "level", e.target.value)
                      }
                      type="number"
                      min="0"
                    />

                    <div
                      style={{
                        display: "flex",
                        margin: "10px 10px 10px 10px",
                      }}
                    >
                      <RemoveCircleTwoToneIcon
                        style={{ cursor: "pointer", color: "black" }}
                        onClick={() => handleRemoveDropdown(index)}
                      />
                      {/* <div>
                                         <button type="submit" className="button-submit">Submit</button>
                                         </div> */}
                    </div>
                  </div>
                </div>
              ))}

            <div
                style={{
                  display: "flex",
                  margin: "10px 10px 10px 30px",
                }}
              >
                <AddCircleTwoToneIcon
                  style={{
                    cursor: "pointer",
                    color: "black",
                  }}
                  onClick={handleAddDropdown}
                />
              </div>

              <button type="submit" className="button-submit">
                Submit
              </button>
            </form>
          )}
        </div>

        <div className="division-background">
          <div
            className="dropdown-section"
            onClick={() => handleDropdownToggle("courseContent")}
          >
            <div>Course Unit Entry</div>
            {showunitcontent ? (
              <ArrowDropUpIcon onClick={handleShowUnitContent} />
            ) : (
              <ArrowDropDownIcon onClick={handleShowUnitContent} />
            )}
          </div>

          {showunitcontent && (
            <form onSubmit={handleSubmitUnit}>
              <ToastContainer />

              {units.map((unit, index) => (
                <div key={index}>
                  <InputBox
                    placeholder="Unit"
                    type="text"
                    value={unit.unit}
                    onChange={(e) =>
                      handleUnitChange(index, "unit", e.target.value)
                    }
                  />
                  <InputBox
                    placeholder="Unit Name"
                    type="text"
                    value={unit.unitname}
                    onChange={(e) =>
                      handleUnitChange(index, "unitname", e.target.value)
                    }
                  />
                  <InputBox
                    placeholder="Description"
                    value={unit.description}
                    type="text"
                    onChange={(e) =>
                      handleUnitChange(index, "description", e.target.value)
                    }
                  />
                  <InputBox
                    placeholder="Hours"
                    type="number"
                    value={unit.hours}
                    onChange={(e) =>
                      handleUnitChange(index, "hours", e.target.value)
                    }
                  />
                  <button type="button" onClick={() => handleDeleteUnit(index)}>
                    <RemoveCircleTwoToneIcon />
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddUnit}>
                <AddCircleTwoToneIcon />
              </button>
              <button type="submit" className="button-submit">
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
      <div>
        <button onClick={handleFetchAndDownloadPDF}>PDF</button>
      </div>
    </div>
  );
};

export default SyllabusEntry;
