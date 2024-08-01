import React, { useState, useEffect } from "react";
import Dropdown from "../../components/dropdown/dropdown";
import InputBox from "../../components/InputBox/inputbox";
import apiHost from "../../utils/api";
import './outcome.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";

function OutcomeForm() {
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
    const [outcomes, setOutcomes] = useState([{ co: "", description: "" }]);

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
            .catch((error) =>
                console.error("Error fetching regulation dropdown:", error)
            );
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
            .catch((error) =>
                console.error("Error fetching semester dropdown:", error)
            );
    };

    useEffect(() => {
        fetchRegulations();
        fetchSemesters();
    }, []);

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
            })
            .catch((error) =>
                console.error("Error fetching branch dropdown", error)
            );
    };

    const handleBranchChange = (selectedBranch) => {
        setSelectedBranchId(selectedBranch.value);
    };

    const handleSemesterChange = (selectedSemester) => {
        setSemesterId(selectedSemester.value);
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

    const handleOutcomeChange = (index, field, value) => {
        const newOutcomes = [...outcomes];
        newOutcomes[index][field] = value;
        setOutcomes(newOutcomes);
    };

    const handleAddOutcome = () => {
        setOutcomes([...outcomes, { co: "", description: "" }]);
    };

    const handleRemoveOutcome = (index) => {
        const newOutcomes = outcomes.filter((_, i) => i !== index);
        setOutcomes(newOutcomes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all fields are filled
        if (!regulationId || !degreeId || !selectedBranchId || !semesterId || !courseId || outcomes.some(outcome => !outcome.co || !outcome.description)) {
            toast.error("Please fill all the fields", {
                position: 'bottom-right'
            });
            return;
        }

        try {
            const dataToSend = outcomes.map(outcome => ({
                course: courseId,
                co_id: outcome.co,
                description: outcome.description,
            }));

            console.log("Data to be sent:", dataToSend);

            const response = await fetch(`${apiHost}/api/rf/course-outcome`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                toast.success("Outcome submitted successfully", {
                    position: 'bottom-right'
                });
                console.log("Data submitted successfully");

                // Reset the form fields and dropdown selections
                setRegulationId(null);
                setDegreeId(null);
                setSelectedBranchId(null);
                setSemesterId(null);
                setCourseId(null);
                setOutcomes([{ co: "", description: "" }]);

                // Re-fetch the dropdown options
                fetchRegulations();
                fetchSemesters();
            } else {
                toast.error("Failed to submit outcome", {
                    position: 'bottom-right'
                });
                console.error("Failed to submit data");
            }
        } catch (error) {
            toast.error("Error submitting outcome", {
                position: 'bottom-right'
            });
            console.error("Error submitting data:", error);
        }
    };

    return (
        <div className="outcome-form">
            <div className="title">Outcome Form</div>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div className="flex-box">
                    <Dropdown
                        className="select-field"
                        options={regulation}
                        value={regulation.find(option => option.value === regulationId) || null}
                        onChange={handleRegulationChange}
                        placeholder="Regulation"
                    />
                    <Dropdown
                        className="select-field"
                        options={degree}
                        value={degree.find(option => option.value === degreeId) || null}
                        onChange={handleDegreeChange}
                        placeholder="Degree"
                    />
                    <Dropdown
                        className="select-field"
                        options={branch}
                        value={branch.find(option => option.value === selectedBranchId) || null}
                        onChange={handleBranchChange}
                        placeholder="Branch"
                    />
                    <Dropdown
                        className="select-field"
                        options={semester}
                        value={semester.find(option => option.value === semesterId) || null}
                        onChange={handleSemesterChange}
                        placeholder="Semester"
                    />
                    <Dropdown
                        className="select-field"
                        options={course}
                        value={course.find(option => option.value === courseId) || null}
                        onChange={(selectedCourse) => setCourseId(selectedCourse.value)}
                        placeholder="Course"
                    />
                    {outcomes.map((outcome, index) => (
                        <div key={index} className="flex-box">
                            <InputBox
                                className="input-box"
                                value={outcome.co}
                                onChange={(e) => handleOutcomeChange(index, 'co', e.target.value)}
                                placeholder="CO Id"
                                type="text"
                            />
                            <InputBox
                                className="input-box"
                                value={outcome.description}
                                onChange={(e) => handleOutcomeChange(index, 'description', e.target.value)}
                                placeholder="Description"
                                type="text"
                            />
                            {outcomes.length > 1 && (
                                <div className="align">
                                    <button className="button-drop"
                                        onClick={() => handleRemoveOutcome(index)}>
                                        Drop
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="align">
                        <button className="button-Add"
                            onClick={handleAddOutcome}>
                            Add
                        </button>
                    </div>
                    <button type="submit" className="button-sub">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default OutcomeForm;
