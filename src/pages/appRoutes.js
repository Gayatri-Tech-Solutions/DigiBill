import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from '../components/sidebar';
import Header from "../components/header";
import Dashboard from "./dashboard";
import Customers from "./customers";
import Bills from "./bills";
const AppRoutes = () => {
  return (
    <div className="w-100">
      <div className="d-flex flex-column ">
        <div
          className="d-flex w-100 p-2  mt-0 "
          style={{ minHeight: "60px", zIndex:3 }}
        >
          <Header   />
        </div>
        <div className="d-flex ">
          <div className="d-flex " style={{ minWidth: "14%", maxWidth: "25%"  }}>
            <Sidebar  />
          </div>
          <div className="d-flex " style={{ minWidth: "86%" }}>
            <Routes>
              <Route exact path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              <Route path="/customers" element={<Customers />}/>
              <Route path="/bills" element={< Bills/>}/>
              
              {/* <Route path="*" element={<Navigate to={`/dashboard`} />} /> */}
              {/* <Route path="/reopen" element={<ReopenTicket />} /> */}
              {/* <Route path="/correspondence" element={<Correspondence />} /> */}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppRoutes