import React, { useState, useEffect } from "react";
import apiHost from "../../utils/api";
import Dropdown from "../../components/dropdown/dropdown";
import InputBox from "../../components/InputBox/inputbox";
import "./branch.css"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BranchForm() {
    const [branch, setBranch] = useState("");
    const [degree, setDegree] = useState([]);
    const [regulation, setRegulation] = useState([]);
    const [regulationid, setRegulationid] = useState(null);
    const [degreeid, setDegreeid] = useState(null);

    const handleRegulationChange = (selectedRegulation) => {
        fetch(
            `${apiHost}/api/rf/dropdown/degree?regulation=${selectedRegulation.value}`
        )
            .then((response) => response.json())
            .then((data) => {
                const options = data.map((item) => ({
                    value: item.id,
                    label: item.degree,
                }));
                setDegree(options);
            })
            .catch((error) =>
                console.error("Error fetching degree dropdown", error)
            );
    };

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
            .catch((error) => console.log("error fetching the degree", error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiHost}/api/rf/branch`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    regulation: regulationid,
                    degree: degreeid,
                    branch: branch,
                }),
            });

            if (response.ok) {
                toast.success("Branch submitted successfully", {
                    position: 'bottom-right'
                });
                console.log("Data submitted successfully");
            } else {
                toast.error("Failed to submit branch ", {
                    position: 'bottom-right'
                });
                console.error("Failed to submit data");
            }
        } catch (error) {
            toast.error("Error submitting branch ", {
                position: 'bottom-right'
            });
            console.error("Error submitting data:", error);
        }
    };

    return (
        <div className="form-container">
             <div className="title">Branch Form</div>
             <ToastContainer />
            <form className="branch-form" onSubmit={handleSubmit}>
            <div className="flex-box">
                <Dropdown
                    className="select-field"
                    options={regulation}
                    onChange={(selectedOption) => {
                        handleRegulationChange(selectedOption);
                        setRegulationid(selectedOption.value);
                    }}
                    placeholder="Regulation"
                />
                <Dropdown
                    className="select-field"
                    options={degree}
                    onChange={(selectedOption) => {
                        setDegree(selectedOption);
                        setDegreeid(selectedOption.value);
                    }}
                    placeholder="Degree"
                />

                <InputBox
                    className="input-field"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="Enter Branch"
                    type="text"
                />
                <button type="submit" className="button-sub">
                    Submit
                </button>
                </div>
            </form>
        </div>
    );
}

export default BranchForm;
