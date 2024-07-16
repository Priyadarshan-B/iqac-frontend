import React, { useState, useEffect, useRef } from "react";
import InputBox from "../../components/InputBox/inputbox";
import Dropdown from "../../components/dropdown/dropdown";
import apiHost from "../../utils/api";
import './co_po_map.css';

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
    const [levelValue, setLevelValue] = useState("");

    const [additionalDropdowns, setAdditionalDropdowns] = useState([]);

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

    const handleCourseChange = (selectedCourse) => {
        setCourseId(selectedCourse.value);
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

    const coRefs = useRef([]);
    const poRefs = useRef([]);
    const levelRefs = useRef("");

    const handleAddDropdown = () => {
        const newCoRefs = [...coRefs.current];
        const newPoRefs = [...poRefs.current];
        const newLevelRefs = [...levelRefs.current];
    
        newCoRefs.push(React.createRef());
        newPoRefs.push(React.createRef());
        newLevelRefs.push(React.createRef());
    
        setAdditionalDropdowns([
            ...additionalDropdowns,
            <div key={additionalDropdowns.length} className="dropdown-set">
                <Dropdown
                    className="select-field"
                    options={co}
                    placeholder="CO"
                    ref={newCoRefs[newCoRefs.length - 1]}
                />
                <Dropdown
                    className="select-field"
                    options={po}
                    placeholder="PO"
                    ref={newPoRefs[newPoRefs.length - 1]}
                />
                <InputBox
                    className="input-field"
                    placeholder="Mapping Level"
                    value={levelValue}
                    onChange={(e) => setLevelValue(e.target.value)}
                    ref={newLevelRefs[newLevelRefs.length - 1]}
                />
            </div>,
        ]);
    
        coRefs.current = newCoRefs;
        poRefs.current = newPoRefs;
        levelRefs.current = newLevelRefs;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Prepare data to send to backend
        const dataToSend = additionalDropdowns.map((dropdownSet, index) => {
            const coValue = coRefs.current[index].value;
            const poValue = poRefs.current[index].value;
            const levelValue = levelRefs.current[index].value;
            return {
                course_outcome: coValue,
                program_outcome: poValue,
                mapping_level: levelValue,
            };
        });

        console.log(dataToSend);

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
            })
            .catch((error) => {
                console.error("Error sending data to backend:", error);
            });
    };

    return (
        <div className="co-po-map">
            <form onSubmit={handleSubmit}>
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
                    onChange={handleCourseChange}
                    placeholder="Course"
                />
                <button type="button" onClick={handleAddDropdown}>
                    Add Dropdown
                </button>
                <div className="additional-dropdowns">
                    {additionalDropdowns}
                </div>
                <button type="submit" className="button">Submit</button>
            </form>
        </div>
    );
}

export default CoPoMap;
