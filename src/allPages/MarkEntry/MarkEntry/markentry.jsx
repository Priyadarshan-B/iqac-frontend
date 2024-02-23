import React, { useState, useEffect } from "react";
import "./markentry.css";
import apiHost from "../../../utils/api";
import Dropdown from "../../../components/dropdown/dropdown";
import InputBox from "../../../components/InputBox/inputbox";
import Button from "../../../components/Button/Button";

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
  const [courseoutcome, setCourseOutcome] = useState("");

  useEffect(() => {
    fetch(`${apiHost}/academic_years`)
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

    fetch(`${apiHost}/semester`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.semester,
          label: item.semester,
        }));
        setSemesterOptions(options);
      })
      .catch((error) => console.error("Error fetching semester data:", error));

    fetch(`${apiHost}/subject`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.subject,
          label: item.subject,
        }));
        setSubjectOptions(options);
      })
      .catch((error) => console.error("Error fetching subject data:", error));

    fetch(`${apiHost}/testtype`)
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
  };

  const [marks, setMarks] = useState(Array.from({ length: 1 }, () => ""));

  const handleMarkChange = (index, value) => {
    const newMarks = [...marks];
    newMarks[index] = value;
    setMarks(newMarks);
  };

  const calculateMax = () => {
    const filledMarks = marks
      .filter((mark) => mark !== "")
      .map((mark) => parseInt(mark, 10));
    return filledMarks.length > 0 ? Math.max(...filledMarks) : 100;
  };

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
              <label>Course Outcome {index + 1}</label>
              <div className="mark">
                <label>Mark:</label>
                <InputBox
                  type="number"
                  name={`mark-${index}`}
                  value={marks[index]}
                  onChange={(e) => handleMarkChange(index, e.target.value)}
                  max={calculateMax()}
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
              {marks.map((mark, i) => (
                <td key={i}>
                  <InputBox type="number" max={mark || 100} />
                </td>
              ))}
              <td>
                <InputBox type="number" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Markentry;
