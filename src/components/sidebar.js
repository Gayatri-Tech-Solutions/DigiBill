// Sidebar.js

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { logout } from "../store/slice/ticketSlice";
import "../resources/sidebar.css";

import { MdDashboard } from "react-icons/md";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { IoCashOutline } from "react-icons/io5";
import { GrOrganization } from "react-icons/gr";

const Sidebar = () => {
  const [activePage, setActivePage] = useState("/dashboard");
  const [sideBar , setSideBar] = useState(true)
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const location = useLocation();
  
  useEffect(()=>{
    let path = location.pathname;
    console.log("path")
    console.log(path)
    setActivePage(location.pathname);

  },[location])
  const showPage = (value) => {
    setActivePage(value);
    navigate(value);
  };

  return sideBar ? (
    <>
        <div className="w-100 p-3">
          <div
            className={`sidebar-item ${activePage === "/dashboard" ? "active" : ""} d-flex`}
            onClick={() => showPage("/dashboard")}
          >
            <h4 className=" me-2"><MdDashboard /> </h4><strong><sub className=" fs-6">Dashboard</sub></strong>
          </div>
          <div
            className={`sidebar-item ${activePage === "/bills" || activePage === "/create-bill" ? "active" : ""} d-flex`}
            onClick={() => showPage("/bills")}
          >
           <h4 className=" me-2"><MdOutlineDocumentScanner /> </h4><strong><sub className=" fs-6">Bills</sub></strong>
          </div>
          <div
            className={`sidebar-item ${activePage === "/customers" ? "active" : ""} d-flex `}
            onClick={() => showPage("/customers")}
          > 
            <h4 className=" me-2"><IoPeopleSharp /> </h4><strong ><sub className=" fs-6">Customers</sub></strong>
          </div>

          <div
            className={`sidebar-item ${activePage === "/ledger" ? "active" : ""} d-flex`}
            onClick={() => showPage("/ledger")}
          >
            <h4 className=" me-2"><IoCashOutline /> </h4><strong><sub className=" fs-6">Ledger</sub></strong>
          </div>

          <div
            className={`sidebar-item ${activePage === "/organization-details" ? "active" : ""} d-flex `}
            onClick={() => showPage("/organization-details")}
          >
            <h4 className=" me-2"><GrOrganization /></h4><strong><sub className=" fs-6"> Organization</sub></strong>
          </div>
        </div>
    </>
  ) : null;
};

export default Sidebar;