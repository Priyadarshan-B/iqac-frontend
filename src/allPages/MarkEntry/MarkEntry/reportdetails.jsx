import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import './Subject.css';
import apiHost from '../../../utils/api';

function SubjectDetailsPage() {
  const { branch } = useParams();
  const { state } = useLocation();
  const query = new URLSearchParams(useLocation().search);
  const title = query.get('title') || 'Subject Details'; // Get title from query params or default to 'Subject Details'

  const [subjectDetails, setSubjectDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredStudents = studentList.filter((student) =>
    Object.values(student).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {studentList?.length > 0 && <TableCell>S.No</TableCell>}
                  {studentList?.length > 0 ? Object.keys(studentList[0]).map((header, index) => (
                    <TableCell key={index}>{header}</TableCell>
                  )) : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((student, index) => (
                    <TableRow key={student.rollNumber}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      {Object.values(student).map((value, i) => (<TableCell key={i}>{value}</TableCell>))}
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      )}
    </div>
  );
}

export default SubjectDetailsPage;
