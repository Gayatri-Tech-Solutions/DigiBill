// Import necessary modules and hooks
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './App.css';
import AppRoutes from "./pages/appRoutes";
import LoginPage from "./pages/login-page";
import Register from "./pages/registerUser";
import ForgetPassword from "./pages/forget-password";
import { useSelector } from "react-redux";
import {validateOtherData} from './resources/otherdata-validation';
import OrganizationDetails from "./pages/organization-details";

function App() {
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const userData = useSelector((state) => state.user.userData);
  const [dataValidation, setDataValidation] = useState(false);

  // UseEffect to validate user data on change
  useEffect(() => {
      if (userData && userData.otherData && validateOtherData(userData.otherData)) {
        setDataValidation(true);
      } else {
        setDataValidation(false);
      }
  }, [userData]);

  return (
    <div className="main-routes">
      <Router>
        {loggedIn ? (
          dataValidation ? (
            <Routes>
            <Route path="*" element={<AppRoutes />} />
          </Routes>
          ) : (
            <Routes>
              <Route path="/organization-details" element={<OrganizationDetails />} />
              <Route path="*" element={<OrganizationDetails/>} />
            </Routes>
          )
        ) : (
         <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgetPassword" element={<ForgetPassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
