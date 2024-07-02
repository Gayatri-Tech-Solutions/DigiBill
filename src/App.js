import {BrowserRouter as Router , Route , Routes, useSearchParams} from "react-router-dom"
import { useState } from "react";
import './App.css';
import AppRoutes from "./pages/appRoutes";
import LoginPage from "./pages/loginpage";
import Register from "./pages/registerUser";
import ForgetPassword from "./pages/forgetpassword";
import { useSelector } from "react-redux";

function App() {
  // const [loggedIn , setLoggedIn] = useState(false)
  const loggedIn = useSelector(state=>state.user.loggedIn)
  console.log(loggedIn)

  const token = localStorage.getItem("token")
  

  return(

    <div className="main-routes">
      <Router>
        {loggedIn ?
        <AppRoutes/> 
        :
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="*" element={<LoginPage/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgetPassword" element={<ForgetPassword/>} />
        </Routes>
      }
      </Router>
      
      
      </div>
    )
  }
  
  export default App;
  
  {/* <Route path="/" element={</>} /> */}