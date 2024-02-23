import React, { useState, useEffect } from "react";
import Select from "react-select";
import Button from "../../../components/Button/button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import apiHost from "../../../utils/api";
import "./facultymap.css";

function Facultymap() {
    const [academicyear, setAcademicyear] = useState([]);
    const [semester, setSemester] = useState([]);
    const [degree, setDegree] = useState([]);
    const [branch, setBranch] = useState([]);
    const [subject, setCourse] = useState([]);
    const [regulation, setRegulation] = useState([]);
    const [department, setDepartment] = useState([]);
    const [faculty, setFaculty] = useState([]);

    const [facultyList, setFacultyList] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState(null); 

    useEffect(() => {
        fetch(`${apiHost}rf/dropdown/regulation`)
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

        fetch(`${apiHost}rf/dropdown/semester`)
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

        fetch(`${apiHost}rf/dropdown/academic-years`)
            .then((response) => response.json())
            .then((data) => {
                const options = data.map((item) => ({
                    value: item.id,
                    label: item.year,
                }));
                setAcademicyear(options);
            })
            .catch((error) =>
                console.error("Error fetching academic-year dropdown", error)
            );

        fetch(`${apiHost}rf/dropdown/department`)
            .then((response) => response.json())
            .then((data) => {
                const options = data.map((item) => ({
                    value: item.id,
                    label: item.dep_name,
                }));
                setDepartment(options);
            })
            .catch((error) =>
                console.error("Error fetching department dropdown", error)
            );
    }, []);

    const handleRegulationChange = (selectedRegulation) => {
        fetch(
            `${apiHost}rf/dropdown/degree?regulation=${selectedRegulation.value}`
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
                console.error("Error fetching degree dropdown", error)
            );
    };

    const handleDegreeChange = (selectedDegree)=>{
      fetch(
        `${apiHost}rf/dropdown/branch?degree=${selectedDegree.value}`
    )
        .then((response) => response.json())
        .then((data) => {
            const options = data.map((item) => ({
                value: item.id,
                label: item.branch,
            }));
            setBranch(options);
        })
        .catch((error) =>
            console.error("Error fetching branch dropdown", error)
        );
    }
const handleDepartmentChange = (selectedDepartment)=>{
  fetch(
    `${apiHost}cfm/dropdown/faculty?department=${selectedDepartment.value}`
)
    .then((response) => response.json())
    .then((data) => {
        const options = data.map((item) => ({
            value: item.id,
            label: item.faculty_name,
        }));
        setFaculty(options);
    })
    .catch((error) =>
        console.error("Error fetching faculty dropdown", error)
    );
}
const handleBranchChange = (selectedBranch) => {
  setSelectedBranchId(selectedBranch.value);
};


const handleSemesterChange = (selectedSemester) => {
  const selectedBranch = branch.find(item => item.value === selectedBranchId);
  if (selectedBranch) {
    fetch(`${apiHost}rf/dropdown/course?branch=${selectedBranch.value}&semester=${selectedSemester.value}`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.course,
        }));
        setCourse(options);
      })
      .catch((error) =>
        console.error("Error fetching course dropdown", error)
      );
  }
};


    // const dummyFacultyData = [
    //   { id: 1, name: "ABC", subject: "Math" },
    //   { id: 2, name: "DEF", subject: "Science" },
    //   { id: 3, name: "ABC", subject: "History" },
    // ];
    useEffect(() => {
        fetch(`${apiHost}cfm/faculty-mapping`)
            .then((response) => response.json())
            .then((data) => {
                setFacultyList(data);
            })
            .catch((error) => {
                console.error("Error fetching faculty data:", error);
                // setFacultyList(dummyFacultyData);
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
                                    <label>Regualtion:</label>
                                </div>
                                <Select
                                    className="select-field"
                                    options={regulation}
                                    onChange={handleRegulationChange}
                                    placeholder="Regulation"
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
                                    onChange={handleDegreeChange}
                                    placeholder="Degree"
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
                                    onChange={handleBranchChange}
                                    placeholder="Branch"
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
                                    onChange={handleSemesterChange}
                                    placeholder="Semester"
                                    isSearchable
                                />
                            </div>

                            <div className="dropdown">
                                <div className="label">
                                    <label>Course</label>
                                </div>
                                <Select
                                    className="select-field"
                                    options={subject}
                                    placeholder="Course"
                                    isSearchable
                                />
                            </div>

                            <div className="dropdown">
                                <div className="label">
                                    <label>Faculty Department:</label>
                                </div>
                                <Select
                                    className="select-field"
                                    options={department}
                                    onChange={handleDepartmentChange}
                                    placeholder="Department"
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
                                    placeholder="Faculty Name"
                                    isSearchable
                                />
                            </div>
                            <div className="dropdown">
                                <div className="label">
                                    <label>Academic Year:</label>
                                </div>
                                <Select
                                    className="select-field"
                                    options={academicyear}
                                    placeholder="Academic Year"
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
                        <h2>Mapped Faculty</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Academic Year</th>
                                    <th>Faculty</th>
                                    <th>Subject</th>
                                    <th>Edit </th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facultyList.map((faculty) => (
                                    <tr key={faculty.id}>
                                        <td>{faculty.year}</td>
                                        <td>{faculty.faculty_name}</td>
                                        <td>{faculty.course_name}</td>
                                        <td>
                                            <EditIcon
                                                onClick={() =>
                                                    handleEdit(faculty.id)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <DeleteIcon
                                                onClick={() =>
                                                    handleDelete(faculty.id)
                                                }
                                            />
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
