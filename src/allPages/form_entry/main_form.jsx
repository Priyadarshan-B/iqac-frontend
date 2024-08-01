import React, { useState } from "react";
import RegulationForm from "../forms/regulation_form";
import DegreeForm from "../forms/degree_from";
import BranchForm from "../forms/branch";
import CourseForm from "../forms/course";
import CategoryForm from "../forms/category";
import UnitForm from "../forms/unit";
import OutcomeForm from "../forms/outcome";
import ObjectiveForm from "../forms/objective";
import CoPoMap from "../forms/co_po_map";
import Button from "../../components/Button/button";
import '../../components/appLayout/appLayout.css'
import '../dashboard/Dashboard.css'


function MainForm() {
  const [showForm, setShowForm] = useState(null);

  const toggleForm = (formName) => {
    setShowForm((prevForm) => (prevForm === formName ? null : formName));
  };

  return (
    <div className="dashboard-container">
      <h1>Main Form</h1>
      <div className="form" style={{
        display:'flex'
      }}>
        <Button onClick={() => toggleForm("regulation")} label="Regulation" />
        <Button onClick={() => toggleForm("degree")} label="Degree" />
        <Button onClick={() => toggleForm("branch")} label="Branch" />
        <Button onClick={() => toggleForm("course")} label="Course" />
        <Button onClick={() => toggleForm("category")} label="Category" />
        <Button onClick={() => toggleForm("unit")} label="Unit" />
        <Button onClick={() => toggleForm("co")} label="Co" />
        <Button onClick={() => toggleForm("objective")} label="Objective" />
        <Button onClick={() => toggleForm("copo")} label="Copo" />



      </div>            


      {showForm === "regulation" && <RegulationForm />}
      {showForm === "degree" && <DegreeForm />}
      {showForm === "branch" && <BranchForm />}
      {showForm === "course" && <CourseForm />}
      {showForm === "category" && <CategoryForm />}
      {showForm === "unit" && <UnitForm />}
      {showForm === "co" && <OutcomeForm />}
      {showForm === "objective" && <ObjectiveForm />}
      {showForm === "copo" && <CoPoMap />}







    </div>
  );
}

export default MainForm;
