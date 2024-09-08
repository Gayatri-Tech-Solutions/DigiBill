import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userData } from "../store/slice/userSlice";
import image from "../Assets/login.jpg";
import OtherDataModal from "../components/otherDetails";
import Loader from "../components/loader";


const apiURL = process.env.REACT_APP_API_URL
const LoginPage = ({ setLoggedin }) => {
  console.log("apiURL")
  console.log(apiURL)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userdata, setUserdata] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);//variable name , function to set variable value
  const [showIdAlert, setShowIdAlert] = useState(false);//variable name , function to set variable value
  const [showLoading, setShowLoading] = useState(false)
  const getUserDetails = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      setShowLoading(true)
      try {
        let { data } = await axios.get(`${apiURL}/api/user/user-details`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        dispatch(userData(data.data));
        setShowLoading(false)
      } catch (error) {
        setShowLoading(false)
        console.log("Something went wrong", error)
        if (error.response.data.message == 'Token expired') {
          localStorage.removeItem('token')
          alert("Token Expired! Please login Again")
          window.location.reload();
        }
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getUserDetails();
    };
    fetchData();
  }, [])




  const onSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true)
    try {
      const bodyData = { email, password };
      const { data } = await axios.post(`${apiURL}/api/user/login`, bodyData);


      localStorage.setItem("token", data.data.token);

      console.log("data.data")
      console.log(data.data)
      dispatch(userData(data.data));
      navigate('/dashboard');
      // setLoggedin(true);
      setShowLoading(false)
      setShowAlert(false);
    } catch (error) {
      setShowLoading(false)
      setShowAlert(true);
      console.log(error)
      console.log(error.response.data.error)
      if(error.response.data.error == "Incorrect Password" || error.response.data.error == "Email Not Found"){
        setShowIdAlert('true')
      }
      
    }
  };

  return (
    showLoading ? 
      <>
      <div>
        <Loader/>
      </div> 
      </>:
      <div className="d-flex justify-content-center w-100 p-4" style={{ height: "100vh" }}>
      <div className="d-flex justify-content-end me-2 w-40 h-100 rounded-4">
        <div className="text-justify w-50 m-5">
          {showAlert &&  (
            showIdAlert ?
             <>
            <div className="alert alert-warning mt-3" role="alert">
              <strong>Wrong Email Id or Password.</strong>Please Check your email id and password , If the problem persist contact System Admin
            </div> 
             </> : 
             <>
            <div className="alert alert-warning mt-3" role="alert">
              <strong>Something Went Wrong.</strong> Please try again later, If the problem persist contact System Admin
            </div>
             </>
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
      <OtherDataModal open={editModalOpen} userdata={userdata} handleClose={() => { setEditModalOpen(false) }} />

    </div>    
  );
};

export default LoginPage;
