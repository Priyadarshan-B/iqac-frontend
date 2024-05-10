import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiHost from "../../utils/api";

function Login() {
  const [token, setToken] = useState(null);

  const googleAuth = () => {
    window.open(`${apiHost}/auth/google`, "_self");
  };

  useEffect(() => {
    console.log("Token updated:", token);
  }, [token]);

  // const handleLogin = () => {
  //   // Perform login using JWT token
  //   // You can send the token to your backend for verification
  //   console.log("Logged in with token:", token);
  //   // Add your login logic here
  // };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div>
      <h1>Log in Form</h1>
      <div>
        {!token ? (
          <button onClick={googleAuth}>
            <span>Sign in with Google</span>
          </button>
        ) : (
          <div>
            <p>You are logged in!</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;

// import { Link } from "react-router-dom";
// import apiHost from "../../utils/api";

// function Login() {
//     const googleAuth = () => {
//     window.open(
//       `${apiHost}/auth/google/callback`,
//       "_self"
//     );

//   };
//   return (
//     <div >
//       <h1 >Log in Form</h1>
//       <div >

//           <button >Log In</button>
//           <p >or</p>
//           <button  onClick={googleAuth}>
//             <span>Sign in with</span>
//           </button>

//         </div>
//       </div>

//   );
// }

// export default Login;
