import React, { useState, useEffect, useRef } from 'react';
import '../resources/createBill.css';
import { FaPhoneAlt, FaHome, FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import moment from 'moment/moment';
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useReactToPrint } from 'react-to-print';
import { useSelector } from 'react-redux';
import DatePicker from "react-datepicker";
import html2pdf from 'html2pdf.js';
import "react-datepicker/dist/react-datepicker.css";

import sign from "../Assets/signature.png"

const CreateBill = (customer) => {
  const apiURL = process.env.REACT_APP_API_URL
  const userData = useSelector(state => state.user.userData)
  console.log("userData")
  console.log(userData.address[0])
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [firmName, setFirmName] = useState("");
  const [firmAdd, setFirmAdd] = useState("");
  const [phone, setPhone] = useState("");
  const [gst, setGst] = useState("");
  const [amount, setAmount] = useState("0");
  const [totalAmount, setTotalAmount] = useState("0");
  const [sasCode, setSasCode] = useState("");
  const [sameState, setSameState] = useState(false)
  const [open, setOpen] = React.useState(false);
  const [startDate, setStartDate] = useState(moment().format());
  const [yourAddress , setYourAddress] = useState("")
  // const [includeInLedger , setIncludeInLedger] = useState(true)

  const [rows, setRows] = useState([
    { sno: 1, date: '', awd: '', deliveryDist: '', box: '', weight: '', rate: '', mode: '' }
  ]);


  const inputStyle = {
    border: 'none',
    padding: '0.375rem',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    borderRadius: '0',
    boxShadow: 'none',
    background: 'transparent',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  };

  const location = useLocation()
  let { billData } = location?.state || null

  if (billData) {
    customer = billData.customer
  } else {
    customer = location?.state?.customer || null
  }

  useEffect(()=>{
    const temp =
        userData.otherData.address.houseno +
        ", " +
        userData.otherData.address.locality +
        ", " +
        userData.otherData.address.city +
        ", " +
        userData.otherData.address.state +
        "-" +
        userData.otherData.address.pin +
        ", " +
        userData.otherData.address.country;
        setYourAddress(temp)
  },[userData])

  useEffect(() => {
    if (customer) {
      const address =
        customer.address[0].houseno +
        ", " +
        customer.address[0].locality +
        ", " +
        customer.address[0].city +
        ", " +
        customer.address[0].state +
        "-" +
        customer.address[0].pin +
        ", " +
        customer.address[0].country;

      setFirmAdd(address);
      setFirmName(customer.name);
      setSasCode(userData.otherData.firmDetails.SAScode)
      setGst(customer.gst);
      setPhone(customer.phone)
      if (customer.address[0].state === "Uttar Pradesh") {
        setSameState(true)
      }
    }

    if (billData) {
      setRows(billData.item)
      calculateTotalAmount(billData.item)
      setFirmAdd(billData.customerData.address)
      setFirmName(billData.customerData.name);
      setGst(billData.customerData.gst);
      setPhone(billData.customerData.phone)
      setSasCode(billData.customerData.sasCode)
      setSameState(billData.customerData.sameState)
    }
  }, [customer , userData ]);

  const calculateTotalAmount = (rows) => {
    const total = rows.reduce((acc, row) => acc + parseFloat(row.rate || 0), 0);
    setAmount(total);
  };

  const addRow = () => {
    const newRow = { sno: rows.length + 1, date: '', awb: '', deliveryDist: '', box: '', weight: '', rate: '', mode: '' };
    const newRows = [...rows, newRow];
    setRows(newRows);
    calculateTotalAmount(newRows);
  };

  const subtractRow = () => {
    if (rows.length > 0) {
      const newRows = rows.slice(0, -1);
      setRows(newRows);
      calculateTotalAmount(newRows);
    }
  };

  const handleInputChange = (index, field, value) => {
    if (billData == null) {
      const newRows = [...rows];
      newRows[index][field] = value;
      setRows(newRows);
      calculateTotalAmount(newRows);
    }
  };

  const cancelBill = async () => {
    if (billData != null) {
      navigate('/bills')
    } else {
      navigate('/customers')
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (includeInLedger) => {
    setOpen(false);
    generateBill(includeInLedger)
  };

  const generateBill = async (includeInLedger) => {
    try {
      
      let apiData = {
        customerData : {
            address : firmAdd,
            name : firmName,
            gst : gst,
            phone : phone,
            sasCode : sasCode,
            sameState : sameState
            
        },
        id: customer.id,
        uuid : customer.uuid,
        item: rows,
        gst,
        tax : parseInt(Math.ceil(amount * 0.18).toFixed(2)) ,
        amount: parseInt(Math.ceil(amount * 1.18).toFixed(2)),
        totalAmount : parseInt(amount),
        updateLedger : includeInLedger,
        createdAt : startDate
      }
      
      let { data } = await axios.post(`${apiURL}/api/invoice/generate`, apiData ,{
        headers : {
          Authorization : `Bearer ${token}`
        },
        params:{
          userid : userData.id
        }
      })

      if(data){
        alert('Invoice Created')
      }
      navigate('/bills')
    } catch (error) {
      console.log('something went wrong', error)
      if(error.response.data.message == 'Token expired'){
        localStorage.removeItem('token')
          alert("Token Expired! Please login Again")
          window.location.reload();
      }
    }
  }

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDownloadPdf = () =>{
    generatePDF('main-block')
  }

  const handleDateChange = (date) => {
    let formattedDate = moment(date).format() ;
    setStartDate(formattedDate.slice(0,11) + "00:00:00+05:30")
  }

  const generatePDF = async (elementId) => {
    const element = document.getElementById(elementId);
    const opt = {
      margin : [1.5 ,1 , 1.5 ,1],
      filename: `${billData?.billNo}__${moment(billData.createdAt).format('DD/MM/YYYY')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2.8},
      jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };
    await html2pdf().set(opt).from(element).save();
  };

  return (
    <div>
    <div className='main-block' id='main-block'  ref={componentRef}>
      <div className='sub-block'>
        <h2 className='bill-heading text-center'>Tax Invoice</h2>

        <div className="detail-block">
          <h4>{(userData.otherData.firmDetails.firmName).toUpperCase()}</h4>
          <h5 className='text-capitalize'><FaHome /> {yourAddress}</h5>
          <h5><FaPhoneAlt />{userData.otherData.firmDetails.phone}</h5>
          <h5><span className='fw-bold'>GSTIN/UIN:-</span>{userData.otherData.firmDetails.gst}</h5>
        </div>

        <div className='receiver-detail-block d-flex'>
          <div className='col-8'>
            <h4 className='text-capitalize'>{firmName.toLowerCase()}</h4>
            <h5 className='text-capitalize'><FaHome /> {firmAdd.toLowerCase()}</h5>
            <h5><FaPhoneAlt /> {phone}</h5>
            <h5><span className='fw-bold'>GSTIN/UIN:-</span>{gst}</h5>
          </div>
          <div className='vl'></div>
          <div>
            <h5><span className='fw-bold'>Bill NO. :-</span>{billData?.billNo ? billData.billNo : " B*****"}</h5>
            <h5><span className='fw-bold'>Bill Date :- </span>{billData?.createdAt ? moment(billData.createdAt).format('DD/MM/YYYY') : <><DatePicker selected={startDate} onChange={(date)=>handleDateChange(date)}   dateFormat="dd/MM/YYYY" /></>}</h5>
            <h5><span className='fw-bold'>SAS Code :- </span>{billData?.customerData?.sasCode ? sasCode : sasCode}</h5>
          </div>
        </div>

        <div className='bill-item-block'>
          <table className="table table-striped table-bordered border border-2 border-dark">
            <thead>
              <tr>
                <th scope="col">S.No.</th>
                <th scope="col">Date</th>
                <th scope="col">AWB No.</th>
                <th scope="col">Delivery Dist</th>
                <th scope="col">Box</th>
                <th scope="col">Weight</th>
                <th scope="col">Rate</th>
                <th scope="col">Mode</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className=' fw-bold align-content-center'>{row.sno}</td>
                  <td className=' align-content-center'><span>{moment(startDate).format('DD/MM/YYYY')}</span></td>
                  <td><input type="text" value={row.awb} onChange={(e) => handleInputChange(index, 'awb', e.target.value)} style={inputStyle} /></td>
                  <td><input type="text" value={row.deliveryDist} onChange={(e) => handleInputChange(index, 'deliveryDist', e.target.value)} style={inputStyle} /></td>
                  <td><input type="text" value={row.box} onChange={(e) => handleInputChange(index, 'box', e.target.value)} style={inputStyle} /></td>
                  <td><input type="text" value={row.weight} onChange={(e) => handleInputChange(index, 'weight', e.target.value)} style={inputStyle} /></td>
                  <td><input type="text" value={row.rate} onChange={(e) => handleInputChange(index, 'rate', e.target.value)} style={inputStyle} /></td>
                  <td><input type="text" value={row.mode} onChange={(e) => handleInputChange(index, 'mode', e.target.value)} style={inputStyle} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {billData == null ? (
            <div className='w-100 text-center d-flex'>
              <hr className='w-50 mt-4' />
              <button onClick={addRow} className='btn mt-1'><FaPlusCircle /></button>
              <button onClick={subtractRow} className='btn mt-1'><FaMinusCircle /></button>
              <hr className='w-50 mt-4' />
            </div>
          ) : <></>}
        </div>

        <div className='total-block d-flex'>
          <div className='col-8'></div>
          <div className="invoice-summary col-4">
            <h3>Total<span>{amount} Rs.</span></h3>
            {sameState ? (<>
              <h3>SGST(9%)<span>{Math.ceil(amount * 0.09).toFixed(2)} Rs.</span></h3>
              <h3>CGST(9%)<span>{Math.ceil(amount * 0.09).toFixed(2)} Rs.</span></h3>
            </>
            ) : (
              <>
              <h3>IGST(18%)<span>{Math.ceil(amount * 0.18).toFixed(2)} Rs.</span></h3>
              </>
            )}
            <h3>Grand Total<span>{Math.ceil(amount * 1.18).toFixed(2)} Rs.</span></h3>
          </div>
        </div>

        <div className='stampAndCondition d-flex term-block'>
          <div className='col-8'>
            <h5>Terms & Conditions...</h5>
            <ul>
              <li><p>Please make payments via <span className='fw-bold'>cheque or NEFT</span> to <span className='fw-bold text-capitalize'>{userData.otherData.bankDetails.accountName.toLowerCase()}, A/C NO - {userData.otherData.bankDetails.accountNumber.toUpperCase()}, IFSCODE - {userData.otherData.bankDetails.IFSCcode.toUpperCase()}, {userData.otherData.bankDetails.bankName}, {userData.otherData.bankDetails.branch} , {userData.otherData.bankDetails.city} - {userData.otherData.bankDetails.pincode}</span></p></li>
              <li>All <span className='fw-bold'>payments are due within 30 days</span> of the invoice date. Late payments may incur additional charges.</li>
              <li>Please review the items and charges listed in this invoice carefully. <span className='fw-bold'>For any discrepancies or questions, contact us within 7 days of receipt.</span></li>
            </ul>
          </div>

          <div className='vl'></div>

          <div className='col-4 d-flex flex-column justify-content-between'>
            <div>
              <h5 className='fw-bold text-capitalize text-decoration-underline'>{userData.otherData.firmDetails.firmName}</h5>
            </div>
            <div className='stamp border border-2 p-2 border-primary-subtle  align-self-center' style={{width:"-WEBKIT-FILL-AVAILABLE", margin:"0 20px 0 20px", }}>
              <div className='text-primary text-capitalize'>For {userData.otherData.firmDetails.firmName.toLowerCase()}</div>
              <div className='Sign d-flex justify-content-center' ><img src={sign} height={"50"} width={"150"}  /></div>

              <div className=' d-flex justify-content-end text-primary'>Proprietor</div>

            </div>
            <div className='align-self-end'>
              Stamp & Signature
            </div>
          </div>
        </div>

      </div>
    </div>
      <div className='d-flex justify-content-end m-2'>
        <button className='btn btn-danger p-2 m-1 ' onClick={cancelBill}>Cancel</button>
        <button className='submit-button p-2 m-1 rounded-2'  onClick={billData ? () => { handleDownloadPdf(); handlePrint(); } : handleClickOpen}>{billData ? "Print" : "Generate Invoice"}</button>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Update Amount in Ledger"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Do you want to add the current bill amount to the customer's account debit section?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button onClick={()=>{handleClose(false)}}>Disagree</button>
          <button onClick={()=>{handleClose(true)}} autoFocus>
            Agree
          </button>
        </DialogActions>
      </Dialog>

<style>
  {
    `
    .react-datepicker-ignore-onclickoutside{
    width:120px;
    }
    
    .react-datepicker__input-container input{
      border:none;
      width:120px;
    }
    `
  }

    
</style>  
    </div>

);
};

export default CreateBill;
