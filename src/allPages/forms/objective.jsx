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
    const [course, setCourse] = useState([]);
    const [courseId, setCourseId] = useState(null);
    const [objective, setObjective] = useState("");
    const [description, setDescription] = useState("");

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
        // You can fetch courses based on selected branch here if needed
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
                toast.success("data submitted successfully", {
                    position: 'bottom-right'
                });
                console.log("Data submitted successfully");
            } else {
                toast.error("Failed to submit data", {
                    position: 'bottom-right'
                });
                console.error("Failed to submit data");
            }
        } catch (error) {
            toast.error("Error submitting data", {
                position: 'bottom-right'
            });
            console.error("Error submitting data:", error);
        }
    };

    return (
        <div className="objective-form">
             <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div className="flex-box">
                <Dropdown
                    className="select-field"
                    options={regulation}
                    onChange={handleRegulationChange}
                    placeholder="Regulation"
                />
                <Dropdown
                    className="select-field"
                    options={degree}
                    onChange={handleDegreeChange}
                    placeholder="Degree"
                />
                <Dropdown
                    className="select-field"
                    options={branch}
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
