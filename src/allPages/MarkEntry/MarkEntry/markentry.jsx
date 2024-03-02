import React, { useState, useEffect } from "react";
import "./markentry.css";
import apiHost from "../../../utils/api";
import Dropdown from "../../../components/dropdown/dropdown";
import InputBox from "../../../components/InputBox/inputbox";
import Button from "../../../components/Button/button";
function Markentry() {
  const [academicyearOptions, setAcademicyearOptions] = useState([]);
  const [academicyear, setAcademicyear] = useState("");

  const [semesterOptions, setSemesterOptions] = useState([]);
  const [semester, setSemester] = useState("");

  const [testtypeOptions, setTestTypeOptions] = useState([]);
  const [testtype, setTestType] = useState("");

  const [subjectOptions, setSubjectOptions] = useState([]);
  const [subject, setSubject] = useState("");

  const [facultyOptions, setFacultyOptions] = useState([]);
  const [faculty, setFaculty] = useState("");

  const [selectedCount, setSelectedCount] = useState(1);

  const [courseoutcomeOptions, setCourseOutcomeOptions] = useState([]);
  const [courseoutcomes, setCourseOutcomes] = useState(Array(10).fill("")); // Array to hold maximum marks for each outcome
  const [marks, setMarks] = useState(Array(10).fill(""));

  useEffect(() => {
    fetch(`${apiHost}/api/academic_years`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.year,
          label: item.year,
        }));
        setAcademicyearOptions(options);
      })
      .catch((error) =>
        console.error("Error fetching academic year data:", error)
      );

    fetch(`${apiHost}/api/semester`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.semester,
          label: item.semester,
        }));
        setSemesterOptions(options);
      })
      .catch((error) => console.error("Error fetching semester data:", error));

    fetch(`${apiHost}/api/subject`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.subject,
          label: item.subject,
        }));
        setSubjectOptions(options);
      })
      .catch((error) => console.error("Error fetching subject data:", error));

    fetch(`${apiHost}/api/testtype`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.type,
          label: item.type,
        }));
        setTestTypeOptions(options);
      })
      .catch((error) => console.error("Error fetching test type data:", error));

    fetch(`${apiHost}/faculty`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.faculty,
          label: item.faculty,
        }));
        setFacultyOptions(options);
      })
      .catch((error) => console.error("Error fetching faculty data:", error));

    fetch(`${apiHost}/co`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.co,
          label: item.co,
        }));
        setCourseOutcomeOptions(options);
      })
      .catch((error) => console.error("Error fetching co data:", error));
  }, []);

  const handleCountChange = (selectedCount) => {
    setSelectedCount(selectedCount.value);
    setMarks(Array(selectedCount.value).fill(0));
    setCourseOutcomes(Array(selectedCount.value).fill(""));
  };

  const handleMaxMarkChange = (index, value) => {
    const updatedCourseOutcomes = [...courseoutcomes];
    updatedCourseOutcomes[index] = value;
    setCourseOutcomes(updatedCourseOutcomes);
  };

  const handleMarkChange = (index, value) => {
    if (value !== "" && parseInt(value) > parseInt(courseoutcomes[index])) {
      value = courseoutcomes[index];
    }
    const updatedMarks = [...marks];
    updatedMarks[index] = value;
    setMarks(updatedMarks);
  };

  const calculateTotal = () => {
    if (marks.length === 1 && !isNaN(marks[0])) {
      return parseInt(marks[0]);
    }
    let sum = 0;
    marks.forEach((mark) => {
      if (!isNaN(mark)) {
        sum += parseInt(mark);
      }
    });
    return sum;
  };

  // search bar
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const [searchTerm, setSearchTerm] = useState("");
  // const filteredFacultyList = facultyList.filter(
  //   (faculty) =>
  //     faculty.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     faculty.id.toString().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="container">
      <div className="dropdown-container">
        <div className="dropdowns">
          <Dropdown
            options={academicyearOptions}
            value={academicyear}
            onChange={setAcademicyear}
            placeholder=" Academic Year"
          />
          <Dropdown
            options={semesterOptions}
            value={semester}
            onChange={setSemester}
            placeholder=" Semester"
          />
          <Dropdown
            options={testtypeOptions}
            value={testtype}
            onChange={setTestType}
            placeholder="Test Type"
          />
          <Dropdown
            options={subjectOptions}
            value={subject}
            onChange={setSubject}
            placeholder="Subject"
          />
          <Dropdown
            options={facultyOptions}
            value={faculty}
            onChange={setFaculty}
            placeholder="Faculty Name"
          />
          <Dropdown
            options={[...Array(10).keys()].map((count) => ({
              value: count + 1,
              label: `${count + 1}`,
            }))}
            value={{ value: selectedCount, label: `${selectedCount}` }}
            onChange={handleCountChange}
            placeholder="Select Count"
          />
        </div>
      </div>

      <div className="white-containers">
        {[...Array(selectedCount)].map((_, index) => (
          <div key={index} className="white-container">
            <div className="mark-and-button">
              <label>Course Outcome {index + 1} </label>
              <div className="mark">
                <label>Max Mark:</label>
                <InputBox
                  type="number"
                  value={courseoutcomes[index]}
                  onChange={(e) => handleMaxMarkChange(index, e.target.value)}
                />
              </div>
              <div className="button">
                <Button label="Update" />
                <Button label="Delete" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="table-container">
        <InputBox
          type="text"
          placeholder="Student Name/Reg.."
          value={searchTerm}
          onChange={handleSearch}
        />
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              {[...Array(selectedCount)].map((_, i) => (
                <th key={i}>Mark {i + 1}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John</td>
              <td>1</td>
              {[...Array(selectedCount)].map((_, i) => (
                <td key={i}>
                  <input
                    type="number"
                    value={marks[i]}
                    max={courseoutcomes[i]}
                    onChange={(e) => handleMarkChange(i, e.target.value)}
                  />
                </td>
              ))}
              <td>{calculateTotal()}</td>
            </tr>
            <tr>
              <td>Vishnu</td>
              <td>2</td>
              {[...Array(selectedCount)].map((_, i) => (
                <td key={i}>
                  <input
                    type="number"
                    value={marks[i]}
                    max={courseoutcomes[i]}
                    onChange={(e) => handleMarkChange(i, e.target.value)}
                  />
                </td>
              ))}
              <td>{calculateTotal()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Markentry;
