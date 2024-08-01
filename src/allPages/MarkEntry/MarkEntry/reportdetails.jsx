import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './Subject.css';
import Dropdown from '../../../components/dropdown/dropdown';
import apiHost from '../../../utils/api';

function SubjectDetailsPage() {
  const { branch } = useParams();
  const { state } = useLocation();
  const query = new URLSearchParams(useLocation().search);
  const title = query.get('title') || 'Subject Details'; // Get title from query params or default to 'Subject Details'

  const [subjectDetails, setSubjectDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [department, setDepartment] = useState(undefined);

  const studentList = state;

  useEffect(() => {
    fetchSubjectDetails(branch)
      .then(details => {
        setSubjectDetails(details);
      })
      .catch(error => {
        console.error('Error fetching subject details:', error);
      });
  }, [branch]);

  const fetchSubjectDetails = async (branch) => {
    return {
      name: "Subject",
      branch: branch,
      courseName: "Course",
      students: studentList
    };
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const downloadTableAsExcel = () => {
    const tableData = [
      studentList.length > 0 ? Object.keys(studentList[0]) : null
    ];

    studentList.forEach((student) => {
      tableData.push(Object.values(student));
    });

    const ws = XLSX.utils.aoa_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SubjectDetails");
    XLSX.writeFile(wb, "SubjectDetails.xlsx");
  };

  return (
    <div className="subject-details-container">
      <h1>{title}</h1> {/* Display the title here */}
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
                {studentList?.length > 0 && <th>S.No</th>}
                {studentList?.length > 0 ? Object.keys(studentList[0]).map((header, index) => (
                  <th key={index}>{header}</th>
                )) : null}
              </tr>
            </thead>
            <tbody>
              {studentList?.map((student, index) => (
                <tr key={student.rollNumber}>
                  <td>{index + 1}</td>
                  {Object.values(student).map((value, i) => (<td key={i}>{value}</td>))}
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
