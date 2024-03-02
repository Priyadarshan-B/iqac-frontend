import React, { useState } from "react";
import apiHost from "../../utils/api";
import InputBox from "../../components/InputBox/inputbox";
import "./form.css";
// import { useNavigate } from "react-router-dom";

function RegulationForm() {
    const [regulationValue, setRegulationValue] = useState("");
    // const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Post the regulation value to the backend
            const response = await fetch(`${apiHost}/api/rf/regulation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ regulation: regulationValue }),
            });

            if (response.ok) {
                console.log("Regulation submitted successfully");
                // navigate("/facultymap");
                setRegulationValue("");
            } else {
                console.error("Failed to submit regulation");
            }
        } catch (error) {
            console.error("Error submitting regulation:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <InputBox
                    type="text"
                    value={regulationValue}
                    onChange={(e) => setRegulationValue(e.target.value)}
                    placeholder="Enter Regulation"
                />
                <button type="submit" className="button">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default RegulationForm;
