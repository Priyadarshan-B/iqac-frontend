import React, { useState, useEffect } from "react";
import apiHost from "../../utils/api";
import Dropdown from "../../components/dropdown/dropdown";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import './units.css';
import Button from "../../components/Button/button";

function Units() {
    const [regulation, setRegulation] = useState([]);
    const [regulationId, setRegulationId] = useState(null);
    const [regulationLabel, setRegulationLabel] = useState("");
    const [degree, setDegree] = useState([]);
    const [degreeId, setDegreeId] = useState(null);
    const [degreeLabel, setDegreeLabel] = useState("");
    const [branch, setBranch] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [branchLabel, setBranchLabel] = useState("");
    const [semester, setSemester] = useState([]);
    const [semesterLabel, setSemesterLabel] = useState("");
    const [course, setCourse] = useState([]);
    const [courseId, setCourseId] = useState(null);
    const [courseLabel, setCourseLabel] = useState("");
    const [syllabus, setSyllabus] = useState([]);

    useEffect(() => {
        // Fetch regulations on component mount
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

        // Fetch semesters on component mount
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
    }, []);

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
                console.error("Error fetching degree dropdown", error)
            );
    };

    const handleDegreeChange = (selectedDegree) => {
        setDegreeId(selectedDegree.value);
        setDegreeLabel(selectedDegree.label);
        fetch(
            `${apiHost}/api/rf/dropdown/branch?degree=${selectedDegree.value}`
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
    };

    const handleBranchChange = (selectedBranch) => {
        setSelectedBranchId(selectedBranch.value);
        setBranchLabel(selectedBranch.label);
        // You can fetch courses based on selected branch here if needed
    };

    const handleSemesterChange = (selectedSemester) => {
        setSemesterLabel(selectedSemester.label);
        const selectedBranch = branch.find(
            (item) => item.value === selectedBranchId
        );
        if (selectedBranch) {
            fetch(
                `${apiHost}/api/rf/dropdown/course?branch=${selectedBranch.value}&semester=${selectedSemester.value}`
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
                    console.error("Error fetching course dropdown", error)
                );
        }
    };

    const handleCourseChange = (selectedCourse) => {
        setCourseId(selectedCourse.value);
        setCourseLabel(selectedCourse.label);
        fetch(`${apiHost}/api/rf/syllabus?course=${selectedCourse.value}`)
            .then((response) => response.json())
            .then((data) => setSyllabus(data))
            .catch((error) =>
                console.error("Error fetching syllabus data", error)
            );
    };

    const handlePrintPDF = () => {
        const doc = new jsPDF();
        doc.text(`Course: ${courseLabel}`, 10, 10);
        doc.text(`Regulation: ${regulationLabel}`, 10, 20);
        doc.text(`Degree: ${degreeLabel}`, 10, 30);
        doc.text(`Branch: ${branchLabel}`, 10, 40);
        doc.text(`Semester: ${semesterLabel}`, 10, 50);
        doc.autoTable({
            startY: 60,
            head: [['Unit', 'Unit Name', 'Description', 'Hours']],
            body: syllabus.map((item) => [
                item.unit,
                item.unit_name,
                item.description,
                item.hours,
            ]),
        });
        doc.save(`${courseLabel}`);
    };

    return (
        <div className="unit-table">
            <div className="dropdown-container">
                <div className="dropdown-item">
                {/* <span className='font'>Regulation</span> */}
                    <Dropdown
                        className="select-field"
                        options={regulation}
                        onChange={handleRegulationChange}
                        placeholder="Select Regulation"
                    />
                </div>
                <div className="dropdown-item">
                {/* <span className='font'>Degree</span> */}
                    <Dropdown
                        className="select-field"
                        options={degree}
                        onChange={handleDegreeChange}
                        placeholder="Select Degree"
                    />
                </div>
                <div className="dropdown-item">
                {/* <span className='font'>Branch</span> */}
                    <Dropdown
                        className="select-field"
                        options={branch}
                        onChange={handleBranchChange}
                        placeholder="Select Branch"
                    />
                </div>
                <div className="dropdown-item">
                {/* <span className='font'>Semester</span> */}
                    <Dropdown
                        className="select-field"
                        options={semester}
                        onChange={handleSemesterChange}
                        placeholder="Select Semester"
                    />
                </div>
                <div className="dropdown-item">
                {/* <span className='font'>Course</span> */}
                    <Dropdown
                        className="select-field"
                        options={course}
                        onChange={handleCourseChange}
                        placeholder="Select Course"
                    />
                </div>
            </div>
            {syllabus.length > 0 && (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Unit</th>
                                <th>Unit Name</th>
                                <th>Description</th>
                                <th>Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {syllabus.map((item) => (
                                <tr key={item.unit}>
                                    <td>{item.unit}</td>
                                    <td>{item.unit_name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.hours}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Button onClick={handlePrintPDF} label="Print as PDF" />
                </div>
            )}
        </div>
    );
}

export default Units;
