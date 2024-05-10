import React from "react";
import { Route, Navigate } from "react-router-dom";

const AuthRoute = ({ element: Element, isAuthenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Element /> : <Navigate to="/login" />}
    />
  );
};

export default AuthRoute;
