import React, { useState, useEffect, useRef } from "react";
import InputBox from "../../components/InputBox/inputbox";
import Dropdown from "../../components/dropdown/dropdown";
import apiHost from "../../utils/api";
import './co_po_map.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

        fetch(`${apiHost}/api/rf/po-pso`)
            .then((response) => response.json())
            .then((data) => {
                const options = data.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));
                setPo(options);
            })
            .catch((error) =>
                console.error("Error fetching po dropdown:", error)
            );
    }, []);

    const handleRegulationChange = (selectedRegulation) => {
        setRegulationId(selectedRegulation);
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
        setDegreeId(selectedDegree);
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
            .catch((error) =>
                console.error("Error fetching outcome dropdown", error)
            );
    };

    const handleBranchChange = (selectedBranch) => {
        setSelectedBranchId(selectedBranch);
    };

    const handleSemesterChange = (selectedSemester) => {
        const selectedBranch = branch.find(
            (item) => item.value === selectedBranchId.value
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
        // Prepare data to send to backend
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
            .then((response) => response.json())
            .then((data) => {
                // Handle response if needed
                console.log("Data submitted successfully", data);
                toast.success("Data submitted successfully!");

                // Reset form using refs
                if (regulationRef.current) regulationRef.current.select.clearValue();
                if (degreeRef.current) degreeRef.current.select.clearValue();
                if (branchRef.current) branchRef.current.select.clearValue();
                if (semesterRef.current) semesterRef.current.select.clearValue();
                if (courseRef.current) courseRef.current.select.clearValue();
                // setRegulation(null)
                // setRegulationId(null)
                setDropdownSets([{ co: null, po: null, level: "" }]);
            })
            .catch((error) => {
                console.error("Error sending data to backend:", error);
                toast.error("Error submitting data");
            });
    };

    return (
        <div className="co-po-map">
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
                    <button type="button" onClick={handleAddDropdown}>
                        Add Dropdown
                    </button>
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
                                    onChange={(e) =>
                                        handleDropdownChange(index, "co", e)
                                    }
                                />
                                <Dropdown
                                    className="select-field"
                                    options={po}
                                    placeholder="PO"
                                    value={set.po}
                                    onChange={(e) =>
                                        handleDropdownChange(index, "po", e)
                                    }
                                />
                                <InputBox
                                    className="input-field"
                                    placeholder="Mapping Level"
                                    value={set.level}
                                    onChange={(e) =>
                                        handleDropdownChange(index, "level", e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveDropdown(index)}
                                >
                                    Remove
                                </button>
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
