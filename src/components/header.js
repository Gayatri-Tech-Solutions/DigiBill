// Header.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, SideNav, SimApps, SimLogo } from "../Assets/svg";
import { useSelector } from "react-redux";
import { userData } from "../store/slice/userSlice";
import "../resources/header.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { apiURL } from "../env";
import logo from '../Assets/logo.png'

const Header = ({ sideBar, setSideBar }) => {
  const adminData = localStorage.getItem("token");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState("");

  let token = localStorage.getItem("token");

  const headers = useMemo(()=>({
      Authorization: `Bearer ${token}`,
  }),[token])



  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  useEffect(() => {
    if (alert == "") {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setDropdownVisible(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, []);

  const handleClickOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLogoutOpen(false);
  };

  const handleSubmit = async () => {
    if (newPassword == confirmPassword) {
      let apiData = {
        type : "reset",
        email,
        password,
        newPassword,
      };

      try {
        let { data } = await axios.post(
          `${apiURL}/api/user/reset-password`,
          apiData,
        );
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowAlert(true);
        console.log(data)
        if(data.status == true ){
          setAlert("Password has been Changed");
        }else{
          setAlert(data.data)
        }
        setTimeout(() => {
          setShowAlert(false);
          setAlert("");
        }, 3000);
      } catch (error) {
        console.log(error);
        setShowAlert(true);
        setAlert("Something Went Wrong");
        setTimeout(() => {
          setShowAlert(false);
          setAlert("");
        }, 3000);
      }
    } else {
      setOpen(true);
      setShowAlert(true);
      setAlert("Password does not match");
      setTimeout(() => {
        setShowAlert(false);
        setAlert("Password has been Changed");
      }, 3000);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const userDetails = useSelector((state) => state.user.userData);

  useEffect(() => {
    setUserName(userDetails?.name);
    setEmail(userDetails?.email);
  }, [adminData]);

  return (
    <>
      <div className="w-100 d-flex flex-column justify-content-around ">
        {showAlert ? (
            <div
              class="alert alert-success z-5 justify-content-center "
              role="alert"
            >
              {alert}
            </div>
          )
         : 
          <></>
        }
      </div>
      <div className=" position-absolute d-flex w-100 bg-white header-main justify-content-center  ">
        <div>{/* sidenav button here  */}</div>
        <div>
          <img src={logo} alt="Logo" width={200} />
        </div>
        <div className="w-100 d-flex align-items-center">
          {/* <div className="search-container">
            <div className="search-icon">
              <Search />
            </div>
            <input
              type="text"
              placeholder="Search Something"
              className="search-input"
            />
          </div> */}

          <div className="d-flex flex-row-reverse align-items-center me-5 w-100">
            <div>
              <SimApps />
            </div>
            <div className="user-details">
              <div className="user-name">{userName}</div>
              <div className="user-role">Jay Logistic Services</div>
            </div>
            <div className="dropdown">
              <div onClick={() => toggleDropdown()}>
                <img
                  className="user-image mx-3 "
                  src="https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_640.png"
                  alt="User Avatar"
                />
              </div>
              {dropdownVisible && (
                <div
                  ref={dropdownRef}
                  className="dropdown-menu position-absolute  drop p-3 z-5 z-2 "
                  style={{ display: "block" }}
                >
                  <div className=" text-lowercase  fw-medium ">
                    {userDetails.email}
                  </div>
                  <div className=" dropdown-divider "></div>
                  <div>
                    <button
                      className="link-custom  bg-light z-5 "
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      Reset Password
                    </button>
                  </div>
                  <div className=" dropdown-divider logout-divider"></div>
                  <div>
                    <button
                      className="border-0 text-danger bg-transparent z-5"
                      onClick={() => {
                        setLogoutOpen(true);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              handleClose();
            },
          }}
        >
          <DialogTitle className="fw-bold">Reset Password</DialogTitle>
          <DialogContent>
            {alert == "" ? (
              <DialogContentText>
                To Reset your password fill the below details correctly.
              </DialogContentText>
            ) : (
              <DialogContentText>{alert}</DialogContentText>
            )}

            <div className="d-flex flex-column ">
              <label className="m-2 fw-normal">Email Id</label>
              <input
                className="m-2 border-0 bg-body-secondary rounded-2 "
                type="text"
                placeholder="for e.g Changed Priority from Low To High"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="d-flex flex-column">
              <label className="m-2 fw-normal">Old Password</label>
              <input
                className="m-2 border-0 bg-body-secondary rounded-2 "
                type="password"
                placeholder="Enter Your Current Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="d-flex flex-column">
              <label className="m-2 fw-normal">New Password</label>
              <input
                className="m-2 border-0 bg-body-secondary rounded-2 "
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="d-flex flex-column">
              <label className="m-2 fw-normal">Confirm Password</label>
              <input
                className="m-2 border-0 bg-body-secondary rounded-2 "
                type="password"
                placeholder="Confirm Your New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <button
              onClick={handleClose}
              className=" bg-danger text-light border-0 rounded-1"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleSubmit();
              }}
              className="button-custom text-light border-0 rounded-1"
            >
              Submit
            </button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={logoutOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to logout?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button className="button-custom m-3 px-5" onClick={handleClose}>
              No
            </button>
            <button
              className=" text-light bg-danger m-3 px-5"
              onClick={handleLogout}
              autoFocus
            >
              Yes
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Header;
