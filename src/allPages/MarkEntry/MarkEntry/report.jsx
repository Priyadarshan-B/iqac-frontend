import React, { useState, useEffect } from 'react';
import './report.css';
import Dropdown from '../../../components/dropdown/dropdown';
import * as XLSX from 'xlsx';
import Card from '../../../components/card/Card';
import axios from "axios";
import apiHost from "../../../utils/api";
import { useNavigate } from 'react-router-dom';
import Absentees from '../../../assets/Absentees.jpg';
import MarkReport from '../../../assets/MarkReport.png';
import FailReport from '../../../assets/fail.jpg';
function Report() {
  const [selectedRegulation, setSelectedRegulation] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedTestType, setSelectedTestType] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [RegulationOptions, setRegulationOptions] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [testtypeOptions, setTestTypeOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");




  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${apiHost}/regulation`)
      .then(response => {
        const options = response.data.map(item => ({
          value: item.id,
          label: item.regulation,
        }));
        setRegulationOptions(options);
      })
      .catch(error => console.error("Error fetching regulation data:", error));

    axios.get(`${apiHost}/year`)
      .then(response => {
        const options = response.data.map(item => ({
          value: item.id,
          label: item.year,
        }));
        setYearOptions(options);
      })
      .catch(error => console.error("Error fetching year data:", error));

    axios.get(`${apiHost}/semester`)
      .then(response => {
        const options = response.data.map(item => ({
          value: item.id,
          label: item.semester,
        }));
        setSemesterOptions(options);
      })
      .catch(error => console.error("Error fetching semester data:", error));

    axios.get(`${apiHost}/testtype`)
      .then(response => {
        const options = response.data.map(item => ({
          value: item.id,
          label: item.type,
        }));
        setTestTypeOptions(options);
      })
      .catch(error => console.error("Error fetching test type data:", error));
  }, []);

  const fetchReport = () => {
    if (selectedRegulation && selectedSemester && selectedTestType && selectedYear) {
      axios.get(`${apiHost}/markReport`, {
        params: {
          type: selectedTestType.value,
          regulation: selectedRegulation.value,
          year: selectedYear.value,
          semester: selectedSemester.value
        }
      }).then((response) => {
        setReportData(response.data);
        console.log(response.data);
      });
    }
  }

  const generateReport = () => {
    fetchReport();
  };

  const downloadTableAsExcel = () => {
    const tableData = [];
    tableData.push(["Department", "Course Code", "Course Name", "Total Students", "Present Students"
      , "Absent Students", "Failed Students", "[0-20]", "[21-50]", "[51-80]", "[81-100]", "minimum mark", "maximum mark", "Pass Percentage"]);
    reportData.forEach((data) => {
      tableData.push([data.branch, data.code, data.name,
      data.strength, data.present_count, data.absent_count,
      data.fail_count, data.range_0_20, data.range_21_50, data.range_51_80, data.range_81_100, data.min_mark, data.max_mark, data.pass_percentage]);
    });

    const ws = XLSX.utils.aoa_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const year = selectedYear ? selectedYear.label : "Year";
    const semester = selectedSemester ? selectedSemester.label : "Semester";
    const testType = selectedTestType ? selectedTestType.label : "TestType";
    const fileName = `${semester}-Semester-${testType}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const getMarkList = (course_id) => {
    console.log("getting marklist ....")
    axios.get(`${apiHost}/getMarkList?semester=${selectedSemester.value}
&type=${selectedTestType.value}&course=${course_id}`).then((response) => {
      navigate('/markentry/report/markReport/list', { state: response.data })
    })

  };
  const getAbsentees = (course_id) => {
    console.log("getting absentees ... ")
    axios.get(`${apiHost}/getAbsentees?semester=${selectedSemester.value}
&type=${selectedTestType.value}&course=${course_id}`).then((response) => {
      navigate('/markentry/report/absentees/list', { state: response.data })
    })
  }
  const getFailures = (course_id) => {
    console.log("getting failures ... ")
    axios.get(`${apiHost}/getFailures?semester=${selectedSemester.value}
&type=${selectedTestType.value}&course=${course_id}`).then((response) => {
      navigate('/markentry/report/failureReport/list', { state: response.data })
    })
  }
  useEffect(() => {
    setReportData([]);
  }, [selectedTestType, selectedRegulation, selectedYear, setSelectedRegulation])
  return (
    <div className="container">

      <div className="dropdown-container">
        {!(window.location.href.includes('/markentry/report/')) &&
          <>
            <Card url="/markentry/report/absentees" image={Absentees} title="Absentees Report" />

            <Card url="/markentry/report/failReport" image={FailReport} title="Failure Report" />

            <Card url="/markentry/report/markReport" image={MarkReport} title="Mark Report" />

          </>
        }
        {window.location.href.includes('/markentry/report/')

          &&
          <div className="dropdowns">
            <Dropdown
              options={RegulationOptions}
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
              options={testtypeOptions}
              placeholder="Test Type"
              value={selectedTestType}
              onChange={setSelectedTestType}
            />

            <button onClick={generateReport} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', height: '40px' }}>Generate Report</button>
          </div>}
      </div>
      {window.location.href.includes('/markentry/report/') &&
        <div className='report'>
          {reportData.length > 0 && (
            <div className="report-container">
              <center>
                <h2>Report Summary</h2>
              </center>
              <div className='row'>
                <input
                  type="text"
                  placeholder="Search all .."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ marginBottom: '25px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button
                  onClick={downloadTableAsExcel}
                  style={{
                    marginBottom: '25px', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', border: '1px solid #ccc'
                  }}
                >
                  Download as Excel
                </button>
              </div>
              <div className="table-wrapper">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Course Code</th>
                      <th>Course Name</th>

                      {window.location.href.includes('/markentry/report/markReport') &&
                        <>
                          <th>Total Students</th>
                          <th>Present Students</th>
                          <th>Absent Students</th>
                          <th>Failed Students</th>
                          <th>[0-20]</th>
                          <th>[21-50]</th>
                        </>
                      }
                      {
                        selectedTestType.value == 5 && window.location.href.includes('/markentry/report/markReport') && <>
                          <th>[51-80]</th>
                          <th>[81-100]</th>
                        </>
                      }
                      {
                        window.location.href.includes('/markentry/report/absentees') &&
                        <th>Absentees Count</th>
                      } {
                        window.location.href.includes('/markentry/report/failReport') &&
                        <th>Failure Count</th>
                      }

                      {window.location.href.includes('/markentry/report/markReport') &&
                        <>
                          <th>Minimum Mark</th>
                          <th>Maximum Mark</th>
                          <th>Pass Percentage</th>
                        </>
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.filter(data => {

                      const searchString = searchTerm.toLowerCase();
                      return (
                        data.branch.toLowerCase().includes(searchString) ||
                        data.code.toLowerCase().includes(searchString) ||
                        data.name.toLowerCase().includes(searchString)

                      );
                    })
                      .map((data, index) => (
                        <tr key={index}>
                          <td onClick={() => getMarkList(data.course_id)} style={{ cursor: 'pointer', color: 'blue' }}>
                            {data.branch}
                          </td>
                          <td>{data.code}</td>
                          <td>{data.name}</td>
                          {window.location.href.includes('/markentry/report/markReport') &&
                            <>

                              <td>{data.strength}</td>
                              <td>{data.present_count}</td>
                              <td>{data.absent_count}</td>
                              <td>{data.fail_count}</td>
                              <td>{data.range_0_20}</td>
                              <td>{data.range_21_50}</td>

                            </>
                          }
                          {
                            window.location.href.includes('/markentry/report/absentees') &&
                            <td>{data.absent_count + " : "}
                              <button onClick={() => { getAbsentees(data.course_id) }} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', height: '40px' }}>Get List</button>
                            </td>
                          }  {
                            window.location.href.includes('/markentry/report/failReport') &&
                            <td>{data.fail_count + " : "}
                              <button onClick={() => { getFailures(data.course_id) }} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', height: '40px' }}>Get List</button>
                            </td>
                          }
                          {
                            selectedTestType == 5 && window.location.href.includes('/markentry/report/markReport') && <>
                              <td>{data.range_51_80}</td>
                              <td>{data.range_81_100}</td>
                            </>
                          }
                          {
                            window.location.href.includes('/markentry/report/markReport') &&
                            <>
                              <td>{data.min_mark}</td>
                              <td>{data.max_mark}</td>
                              <td>{data.pass_percentage}</td>
                            </>
                          }
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      }
    </div >
  );
}

export default Report;
