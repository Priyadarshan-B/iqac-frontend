import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import apiHost from "../../../utils/api";
import "./attendance.css";
import axios from "axios";
import { Modal, Backdrop, Fade, Button } from '@mui/material';

function Attendance() {
  const [studentsData, setStudentsData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); 

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

      setExcelData(worksheet);
    };

    reader.readAsBinaryString(file);
  };

  const parseExcelToJson = () => {
    const headers = excelData[0];
    const jsonData = [];

    for (let i = 1; i < excelData.length; i++) {
      const row = excelData[i];
      const rowData = {};

      for (let j = 0; j < headers.length; j++) {
        rowData[headers[j]] = row[j];
      }

      jsonData.push(rowData);
    }

    return jsonData;
  };

  const jsonData = parseExcelToJson();

  useEffect(() => {
    jsonData.forEach((row, index) => {
      console.log(`Index: ${index}, Row:`, row);
    });
  }, [jsonData]);

  const sendDataToBackend = () => {

    axios.post(`${apiHost}/updateAttendance`, { data: jsonData })
      .then((response) => {
        if(response.status == 200){
          setSuccessMessage("Successfully added");
          setOpenModal(true);
        }
        else{
          setSuccessMessage("Error adding student details");
          setOpenModal(true);
        }
        
       
      })
      .catch((error) => {
        console.error('Error sending data:', error);
        setSuccessMessage("Error adding student details");
        setOpenModal(true);
      });
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "attendance_data.xlsx");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
   
  };

  return (
    <div className="attendance-container">
      <input
        accept=".xlsx, .xls"
        className="file-upload-input"
        type="file"
        onChange={handleFileUpload}
      />
      <div className="upload-section">
        <center><br />
        <h3>Here you can upload the student list</h3>
        <button 
          className="upload-button"
          onClick={() => document.querySelector('.file-upload-input').click()}
        >
          Upload Excel
        </button>
        </center>
      </div>
      {excelData.length > 0 && (
        <div className="table-section">
         
          <div className="scrollable-table">
            <table className="data-table">
              <thead>
                <tr>
                  {excelData[0].map((header, index) => (
                    <th key={index} className="table-header">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className="table-row">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="table-cell">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <center>
            <button 
              className="submit-button"
              onClick={sendDataToBackend}
            >
              Submit
            </button>
          </center>
        </div>
      )}

      {/* Modal */}
      <center>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
       
      >
        <Fade in={openModal}>
          <div className="modal-content">
            <center>
            <h2>{successMessage}</h2>

            <Button onClick={handleCloseModal}>Close</Button>
            </center>
          </div>
        </Fade>
      </Modal>
      </center>
    </div>
  );
}

export default  Attendance;