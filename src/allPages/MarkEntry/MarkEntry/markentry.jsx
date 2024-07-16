import React, { useState, useEffect } from "react";
import "./markentry.css";
import apiHost from "../../../utils/api";
import Dropdown from "../../../components/dropdown/dropdown";
import InputBox from "../../../components/InputBox/inputbox";
import Button from "../../../components/Button/button";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


function Markentry() {

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [Open, setOpen] = useState(false);

  const [RegulationOptions, setRegulationOptions] = useState([]);
  const [Regulation, setRegulation] = useState("");

  const [semesterOptions, setSemesterOptions] = useState([]);
  const [semester, setSemester] = useState("");

  const [yearOptions, setYearOptions] = useState([]);
  const [year, setYear] = useState(undefined)

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [department, setDepartment] = useState(undefined)

  const [testtypeOptions, setTestTypeOptions] = useState([]);
  const [testtype, setTestType] = useState("");

  const [subjectOptions, setSubjectOptions] = useState([]);
  const [subject, setSubject] = useState(undefined);

  const [facultyOptions, setFacultyOptions] = useState([]);
  const [faculty, setFaculty] = useState(1);

  const [coCount, setCoCount] = useState(0);
  const [coBound, setCoBound] = useState(3);
  const [courseoutcomeOptions, setCourseOutcomeOptions] = useState([]);
  const [courseoutcomes, setCourseOutcomes] = useState([]); // Array to hold maximum marks for each outcome
  const [courseOutcomeIds, setCourseOutcomeIds] = useState([]);

  const [updatedMarks, setUpdatedMarks] = useState({})
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);

  const [studentsData, setStudentsData] = useState([]);

  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetch(`${apiHost}/regulation`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.regulation,
        }));
        setRegulationOptions(options);
      })
      .catch((error) =>
        console.error("Error fetching academic year data:", error)
      );

    fetch(`${apiHost}/semester`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.semester,
        }));
        setSemesterOptions(options);
      })
      .catch((error) => console.error("Error fetching semester data:", error));

    fetch(`${apiHost}/testtype`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.type,
        }));
        setTestTypeOptions(options);
      })
      .catch((error) => console.error("Error fetching test type data:", error));



    fetch(`${apiHost}/year`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((res) => ({
          value: res.id,
          label: res.year
        }
        ))
        console.log(options)
        setYearOptions(options)
      }
      )



  }, []);

  useState(() => {
    console.log(departmentOptions)
  }, [departmentOptions])
  const getFaculty = () => {
    fetch(`${apiHost}/faculty`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setFacultyOptions(options);
      })
      .catch((error) => console.error("Error fetching faculty data:", error));

  }
  const getDepartment = () => {
    fetch(`${apiHost}/department?regulation=${Regulation.value}`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((res) => ({
          value: res.id,
          label: res.branch
        }
        ))
        console.log(options)
        setDepartmentOptions(options)
      }
      )
  }
  const getCourse = (semester) => {
    fetch(`${apiHost}/course?semester=${semester}&faculty=${faculty}&year=${Regulation.value}&branch=${department.value}`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.name + ' - ' + item.code,
        }));
        setSubjectOptions(options);
      })
      .catch((error) => console.error("Error fetching subject data:", error));
  }
  const getCourseOutcomes = () => {
    fetch(`${apiHost}/co?course=${subject.value}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setCoCount(data.length)
        setCourseOutcomeIds(data)
      })
  }


  useEffect(() => {
    console.log(courseOutcomeIds)
  }, [courseOutcomeIds])


  const getStudents = () => {
    console.log(subject);
    fetch(`${apiHost}/students?branch=${department.value}&year=${year.value}&course=${subject.value}`)
      .then((response) => response.json())
      .then((data) => {
        const students = data.map((value) => (

          {
            id: value.id,
            name: value.name,
            register_number: value.register_number,
            marks: Array(coCount).fill(0),
            type: testtype.value
          }
        ))
        setStudentsData(students)
      }
      )
  }
  useEffect(() => {
    setCourseOutcomes(Array(coCount).fill(20));
  }, [coCount])

  useEffect(() => {
    if (Regulation) {
      getDepartment();
    }
  }, [Regulation])


  useEffect(() => {
    if (subject) {
      getCourseOutcomes();
    }
  }, [subject, year, semester, department])

  useEffect(() => {
    setSubject("")
  }, [year, semester, department])


  useEffect(() => {
    if (semester) {
      getCourse(semester.value)
    }
  }, [semester, year, department])

  useEffect(() => {
    setUpdatedMarks({});

    if (courseOutcomeIds.length > 0 && testtype && subject) {

      const promises = courseOutcomeIds.map((id) =>
        axios.get(`${apiHost}/marks?co_id=${id.id}&type=${testtype.value}`)
      );

      Promise.all(promises)
        .then((responses) => {
          const mergedData = responses.reduce(
            (acc, res) => ({ ...acc, ...res.data }),
            {}
          );
          setUpdatedMarks(mergedData);

          const newStudentsData = studentsData.map((student) => {
            const updatedMarks = courseOutcomeIds.map((co, markIndex) => {
              const mark = mergedData['S' + student.id + 'C' + co.id + 'T' + testtype.value]?.mark || 0;
              return mark;
            });
            return { ...student, marks: updatedMarks };
          });

          setStudentsData(newStudentsData);
        })
        .catch((error) => {
          console.error("Error fetching marks:", error);
        });
    }
  }, [courseOutcomeIds, testtype, subject]);

  useEffect(() => {
    console.log(courseOutcomeIds)
    console.log(updatedMarks)
  }, [updatedMarks])

  useEffect(() => {
    if (testtype && testtype.value) {
      console.log("Test Type: ", testtype.value);
    }
  }, [testtype]);

  useEffect(() => {
    console.log("Resetting the studentsData");
    setStudentsData([]);

  }, [year, Regulation, testtype, department, subject, semester])


  const handleMaxMarkChange = (index, value) => {
    const updatedCourseOutcomes = [...courseoutcomes];
    updatedCourseOutcomes[index] = value;
    console.log(updatedCourseOutcomes)
    setCourseOutcomes(updatedCourseOutcomes);
  };

  const handleMarkChange = (studentIndex, markIndex, value, courseOutcome) => {
    console.log(value)
    if (value < 0) {
      value = 0;
    }
    if (courseOutcome === "" || isNaN(parseInt(courseOutcome))) {
      return;
    }
    if (value !== "" && parseInt(value) > parseInt(courseOutcome)) {
      value = courseOutcome;
    }
    const updatedStudentsData = [...studentsData];

    updatedStudentsData[studentIndex].marks[markIndex] = value;
    setStudentsData(updatedStudentsData);

    if (value > courseOutcome) {
      setAlertMessage("Entered mark exceeds maximum mark!");
      setModalIsOpen(true);
    }
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

  const handleSemesterChange = (e) => {
    setSemester(e);
  }

  // search bar
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    console.log("The student data changed to", studentsData)
  }, [studentsData])

  const updateMarks = () => {

    let startIndex = (testtype.value == 2 || testtype.value == 4) ? (coBound - 1) : 0;
    let endIndex = (testtype.value == 1 || testtype.value == 3) ? coBound : coCount;
    const updatedStudentData = [...studentsData]
    updatedStudentData.map((value, i) => {
      value.marks = value.marks.slice(startIndex, endIndex);
    })
    setStudentsData(updatedStudentData)
    console.log(" start : " + startIndex + " end : " + endIndex)
    axios.post(`${apiHost}/updateMarks`,
      { student: studentsData, testtype: testtype.value, co: courseOutcomeIds.slice(startIndex, endIndex) }).then((res) => {
        if (res.status == 200) {
          setModalIsOpen(true);
        }
      })
  }

  return (
    <div className="container">
      <div className="dropdown-container">
        <div className="dropdowns">
          <Dropdown
            options={RegulationOptions}
            value={Regulation}
            onChange={setRegulation}
            placeholder="Regulation"
          />
          <Dropdown
            options={Regulation ? yearOptions : undefined}
            value={year}
            disabled={!Regulation}
            onChange={setYear}
            placeholder=" Year"
          />
          <Dropdown
            options={Regulation ? departmentOptions : undefined}
            value={department}
            disabled={!year}
            onChange={setDepartment}
            placeholder=" Department"
          />

          <Dropdown
            options={semesterOptions}
            value={semester}
            disabled={!department}
            onChange={handleSemesterChange}
            placeholder="Semester"
          />
          <Dropdown
            options={testtypeOptions}
            value={testtype}
            disabled={!semester}
            onChange={setTestType}
            placeholder="Test Type"
          />
          <Dropdown
            options={subjectOptions}
            value={subject}
            disabled={!semester}
            onChange={setSubject}
            placeholder="Subject"
          />
          <Button label="Get Student List" onClick={getStudents} />
        </div>
      </div>
      <ToastContainer />
      <div className="white-containers">
        {courseoutcomes.map((_, index) => {
          if (testtype.value == 1 || testtype.value == 3) {
            if (index < coBound) {
              return (
                <div key={index} className="white-container">

                  <div className="mark-and-button">
                    <h4>Course Outcome {index + 1} </h4>
                    <div className="mark">
                      <>Max Mark:</>
                      <InputBox
                        type="number"
                        value={index == coBound - 1 ? courseoutcomes[index] / 2 : courseoutcomes[index]}
                        onChange={(e) => handleMaxMarkChange(index, e.target.value)}
                      />
                    </div>

                    <Button label="Update" />
                    <Button label="Delete" />

                  </div>

                </div>
              )
            }
          }
          else if (testtype.value == 2 || testtype.value == 4) {
            if (index >= coBound - 1) {
              return (
                <div key={index} className="white-container">
                  <div className="mark-and-button">
                    <h4>Course Outcome {index + 1} </h4>
                    <div className="mark">
                      <>Max Mark:</>
                      <InputBox
                        type="number"

                        value={index == coBound - 1 ? courseoutcomes[index] / 2 : courseoutcomes[index]}
                        onChange={(e) => handleMaxMarkChange(index, e.target.value)}
                      />
                    </div>

                    <Button label="Update" />
                    <Button label="Delete" />

                  </div>
                </div>
              )
            }
          }
          else {

            return (
              <div key={index} className="white-container">

                <div className="mark-and-button">
                  <h4>Course Outcome {index + 1} </h4>
                  <div className="mark">
                    <>Max Mark:</>
                    <InputBox
                      type="number"
                      value={courseoutcomes[index]}
                      onChange={(e) => handleMaxMarkChange(index, e.target.value)}
                    />
                  </div>

                  <Button label="Update" />
                  <Button label="Delete" />

                </div>
              </div>
            )
          }

        })}
      </div>
      {studentsData.length > 0 &&
        <div className="table-container">
          <InputBox
            type="text"
            placeholder="Student Name/Reg.."
            value={searchTerm}
            onChange={handleSearch}
          /><br />
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                {courseoutcomes.map((_, i, courseOutcome) => {

                  if (testtype.value == 1 || testtype.value == 3) {
                    if (i < coBound) {
                      return (
                        <th key={i}>
                          COURSE OUTCOME {i + 1} (MAX : {i == coBound - 1 ? courseoutcomes[i] / 2 : courseoutcomes[i]})

                        </th>
                      )

                    }
                  }
                  else if (testtype.value == 2 || testtype.value == 4) {
                    if (i >= coBound - 1) {
                      return (
                        <th key={i}>
                          COURSE OUTCOME {i + 1} (MAX : {i == coBound - 1 ? courseoutcomes[i] / 2 : courseoutcomes[i]})
                        </th>
                      )

                    }
                  }
                  else {
                    return (
                      <th key={i}>
                        COURSE OUTCOME {i + 1} (MAX : {courseoutcomes[i]})
                      </th>
                    )
                  }
                })}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>

              {
                studentsData.filter(student =>
                  student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  student.register_number.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((student, studentIndex) => {

                  let absent = false;

                  return (

                    <tr key={studentIndex}>
                      <td>{student.name}</td>
                      <td>{student.register_number}</td>
                      {courseoutcomes.map((courseOutcome, markIndex) => {

                        if (testtype.value == 1 || testtype.value == 3) {
                          if (markIndex < coBound) {
                            if (updatedMarks['S' + student.id + 'C' + courseOutcomeIds[markIndex].id + 'T' + testtype.value]?.present == 0) {
                              absent = true
                            }
                            else {
                              absent = false
                            }
                            return (
                              <td key={markIndex}>
                                <InputBox
                                  disabled={absent}
                                  type={absent ? "text" : "number"}
                                  value={absent ? "AB" : student.marks[markIndex]}
                                  max={(markIndex == coBound - 1) ? courseOutcome / 2 : courseOutcome}
                                  onChange={(e) =>
                                    handleMarkChange(studentIndex, markIndex, e.target.value, (markIndex == coBound - 1) ? courseOutcome / 2 : courseOutcome)
                                  }
                                />
                              </td>
                            )
                          }
                        }
                        else if (testtype.value == 2 || testtype.value == 4) {
                          if (markIndex >= coBound - 1) {
                            return (
                              <td key={markIndex}>
                                <InputBox
                                  type="number"
                                  value={student.marks[markIndex]}
                                  max={(markIndex == coBound - 1) ? courseOutcome / 2 : courseOutcome}
                                  onChange={(e) =>
                                    handleMarkChange(studentIndex, markIndex, e.target.value, (markIndex == coBound - 1) ? courseOutcome / 2 : courseOutcome)
                                  }

                                />
                              </td>
                            )
                          }
                        }
                        else {
                          return (
                            <td key={markIndex}>
                              <InputBox
                                type="number"
                                value={student.marks[markIndex]}
                                max={courseOutcome}
                                onChange={(e) =>
                                  handleMarkChange(studentIndex, markIndex, e.target.value, courseOutcome)
                                }

                              />
                            </td>
                          )
                        }


                      })}
                      <td>{absent ? "AB" : calculateTotal(student.marks)}</td>

                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      }
      {studentsData.length > 0 &&
        <div className="Marks-Submit-Button">
          <Button onClick={updateMarks} label={"Submit"} />
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Marks Submission Success"
            className="modal"
            overlayClassName="modal-overlay"
          >
            <center>
              <h2>Marks added successfully</h2>

              <button onClick={() => setModalIsOpen(false)}>Close</button>
            </center>
          </Modal>

        </div>
      }

      <Modal
        open={Open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ width: 400, p: 4, m: 'auto', mt: '20vh', bgcolor: 'background.paper', boxShadow: 24 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Alert
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {alertMessage}
          </Typography>
        </Box>
      </Modal>


      {!studentsData.length > 0 &&
        <div className="noData">No Data To Show</div>
      }


    </div>


  );
}

export default Markentry;


