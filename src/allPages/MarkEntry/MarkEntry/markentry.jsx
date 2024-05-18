import React, { useState, useEffect } from "react";
import "./markentry.css";
import apiHost from "../../../utils/api";
import Dropdown from "../../../components/dropdown/dropdown";
import InputBox from "../../../components/InputBox/inputbox";
import Button from "../../../components/Button/button";
import { json } from "react-router-dom";

function Markentry() {
  const [academicyearOptions, setAcademicyearOptions] = useState([]);
  const [academicyear, setAcademicyear] = useState("");

  const [semesterOptions, setSemesterOptions] = useState([]);
  const [semester, setSemester] = useState("");

  const [yearOptions,setYearOptions]=useState([]);
  const [year,setYear]= useState(undefined)

  const [departmentOptions,setDepartmentOptions]=useState([]);
  const [department,setDepartment]= useState(undefined)

  const [testtypeOptions, setTestTypeOptions] = useState([]);
  const [testtype, setTestType] = useState("");

  const [subjectOptions, setSubjectOptions] = useState([]);
  const [subject, setSubject] = useState(undefined);

  const [facultyOptions, setFacultyOptions] = useState([]);
  const [faculty, setFaculty] = useState(1);

  const [coCount, setCoCount] = useState(0);

  const [courseoutcomeOptions, setCourseOutcomeOptions] = useState([]);
  const [courseoutcomes, setCourseOutcomes] = useState([]); // Array to hold maximum marks for each outcome
  const [marks, setMarks] = useState([]);
  const [students,setStudents] = useState([]);
  useEffect(() => {
    fetch(`${apiHost}/academic_years`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.year,
        }));
        setAcademicyearOptions(options);
      })
      .catch((error) =>
        console.error("Error fetching academic year data:", error)
      );

    fetch(`${apiHost}/semester`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.semester,
        }));
        setSemesterOptions(options);
      })
      .catch((error) => console.error("Error fetching semester data:", error));

    fetch(`${apiHost}/testtype`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.type,
          label: item.type,
        }));
        setTestTypeOptions(options);
      })
      .catch((error) => console.error("Error fetching test type data:", error));

   fetch(`${apiHost}/department`)
   .then((response)=>response.json())
   .then((data)=>{
    const options = data.map((res)=>     ( {
        value:res.id,
        label:res.branch
      }
    ))
    console.log(options)
    setDepartmentOptions(options)
   }
  )

  fetch(`${apiHost}/year`)
  .then((response)=>response.json())
  .then((data)=>{
   const options = data.map((res)=>     ( {
       value:res.id,
       label:res.year
     }
   ))
   console.log(options)
   setYearOptions(options)
  }
 )



    }, []);

useState(()=>{
  console.log(departmentOptions)
},[departmentOptions])
  const getFaculty  =  ()=>{
    fetch(`${apiHost}/faculty`)
    .then((response) => response.json())
    .then((data) => {
      const options = data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setFacultyOptions(options);
    })
    .catch((error) => console.error("Error fetching faculty data:", error));
  
  }
  const getCourse = (semester)=>{
    fetch(`${apiHost}/course?semester=${semester}&faculty=${faculty}&year=${academicyear.value}&branch=${department.value}`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setSubjectOptions(options);
      })
      .catch((error) => console.error("Error fetching subject data:", error));
  }
 const getCourseOutcomes = ()=>{
  fetch(`${apiHost}/co?course=${subject.value}`)
  .then((response)=>response.json())
  .then((data)=>{
    console.log(data)
    setCoCount(data.length)
  })
 }


 const getStudents = ()=>{
  console.log(subject);
  fetch(`${apiHost}/students?branch=${department.value}&year=${year.value}&course=${subject.value}`)
  .then((response)=>response.json())
  .then((data)=>{
       setStudents(data)
  }
)
 }
useEffect(()=>{
  setMarks(Array(coCount).fill(0));
  setCourseOutcomes(Array(coCount).fill(""));
},[coCount])




useEffect(()=>{
  if(subject){
    getCourseOutcomes();
  }
},[subject,year,semester,department])

useEffect(()=>{
  if(semester){
    getCourse(semester.value)
  }
},[semester,year])


useEffect(()=>{
  if(year && department && subject){
    getStudents();
  }
},[year,department,subject])
  const handleMaxMarkChange = (index, value) => {
    const updatedCourseOutcomes = [...courseoutcomes];
    updatedCourseOutcomes[index] = value;
    console.log(updatedCourseOutcomes)
    setCourseOutcomes(updatedCourseOutcomes);
  };

  const handleMarkChange = (index, value) => {
    if (value !== "" && parseInt(value) > parseInt(courseoutcomes[index])) {
      value = courseoutcomes[index];
    }
    const updatedMarks = [...marks];
    updatedMarks[index] = value;
    setMarks(updatedMarks);
  };

  const calculateTotal = () => {
    if (marks.length === 1 && !isNaN(marks[0])) {
      return parseInt(marks[0]);
    }
    let sum = 0;
    marks.forEach((mark) => {
      if (!isNaN(mark)) {
        sum += parseInt(mark);
      }
    });
    return sum;
  };
  const handleSemesterChange  = (e) => {
    setSemester(e);
  }
 
  // search bar
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const [searchTerm, setSearchTerm] = useState("");
  // const filteredFacultyList = facultyList.filter(
  //   (faculty) =>
  //     faculty.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     faculty.id.toString().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="container">
      <div className="dropdown-container">
        <div className="dropdowns">
          <Dropdown
            options={academicyearOptions}
            value={academicyear}
            onChange={setAcademicyear}
            placeholder=" Academic Year"
          /> 
           <Dropdown
          options={academicyear?yearOptions:undefined}
          value={year}
          isDisabled={!academicyear}
          onChange={setYear}
          placeholder=" Year"
        />
          <Dropdown
            options={academicyear?departmentOptions:undefined}
            value={department}
            isDisabled={!year}
            onChange={setDepartment}
            placeholder=" Department"
          />
          
          <Dropdown
            options={academicyear?semesterOptions:undefined}
            value={semester}
            isDisabled={!department}
            onChange={(e)=>handleSemesterChange(e)}
            placeholder=" Semester"
          />
          
          <Dropdown
            options={testtypeOptions}
            value={testtype}
            isDisabled={!semester}
            onChange={setTestType}
            placeholder="Test Type"
          />
          <Dropdown
            options={subjectOptions}
            value={subject}
            isDisabled={!semester}
            onChange={setSubject}
            placeholder="Subject"
          />
          <div className="facultyname">
            Faculty : John
          </div>
          {/* <Dropdown
            options={[...Array(10).keys()].map((count) => ({
              value: count + 1,
              label: `${count + 1}`,
            }))}
            value={{ value: selectedCount, label: `${selectedCount}` }}
            onChange={handleCountChange}
            placeholder="Select Count"
          /> */}
        </div>
      </div>

      <div className="white-containers">
        {console.log(courseoutcomes.length)}
        {courseoutcomes.length>0 && courseoutcomes.map((value, index) => (
          <div key={index} className="white-container">
            <div className="mark-and-button">
              <label>Course Outcome {index + 1} </label>
              <div className="mark">
                <label>Max Mark:</label>
                <InputBox
                  type="number"
                  value={value}
                  onChange={(e) => handleMaxMarkChange(index,e.target.value)}
                />
              </div>
              <div className="button">
                <Button label="Update" />
                <Button label="Delete" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="table-container">
        <InputBox
          type="text"
          placeholder="Student Name/Reg.."
          value={searchTerm}
          onChange={handleSearch}
        />
       { students.length>0 && <table className="table">
       <thead>
            <tr>
              <th>S.no</th>
              <th>Name</th>
              <th>Roll Number</th>
              {courseoutcomes.map((_, i) => (
                <th key={i}>Mark {i + 1}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
        {
          students.map((data,index)=>(
            <tbody>
            <tr>
              <td>{index+1}</td>
              <td>{data.name}</td>
              <td>{data.register_number}</td>
              {courseoutcomes.map((_, i) => (
                <td key={i}>
                  <input
                    type="number"
                    value={marks[i]}
                    max={courseoutcomes[i]}
                    onChange={(e) => handleMarkChange(i, e.target.value)}
                  />
                </td>
              ))}
              <td>{calculateTotal()}</td>
            </tr>
          </tbody>
          ))
        }
        
        </table>}
      </div>
    </div>
  );
}

export default Markentry;
