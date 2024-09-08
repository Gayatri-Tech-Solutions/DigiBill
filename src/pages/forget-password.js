import React, { useEffect, useState } from 'react';
import image from '../Assets/forgetPassword.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const ForgetPassword = () => {
    const apiURL = process.env.REACT_APP_API_URL
    const userData = useSelector(state => state.user.userData)
    const token = localStorage.getItem('token')
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            let {data} = await axios.post(`${apiURL}/api/user/forgetPassword`, {
                email,
                type: 'forget'
            },{
                headers : {
                    Authorization : `Bearer ${token}`
                  },
                  params:{
                    id : userData.id
                  }
            });
            if (data.status === true) {
                setStatus("success");
                setTimeout(()=>{
                    navigate('/login')
                },2000)
            } else {
                setStatus("error");
            }

        } catch (error) {
            console.log(error.response.data.data);
            setStatus("error");
            if(error.response.data.message == 'Token expired'){
                localStorage.removeItem('token')
          alert("Token Expired! Please login Again")
          window.location.reload();
              }
        }
    };

    useEffect(() => { setStatus(""); }, []);

    return (
        <div
            className="d-flex justify-content-end w-100 p-4"
            style={{ height: "100vh" }}
            >
            <div className="d-flex justify-content-center me-2 w-40 h-100 rounded-4 mt-5">
                <div className="text-justify w-50 m-5">
                {
                    status === "success" ?
                        <div className="alert alert-success mt-3" role="alert">
                            Mail Sent Successfully
                        </div>
                        : (
                            status === "error" ?
                                <div className="alert alert-warning mt-3" role="alert">
                                    <strong>Something Went Wrong.</strong>Check your Email Id, If the problem persist contact System Admin
                                </div> : null
                        )
                }
                    <h1 className="mb-3">Forget Password</h1>
                    <p className="mb-4 mt-3">
                        <strong>Don't worry</strong> Just tell us your Email Id we will send you an email with New Password
                    </p>
                    <div className="d-flex text-start">
                        <form>
                            <label className="mb-2 ">
                                <strong>Email</strong>
                            </label>
                            <br />
                            <input
                                className="rounded-1 p-2 w-100 border-light"
                                type="email"
                                placeholder="Example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <div className="w-100 mt-4">
                                <Link className="float-end" to="/login">Login</Link>
                                <br />
                            </div>

                            <button
                                className="w-100 my-3 rounded-2 text-light"
                                style={{ backgroundColor: "rgb(47,52,121)" }}
                                onClick={onSubmit}
                            >
                                Forget Password
                            </button>

                            <div className="text-center my-3">or</div>

                            <div>
                                <p>
                                    Don't you have an account?<Link to='/register'> Sign up</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="w-50 ms-2">
                <h1>
                    <img
                        className="rounded-4 justify-content-around"
                        src={image}
                        alt="Login Page Image"
                        style={{ width: "85%", height: "93vh" }}
                    />
                </h1>
            </div>
        </div>
    )
}

export default ForgetPassword;
