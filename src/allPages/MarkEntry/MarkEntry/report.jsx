import React, { useState,useEffect } from 'react';
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
    const [searchInput, setSearchInput] = useState('');
    const [reportData, setReportData] = useState([]);
    const [RegulationOptions, setRegulationOptions] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [yearOptions,setYearOptions]=useState([]);
    const [testtypeOptions, setTestTypeOptions] = useState([]);

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
            { id: 1, departments: "CT", courseCode: "CT101", courseName: "MATHS" },
            { id: 1, departments: "CT", courseCode: "CT102", courseName: "DCE" },
            { id: 1, departments: "CT", courseCode: "CT103", courseName: "CHEM" },
            { id: 1, departments: "CT", courseCode: "CT104", courseName: "PHY" },
            { id: 1, departments: "CT", courseCode: "CT105", courseName: "ENG" },
            { id: 1, departments: "CT", courseCode: "CT106", courseName: "CPS" },

            { id: 2, departments: "CSE", courseCode: "CSE101", courseName: "MATHS" },
            { id: 2, departments: "CSE", courseCode: "CSE102", courseName: "DCE" },
            { id: 2, departments: "CSE", courseCode: "CSE103", courseName: "CHEM" },
            { id: 2, departments: "CSE", courseCode: "CSE104", courseName: "PHY" },
            { id: 2, departments: "CSE", courseCode: "CSE105", courseName: "ENG" },
            { id: 2, departments: "CSE", courseCode: "CSE106", courseName: "CPS" },

            { id: 3, departments: "IT", courseCode: "IT101", courseName: "MATHS" },
            { id: 3, departments: "IT", courseCode: "IT102", courseName: "DCE" },
            { id: 3, departments: "IT", courseCode: "IT103", courseName: "CHEM" },
            { id: 3, departments: "IT", courseCode: "IT104", courseName: "PHY" },
            { id: 3, departments: "IT", courseCode: "IT105", courseName: "ENG" },
            { id: 3, departments: "IT", courseCode: "IT106", courseName: "CPS" },

            { id: 4, departments: "BT", courseCode: "BT101", courseName: "MATHS" },
            { id: 4, departments: "BT", courseCode: "BT102", courseName: "DCE" },
            { id: 4, departments: "BT", courseCode: "BT103", courseName: "CHEM" },
            { id: 4, departments: "BT", courseCode: "BT104", courseName: "PHY" },
            { id: 4, departments: "BT", courseCode: "BT105", courseName: "ENG" },
            { id: 4, departments: "BT", courseCode: "BT106", courseName: "CPS" },
        ];

        const allReportData = [];

        dummySubjects.forEach(subject => {
            allReportData.push({
                id: subject.id,
                department: subject.departments,
                courseCode: subject.courseCode,
                courseName: subject.courseName,
                totalStudents: 100,
                presentStudents: 95,
                absentStudents: 5,
                failedStudents: 5,
                passPercentage: ((95 - 5) / 95 * 100).toFixed(2)
            });
        });

        setReportData(allReportData);
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
    const fileName = `${semester} Semester ${testType}.xlsx`;

    XLSX.writeFile(wb, fileName);
    };

    const filteredReportData = reportData.filter(data =>
        Object.values(data).some(val =>
            String(val).toLowerCase().includes(searchInput.toLowerCase())
        )
    );

    const filteredGroupedData = filteredReportData.reduce((acc, cur) => {
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
                                placeholder="Search ..."
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                style={{ marginBottom: '25px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                            <button
                                onClick={downloadTableAsExcel}
                                style={{
                                    marginBottom: '25px', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px',  border: '1px solid #ccc'
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
                                    {Object.keys(filteredGroupedData).map((department, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td rowSpan={filteredGroupedData[department].length}>
                                                    <Link to={{ pathname: `/markentry/report/${filteredGroupedData[department][0].id}`, state: { department } }} className="line">
                                                        {department}
                                                    </Link>
                                                </td>
                                                <td>{filteredGroupedData[department][0].courseCode}</td>
                                                <td>{filteredGroupedData[department][0].courseName}</td>
                                                <td>{filteredGroupedData[department][0].totalStudents}</td>
                                                <td>{filteredGroupedData[department][0].presentStudents}</td>
                                                <td>{filteredGroupedData[department][0].absentStudents}</td>
                                                <td>{filteredGroupedData[department][0].failedStudents}</td>
                                                <td>{filteredGroupedData[department][0].passPercentage}</td>
                                            </tr>
                                            {filteredGroupedData[department].slice(1).map((data, subIndex) => (
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
