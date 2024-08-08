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
import * as XLSX from 'xlsx'; // Import XLSX library

const InfoModal = ({ status, requestDetails, onClose }) => {
  return (
    <div>
      <h2>Faculty Status Information</h2>
      <p>The current status is: {status}</p>
      {requestDetails && (
        <div>
          <h3>Replacement Request Details</h3>
          <p>Request ID: {requestDetails.request_id}</p>
          <p>Old Faculty : {requestDetails.old_faculty_name}</p>
          <p>New Faculty : {requestDetails.new_faculty_name}</p>
          <p>Course : {requestDetails.course_name}</p>
          <p>Status: {requestDetails.status}</p>
          <p>Remarks: {requestDetails.remarks}</p>
        </div>
      )}

    </div>
  );
};

function HodSemesterPage() {
  const [semesterData, setSemesterData] = useState([]);
  const [viewMoreState, setViewMoreState] = useState([]);
  const [semester, setSemester] = useState({ value: 1, label: 'Semester 1' });
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');
  const [requestDetails, setRequestDetails] = useState(null);
  const branch = 1;

  const tableCellFontSize = "14px";
  const semesterTitles = {
    1: 'S1 Courses',
    2: 'S2 Courses',
    3: 'S3 Courses',
    4: 'S4 Courses',
    5: 'S5 Courses',
    6: 'S6 Courses',
    7: 'S7 Courses',
    8: 'S8 Courses',
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching semester faculty allocation data...");
        const response = await axios.get(`${apiHost}/semesterFacultyAllocation`, {
          params: { semester: semester.value, branch }
        });
        console.log("Semester data response:", response.data);

        const updatedSemesterData = await Promise.all(response.data.map(async (data) => {
          const facultyWithRequests = await Promise.all(data.faculty.map(async (faculty) => {
            const facultyRequests = await fetchReplacementRequestDetails([faculty.id]);
            console.log(`Replacement requests for faculty ID ${faculty.id}:`, facultyRequests);
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
        console.log("Updated semester data:", updatedSemesterData);
        
      } catch (error) {
        console.error('Error fetching semester data:', error);
      }
    };

    fetchData();
  }, [semester, branch]);

  const fetchReplacementRequestDetails = async (facultyIds) => {
    try {
      console.log("Fetching replacement request details for faculty IDs:", facultyIds);
      const response = await axios.get(`${apiHost}/faculty_replacement_requests`, {
        params: { facultyIds }
      });
      console.log("Replacement request details response:", response.data);
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
    console.log("Selected semester:", selectedOption);
  };

  const handleInfoModalClose = () => {
    setInfoModalOpen(false);
    setRequestDetails(null);
    console.log("Closed info modal");
  };

  const ReplaceFaculty = ({ courseId, currentFacultyId }) => {
    const [selectedFacultyId, setSelectedFacultyId] = useState(currentFacultyId);
    const [remarks, setRemarks] = useState('');
    const [facultyOptions, setFacultyOptions] = useState([]);

    useEffect(() => {
      const fetchFacultyData = async () => {
        try {
          console.log(`Fetching faculty suggestions for course ID: ${courseId} and current faculty ID: ${currentFacultyId}`);
          const response = await axios.get(`${apiHost}/facultySuggestionCourseDetails`, {
            params: { courseId: courseId, facultyRegisterNumber: currentFacultyId }
          });
          const options = response.data.map(faculty => ({
            value: faculty.id,
            label: faculty.faculty_name
          }));
          setFacultyOptions(options);
          console.log("Fetched faculty options:", options);
        } catch (error) {
          console.error('Error fetching faculty suggestions:', error);
        }
      };

      fetchFacultyData();
    }, [courseId, currentFacultyId]);

    const handleFacultyChange = (selectedOption) => {
      setSelectedFacultyId(selectedOption.value);
      console.log("Selected faculty ID:", selectedOption.value);
    };

    const handleSubmit = async () => {
      try {
        console.log("Submitting replacement request...");
        const response = await axios.post(`${apiHost}/replaceFaculty`, {
          courseId: courseId,
          oldFacultyId: currentFacultyId,
          newFacultyId: selectedFacultyId,
          remarks: remarks
        });
        console.log('Replacement request submitted successfully:', response.data);
      } catch (error) {
        console.error('Error submitting replacement request:', error);
      }
    };

    return (
      <>
        <InputLabel id="simple-select" color="primary">Select Faculty</InputLabel>
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
    try {
      // Prepare the data for Excel
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

      console.log(dataToExport);

      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Convert data to a worksheet
      const ws = XLSX.utils.json_to_sheet(dataToExport);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Semester Data');

      // Generate a download
      XLSX.writeFile(wb, `Semester_${semester.value}_Data.xlsx`);
    } catch (error) {
      console.error("Error generating Excel file:", error);
    }
  };

  return (
    <div>
       <h1>{semesterTitles[semester.value]}</h1> 
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
                          <TableCell sx={{ fontSize: tableCellFontSize }} align="center">Action</TableCell>
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
                            <TableCell sx={{ fontSize: "20px" }} align="center">
                              {faculty.status !== "active" ? (
                                <div onClick={() => handleOpenInfoModal(faculty.status, faculty.requests)}>
                                  <ModalUnstyled
                                  closeText={"close"}
                                    icon={<InfoIcon />}
                                    open={infoModalOpen}
                                    modalContent={<InfoModal  status={currentStatus} requestDetails={requestDetails} onClose={handleInfoModalClose} />}
                                  />
                                </div>
                              ) : (
                                <ModalUnstyled
                                closeText={"Cancel"}
                                  icon={<RotateLeft />}
                                  modalContent={<ReplaceFaculty courseId={data.courseId} currentFacultyId={faculty.id} />}
                                />
                              )}
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

export default HodSemesterPage;
