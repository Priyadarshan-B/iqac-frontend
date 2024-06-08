import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import apiHost from "../../../utils/api";
import "./markentry.css";
import axios from "axios";

import UploadIcon from '@mui/icons-material/Upload';

function Attendance() {
  const [studentsData, setStudentsData] = useState([]);
  const [excelData, setExcelData] = useState([]);
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
        console.log('Data sent successfully');
        toast.success('Data sent successfully');
        navigate('/markentry', { state: { data: jsonData } });
      })
      .catch((error) => {
        console.error('Error sending data:', error);
        toast.error('Error sending data');
      });
  };

  return (
    
    <div style={{ marginTop:'25px',marginLeft:'20px', borderRadius: '5px' }}>
      <input
        accept=".xlsx, .xls"
        style={{ display: 'none' }}
        id="upload-file"
        type="file"
        onChange={handleFileUpload}
      />
      <div style={{height: '150px',width:'1400px',backgroundColor:'white'}}>
        <center>
        <br />
          <h3>Here you can upload the student list</h3>
       
      <button 
        style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer',marginTop:'30px' }}
        onClick={() => document.getElementById('upload-file').click()}
      >
        Upload Excel
      </button>
      </center>
      </div>
    

      {excelData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {excelData[0].map((header, index) => (
                  <th key={index} style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} style={{ border: '1px solid #ddd', padding: '8px' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <center>
            <button 
              style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
              onClick={sendDataToBackend}
            >
              Submit
            </button>
          </center>
        </div>
      )}
  
    </div>
  );
}

export default Attendance;
