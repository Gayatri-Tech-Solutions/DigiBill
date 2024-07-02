import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { apiURL } from "../env";
import { useNavigate ,Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userData} from "../store/slice/userSlice";
import image from "../Assets/login.jpg";

const LoginPage = ({ setLoggedin }) => {
  const [email, setEmail] = useState("rudraptap");
  const [password, setPassword] = useState("");

  const [showAlert, setShowAlert] = useState(false);//variable name , function to set variable value
  
  const getUserDetails = async() =>{
    const token = localStorage.getItem('token')
    if(token){
      console.log("token exist")
      try{
        let {data} = await axios.get(`${apiURL}/api/user/user-details`,{
          headers : {
            Authorization : `Bearer ${token}`
          }
        }) 
        console.log("API CALLED")
        console.log(data.data)
        // localStorage.setItem("token", data.data.token);
      dispatch(userData(data.data));
      navigate('/dashboard');
      }catch(error){
         console.log("Something went wrong",error) 
      }
    }
  }

  useEffect(()=>{
    getUserDetails()
  },[])


  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyData = { email, password };
      const { data } = await axios.post(`${apiURL}/api/user/login`, bodyData);
      console.log("data")
      console.log(data.data)

      localStorage.setItem("token", data.data.token);
      
      dispatch(userData(data.data));
      // setLoggedin(true);
      navigate('/dashboard');
      setShowAlert(false);
    } catch (error) {
      setShowAlert(true);
    }
  };

  return (
    <div className="d-flex justify-content-center w-100 p-4" style={{ height: "100vh" }}>
      <div className="d-flex justify-content-end me-2 w-40 h-100 rounded-4">
        <div className="text-justify w-50 m-5">
          {showAlert && (
            <div className="alert alert-warning mt-3" role="alert">
              <strong>Something Went Wrong.</strong> Check your Email Id & Password, If the problem persist contact System Admin
            </div>
          )}
          <h1 className="mb-3">Welcome Back&#128075;</h1>
          <p className="mb-4">Today is a new day. It's your day. You shape it. Sign in to start managing your projects.</p>
          <div className="d-flex text-start">

            <form onSubmit={onSubmit}>

              <label className="mb-2"><strong>Email</strong></label>
              <input className="rounded-1 p-2 w-100 border-light" type="email" placeholder="Example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              
              <label className="mb-2 mt-2"><strong>Password</strong></label>
              <input className="rounded-1 p-2 w-100 border-light" type="password" placeholder="at least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
              
              <div className="w-100 mt-4">
                <Link className="float-end" to="/forgetPassword">Forget Password</Link>
              </div>

              <button className="w-100 my-3 rounded-2 text-light" style={{ backgroundColor: "rgb(47,52,121)" }} type="submit">
                Sign In
              </button>
              <div className="text-center my-3">or</div>
              <div>
                <p>Don't you have an account? <Link to='/register'>Sign up</Link></p>
              </div>
            </form>

          </div>
        </div>
      </div>
      <div className="w-50 ms-2">
        <img className="rounded-4 float-end" src={image} alt="Login Page Image" style={{ width: "85%", height: "93vh" }} />
      </div>
    </div>
  );
};

export default LoginPage;
