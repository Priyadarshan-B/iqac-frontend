import React, { useState, useEffect } from "react";
import Dropdown from "../../components/dropdown/dropdown";
import InputBox from "../../components/InputBox/inputbox";
import apiHost from "../../utils/api";
import './objective.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ObjectiveForm() {
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
    const [objective, setObjective] = useState("");
    const [description, setDescription] = useState("");
    const [key, setKey] = useState(0);  // Add a key state to force re-render

    const fetchDropdownData = () => {
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
    };

    useEffect(() => {
        fetchDropdownData();
    }, [key]);  // Add key as a dependency

    const handleRegulationChange = (selectedRegulation) => {
        setRegulationId(selectedRegulation.value);
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
                setDegreeId(null);
                setBranch([]);
                setSelectedBranchId(null);
                setCourse([]);
                setCourseId(null);
                setSemesterId(null);
            })
            .catch((error) =>
                console.error("Error fetching degree dropdown", error)
            );
    };

    const handleDegreeChange = (selectedDegree) => {
        setDegreeId(selectedDegree.value);
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
                setSelectedBranchId(null);
                setCourse([]);
                setCourseId(null);
                setSemesterId(null);
            })
            .catch((error) =>
                console.error("Error fetching branch dropdown", error)
            );
    };

    const handleBranchChange = (selectedBranch) => {
        setSelectedBranchId(selectedBranch.value);
        setCourse([]);
        setCourseId(null);
        setSemesterId(null);
    };

    const handleSemesterChange = (selectedSemester) => {
        setSemesterId(selectedSemester.value);
        if (selectedBranchId) {
            fetch(
                `${apiHost}/api/rf/dropdown/course?branch=${selectedBranchId}&semester=${selectedSemester.value}`
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = {
                course: courseId,
                co_obj_id: objective,
                description: description,
            };

            console.log("Data to be sent:", dataToSend);

            const response = await fetch(`${apiHost}/api/rf/course-objective`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                toast.success("Objective submitted successfully", {
                    position: 'bottom-right'
                });
                console.log("Data submitted successfully");
                // Reset the form fields and dropdown selections
                setRegulationId(null);
                setDegree([]);
                setDegreeId(null);
                setBranch([]);
                setSelectedBranchId(null);
                setSemester([]);
                setSemesterId(null);
                setCourse([]);
                setCourseId(null);
                setObjective("");
                setDescription("");

                // Refetch the dropdown data and force re-render
                setKey(prevKey => prevKey + 1);
            } else {
                toast.error("Failed to submit objective", {
                    position: 'bottom-right'
                });
                console.error("Failed to submit data");
            }
        } catch (error) {
            toast.error("Error submitting objective", {
                position: 'bottom-right'
            });
            console.error("Error submitting data:", error);
        }
    };

    return (
        <div className="objective-form">
            <div className="title">Objective Form</div>
            <ToastContainer />
            <form key={key} onSubmit={handleSubmit}>
                <div className="flex-box">
                    <Dropdown
                        className="select-field"
                        options={regulation}
                        value={regulation.find(option => option.value === regulationId)}
                        onChange={handleRegulationChange}
                        placeholder="Regulation"
                    />
                    <Dropdown
                        className="select-field"
                        options={degree}
                        value={degree.find(option => option.value === degreeId)}
                        onChange={handleDegreeChange}
                        placeholder="Degree"
                    />
                    <Dropdown
                        className="select-field"
                        options={branch}
                        value={branch.find(option => option.value === selectedBranchId)}
                        onChange={handleBranchChange}
                        placeholder="Branch"
                    />
                    <Dropdown
                        className="select-field"
                        options={semester}
                        value={semester.find(option => option.value === semesterId)}
                        onChange={handleSemesterChange}
                        placeholder="Semester"
                    />
                    <Dropdown
                        className="select-field"
                        options={course}
                        value={course.find(option => option.value === courseId)}
                        onChange={(selectedCourse) =>
                            setCourseId(selectedCourse.value)
                        }
                        placeholder="Course"
                    />
                    <InputBox
                        className="input-box"
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        placeholder="Course Objective"
                        type="text"
                    />
                    <InputBox
                        className="input-box"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        type="text"
                    />
                    <button type="submit" className="button-sub">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default ObjectiveForm;
