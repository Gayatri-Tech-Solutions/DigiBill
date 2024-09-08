import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import image from "../Assets/register.jpg";
import { Verified } from "@mui/icons-material";
import Loader from "../components/loader";

const Register = () => {
  // const navigate = useNavigate()
  const apiURL = process.env.REACT_APP_API_URL
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [name , setName] = useState("");
  const [phone , setPhone] = useState("")
  const [showLoading, setShowLoading] = useState(false)
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true)
    try {
      let bodyData = {
        email,
        password,
        name ,
        phone,
        verified : false
      };

      let { data } = await axios.post(`${apiURL}/api/user/register`, bodyData);
      setShowAlert(false)
      setShowLoading(false)
      navigate('/login')
    } catch (error) {
      setShowLoading(false)
      console.log(error)
      setShowAlert(true);
      setShowAlert(true);
    }
  };

  return (
    showLoading ? <Loader/> :
    <>
      <div
        className="d-flex justify-content-center w-100 p-4"
        style={{ height: "100vh" }}
      >
        <div className="d-flex  justify-content-end  me-2  w-50  h-100 rounded-4">
          <div className=" text-justify w-50 m-5">
            {showAlert ? (
              <div className="alert alert-warning mt-3" role="alert">
                <strong>Something Went Wrong.</strong>Check your Email Id &
                Password, If the problem persist contact System Admin
              </div>
            ) : null}
            <h1 className="mb-3">Sign Up</h1>
            <div className="d-flex text-start">
              <form>
              <label className="mb-2 ">
                  <strong>UserName</strong>
                </label>
                <br />
                <input
                  className=" rounded-1 p-2 w-100 border-light  "
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />

                <label className="mb-2 ">
                  <strong>Email</strong>
                </label>
                <br />
                <input
                  className=" rounded-1 p-2 w-100 border-light  "
                  type="email"
                  placeholder="Example@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />

<label className="mb-2 ">
                  <strong>Phone</strong>
                </label>
                <br />
                <input
                  className=" rounded-1 p-2 w-100 border-light  "
                  type="text"
                  placeholder="Your Phone Number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />

                <label className="mb-2 mt-2 ">
                  <strong>Password</strong>
                </label>
                <br />
                <input
                  className=" rounded-1 p-2 w-100 border-light  "
                  type="password"
                  placeholder="at least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                

                <button
                  className="w-100 my-3 rounded-2 text-light "
                  style={{ backgroundColor: "rgb(47,52,121)" }}
                  onClick={(e) => {
                    onSubmit(e);
                  }}
                >
                  Sign Up
                </button>

                <div className="text-center my-3 ">or</div>

                <div>
                  <p>
                    Already have an account?<Link to={"/login"}> Sign In</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className=" w-50  ms-2">
          <h1>
            <img
              className="rounded-4 float-end"
              src={image}
              alt="Login Page Image"
              style={{ width: "85%", height: "93vh" }}
            />
          </h1>
        </div>
      </div>
    </>
  );
};

export default Register;
