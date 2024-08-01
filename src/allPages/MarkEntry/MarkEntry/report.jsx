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
import { Button } from '@mui/material';
function Report() {
  const localStorageDropdowns = JSON.parse(localStorage.getItem('dropdowns'))
  console.log("dropdwons : ", localStorageDropdowns)
  const [selectedRegulation, setSelectedRegulation] = useState(localStorageDropdowns?.regulation || null);
  const [selectedYear, setSelectedYear] = useState(localStorageDropdowns?.year || null);
  const [selectedSemester, setSelectedSemester] = useState(localStorageDropdowns?.semester || null);
  const [selectedTestType, setSelectedTestType] = useState(localStorageDropdowns?.testtype || null);
  const [selectedReportType, setSelectedReportType] =
    useState({ value: "markReport", label: "Mark Analysis" }
    );
  const [reportData, setReportData] = useState([]);
  const [RegulationOptions, setRegulationOptions] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [testtypeOptions, setTestTypeOptions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [reportTypeOptions, setReportTypeOptions] =
    useState([
      { value: "markReport", label: "Mark Analysis" },
      { value: "absenteesReport", label: "Absentees" },
      { value: "failureReport", label: "Failures" },
      { value: "absenteesAndFailureReport", label: "Absentees + Failures" }
    ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [department, setDepartment] = useState(undefined)
  useEffect(() => {
    if (localStorageDropdowns) {
      generateReport();
    }
  }, [])


  const navigate = useNavigate();
  useEffect(() => {
    if (department && department.value) {
      setSearchTerm(department.label)
    }
    else {
      setSearchTerm("");
    }

  }, [department])
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
    if (selectedReportType && selectedReportType.value) {
      axios.get(`${apiHost}/${selectedReportType.value}`, {
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
    else if (selectedRegulation && selectedSemester && selectedTestType && selectedYear) {
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
  const getDepartment = () => {
    fetch(`${apiHost}/department?regulation=${selectedRegulation.value}`)
      .then((response) => response.json())
      .then((data) => {
        const options = [];
        options.push({ value: null, label: "Select Department" })
        data.map((res) => {
          options.push(
            {
              value: res.id,
              label: res.branch
            });
        }
        )
        console.log(options)
        setDepartmentOptions(options)
      }


      )
  }
  useEffect(() => {
    if (selectedRegulation) {
      getDepartment();
    }
  }, [selectedRegulation])
  useEffect(() => {
    setFilteredData(reportData.filter(data => {

      const searchString = searchTerm.toLowerCase();
      return (
        data.Department.toLowerCase().includes(searchString) ||
        data["Course Code"].toLowerCase().includes(searchString) ||
        data["Course Name"].toLowerCase().includes(searchString)

      )
    })
    )

  }, [searchTerm])

  const generateReport = () => {
    fetchReport();
  };

  const downloadTableAsExcel = () => {
    const tableData = [];
    tableData.push(Object.keys(reportData[0]).map((key) => {
      return key != "course_id" ? key : null;
    }));
    filteredData.forEach((data, i) => {
      tableData.push(Object.values(data).map((value, i) => {
        if (Object.keys(data)[i] != "course_id") {
          return value
        }
      }));
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


  const getMarkList = (course_id, checkDepartment) => {
    console.log("getting marklist ....");

    const params = new URLSearchParams({
      year: selectedYear.value,
      semester: selectedSemester.label,
      type: selectedTestType.value,
    });

    if (course_id) {
      params.append('course', course_id);
    }

    if (checkDepartment) {
      params.append('department', department.value);
    }

    const url = `${apiHost}/getMarkList?${params.toString()}`;
    console.log(url);

    axios.get(url)
      .then((response) => {
        navigate('/markentry/report/markReport/list?title=Mark Report', { state: response.data });
      })
      .catch((error) => {
        console.error('Error fetching mark list:', error);
      });
  };
  window.onbeforeunload = () => {
    localStorage.removeItem('dropdowns')
  }

  const getAbsentees = (course_id, checkDepartment) => {
    console.log("getting absentees ...");

    // Construct the parameters object
    const params = {
      year: selectedYear.value,
      semester: selectedSemester?.label,
      type: selectedTestType?.value,
      course: course_id
    };

    // Include course_id if it is defined

    // Include department if checkDepartment is true and department has a value
    if (checkDepartment && department?.value) {
      params.department = department.value;
    }

    // Construct the URL with parameters
    const url = `${apiHost}/getAbsentees`;

    console.log("Fetching absentees with parameters:", params);

    axios.get(url, { params })
      .then((response) => {
        localStorage.setItem('dropdowns', JSON.stringify({
          regulation: selectedRegulation,
          year: selectedYear,
          semester: selectedSemester,
          testtype: selectedTestType
        }));
        navigate('/markentry/report/absentees/list?title=Absentees Report', { state: response.data });
      })
      .catch((error) => {
        console.error('Error fetching absentees:', error);
      });
  };




  const getFailures = (course_id, checkDepartment) => {
    console.log("getting failures ...");

    const params = new URLSearchParams({
      year: selectedYear.value,
      semester: selectedSemester.label,
      type: selectedTestType.value,
    });

    if (course_id !== undefined) {
      params.append('course', course_id);
    }

    if (checkDepartment && department?.value !== undefined) {
      params.append('department', department.value);
    }

    const url = `${apiHost}/getFailures?${params.toString()}`;
    console.log(url);

    axios.get(url)
      .then((response) => {
        localStorage.setItem('dropdowns', JSON.stringify({
          regulation: selectedRegulation,
          year: selectedYear,
          semester: selectedSemester,
          testtype: selectedTestType
        }));
        navigate('/markentry/report/failureReport/list?title=Failure Report', { state: response.data });
      })
      .catch((error) => {
        console.error('Error fetching failures:', error);
      });
  };
  window.onbeforeunload = () => {
    localStorage.removeItem('dropdowns')
  }


  useEffect(() => {
    setReportData([]);
  }, [selectedTestType, selectedRegulation, selectedYear, setSelectedRegulation])

  useEffect(() => {
    if (selectedReportType && selectedYear && selectedTestType && selectedRegulation && selectedSemester) {
      axios.get(`${apiHost}/${selectedReportType.value}`, {
        params: {
          type: selectedTestType.value,
          regulation: selectedRegulation.value,
          year: selectedYear.value,
          semester: selectedSemester.value
        }
      }).then((response) => {
        console.log(response.data);
        setReportData(response.data);
      })
    }
  }, [selectedReportType])

  const getStudentsReport = (checkDepartment) => {
    console.log("getting students report ...");

    const params = new URLSearchParams({
      year: selectedYear.value,
      semester: selectedSemester.label,
      type: selectedTestType.value,
    });

    // Append course_id if defined

    // Append department if checkDepartment is true and department is defined
    if (checkDepartment && department?.value !== undefined) {
      params.append('department', department.value);
    }

    const url = `${apiHost}/studentReport?${params.toString()}`;
    console.log(url);

    axios.get(url)
      .then((response) => {
        localStorage.setItem('dropdowns', JSON.stringify({
          regulation: selectedRegulation,
          year: selectedYear,
          semester: selectedSemester,
          testtype: selectedTestType
        }));
        navigate('/markentry/report/failureReport/list?title=Student Report', { state: response.data });
      })
      .catch((error) => {
        console.error('Error fetching student report:', error);
      });
  };

  const getAbsenteesAndFailures = (course_id, checkDepartment) => {
    console.log("getting failures and absentees ... ");

    // Construct the query parameters
    const params = new URLSearchParams({
      semester: selectedSemester.label,
      year: selectedYear.value,
      type: selectedTestType.value,
    });
    if (course_id !== undefined) {
      params.append('course', course_id);
    }

    if (checkDepartment && department?.value !== undefined) {
      params.append('department', department.value);
    }


    axios.get(`${apiHost}/getAbsenteesAndFailures?${params}`).then((response) => {
      localStorage.setItem('dropdowns', JSON.stringify({
        regulation: selectedRegulation,
        year: selectedYear,
        semester: selectedSemester,
        testtype: selectedTestType
      }));
      console.log(response.data);
      navigate('/markentry/report/failureReport/list?title=Absentees and Failures Report', { state: response.data });
    }).catch((error) => {
      console.error('Error fetching absentees and failures:', error);
    });
  }



  return (
    <div className="container">

      <div className="dropdown-container">

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
        </div>
      </div>
      <div className='report'>
        {reportData?.length > 0 && (
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
              /> <Dropdown
                options={reportTypeOptions}
                placeholder="Report Type"
                value={selectedReportType}
                onChange={setSelectedReportType}
              />
              <Dropdown
                options={selectedRegulation ? departmentOptions : undefined}
                value={department}
                disabled={!selectedYear}
                onChange={setDepartment}
                placeholder="Department"
              />           <button
                onClick={downloadTableAsExcel}
                style={{
                  marginBottom: '25px', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', border: '1px solid #ccc'
                }}
              >
                Download as Excel
              </button>
            </div>

            <div className="table-wrapper">
              {
                (department && department.value) &&

                < button
                  onClick={() => {
                    switch (selectedReportType.label) {
                      case "Absentees":
                        getAbsentees(undefined, true);
                        break;
                      case "Mark Analysis":
                        getMarkList(undefined, true);
                        break;
                      case "Failures":
                        getFailures(undefined, true);
                        break;
                      case "Absentees + Failures":
                        getAbsenteesAndFailures(undefined, true);
                        break;
                      default:
                        break;
                    }
                  }}
                  style={{
                    marginBottom: '25px', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', border: '1px solid #ccc'
                  }}
                >
                  Get Full {selectedReportType.label} Report for {department.label}
                </button>


              } {
                (department && department.value) &&

                < button
                  onClick={() => {
                    getStudentsReport(true);
                  }}
                  style={{
                    marginBottom: '25px', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', border: '1px solid #ccc'
                  }}
                >
                  Get Full Student Report for {department.label}
                </button>


              }
              {
                (selectedYear && selectedYear.value) &&

                < button
                  onClick={() => {
                    getStudentsReport();
                  }}
                  style={{
                    marginBottom: '25px', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', border: '1px solid #ccc'
                  }}
                >
                  Get Full Student Report for year {selectedYear.label}
                </button>


              }
              {
                (selectedYear && selectedYear.value) &&

                < button
                  onClick={() => {
                    switch (selectedReportType.label) {
                      case "Absentees":
                        getAbsentees();
                        break;
                      case "Mark Analysis":
                        getMarkList();
                        break;
                      case "Failures":
                        getFailures();
                        break;
                      case "Absentees + Failures":
                        getAbsenteesAndFailures();
                        break;
                      default:
                        break;
                    }
                  }}
                  style={{
                    marginBottom: '25px', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', border: '1px solid #ccc'
                  }}
                >
                  Get Full {selectedReportType.label} Report for year {selectedYear.label}
                </button>


              }
              <table className="report-table">
                <thead>
                  <tr>
                    {
                      Object.keys(reportData[0]).map((title) => (
                        title != "course_id" &&

                        <th>{title}</th>

                      ))
                    }
                    {
                      selectedReportType.value != "markReport" &&
                      <th>
                        List
                      </th>
                    }
                  </tr>
                </thead>
                <tbody>

                  {reportData.filter(data => {

                    const searchString = searchTerm.toLowerCase();
                    return (
                      data.Department?.toLowerCase().includes(searchString) ||
                      data["Course Code"]?.toLowerCase().includes(searchString) ||
                      data["Course Name"]?.toLowerCase().includes(searchString)

                    );
                  })
                    .map((data, index) =>
                    (<tr key={index}>
                      {

                        Object.values(data).map((value, i) =>

                        (Object.keys(data)[i] != "course_id" &&
                          <td>{value}</td>
                        ))}
                      {
                        selectedReportType.value == "absenteesReport" &&
                        <td>< button
                          onClick={() => {
                            getAbsentees(data.course_id)
                          }}
                          style={{
                            marginBottom: '25px',
                            padding: '10px', backgroundColor: '#007bff',
                            color: 'white', borderRadius: '5px', border: '1px solid #ccc'
                          }}
                        >
                          Get List
                        </button>

                        </td>

                      } {
                        selectedReportType.value == "failureReport" &&
                        <td>< button
                          onClick={() => {
                            getFailures(data.course_id)
                          }}
                          style={{
                            marginBottom: '25px',
                            padding: '10px', backgroundColor: '#007bff',
                            color: 'white', borderRadius: '5px', border: '1px solid #ccc'
                          }}
                        >
                          Get List
                        </button>

                        </td>

                      } {
                        selectedReportType.value == "absenteesAndFailureReport" &&
                        <td>< button
                          onClick={() => {
                            getAbsenteesAndFailures(data.course_id)
                          }}

                          style={{
                            marginBottom: '25px',
                            padding: '10px', backgroundColor: '#007bff',
                            color: 'white', borderRadius: '5px', border: '1px solid #ccc'
                          }}
                        >
                          Get List
                        </button>

                        </td>

                      }
                    </tr >


                    ))
                  }


                </tbody>
              </table>
            </div>
          </div>
        )
        }
      </div >

    </div >
  );
}

export default Report;
