// import React from "react";
// import GoogleSignIn from "../../components/auth/auth";

// const Login =()=>{
//     return(
//         <div>
//             <GoogleSignIn/>
//         </div>
//     )
// }
// export default Login;

// login.jsx (or wherever your login component resides)

import React from 'react';
import axios from 'axios';

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/login'); // Ensure you use the correct path here
      // Redirect user to the URL provided by the backend for Google authentication
      window.location.href = response.data.redirectUrl;
    } catch (error) {
      console.error('Google login failed:', error.message);
      // Handle login failure
    }
  };

  return (
    <div>
      <h2>Sign in with Google</h2>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;

