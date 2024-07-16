import React, { useState } from "react";
import apiHost from "../../utils/api";
import InputBox from "../../components/InputBox/inputbox";
import "./category.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CategoryForm() {
    const [category, setCategory] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiHost}/api/rf/course-category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: category }),
            });

            if (response.ok) {
                toast.success("category submitted successfully", {
                    position: 'bottom-right'
                });
                console.log("Category submitted successfully");
                setCategory("");
            } else {
                toast.error("Failed to submit categoty", {
                    position: 'bottom-right'
                });
                console.error("Failed to submit category");
            }
        } catch (error) {
            toast.error("Error submitting category", {
                position: 'bottom-right'
            });
            console.error("Error submitting category:", error);
        }
    };

    return (
        <div className="category-form-container">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="category-form">
                <InputBox
                    value={category}
                    type="text"
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                />
                <button type="submit" className="category-button">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default CategoryForm;
