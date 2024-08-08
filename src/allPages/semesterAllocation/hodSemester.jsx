import { Card } from "@mui/material";
import ViewMoreButton from "../../components/Button/viewMore";
import { useState, useEffect } from "react";
import React from "react";
import {
  MenuItem,
  InputLabel,
  TextareaAutosize,
  Table,
  Box,
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer
} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import InfoIcon from '@mui/icons-material/Info';
import ModalUnstyled from "../../components/Modals/Modal";
import apiHost from "../../utils/api";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import Select from 'react-select';
import './hodSemesterPage.css';
import RotateLeft from "@mui/icons-material/RotateLeft";

const InfoModal = ({ status, requestDetails, onClose }) => {
  return (
    <div>
      <h2>Faculty Status Information</h2>
      <p>The current status is: {status}</p>
      {requestDetails && (
        <div>
          <h3>Replacement Request Details</h3>
          <p>Request ID: {requestDetails.request_id}</p>
          <p>Old Faculty ID: {requestDetails.old_faculty_id}</p>
          <p>New Faculty ID: {requestDetails.new_faculty_id}</p>
          <p>Course ID: {requestDetails.course_id}</p>
          <p>Status: {requestDetails.status}</p>
          <p>Remarks: {requestDetails.remarks}</p>
          <p>Created At: {requestDetails.created_at}</p>
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
  const [requestDetails, setRequestDetails] = useState(null); // State for replacement request details
  const branch = 1;

  const tableCellFontSize = "14px";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiHost}/semesterFacultyAllocation`, {
          params: { semester: semester.value, branch }
        });
        setSemesterData(response.data);
        setViewMoreState(new Array(response.data.length).fill(0));
      } catch (error) {
        console.error('Error fetching semester data:', error);
      }
    };

    fetchData();
  }, [semester, branch]);

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

  const fetchReplacementRequestDetails = async (facultyId) => {
    try {
      const response = await axios.get(`${apiHost}/faculty_replacement_requests`, {
        params: { facultyId }
      });
      return response.data; // Assuming the API returns the relevant data
    } catch (error) {
      console.error('Error fetching replacement request details:', error);
    }
  };

  const handleInfoModalOpen = async (status, facultyId) => {
    const details = await fetchReplacementRequestDetails(facultyId);
    setCurrentStatus(status);
    setRequestDetails(details);
    setInfoModalOpen(true);
  };

  const handleInfoModalClose = () => {
    setInfoModalOpen(false);
  };

  const ReplaceFaculty = ({ courseId, currentFacultyId }) => {
    const [selectedFacultyId, setSelectedFacultyId] = useState(currentFacultyId);
    const [remarks, setRemarks] = useState('');
    const [facultyOptions, setFacultyOptions] = useState([]);

    useEffect(() => {
      const fetchFacultyData = async () => {
        try {
          const response = await axios.get(`${apiHost}/facultySuggestionCourseDetails`, {
            params: { courseId: courseId, facultyRegisterNumber: currentFacultyId }
          });
          const options = response.data.map(faculty => ({
            value: faculty.id,
            label: faculty.faculty_name
          }));
          setFacultyOptions(options);
        } catch (error) {
          console.error('Error fetching faculty suggestions:', error);
        }
      };

      fetchFacultyData();
    }, [courseId, currentFacultyId]);

    const handleFacultyChange = (selectedOption) => {
      setSelectedFacultyId(selectedOption.value);
    };

    const handleSubmit = async () => {
      try {
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
                                <CircleIcon sx={{ color: faculty.status === "active" ? "green" : faculty.status === "pending" ? "orange" : "red" }} />
                                <span>{faculty.status}</span>
                              </div>
                            </TableCell>
                            <TableCell sx={{ fontSize: "20px" }} align="center">
                              {faculty.status === "pending" ? (
                                <ModalUnstyled
                                  icon={<InfoIcon />}
                                  open={infoModalOpen}
                                  modalContent={<InfoModal status={currentStatus} requestDetails={requestDetails} onClose={handleInfoModalClose} />}
                                  onOpen={() => handleInfoModalOpen(faculty.status, faculty.id)} // Pass faculty.id
                                />
                              ) : (
                                <ModalUnstyled
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
