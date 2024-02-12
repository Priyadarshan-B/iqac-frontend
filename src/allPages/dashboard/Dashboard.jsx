import React from 'react'
import './Dashboard.css'
import Button from '../../components/Button/Button'
import Card from '../../components/card/Card'
import InputBox from '../../components/InputBox/inputbox'

function Dashboard() {

    const handleSubmit = (formData) => {
        // Handle form submission, e.g., send data to server
        console.log(formData);
      };
    return (
        <div className='dashboard-container'>
            Dashboard...
            <Button label='click' />
            <Card
                title="Display the title of the card over here"
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEX9pl8af7Y7nzBN_8gY3XmGZKCzkUOqRcod9oXuBf4g&s"
                description="sample card description."
            />
            <Button label='Button' />
            <Card
                title="Display the title of the card over here"
                image="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"
                description="sample card description."
            />
            <Button label='Button' />
            <Card
                title="Display the title of the card over here"
                image="https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510_640.jpg"
                description="sample card description."
            />
            <InputBox />
        </div>
    )
}

export default Dashboard
