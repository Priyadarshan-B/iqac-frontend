import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './Subject.css';
import Dropdown from '../../../components/dropdown/dropdown';
import apiHost from '../../../utils/api';
function SubjectDetailsPage() {
  const { branch } = useParams();
  const [subjectDetails, setSubjectDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { state } = useLocation()
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [department, setDepartment] = useState(undefined)
  console.log(useLocation())
  const studentList = state
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
  /*
    const countFailedSubjects = (marks) => {
      let failedSubjects = 0;
      Object.values(marks).forEach(mark => {
        if (mark < 50) {
          failedSubjects++;
        }
      });
      return failedSubjects;
    };
    */

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  console.log(studentList)


  const downloadTableAsExcel = () => {
    const tableData = [
      studentList.length > 0 ? Object.keys(studentList[0]) : null
    ];

    filteredStudents.forEach((student, index) => {
      tableData.push(
        Object.values(student)
      );
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
          <div className='row'  >
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
                {
                  studentList.length > 0 && <th>S.No</th>

                }
                {
                  studentList.length > 0 ? Object.keys(studentList[0]).map((student) =>
                    (<th>{student}</th>)
                  ) : null
                }
              </tr>
            </thead>
            <tbody>
              {studentList.map((student, index) => (
                <tr key={student.rollNumber}>
                  <td>{index + 1}</td>
                  {
                    Object.values(student).map((student, i) => (<td>{student}</td>))
                  }
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
