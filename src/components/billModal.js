// import React, { useState, useEffect } from "react";
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import { apiURL } from "../env";
// import axios from "axios";
// import '../resources/modal.css';

// const BillModal = ({ open, handleClose, customer }) => {
//   const [awd, setAwd] = useState("");
//   const [deliverydist, setDeliverydist] = useState("");
//   const [box, setBox] = useState("");
//   const [weight, setWeight] = useState("");
//   const [rate, setRate] = useState("");
//   const [mode, setMode] = useState("");
  
//   const [firmName, setFirmName] = useState("");
//   const [firmAdd, setFirmAdd] = useState("");
//   const [gst, setGst] = useState("");
//   useEffect(() => {
//     if (customer) {
//       const address = 
//         customer.address[0].houseno + 
//         ", " + 
//         customer.address[0].locality + 
//         ", " + 
//         customer.address[0].city + 
//         ", " + 
//         customer.address[0].state + 
//         ", " + 
//         customer.address[0].country;

//       setFirmAdd(address);
//       setFirmName(customer.name);
//       setGst(customer.gst);
//     }
//   }, [customer]);

//   const submit = async (e) => {
//     e.preventDefault();

//     try {
//       let apiData = {
//         customerId: customer.id,
//         gst,
//         awd,
//         deliverydist,
//         box,
//         weight,
//         rate,
//         mode
//       };

//       let { data } = await axios.post(`${apiURL}/api/invoice/generate`, apiData);
//       console.log(data);
//       closeModal();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const closeModal = () => {
//     setFirmName("");
//     setFirmAdd("");
//     setGst("");
//     setAwd("");
//     setDeliverydist("");
//     setBox("");
//     setWeight("");
//     setRate("");
//     setMode("");
//     handleClose();
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={closeModal}
//     >
//       <DialogTitle>{customer ? "Create Bill" : "Add New Customer"}</DialogTitle>
//       <DialogContent>
//         <form onSubmit={submit}>
//           <div className="w-100 m-3">
//             <div>
//               <label>Firm Name</label>
//             </div>
//             <div>
//               <input
//                 className="input"
//                 type="text"
//                 value={firmName}
//                 disabled
//               />
//             </div>
//           </div>

//           <div className="w-100 m-3">
//             <div>
//               <label>Address</label>
//             </div>
//             <div>
//               <input
//                 className="input"
//                 type="text"
//                 value={firmAdd}
//                 disabled
//                 size={50}
//               />
//             </div>
//           </div>

//           <div className="w-100 m-3">
//             <div>
//               <label>GST NO.</label>
//             </div>
//             <div>
//               <input
//                 className="input"
//                 type="text"
//                 value={gst}
//                 disabled
//               />
//             </div>
//           </div>

//           <div className="w-100 m-3">
//             <div>
//               <label>AWD NO.</label>
//             </div>
//             <div>
//               <input
//                 className="input"
//                 type="text"
//                 value={awd}
//                 onChange={(e) => setAwd(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="w-100 m-3">
//             <div>
//               <label>Delivery Dist</label>
//             </div>
//             <div>
//               <input
//                 className="input"
//                 type="text"
//                 value={deliverydist}
//                 onChange={(e) => setDeliverydist(e.target.value.toUpperCase())}
//               />
//             </div>
//           </div>

//           <div className="w-100 m-3">
//             <div>
//               <label>Number of Box</label>
//             </div>
//             <div>
//               <input
//                 className="input"
//                 type="text"
//                 value={box}
//                 onChange={(e) => setBox(parseInt(e.target.value))}
//               />
//             </div>
//           </div>

//           <div className="w-100 m-3">
//             <div>
//               <label>Weight in KG</label>
//             </div>
//             <div>
//               <input
//                 className="input"
//                 type="text"
//                 value={weight}
//                 onChange={(e) => setWeight(parseFloat(e.target.value))}
//               />
//             </div>
//           </div>

//           <div className="w-100 m-3">
//             <div>
//               <label>Rate</label>
//             </div>
//             <div>
//               <input
//                 className="input"
//                 type="text"
//                 value={rate}
//                 onChange={(e) => setRate(parseInt(e.target.value))}
//               />
//             </div>
//           </div>

//           <div className="w-100 m-3">
//             <div>
//               <label>Mode</label>
//             </div>
//             <div>
//               <input
//                 className="input"
//                 type="text"
//                 value={mode}
//                 onChange={(e) => setMode(e.target.value.toUpperCase())}
//               />
//             </div>
//           </div>

//           <div className="w-100 d-flex flex-column align-items-end">
//             <div className="col-8"></div>
//             <div className="col-4">
//               <div className="d-flex justify-content-between">
//                 <h6>Rate: </h6>
//                 <h6>{rate}</h6>
//               </div>
//               <div className="d-flex justify-content-between">
//                 <h6>Tax: </h6>
//                 <h6>9%</h6>
//               </div>
//               <div className="d-flex justify-content-between">
//                 <h5>Total: </h5>
//                 <h5>{new Intl.NumberFormat('en-IN').format(Math.ceil(rate + (rate * 0.09))) || 0}</h5>
//               </div>
//             </div>
//           </div>

//           <DialogActions>
//             <button
//               type="button"
//               onClick={closeModal}
//               className="bg-danger text-light border-0 rounded-1"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="button-custom text-light border-0 rounded-1"
//             >
//               {customer ? "Create Bill" : "Add Customer"}
//             </button>
//           </DialogActions>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default BillModal;
