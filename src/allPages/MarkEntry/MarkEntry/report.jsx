import React, { useState } from 'react';
import './report.css';
import Dropdown from '../../../components/dropdown/dropdown';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';

function Report() {
    const regulationOptions = [
        { value: "Regulation 1", label: "2022" },
        { value: "Regulation 2", label: "2021" },
        { value: "Regulation 3", label: "2020" }
    ];

    const yearOptions = [
        { value: "Year 1", label: "1" },
        { value: "Year 2", label: "2" },
        { value: "Year 3", label: "3" }
    ];

    const semesterOptions = [
        { value: "Semester 1", label: "S1" },
        { value: "Semester 2", label: "S2" },
        { value: "Semester 3", label: "S3" }
    ];

    const testTypeOptions = [
        { value: "Test Type 1", label: "PT 1" },
        { value: "Test Type 2", label: "PT 2" },
        { value: "Test Type 3", label: "SEM 2" }
    ];

    const [selectedRegulation, setSelectedRegulation] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedTestType, setSelectedTestType] = useState(null);

    const [reportData, setReportData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const generateReport = () => {
        const dummySubjects = [
            { id: 1, departments: "CT", courseCode: "CT101", courseName: "MATHS" },
            { id: 1, departments: "CT", courseCode: "CT102", courseName: "DCE" },
            { id: 1, departments: "CT", courseCode: "CT103", courseName: "CHEM" },
            { id: 1, departments: "CT", courseCode: "CT104", courseName: "PHY" },
            { id: 1, departments: "CT", courseCode: "CT105", courseName: "ENG" },
            { id: 1, departments: "CT", courseCode: "CT106", courseName: "CPS" },

            { id: 2, departments: "CSE", courseCode: "CT101", courseName: "MATHS" },
            { id: 2, departments: "CSE", courseCode: "CT102", courseName: "DCE" },
            { id: 2, departments: "CSE", courseCode: "CT103", courseName: "CHEM" },
            { id: 2, departments: "CSE", courseCode: "CT104", courseName: "PHY" },
            { id: 2, departments: "CSE", courseCode: "CT105", courseName: "ENG" },
            { id: 2, departments: "CSE", courseCode: "CT106", courseName: "CPS" },

            { id: 3, departments: "IT", courseCode: "CT101", courseName: "MATHS" },
            { id: 3, departments: "IT", courseCode: "CT102", courseName: "DCE" },
            { id: 3, departments: "IT", courseCode: "CT103", courseName: "CHEM" },
            { id: 3, departments: "IT", courseCode: "CT104", courseName: "PHY" },
            { id: 3, departments: "IT", courseCode: "CT105", courseName: "ENG" },
            { id: 3, departments: "IT", courseCode: "CT106", courseName: "CPS" },

            { id: 4, departments: "BT", courseCode: "CT101", courseName: "MATHS" },
            { id: 4, departments: "BT", courseCode: "CT102", courseName: "DCE" },
            { id: 4, departments: "BT", courseCode: "CT103", courseName: "CHEM" },
            { id: 4, departments: "BT", courseCode: "CT104", courseName: "PHY" },
            { id: 4, departments: "BT", courseCode: "CT105", courseName: "ENG" },
            { id: 4, departments: "BT", courseCode: "CT106", courseName: "CPS" },
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
        XLSX.writeFile(wb, "report.xlsx");
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredData = reportData.filter(data =>
        data.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container">
            <div className="dropdown-container">
                <div className="dropdowns">
                    <Dropdown
                        options={regulationOptions}
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
                        options={testTypeOptions}
                        placeholder="Test Type"
                        value={selectedTestType}
                        onChange={setSelectedTestType}
                    />
                    <button onClick={generateReport} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', height: '40px', marginTop: '29px' }}>Generate Report</button>
                    <button onClick={downloadTableAsExcel} style={{ backgroundColor: 'green', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', height: '40px', marginTop: '29px' }}>Download Report</button>
                </div>
            </div>
            <div className='report'>
                {reportData.length > 0 && (
                    <div className="report-container">
                        <center>
                            <h2>Report Summary</h2>
                        </center>
                       
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
                                {Object.keys(groupedData).map((department, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td rowSpan={groupedData[department].length}>
                                                <Link to={{ pathname: `/markentry/report/${groupedData[department][0].id}`, state: { department } }}>
                                                    {department}
                                                </Link>
                                            </td>
                                            <td>{groupedData[department][0].courseCode}</td>
                                            <td>{groupedData[department][0].courseName}</td>
                                            <td>{groupedData[department][0].totalStudents}</td>
                                            <td>{groupedData[department][0].presentStudents}</td>
                                            <td>{groupedData[department][0].absentStudents}</td>
                                            <td>{groupedData[department][0].failedStudents}</td>
                                            <td>{groupedData[department][0].passPercentage}</td>
                                        </tr>
                                        {groupedData[department].slice(1).map((data, subIndex) => (
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
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredData.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function Pagination({ itemsPerPage, totalItems, paginate, currentPage }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <a onClick={() => paginate(number)} href='#!' className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Report;
