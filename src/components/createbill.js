import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AppNavbar from "./navbar";
import { Link, useLocation } from "react-router-dom";

const Createbill = () => {
 const [open, setOpen] = useState(false);
 const [firmName, setFirmName] = useState("");
 const [firmAdd, setFirmAdd] = useState("");
 const [gstNo, setGstNo] = useState("");
 const [awdNo, setAwdNo] = useState("");
 const [deliveryDist, setDeliveryDist] = useState("");
 const [box, setBox] = useState("");
 const [weight, setWeight] = useState("");
 const [rate, setRate] = useState("");
 const [mode, setMode] = useState("");

 const location = useLocation();
 const data = location.state.data;

 console.log(data);

 useEffect(() => {
   if (data) {
     const address =
       data.address[0].locality +
       ", " +
       data.address[0].city +
       ", " +
       data.address[0].state +
       ", " +
       data.address[0].country;
     console.log(address);
     setFirmAdd(address);
     setFirmName(data.name);
   }
 }, [data]);

 const handleClose = () => {
   setOpen(false);
 };

 const handleClickOpen = () => {
   setOpen(true);
 };

 const generateInvoice = async () => {
   // Add your invoice generation logic here
 };

 return (
   <div className="d-flex flex-column w-100">
     <AppNavbar />
     <div>
       <div className="d-flex justify-content-center">
         <button onClick={handleClickOpen} className="btn bg-success">
           Open Invoice Form
         </button>
         <Dialog
           open={open}
           onClose={handleClose}
           PaperProps={{
             component: "form",
             onSubmit: (event) => {
               event.preventDefault();
               generateInvoice();
               handleClose();
             },
           }}
         >
           <DialogTitle className="fw-bold">Generate New Invoice</DialogTitle>
           <DialogContent>
             <div className="d-flex flex-column">
               <label className="m-2 fw-normal">Firm Name</label>
               <input
                 className="m-2 border-0 bg-body-secondary rounded-2"
                 type="text"
                 value={firmName}
                 disabled
               />
             </div>
             <div className="d-flex flex-column">
               <label className="m-2 fw-normal">Address</label>
               <input
                 className="m-2 border-0 bg-body-secondary rounded-2"
                 type="text"
                 value={firmAdd}
                 disabled
                 size={50}
               />
             </div>
             <div className="d-flex flex-column">
               <label className="m-2 fw-normal">GST NO.</label>
               <input
                 className="m-2 border-0 bg-body-secondary rounded-2"
                 type="text"
                 value={gstNo}
                 onChange={(e) => setGstNo(e.target.value)}
               />
             </div>
             <div className="d-flex flex-column">
               <label className="m-2 fw-normal">AWD NO.</label>
               <input
                 className="m-2 border-0 bg-body-secondary rounded-2"
                 type="text"
                 value={awdNo}
                 onChange={(e) => setAwdNo(e.target.value)}
               />
             </div>
             <div className="d-flex flex-column">
               <label className="m-2 fw-normal">Delivery Dist</label>
               <input
                 className="m-2 border-0 bg-body-secondary rounded-2"
                 type="text"
                 value={deliveryDist}
                 onChange={(e) => setDeliveryDist(e.target.value)}
               />
             </div>
             <div className="d-flex flex-column">
               <label className="m-2 fw-normal">Number of Box</label>
               <input
                 className="m-2 border-0 bg-body-secondary rounded-2"
                 type="text"
                 value={box}
                 onChange={(e) => setBox(e.target.value)}
               />
             </div>
             <div className="d-flex flex-column">
               <label className="m-2 fw-normal">Weight in KG</label>
               <input
                 className="m-2 border-0 bg-body-secondary rounded-2"
                 type="text"
                 value={weight}
                 onChange={(e) => setWeight(e.target.value)}
               />
             </div>
             <div className="d-flex flex-column">
               <label className="m-2 fw-normal">Rate</label>
               <input
                 className="m-2 border-0 bg-body-secondary rounded-2"
                 type="text"
                 value={rate}
                 onChange={(e) => setRate(e.target.value)}
               />
             </div>
             <div className="d-flex flex-column">
               <label className="m-2 fw-normal">Mode</label>
               <input
                 className="m-2 border-0 bg-body-secondary rounded-2"
                 type="text"
                 value={mode}
                 onChange={(e) => setMode(e.target.value)}
               />
             </div>
           </DialogContent>
           <DialogActions>
             <button
               onClick={handleClose}
               className="bg-danger text-light border-0 rounded-1"
             >
               Cancel
             </button>
             <button
               type="submit"
               className="button-custom text-light border-0 rounded-1"
             >
               Generate Invoice
             </button>
             <Link to="/addnewcustomer">
               <button className="btn bg-success">
                 Add New Customer
               </button>
             </Link>
           </DialogActions>
         </Dialog>
       </div>
     </div>
   </div>
 );
}

export default Createbill