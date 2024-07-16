import React, { useState } from "react";
import apiHost from "../../utils/api";
import InputBox from "../../components/InputBox/inputbox";
import "./regulation_form.css"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegulationForm() {
    const [regulationValue, setRegulationValue] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiHost}/api/rf/regulation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ regulation: regulationValue }),
            });

            if (response.ok) {
                toast.success("Regulation submitted successfully", {
                    position: 'bottom-right'
                });
                console.log("Regulation submitted successfully");
                setRegulationValue("");
            } else {
                toast.error("Failed to submit regulation", {
                    position: 'bottom-right'
                });
                console.error("Failed to submit regulation");
            }
        } catch (error) {
            toast.error("Error submitting regulation", {
                position: 'bottom-right'
            });
            console.error("Error submitting regulation:", error);
        }
    };

    return (
        <div className="regulation-form-container">
            <ToastContainer />
            <form className="regulation-form" onSubmit={handleSubmit}>
                <InputBox
                    type="text"
                    value={regulationValue}
                    onChange={(e) => setRegulationValue(e.target.value)}
                    placeholder="Enter Regulation"
                />
                <button type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default RegulationForm;
