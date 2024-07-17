import React, { useState, useEffect } from "react";
import apiHost from "../../utils/api";
import Dropdown from "../../components/dropdown/dropdown";
import Button from "../../components/Button/button";
import InputBox from "../../components/InputBox/inputbox";
import '../dashboard/Dashboard.css'
import '../MarkEntry/SubjectAllocation/facultymap.css'
import './course.css';
import  '../forms/degree.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CourseForm() {
    const [regulation, setRegulation] = useState([]);
    const [degree, setDegree] = useState([]);
    const [branch, setBranch] = useState([]);
    const [semester, setSemester] = useState([]);
    const [courseCategory, setCourseCategory] = useState([]);

    const [regulationId, setRegulationId] = useState(null);
    const [degreeId, setDegreeId] = useState(null);
    const [branchId, setBranchId] = useState(null);
    const [semesterId, setSemesterId] = useState(null);

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [lecture, setLecture] = useState("");
    const [tutorial, setTutorial] = useState("");
    const [practical, setPractical] = useState("");
    const [credit, setCredit] = useState("");
    const [hours, setHours] = useState("");
    const [ca, setCa] = useState("");
    const [es, setEs] = useState("");
    const [total, setTotal] = useState("");
    const [category, setCategory] = useState("");

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

        fetch(`${apiHost}/api/rf/dropdown/course-category`)
            .then((response) => response.json())
            .then((data) => {
                const options = data.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));
                setCourseCategory(options);
            })
            .catch((error) =>
                console.error("Error fetching course category dropdown:", error)
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

    useEffect(() => {
        if (ca && es) {
            setTotal(parseInt(ca) + parseInt(es));
        }
    }, [ca, es]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = {
                // regulation: regulationId,
                // degree: degreeId,
                semester: semesterId,
                branch: branchId,
                code: code,
                name: name,
                lecture_hours: parseInt(lecture),
                tutorial_hours: parseInt(tutorial),
                practical_hours: parseInt(practical),
                credit: parseInt(credit),
                hours_per_week: parseInt(hours),
                ca: parseInt(ca),
                es: parseInt(es),
                total: parseInt(total),
                category: category,
            };

            console.log("Data to be sent:", dataToSend);

            const response = await fetch(`${apiHost}/api/rf/course`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                toast.success("Course submitted successfully", {
                    position: 'bottom-right'
                });
                console.log("Data submitted successfully");
            } else {
                toast.error("Failed to submit course", {
                    position: 'bottom-right'
                });
                console.error("Failed to submit Course");
            }
        } catch (error) {
            toast.error("Error submitting course", {
                position: 'bottom-right'
            });
            console.error("Error submitting data:", error);
        }
    };

    return (
        <div className="course-form-container">
             <div className="title">Course Form</div>
             <ToastContainer />
            <form onSubmit={handleSubmit} className="course-form">
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
                        onChange={(selectedBranch) =>
                            setBranchId(selectedBranch.value)
                        }
                        placeholder="Branch"
                    />
                    <Dropdown
                        className="select-field"
                        options={semester}
                        onChange={(selectedSemester) => setSemesterId(selectedSemester.value)}
                        placeholder="Semester"
                    />
                    <InputBox
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Subject Code"
                        type="text"

                    />
                    <InputBox
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Subject Name"
                        type="text"

                    />
                    <InputBox
                        value={lecture}
                        onChange={(e) => setLecture(e.target.value)}
                        placeholder="Lecture Hours"
                        type="number"
                        min="0"
                    />
                    <InputBox
                        value={tutorial}
                        onChange={(e) => setTutorial(e.target.value)}
                        placeholder="Tutorial Hours"
                        type="number"
                        min="0"
                    />
                    <InputBox
                        value={practical}
                        onChange={(e) => setPractical(e.target.value)}
                        placeholder="Practical Hours"
                        type="number"
                        min="0"
                    />
                    <InputBox
                        value={credit}
                        onChange={(e) => setCredit(e.target.value)}
                        placeholder="Credit"
                        type="number"
                        min="0"
                    />
                    <InputBox
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder="Hours per Week"
                        type="number"
                        min="0"
                    />
                    <InputBox
                        value={ca}
                        onChange={(e) => setCa(e.target.value)}
                        placeholder="CA"
                        type="number"
                        min="0"
                    />
                    <InputBox
                        value={es}
                        onChange={(e) => setEs(e.target.value)}
                        placeholder="ES"
                        type="number"
                        min="0"
                    />
                    <InputBox
                        value={total}
                        onChange={(e) => setTotal(e.target.value)}
                        placeholder="Total"
                        type="number"
                        min="0"
                        readOnly /* Make the total input read-only */
                    />
                    <Dropdown
                        className="select-field"
                        options={courseCategory}
                        onChange={(selectedCategory) =>
                            setCategory(selectedCategory.value)
                        }
                        placeholder="Category"
                    />
              
                <button type="submit" className="button-sub">Submit</button>
            </div>
            </form>
        </div>
    );
}

export default CourseForm;
