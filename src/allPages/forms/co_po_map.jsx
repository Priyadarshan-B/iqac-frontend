
import React, { useState, useEffect, useRef } from "react";
import InputBox from "../../components/InputBox/inputbox";
import Dropdown from "../../components/dropdown/dropdown";
import apiHost from "../../utils/api";
import './co_po_map.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import RemoveCircleTwoToneIcon from '@mui/icons-material/RemoveCircleTwoTone';
function CoPoMap() {
    const [regulation, setRegulation] = useState([]);
    const [regulationId, setRegulationId] = useState(null);

    const [degree, setDegree] = useState([]);
    const [degreeId, setDegreeId] = useState(null);

    const [branch, setBranch] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState(null);

    const [semester, setSemester] = useState([]);
    const [semesterId, setSemesterId] = useState(null);

    const [course, setCourse] = useState([]);
    const [courseId, setCourseId] = useState(null);

    const [co, setCo] = useState([]);
    const [po, setPo] = useState([]);
    const [dropdownSets, setDropdownSets] = useState([{ co: null, po: null, level: "" }]);

    // Refs for resetting dropdowns
    const regulationRef = useRef(null);
    const degreeRef = useRef(null);
    const branchRef = useRef(null);
    const semesterRef = useRef(null);
    const courseRef = useRef(null);

    useEffect(() => {
        fetchRegulations();
        fetchSemesters();
        fetchPoPso();
    }, []);

    const fetchRegulations = () => {
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
    };

    const fetchSemesters = () => {
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

    const handleRegulationChange = (selectedRegulation) => {
        setRegulationId(selectedRegulation);
        fetch(`${apiHost}/api/rf/dropdown/degree?regulation=${selectedRegulation.value}`)
            .then((response) => response.json())
            .then((data) => {
                const options = data.map((item) => ({
                    value: item.id,
                    label: item.degree,
                }));
                setDegree(options);
            })
            .catch((error) => console.error("Error fetching degree dropdown", error));
    };

    const handleDegreeChange = (selectedDegree) => {
        setDegreeId(selectedDegree);
        fetch(`${apiHost}/api/rf/dropdown/branch?degree=${selectedDegree.value}`)
            .then((response) => response.json())
            .then((data) => {
                const options = data.map((item) => ({
                    value: item.id,
                    label: item.branch,
                }));
                setBranch(options);
            })
            .catch((error) => console.error("Error fetching branch dropdown", error));
    };

    const handleBranchChange = (selectedBranch) => {
        setSelectedBranchId(selectedBranch);
    };

    const handleSemesterChange = (selectedSemester) => {
        setSemesterId(selectedSemester);
        const selectedBranch = branch.find((item) => item.value === selectedBranchId.value);
        if (selectedBranch) {
            fetch(`${apiHost}/api/rf/dropdown/course?branch=${selectedBranch.value}&semester=${selectedSemester.value}`)
                .then((response) => response.json())
                .then((data) => {
                    const options = data.map((item) => ({
                        value: item.id,
                        label: item.course,
                    }));
                    setCourse(options);
                })
                .catch((error) => console.error("Error fetching course dropdown", error));
        }
    };

    const handleCourseChange = (selectedCourse) => {
        setCourseId(selectedCourse);
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

    const handleAddDropdown = () => {
        setDropdownSets([...dropdownSets, { co: null, po: null, level: "" }]);
    };

    const handleRemoveDropdown = (index) => {
        const updatedDropdownSets = dropdownSets.filter((_, i) => i !== index);
        setDropdownSets(updatedDropdownSets);
    };

    const handleDropdownChange = (index, field, value) => {
        const updatedDropdownSets = [...dropdownSets];
        updatedDropdownSets[index][field] = value;
        setDropdownSets(updatedDropdownSets);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        // Validate form data
        if (!regulationId || !degreeId || !selectedBranchId || !semesterId || !courseId) {
            toast.error("Please fill in all the fields before submitting.", {
                position: 'bottom-right'
            });
            return;
        }
    
        const dataToSend = dropdownSets.map(({ co, po, level }) => ({
            course_outcome: co ? co.value : "",
            program_outcome: po ? po.value : "",
            mapping_level: level,
        }));
    
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
                return response.json();
            })
            .then((data) => {
                toast.success("Data submitted successfully", {
                    position: 'bottom-right'
                });
    
                // Reset form using refs
                if (regulationRef.current) regulationRef.current.select.clearValue();
                if (degreeRef.current) degreeRef.current.select.clearValue();
                if (branchRef.current) branchRef.current.select.clearValue();
                if (semesterRef.current) semesterRef.current.select.clearValue();
                if (courseRef.current) courseRef.current.select.clearValue();
                setDropdownSets([{ co: null, po: null, level: "" }]);
    
                // Clear state values
                setRegulationId(null);
                setDegreeId(null);
                setSelectedBranchId(null);
                setSemesterId(null);
                setCourseId(null);
                setCo([]);
                setPo([]);
    
                // Reset dropdown options
                setRegulation([]);
                setDegree([]);
                setBranch([]);
                setSemester([]);
                setCourse([]);
    
                // Re-fetch data to refresh dropdown options
                fetchRegulations();
                fetchSemesters();
                fetchPoPso();
            })
            .catch((error) => {
                toast.error("Error submitting data", {
                    position: 'bottom-right'
                });
                console.error("Error sending data to backend:", error);
            });
    };
    

    return (
        <div className="co-po-map">
            <div className="title">
                Course Outcome and Program Outcome Form
                </div>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div className="flex-box">
                    <Dropdown
                        className="select-field"
                        options={regulation}
                        onChange={handleRegulationChange}
                        placeholder="Regulation"
                        ref={regulationRef}
                        value={regulationId}
                    />
                    <Dropdown
                        className="select-field"
                        options={degree}
                        onChange={handleDegreeChange}
                        placeholder="Degree"
                        ref={degreeRef}
                        value={degreeId}
                    />
                    <Dropdown
                        className="select-field"
                        options={branch}
                        onChange={handleBranchChange}
                        placeholder="Branch"
                        ref={branchRef}
                        value={selectedBranchId}
                    />
                    <Dropdown
                        className="select-field"
                        options={semester}
                        onChange={handleSemesterChange}
                        placeholder="Semester"
                        ref={semesterRef}
                        value={semesterId}
                    />
                    <Dropdown
                        className="select-field"
                        options={course}
                        onChange={handleCourseChange}
                        placeholder="Course"
                        ref={courseRef}
                        value={courseId}
                    />
                    {/* <button type="button" className="add" onClick={handleAddDropdown}>
                        Add Dropdown
                    </button> */}
                    <AddCircleTwoToneIcon style={{
                        cursor:'pointer',
                        color:'black'
                    }} onClick={handleAddDropdown}/>
                </div>
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
                        </div>
                    ))}
                </div>
                <button type="submit" className="button-sub">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default CoPoMap;
