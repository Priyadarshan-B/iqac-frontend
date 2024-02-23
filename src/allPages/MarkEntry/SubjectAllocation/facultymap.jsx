import React, { useState, useEffect } from "react";
import Select from "react-select";
import Button from "../../../components/Button/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import apiHost from "../../../utils/api";
import "./facultymap.css";

function Facultymap() {
  const [academicyear, setAcademicyear] = useState([]);
  const [semester, setSemester] = useState([]);
  const [degree, setDegree] = useState([]);
  const [branch, setBranch] = useState([]);
  const [subject, setSubject] = useState([]);
  const [regulation, setReglation] = useState([]);
  const [department, setDepartment] = useState([]);
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    fetch(`${apiHost}/academic_years`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.year,
          label: item.year,
        }));
        setAcademicyear(options);
      })
      .catch((error) =>
        console.error("Error fetching dropdown 1 data:", error)
      );

    fetch(`${apiHost}/semester`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.semester,
          label: item.semester,
        }));
        setSemester(options);
      })
      .catch((error) =>
        console.error("Error fetching dropdown 2 data:", error)
      );

    fetch(`${apiHost}/degree`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.degree,
          label: item.degree,
        }));
        setDegree(options);
      })
      .catch((error) =>
        console.error("Error fetching dropdown 3 data:", error)
      );

    fetch(`${apiHost}/department`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.dep_name,
          label: item.dep_name,
        }));
        setBranch(options);
      })
      .catch((error) =>
        console.error("Error fetching dropdown 4 data:", error)
      );

    fetch("API_ENDPOINT_5")
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setSubject(options);
      })
      .catch((error) =>
        console.error("Error fetching dropdown 5 data:", error)
      );

    fetch(`${apiHost}/regulation`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.regulation,
          label: item.regulation,
        }));
        setReglation(options);
      })
      .catch((error) =>
        console.error("Error fetching dropdown 6 data:", error)
      );
    fetch(`${apiHost}/department`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.dep_name,
          label: item.dep_name,
        }));
        setDepartment(options);
      })
      .catch((error) =>
        console.error("Error fetching dropdown 5 data:", error)
      );

    fetch("API_ENDPOINT_8")
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setFaculty(options);
      })
      .catch((error) =>
        console.error("Error fetching dropdown 5 data:", error)
      );
  }, []);

  // table
  const [facultyList, setFacultyList] = useState([]);

  const dummyFacultyData = [
    { id: 1, name: "ABC", subject: "Math" },
    { id: 2, name: "DEF", subject: "Science" },
    { id: 3, name: "ABC", subject: "History" },
  ];
  useEffect(() => {
    fetch("API_ENDPOINT")
      .then((response) => response.json())
      .then((data) => {
        setFacultyList(data);
      })
      .catch((error) => {
        console.error("Error fetching faculty data:", error);
        setFacultyList(dummyFacultyData);
      });
  }, []);

  const handleEdit = (id) => {
    console.log("Edit faculty with ID:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete faculty with ID:", id);
    setFacultyList(facultyList.filter((faculty) => faculty.id !== id));
  };

  return (
    <div className="content-container">
      <div className="flex-for-facultymap">
        <div className="content-with-button">
          <div className="drop-and-faculty">
            <div className="drop-flex">
              <div className="dropdown">
                <div className="label">
                  <label>Academic Year:</label>
                </div>
                <Select
                  className="select-field"
                  options={academicyear}
                  placeholder="Enter Academic Year"
                  isSearchable
                />
              </div>
              <div className="dropdown">
                <div className="label">
                  <label>Degree:</label>
                </div>
                <Select
                  className="select-field"
                  options={degree}
                  placeholder="Enter Degree"
                  isSearchable
                />
              </div>
              <div className="dropdown">
                <div className="label">
                  <label>Branch:</label>
                </div>
                <Select
                  className="select-field"
                  options={branch}
                  placeholder="Enter Branch"
                  isSearchable
                />
              </div>
              <div className="dropdown">
                <div className="label">
                  <label>Semester:</label>
                </div>
                <Select
                  className="select-field"
                  options={semester}
                  placeholder="Enter Semester"
                  isSearchable
                />
              </div>
              <div className="dropdown">
                <div className="label">
                  <label>Regualtion:</label>
                </div>
                <Select
                  className="select-field"
                  options={regulation}
                  placeholder="Enter Regulation"
                  isSearchable
                />
              </div>

              <div className="dropdown">
                <div className="label">
                  <label>Subject</label>
                </div>
                <Select
                  className="select-field"
                  options={subject}
                  placeholder="Enter Department"
                  isSearchable
                />
              </div>

              <div className="dropdown">
                <div className="label">
                  <label>Department:</label>
                </div>
                <Select
                  className="select-field"
                  options={department}
                  placeholder="Enter Department"
                  isSearchable
                />
              </div>
              <div className="dropdown">
                <div className="label">
                  <label>Faculty Name:</label>
                </div>
                <Select
                  className="select-field"
                  options={faculty}
                  placeholder="Enter Faculty Name"
                  isSearchable
                />
              </div>
            </div>




               

             
            
          </div>
          <div className="assign-button">
            <Button label="Assign" />
          </div>
        </div>
        <div className="faculty-table">
          <div className="table-faculty">
            <h2>Faculty List</h2>
            <table>
              <thead>
                <tr>
                  <th>FACULTY</th>
                  <th>SUBJECT</th>
                  <th>Edit </th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {facultyList.map((faculty) => (
                  <tr key={faculty.id}>
                    <td>{faculty.name}</td>
                    <td>{faculty.subject}</td>
                    <td>
                      <EditIcon onClick={() => handleEdit(faculty.id)} />
                    </td>
                    <td>
                      <DeleteIcon onClick={() => handleDelete(faculty.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Facultymap;
