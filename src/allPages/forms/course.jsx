import React, { useState, useEffect } from "react";
import apiHost from "../../utils/api";
import Dropdown from "../../components/dropdown/dropdown";
import Button from "../../components/Button/button";
import InputBox from "../../components/InputBox/inputbox";
import '../dashboard/Dashboard.css';
import '../MarkEntry/SubjectAllocation/facultymap.css';
import './course.css';
import  '../forms/degree.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import RemoveCircleTwoToneIcon from '@mui/icons-material/RemoveCircleTwoTone';

function CourseForm() {
    const [regulation, setRegulation] = useState([]);
    const [degree, setDegree] = useState([]);
    const [branch, setBranch] = useState([]);
    const [semester, setSemester] = useState([]);
    const [courseCategory, setCourseCategory] = useState([]);

    const [regulationId, setRegulationId] = useState(null);
    const [degreeId, setDegreeId] = useState(null);
    const [branchId, setBranchId] = useState(null);

    const [courseRows, setCourseRows] = useState([{
        semester: "",
        code: "",
        name: "",
        lecture: "",
        tutorial: "",
        practical: "",
        credit: "",
        hours: "",
        ca: "",
        es: "",
        total: "",
        category: ""
    }]);

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

    const fetchCourseCategories = () => {
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
    };

    useEffect(() => {
        fetchRegulations();
        fetchSemesters();
        fetchCourseCategories();
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
        const updatedRows = courseRows.map((row) => ({
            ...row,
            total: row.ca && row.es ? parseInt(row.ca) + parseInt(row.es) : ""
        }));
        setCourseRows(updatedRows);
    }, [courseRows.map(row => row.ca), courseRows.map(row => row.es)]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = courseRows.map(row => ({
                semester: row.semester,
                branch: branchId,
                code: row.code,
                name: row.name,
                lecture_hours: parseInt(row.lecture),
                tutorial_hours: parseInt(row.tutorial),
                practical_hours: parseInt(row.practical),
                credit: parseInt(row.credit),
                hours_per_week: parseInt(row.hours),
                ca: parseInt(row.ca),
                es: parseInt(row.es),
                total: parseInt(row.total),
                category: row.category,
            }));

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

                // Reset the form fields and dropdown selections
                setRegulationId(null);
                setDegreeId(null);
                setBranchId(null);
                setCourseRows([{
                    semester: "",
                    code: "",
                    name: "",
                    lecture: "",
                    tutorial: "",
                    practical: "",
                    credit: "",
                    hours: "",
                    ca: "",
                    es: "",
                    total: "",
                    category: ""
                }]);

                // Re-fetch the dropdown options
                fetchRegulations();
                fetchSemesters();
                fetchCourseCategories();
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

    const handleAddRow = () => {
        setCourseRows([...courseRows, {
            semester: "",
            code: "",
            name: "",
            lecture: "",
            tutorial: "",
            practical: "",
            credit: "",
            hours: "",
            ca: "",
            es: "",
            total: "",
            category: ""
        }]);
    };

    const handleRemoveRow = (index) => {
        const updatedRows = courseRows.filter((_, i) => i !== index);
        setCourseRows(updatedRows);
    };

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...courseRows];
        updatedRows[index][field] = value;
        setCourseRows(updatedRows);
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
                        value={branch.find(option => option.value === branchId) || null}
                        onChange={(selectedBranch) => setBranchId(selectedBranch.value)}
                        placeholder="Branch"
                    />
                </div>

                {regulationId && degreeId && branchId && (
                    <table className="course-form-table">
                        <thead>
                            <tr>
                                <th>Semester</th>
                                <th>Course Code</th>
                                <th>Course</th>
                                <th>L</th>
                                <th>T</th>
                                <th>P</th>
                                <th>C</th>
                                <th>Hours/Week</th>
                                <th>CA</th>
                                <th>ES</th>
                                <th>Total</th>
                                <th>Category</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseRows.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <Dropdown
                                            className="select-field"
                                            options={semester}
                                            value={semester.find(option => option.value === row.semester) || null}
                                            onChange={(selectedSemester) => handleInputChange(index, 'semester', selectedSemester.value)}
                                            placeholder="Semester"
                                        />
                                    </td>
                                    <td>
                                        <InputBox
                                            value={row.code}
                                            onChange={(e) => handleInputChange(index, 'code', e.target.value)}
                                            placeholder="Code Id"
                                            type="text"
                                        />
                                    </td>
                                    <td>
                                        <InputBox
                                            value={row.name}
                                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                            placeholder="Course"
                                            type="text"
                                        />
                                    </td>
                                    <td>
                                        <InputBox
                                            value={row.lecture}
                                            onChange={(e) => handleInputChange(index, 'lecture', e.target.value)}
                                            placeholder="L"
                                            type="number"
                                            min="0"
                                        />
                                    </td>
                                    <td>
                                        <InputBox
                                            value={row.tutorial}
                                            onChange={(e) => handleInputChange(index, 'tutorial', e.target.value)}
                                            placeholder="T"
                                            type="number"
                                            min="0"
                                        />
                                    </td>
                                    <td>
                                        <InputBox
                                            value={row.practical}
                                            onChange={(e) => handleInputChange(index, 'practical', e.target.value)}
                                            placeholder="P"
                                            type="number"
                                            min="0"
                                        />
                                    </td>
                                    <td>
                                        <InputBox
                                            value={row.credit}
                                            onChange={(e) => handleInputChange(index, 'credit', e.target.value)}
                                            placeholder="C"
                                            type="number"
                                            min="0"
                                        />
                                    </td>
                                    <td>
                                        <InputBox
                                            value={row.hours}
                                            onChange={(e) => handleInputChange(index, 'hours', e.target.value)}
                                            placeholder="Hours/Week"
                                            type="number"
                                            min="0"
                                        />
                                    </td>
                                    <td>
                                        <InputBox
                                            value={row.ca}
                                            onChange={(e) => handleInputChange(index, 'ca', e.target.value)}
                                            placeholder="CA"
                                            type="number"
                                            min="0"
                                        />
                                    </td>
                                    <td>
                                        <InputBox
                                            value={row.es}
                                            onChange={(e) => handleInputChange(index, 'es', e.target.value)}
                                            placeholder="ES"
                                            type="number"
                                            min="0"
                                        />
                                    </td>
                                    <td>
                                        <InputBox
                                            value={row.total}
                                            placeholder="Total"
                                            type="number"
                                            min="0"
                                            readOnly
                                        />
                                    </td>
                                    <td>
                                        <Dropdown
                                            className="select-field"
                                            options={courseCategory}
                                            value={courseCategory.find(option => option.value === row.category) || null}
                                            onChange={(selectedCategory) => handleInputChange(index, 'category', selectedCategory.value)}
                                            placeholder="Category"
                                        />
                                    </td>
                                    <td>
                                        <RemoveCircleTwoToneIcon 
                                            style={{ cursor: 'pointer', color: 'black' }} 
                                            onClick={() => handleRemoveRow(index)} 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        
                    </table>
                )}
                 <AddCircleTwoToneIcon style={{
                        cursor:'pointer',
                        color:'black'
                    }} onClick={handleAddRow}/>
                
                <div className="form-buttons">
                    
                   <button type="submit" className="button-sub">Submit</button>
                </div>
           

                
            </form>
        </div>
    );
}

export default CourseForm;
