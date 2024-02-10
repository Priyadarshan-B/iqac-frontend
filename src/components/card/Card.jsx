import React from 'react';
import './Card.css'; // Don't forget to import your CSS file

const Card = (props) => {
    return (
        <div className="card">
            <div className="card-header">
                <h2>{props.title}</h2>
            </div>
            <br></br>
            <div className='card-image-container'>
                <img src={props.image} alt={props.title} className="card-image" />
            </div>
            <br></br>
            <div className="card-body">
                <p>{props.description}</p>
            </div>
        </div>
    );
};

export default Card;
