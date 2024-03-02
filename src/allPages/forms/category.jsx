import React, { useState } from "react";
import apiHost from "../../utils/api";
import InputBox from "../../components/InputBox/inputbox";
import "./form.css";

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
                console.log("Category submitted successfully");
                setCategory("");
            } else {
                console.error("Failed to submit category");
            }
        } catch (error) {
            console.error("Error submitting category:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <InputBox
                    value={category}
                    type="text"
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                />
                <button type="submit" className="button">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default CategoryForm;
