import React from 'react';
import InputBox from '../InputBox/inputbox';

function MyForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputBox type="text" name="username" placeholder="Username" />
      <InputBox type="email" name="email" placeholder="Email" />
      <InputBox type="password" name="password" placeholder="Password" />
      <button type="submit">Submit</button>
    </form>
  );
}

export default MyForm;
