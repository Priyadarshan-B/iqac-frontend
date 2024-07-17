import React, { useState, useEffect } from "react";
import Dropdown from "../../components/dropdown/dropdown";
import apiHost from "../../utils/api";
import InputBox from "../../components/InputBox/inputbox";
import "./degree.css"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DegreeForm() {
    const [degree, setDegree] = useState("");
    const [regulation, setRegulation] = useState([]);
    const [selectedRegulationId, setSelectedRegulationId] = useState(null);

    useEffect(() => {
        fetch(`${apiHost}/api/rf/dropdown/regulation`)
            .then((response) => response.json())
            .then((data) => {
                const options = data.map((item) => ({
                    value: item.id,
                    label: item.regulation,
                }));
                setRegulation(options);
            })
            .catch((error) =>
                console.error("Error fetching regulation dropdown:", error)
            );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Post the regulation ID and degree value to the backend
            const response = await fetch(`${apiHost}/api/rf/degree`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    regulation: selectedRegulationId,
                    degree: degree,
                }),
            });

            if (response.ok) {
                toast.success("data submitted successfully", {
                    position: 'bottom-right'
                });
                console.log("Data submitted successfully");
                setDegree("");
                // Handle success, such as showing a success message or redirecting
            } else {
                toast.error("Failed to submit data", {
                    position: 'bottom-right'
                });
                console.error("Failed to submit data");
                // Handle error, such as displaying an error message
            }
        } catch (error) {
            toast.error("Error submitting data", {
                position: 'bottom-right'
            });
            console.error("Error submitting data:", error);
            // Handle error, such as displaying an error message
        }
    };

    return (
        <div className="degree-form-container">
             <div className="title">Degree Form</div>
             <ToastContainer />
            <form className="degree-form" onSubmit={handleSubmit}>
                <div className="flex-box">
                    <Dropdown
                        className="select-field"
                        options={regulation}
                        onChange={(selectedOption) => {
                            setRegulation(selectedOption);
                            setSelectedRegulationId(selectedOption.value);
                        }}
                        placeholder="Regulation"
                    />
                        <InputBox
                            className="input-field"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            placeholder="Enter Degree"
                            type="text"
                        />
                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DegreeForm;
