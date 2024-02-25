import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    setIsLoggedIn(true);
    // Handle successful login
  };

  const onError = () => {
    console.log('Login Failed');
    // Handle login failure
  };

  const handleLogout = () => {
    googleLogout();
    setIsLoggedIn(false);
    // Handle logout
  };

  return (
    <GoogleOAuthProvider 
      clientId="207769143225-vbmg55s3k3evs99vapl9a8uvql9essg1.apps.googleusercontent.com"
    >
      <div>
        {isLoggedIn ? (
          <div>
            <h2>Logged in with Google</h2>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <h2>Sign in with Google</h2>
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onError}
            />
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
