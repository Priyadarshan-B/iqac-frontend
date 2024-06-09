import React, { useState, useEffect } from 'react';
import './report.css';
import Dropdown from '../../../components/dropdown/dropdown';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import axios from "axios";
import apiHost from "../../../utils/api";

function Report() {
    const [selectedRegulation, setSelectedRegulation] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedTestType, setSelectedTestType] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [RegulationOptions, setRegulationOptions] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [yearOptions, setYearOptions] = useState([]);
    const [testtypeOptions, setTestTypeOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get(`${apiHost}/regulation`)
            .then(response => {
                const options = response.data.map(item => ({
                    value: item.id,
                    label: item.regulation,
                }));
                setRegulationOptions(options);
            })
            .catch(error => console.error("Error fetching regulation data:", error));

        axios.get(`${apiHost}/year`)
            .then(response => {
                const options = response.data.map(item => ({
                    value: item.id,
                    label: item.year,
                }));
                setYearOptions(options);
            })
            .catch(error => console.error("Error fetching year data:", error));

        axios.get(`${apiHost}/semester`)
            .then(response => {
                const options = response.data.map(item => ({
                    value: item.id,
                    label: item.semester,
                }));
                setSemesterOptions(options);
            })
            .catch(error => console.error("Error fetching semester data:", error));

        axios.get(`${apiHost}/testtype`)
            .then(response => {
                const options = response.data.map(item => ({
                    value: item.id,
                    label: item.type,
                }));
                setTestTypeOptions(options);
            })
            .catch(error => console.error("Error fetching test type data:", error));
    }, []);

    const generateReport = () => {
        const dummySubjects = [
            { id: 1, department: "CT", courseCode: "CT101", courseName: "MATHS", totalStudents: 100, presentStudents: 90, absentStudents: 10, failedStudents: 5, passPercentage: "94.44" },
            { id: 1, department: "CT", courseCode: "CT102", courseName: "DCE", totalStudents: 95, presentStudents: 85, absentStudents: 10, failedStudents: 6, passPercentage: "92.94" },
            { id: 1, department: "CT", courseCode: "CT103", courseName: "CHEM", totalStudents: 105, presentStudents: 100, absentStudents: 5, failedStudents: 7, passPercentage: "93.00" },
            { id: 1, department: "CT", courseCode: "CT104", courseName: "PHY", totalStudents: 90, presentStudents: 85, absentStudents: 5, failedStudents: 4, passPercentage: "95.29" },
            { id: 1, department: "CT", courseCode: "CT105", courseName: "ENG", totalStudents: 110, presentStudents: 100, absentStudents: 10, failedStudents: 8, passPercentage: "92.00" },
            { id: 1, department: "CT", courseCode: "CT106", courseName: "CPS", totalStudents: 120, presentStudents: 115, absentStudents: 5, failedStudents: 9, passPercentage: "92.17" },

            { id: 2, department: "CSE", courseCode: "CSE101", courseName: "MATHS", totalStudents: 100, presentStudents: 90, absentStudents: 10, failedStudents: 5, passPercentage: "94.44" },
            { id: 2, department: "CSE", courseCode: "CSE102", courseName: "DCE", totalStudents: 98, presentStudents: 88, absentStudents: 10, failedStudents: 4, passPercentage: "95.45" },
            { id: 2, department: "CSE", courseCode: "CSE103", courseName: "CHEM", totalStudents: 105, presentStudents: 99, absentStudents: 6, failedStudents: 5, passPercentage: "94.95" },
            { id: 2, department: "CSE", courseCode: "CSE104", courseName: "PHY", totalStudents: 97, presentStudents: 91, absentStudents: 6, failedStudents: 3, passPercentage: "96.70" },
            { id: 2, department: "CSE", courseCode: "CSE105", courseName: "ENG", totalStudents: 103, presentStudents: 95, absentStudents: 8, failedStudents: 6, passPercentage: "94.74" },
            { id: 2, department: "CSE", courseCode: "CSE106", courseName: "CPS", totalStudents: 108, presentStudents: 100, absentStudents: 8, failedStudents: 7, passPercentage: "93.00" },

            { id: 3, department: "IT", courseCode: "IT101", courseName: "MATHS", totalStudents: 90, presentStudents: 85, absentStudents: 5, failedStudents: 4, passPercentage: "95.29" },
            { id: 3, department: "IT", courseCode: "IT102", courseName: "DCE", totalStudents: 93, presentStudents: 88, absentStudents: 5, failedStudents: 3, passPercentage: "96.59" },
            { id: 3, department: "IT", courseCode: "IT103", courseName: "CHEM", totalStudents: 87, presentStudents: 83, absentStudents: 4, failedStudents: 2, passPercentage: "97.59" },
            { id: 3, department: "IT", courseCode: "IT104", courseName: "PHY", totalStudents: 92, presentStudents: 88, absentStudents: 4, failedStudents: 5, passPercentage: "94.32" },
            { id: 3, department: "IT", courseCode: "IT105", courseName: "ENG", totalStudents: 89, presentStudents: 83, absentStudents: 6, failedStudents: 3, passPercentage: "96.39" },
            { id: 3, department: "IT", courseCode: "IT106", courseName: "CPS", totalStudents: 91, presentStudents: 86, absentStudents: 5, failedStudents: 4, passPercentage: "95.35" },

            { id: 4, department: "BT", courseCode: "BT101", courseName: "MATHS", totalStudents: 80, presentStudents: 75, absentStudents: 5, failedStudents: 3, passPercentage: "96.00" },
            { id: 4, department: "BT", courseCode: "BT102", courseName: "DCE", totalStudents: 82, presentStudents: 77, absentStudents: 5, failedStudents: 4, passPercentage: "94.81" },
            { id: 4, department: "BT", courseCode: "BT103", courseName: "CHEM", totalStudents: 85, presentStudents: 81, absentStudents: 4, failedStudents: 2, passPercentage: "97.53" },
            { id: 4, department: "BT", courseCode: "BT104", courseName: "PHY", totalStudents: 79, presentStudents: 75, absentStudents: 4, failedStudents: 3, passPercentage: "96.00" },
            { id: 4, department: "BT", courseCode: "BT105", courseName: "ENG", totalStudents: 84, presentStudents: 79, absentStudents: 5, failedStudents: 2, passPercentage: "97.47" },
            { id: 4, department: "BT", courseCode: "BT106", courseName: "CPS", totalStudents: 88, presentStudents: 84, absentStudents: 4, failedStudents: 3, passPercentage: "96.43" },
        ];

        setReportData(dummySubjects);
    };

    const groupedData = reportData.reduce((acc, cur) => {
        if (!acc[cur.department]) {
            acc[cur.department] = [];
        }
        acc[cur.department].push(cur);
        return acc;
    }, {});

    const downloadTableAsExcel = () => {
        const tableData = [];
        tableData.push(["Department", "Course Code", "Course Name", "Total Students", "Present Students", "Absent Students", "Failed Students", "Pass Percentage"]);
        Object.keys(groupedData).forEach(department => {
            groupedData[department].forEach((data, index) => {
                if (index === 0) {
                    tableData.push([department, data.courseCode, data.courseName, data.totalStudents, data.presentStudents, data.absentStudents, data.failedStudents, data.passPercentage]);
                } else {
                    tableData.push(["", data.courseCode, data.courseName, data.totalStudents, data.presentStudents, data.absentStudents, data.failedStudents, data.passPercentage]);
                }
            });
        });

        const ws = XLSX.utils.aoa_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        const year = selectedYear ? selectedYear.label : "Year";
        const semester = selectedSemester ? selectedSemester.label : "Semester";
        const testType = selectedTestType ? selectedTestType.label : "TestType";
        const fileName = `${semester}-Semester-${testType}.xlsx`;

        XLSX.writeFile(wb, fileName);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = reportData.filter(item =>
        item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.totalStudents.toString().includes(searchTerm) ||
        item.presentStudents.toString().includes(searchTerm) ||
        item.absentStudents.toString().includes(searchTerm) ||
        item.failedStudents.toString().includes(searchTerm) ||
        item.passPercentage.toString().includes(searchTerm)
    );

    const groupedFilteredData = filteredData.reduce((acc, cur) => {
        if (!acc[cur.department]) {
            acc[cur.department] = [];
        }
        acc[cur.department].push(cur);
        return acc;
    }, {});

    return (
        <div className="container">
            <div className="dropdown-container">
                <div className="dropdowns">
                    <Dropdown
                        options={RegulationOptions}
                        placeholder="Regulation"
                        value={selectedRegulation}
                        onChange={setSelectedRegulation}
                    />
                    <Dropdown
                        options={yearOptions}
                        placeholder="Year"
                        value={selectedYear}
                        onChange={setSelectedYear}
                    />
                    <Dropdown
                        options={semesterOptions}
                        placeholder="Semester"
                        value={selectedSemester}
                        onChange={setSelectedSemester}
                    />
                    <Dropdown
                        options={testtypeOptions}
                        placeholder="Test Type"
                        value={selectedTestType}
                        onChange={setSelectedTestType}
                    />
                    <button onClick={generateReport} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', height: '40px' }}>Generate Report</button>
                </div>
            </div>
            <div className='report'>
                {reportData.length > 0 && (
                    <div className="report-container">
                        <center>
                            <h2>Report Summary</h2>
                        </center>
                        <div className='row'>
                            <input
                                type="text"
                                placeholder="Search all .."
                                value={searchTerm}
                                onChange={handleSearch}
                                style={{ marginBottom: '25px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                            <button
                                onClick={downloadTableAsExcel}
                                style={{
                                    marginBottom: '25px', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', border: '1px solid #ccc'
                                }}
                            >
                                Download as Excel
                            </button>
                        </div>
                        <div className="table-wrapper">
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th>Department</th>
                                        <th>Course Code</th>
                                        <th>Course Name</th>
                                        <th>Total Students</th>
                                        <th>Present Students</th>
                                        <th>Absent Students</th>
                                        <th>Failed Students</th>
                                        <th>Pass Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(groupedFilteredData).map((department, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td rowSpan={groupedFilteredData[department].length}>
                                                    <Link to={{ pathname: `/markentry/report/${groupedFilteredData[department][0].id}`, state: { department } }} className="line">
                                                        {department}
                                                    </Link>
                                                </td>
                                                <td>{groupedFilteredData[department][0].courseCode}</td>
                                                <td>{groupedFilteredData[department][0].courseName}</td>
                                                <td>{groupedFilteredData[department][0].totalStudents}</td>
                                                <td>{groupedFilteredData[department][0].presentStudents}</td>
                                                <td>{groupedFilteredData[department][0].absentStudents}</td>
                                                <td>{groupedFilteredData[department][0].failedStudents}</td>
                                                <td>{groupedFilteredData[department][0].passPercentage}</td>
                                            </tr>
                                            {groupedFilteredData[department].slice(1).map((data, subIndex) => (
                                                <tr key={`${index}-${subIndex}`}>
                                                    <td>{data.courseCode}</td>
                                                    <td>{data.courseName}</td>
                                                    <td>{data.totalStudents}</td>
                                                    <td>{data.presentStudents}</td>
                                                    <td>{data.absentStudents}</td>
                                                    <td>{data.failedStudents}</td>
                                                    <td>{data.passPercentage}</td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Report;
