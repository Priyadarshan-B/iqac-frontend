import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './Subject.css';

function SubjectDetailsPage() {
    const { courseCode } = useParams();
    const [subjectDetails, setSubjectDetails] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubjectDetails(courseCode)
            .then(details => {
                setSubjectDetails(details);
            })
            .catch(error => {
                console.error('Error fetching subject details:', error);
            });
    }, [courseCode]);

    const fetchSubjectDetails = async (courseCode) => {
        return {
            name: "Subject",
            courseCode: courseCode,
            courseName: "Course",
            students: [
                { name: "KISHORE", rollNumber: "7376232CT126", marks: { phy: 80, math: 75, sci: 85, eng: 70, tam: 90, dce: 85 } },
                { name: "MOHAN", rollNumber: "7376232CT127", marks: { phy: 75, math: 70, sci: 80, eng: 65, tam: 85, dce: 80 } },
                { name: "RAJU", rollNumber: "7376232CT128", marks: { phy: 20, math: 65, sci: 30, eng: 55, tam: 75, dce: 60 } },
            ]
        };
    };

    const countFailedSubjects = (marks) => {
        let failedSubjects = 0;
        Object.values(marks).forEach(mark => {
            if (mark < 50) {
                failedSubjects++;
            }
        });
        return failedSubjects;
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredStudents = subjectDetails?.students.filter(student => {
        const studentDetails = [
            student.name,
            student.rollNumber,
            student.marks.phy,
            student.marks.math,
            student.marks.sci,
            student.marks.eng,
            student.marks.tam,
            student.marks.dce,
            countFailedSubjects(student.marks)
        ];
        return studentDetails.some(detail =>
            detail.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const downloadTableAsExcel = () => {
        const tableData = [
            ["S.No", "Register Number", "Name", "Phy", "Math", "Chem", "Eng", "Cps", "DCE", "Failed"]
        ];

        filteredStudents.forEach((student, index) => {
            tableData.push([
                index + 1,
                student.rollNumber,
                student.name,
                student.marks.phy,
                student.marks.math,
                student.marks.sci,
                student.marks.eng,
                student.marks.tam,
                student.marks.dce,
                countFailedSubjects(student.marks)
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SubjectDetails");
        XLSX.writeFile(wb, "SubjectDetails.xlsx");
    };

    return (
        <div className="subject-details-container">
            {subjectDetails && (
                <div className="table-container">
                    <div className='row'>
                    <input
                        type="text"
                        placeholder="Search ..."
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <button
                        onClick={downloadTableAsExcel}
                        style={{
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid white',
                            backgroundColor: '#007bff',
                             
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        Download as Excel
                    </button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Register Number</th>
                                <th>Name</th>
                                <th>Phy</th>
                                <th>Math</th>
                                <th>Chem</th>
                                <th>Eng</th>
                                <th>Cps</th>
                                <th>DCE</th>
                                <th>Failed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => (
                                <tr key={student.rollNumber}>
                                    <td>{index + 1}</td>
                                    <td>{student.rollNumber}</td>
                                    <td>{student.name}</td>
                                    <td>{student.marks.phy}</td>
                                    <td>{student.marks.math}</td>
                                    <td>{student.marks.sci}</td>
                                    <td>{student.marks.eng}</td>
                                    <td>{student.marks.tam}</td>
                                    <td>{student.marks.dce}</td>
                                    <td>{countFailedSubjects(student.marks)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default SubjectDetailsPage;
