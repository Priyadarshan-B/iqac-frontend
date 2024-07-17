import React, { useEffect, useState } from "react";
import apiHost from "../../utils/api";
import InputBox from "../../components/InputBox/inputbox";
import Dropdown from "../../components/dropdown/dropdown";
import './unit.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UnitForm() {
    const [regulation, setRegulation] = useState([]);
    const [regulationId, setRegulationId] = useState(null);
    const [degree, setDegree] = useState([]);
    const [degreeId, setDegreeId] = useState(null);
    const [branch, setBranch] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [semester, setSemester] = useState([]);
    const [course, setCourse] = useState([]);
    const [courseId, setCourseId] = useState(null);
    const [unit, setUnit] = useState("");
    const [unitname, setUnitname] = useState("");
    const [description, setDescription] = useState("");
    const [hours, setHours] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = {
                course: courseId,
                unit: unit,
                unit_name: unitname,
                description: description,
                hours: hours,
            };

            console.log("Data to be sent:", dataToSend);

            const response = await fetch(`${apiHost}/api/rf/course-unit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                toast.success("Data submitted successfully", {
                    position: 'bottom-right'
                });
                console.log("Unit submitted successfully");

                // Reset the form fields and dropdown selections
                setRegulationId(null);
                setDegreeId(null);
                setSelectedBranchId(null);
                setCourseId(null);
                setUnit("");
                setUnitname("");
                setDescription("");
                setHours("");

                // Re-fetch the dropdown options
                fetchRegulations();
                fetchSemesters();
            } else {
                toast.error("Failed to submit unit", {
                    position: 'bottom-right'
                });
                console.error("Failed to submit data");
            }
        } catch (error) {
            toast.error("Error submitting unit", {
                position: 'bottom-right'
            });
            console.error("Error submitting data:", error);
        }
    };

    return (
        <div className="unit-form">
            <div className="title">Unit Form</div>
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
                    <InputBox
                        className="input-box"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        placeholder="Unit"
                        type="text"
                    />
                    <InputBox
                        className="input-box"
                        value={unitname}
                        onChange={(e) => setUnitname(e.target.value)}
                        placeholder="Unit Name"
                        type="text"
                    />
                    <InputBox
                        className="input-box"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Unit Description"
                        type="text"
                    />
                    <InputBox
                        className="input-box"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder="Hours"
                        type="number"
                        min="0"
                    />
                    <button type="submit" className="button-sub">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default UnitForm;
