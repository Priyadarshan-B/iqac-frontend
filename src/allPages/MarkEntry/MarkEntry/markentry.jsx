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
  const [courseoutcomes, setCourseOutcomes] = useState(Array(1).fill("")); // Array to hold maximum marks for each outcome
  const [marks, setMarks] = useState(Array(10).fill(""));

  const [studentsData, setStudentsData] = useState([
    { name: "John", rollNumber: "1", marks: Array(10).fill("") },
    { name: "Priyan", rollNumber: "2", marks: Array(10).fill("") },
    
  ]);

  useEffect(() => {
  
    fetchOptions(`${apiHost}/api/academic_years`, setAcademicyearOptions);
    fetchOptions(`${apiHost}/api/semester`, setSemesterOptions);
    fetchOptions(`${apiHost}/api/subject`, setSubjectOptions);
    fetchOptions(`${apiHost}/api/testtype`, setTestTypeOptions);
    fetchOptions(`${apiHost}/faculty`, setFacultyOptions);
    fetchOptions(`${apiHost}/co`, setCourseOutcomeOptions);
  }, []);

  const fetchOptions = (url, setter) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.value,
          label: item.label,
        }));
        setter(options);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

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

  const calculateTotal = (studentMarks) => {
    let sum = 0;
    studentMarks.forEach((mark) => {
      if (!isNaN(mark) && mark !== "") {
        sum += parseInt(mark);
      }
    });
    return sum;
  };

  // const handleStudentMarkChange = (studentIndex, markIndex, value, courseOutcome) => {
  //   if (value !== "" && parseInt(value) > parseInt(courseOutcome)) {
  //     value = courseOutcome;
  //   }
  //   const updatedStudentsData = [...studentsData];
  //   updatedStudentsData[studentIndex].marks[markIndex] = value;
  //   setStudentsData(updatedStudentsData);
  // };


  const handleStudentMarkChange = (studentIndex, markIndex, value, courseOutcome) => {
    if (courseOutcome === "" || isNaN(parseInt(courseOutcome))) {
      return;
    }
    if (value !== "" && parseInt(value) > parseInt(courseOutcome)) {
      value = courseOutcome;
    }
   const updatedStudentsData = [...studentsData];
    updatedStudentsData[studentIndex].marks[markIndex] = value;
    setStudentsData(updatedStudentsData);
  };
  

  // search bar
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="container">
      <div className="dropdown-container">
        <div className="dropdowns">
          <Dropdown
            options={academicyearOptions}
            value={academicyear}
            onChange={setAcademicyear}
            placeholder="Academic Year"
          />
          <Dropdown
            options={semesterOptions}
            value={semester}
            onChange={setSemester}
            placeholder="Semester"
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
              {courseoutcomes.map((_, i,courseOutcome) => (
                <th key={i}>
                COURSE OUTCOME {i + 1} (MAX : {courseoutcomes[i]})
              </th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.map((student, studentIndex) => (
              <tr key={studentIndex}>
                <td>{student.name}</td>
                <td>{student.rollNumber}</td>
                {courseoutcomes.map((courseOutcome, markIndex) => (
                  <td key={markIndex}>
                    <input
                      type="number"
                      value={student.marks[markIndex]}
                      max={courseOutcome}
                      onChange={(e) =>
                        handleStudentMarkChange(studentIndex, markIndex, e.target.value, courseOutcome)
                      }
                    />
                  </td>
                ))}
               <td>{calculateTotal(student.marks)}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Markentry;


