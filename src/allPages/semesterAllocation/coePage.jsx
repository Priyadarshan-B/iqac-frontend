import { Card } from "@mui/material";
import ViewMoreButton from "../../components/Button/viewMore";
import { useState, useEffect } from "react";
import React from "react";
import {
  InputLabel,
  TextareaAutosize,
  Table,
  Box,
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import InfoIcon from '@mui/icons-material/Info';
import ModalUnstyled from "../../components/Modals/Modal";
import apiHost from "../../utils/api";
import axios from 'axios';
import Select from 'react-select';
import './hodSemesterPage.css';
import RotateLeft from "@mui/icons-material/RotateLeft";
import * as XLSX from 'xlsx';

const InfoModal = ({ status, requestDetails, onClose }) => {
  return (
    <div>
      <h2>Faculty Status Information</h2>
      <p>The current status is: {status}</p>
      {requestDetails && (
        <div>
          <h3>Replacement Request Details</h3>
          <p>Request ID: {requestDetails.request_id}</p>
          <p>Old Faculty: {requestDetails.old_faculty_name}</p>
          <p>New Faculty: {requestDetails.new_faculty_name}</p>
          <p>Course: {requestDetails.course_name}</p>
          <p>Status: {requestDetails.status}</p>
          <p>Remarks: {requestDetails.remarks}</p>
        </div>
      )}
    </div>
  );
};

function COEPage() {
  const [semesterData, setSemesterData] = useState([]);
  const [viewMoreState, setViewMoreState] = useState([]);
  const [semester, setSemester] = useState({ value: 1, label: 'Semester 1' });
  const [department, setDepartment] = useState(null);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');
  const [requestDetails, setRequestDetails] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [branch, setBranch] = useState(1);
  const [regulationOptions, setRegulationOptions] = useState([]);
  const [selectedRegulation, setSelectedRegulation] = useState(null);

  const tableCellFontSize = "14px";

  useEffect(() => {
    const fetchRegulations = async () => {
      try {
        const response = await axios.get(`${apiHost}/regulation`);
        const options = response.data.map(reg => ({
          value: reg.id,
          label: reg.regulation
        }));
        setRegulationOptions(options);
      } catch (error) {
        console.error('Error fetching regulations:', error);
      }
    };

    fetchRegulations();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${apiHost}/department`, {
          params: { regulation: selectedRegulation?.value } // Send selected regulation
        });
        console.log(response.data)
        const options = response.data.map(dept => ({
          value: dept.id,
          label: dept.branch
        }));
        setDepartmentOptions(options);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    if (selectedRegulation) {
      fetchDepartments(); // Fetch departments whenever the selected regulation changes
    } else {
      setDepartmentOptions([]); // Clear department options if no regulation is selected
    }
  }, [selectedRegulation]);

  useEffect(() => {
    const fetchFacultyOptions = async () => {
      try {
        const response = await axios.get(`${apiHost}/faculty`);
        const options = response.data.map(faculty => ({
          value: faculty.id,
          label: faculty.faculty_name
        }));
        setFacultyOptions(options);
      } catch (error) {
        console.error('Error fetching faculty options:', error);
      }
    };

    fetchFacultyOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiHost}/semesterFacultyAllocation`, {
          params: { 
            semester: semester.value,  
            branch: department?.value,
            regulation: selectedRegulation?.value // Include selected regulation
          }
        });
        
        const updatedSemesterData = await Promise.all(response.data.map(async (data) => {
          const facultyWithRequests = await Promise.all(data.faculty.map(async (faculty) => {
            const facultyRequests = await fetchReplacementRequestDetails([faculty.id]);
            return {
              ...faculty,
              requests: facultyRequests
            };
          }));

          return {
            ...data,
            faculty: facultyWithRequests
          };
        }));

        setSemesterData(updatedSemesterData);
        setViewMoreState(new Array(updatedSemesterData.length).fill(0));
        
      } catch (error) {
        console.error('Error fetching semester data:', error);
      }
    };
    if(semester&&department){
    fetchData();
    }
  }, [semester, branch, department, selectedRegulation]); // Add selected regulation as a dependency

  const fetchReplacementRequestDetails = async (facultyIds) => {
    try {
      const response = await axios.get(`${apiHost}/faculty_replacement_requests`, {
        params: { facultyIds }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching replacement request details:', error);
    }
  };

  const handleViewToggle = (index) => {
    setViewMoreState(prev => {
      const newState = [...prev];
      newState[index] = newState[index] === 1 ? 0 : 1;
      return newState;
    });
  };

  const handleSemesterChange = (selectedOption) => {
    setSemester(selectedOption);
  };

  const handleDepartmentChange = (selectedOption) => {
    setDepartment(selectedOption);
  };

  const handleRegulationChange = (selectedOption) => {
    setSelectedRegulation(selectedOption);
  };

  const handleInfoModalClose = () => {
    setInfoModalOpen(false);
    setRequestDetails(null);
  };

  const ReplaceFaculty = ({ courseId, currentFacultyId }) => {
    const [selectedFacultyId, setSelectedFacultyId] = useState(currentFacultyId);
    const [remarks, setRemarks] = useState('');

    const handleFacultyChange = (selectedOption) => {
      setSelectedFacultyId(selectedOption.value);
    };

    const handleSubmit = async () => {
      try {
        await axios.post(`${apiHost}/replaceFaculty`, {
          courseId,
          oldFacultyId: currentFacultyId,
          newFacultyId: selectedFacultyId,
          remarks
        });
      } catch (error) {
        console.error('Error submitting replacement request:', error);
      }
    };

    return (
      <>
        <InputLabel id="faculty-select" color="primary">Select Faculty</InputLabel>
        <Select
          id="faculty-select"
          value={facultyOptions.find(option => option.value === selectedFacultyId)}
          onChange={handleFacultyChange}
          options={facultyOptions}
        />
        <InputLabel id="remarks-label" color="primary">Enter Remarks if any</InputLabel>
        <TextareaAutosize
          minRows={8}
          value={remarks}
          style={{ resize: 'none' }}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit Replacement Request</Button>
      </>
    );
  };

  const handleOpenInfoModal = (facultyStatus, facultyRequests) => {
    setCurrentStatus(facultyStatus);
    setRequestDetails(facultyRequests[0]);
    setInfoModalOpen(true);
  };

  const downloadExcel = () => {
    const dataToExport = semesterData.flatMap(course => {
      return course.faculty.map(faculty => ({
        'Course Name': course.CourseName,
        'Total Papers': course.totalPapers,
        'Faculty Name': faculty.facultyName,
        'Department': faculty.department,
        'Faculty ID': faculty.facultyId,
        'Status': faculty.status
      }));
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(wb, ws, 'Semester Data');
    XLSX.writeFile(wb, `Semester_${semester.value}_Data.xlsx`);
  };

  return (
    <div>
      <h1>S1 Courses</h1>
      <br />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px' }}>
        <InputLabel id="semester-select" color="primary" sx={{ marginRight: '10px' }}>Select Semester</InputLabel>
        <Select
          id="semester-select"
          value={semester}
          onChange={handleSemesterChange}
          options={[
            { value: 1, label: 'Semester 1' },
            { value: 2, label: 'Semester 2' },
            { value: 3, label: 'Semester 3' },
            { value: 4, label: 'Semester 4' },
            { value: 5, label: 'Semester 5' },
            { value: 6, label: 'Semester 6' },
            { value: 7, label: 'Semester 7' },
            { value: 8, label: 'Semester 8' },
          ]}
        />
           <InputLabel id="regulation-select" color="primary" sx={{ marginLeft: '10px', marginRight: '10px' }}>Select Regulation</InputLabel>
        <Select
          id="regulation-select"
          value={selectedRegulation}
          onChange={handleRegulationChange}
          options={regulationOptions}
        />
        <InputLabel id="department-select" color="primary" sx={{ marginLeft: '10px', marginRight: '10px' }}>Select Department</InputLabel>
        <Select
          id="department-select"
          value={department}
          onChange={handleDepartmentChange}
          options={departmentOptions}
        />
     
        <Button onClick={downloadExcel} variant="contained" color="primary" sx={{ marginLeft: '10px' }}>
          Download Excel
        </Button>
      </Box>
      <Table sx={{ backgroundColor: "white", marginTop: "20px" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: tableCellFontSize }} align="center">Course Name</TableCell>
            <TableCell sx={{ fontSize: tableCellFontSize }} align="center">No. of Faculties Allotted</TableCell>
            <TableCell sx={{ fontSize: tableCellFontSize }} align="center">Total Papers</TableCell>
            <TableCell sx={{ fontSize: tableCellFontSize }} align="center">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {semesterData.map((data, index) => (
            <React.Fragment key={index}>
              <TableRow>
                <TableCell sx={{ fontSize: tableCellFontSize }} align="center">{data.CourseName}</TableCell>
                <TableCell sx={{ fontSize: tableCellFontSize }} align="center">{data.facultyCount}</TableCell>
                <TableCell sx={{ fontSize: tableCellFontSize }} align="center">{data.totalPapers}</TableCell>
                <TableCell sx={{ fontSize: tableCellFontSize }} align="center">
                  <center><ViewMoreButton onClick={() => handleViewToggle(index)} label="View More" /></center>
                </TableCell>
              </TableRow>
              {viewMoreState[index] === 1 && (
                <TableRow>
                  <TableCell colSpan="4">
                    <Table className="report-table">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontSize: tableCellFontSize }} align="center">Faculty Name</TableCell>
                          <TableCell sx={{ fontSize: tableCellFontSize }} align="center">Department</TableCell>
                          <TableCell sx={{ fontSize: tableCellFontSize }} align="center">Faculty ID</TableCell>
                          <TableCell sx={{ fontSize: tableCellFontSize }} align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.faculty.map((faculty, facultyIndex) => (
                          <TableRow key={facultyIndex}>
                            <TableCell sx={{ fontSize: tableCellFontSize }} align="center">{faculty.facultyName}</TableCell>
                            <TableCell sx={{ fontSize: tableCellFontSize }} align="center">{faculty.department}</TableCell>
                            <TableCell sx={{ fontSize: tableCellFontSize }} align="center">{faculty.facultyId}</TableCell>
                            <TableCell sx={{ fontSize: tableCellFontSize }} align="center">
                              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
                                <CircleIcon sx={{ color: faculty.status === "active" ? "green" : "orange" }} />
                                <span>{faculty.status}</span>
                              </div>
                            </TableCell>
                           
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default COEPage;
