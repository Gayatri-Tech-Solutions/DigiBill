import React, { useState } from 'react'
import { LuBadgeHelp } from "react-icons/lu";
import '../resources/accountdetailspage.css'
import Loader from "./loader.js"
import axios from 'axios';

import { useDispatch, useSelector } from "react-redux";
import { userData} from "../store/slice/userSlice";

const Accountdetails = ({data}) => {
 
  const apiURL = process.env.REACT_APP_API_URL
//  console.log(data)
 const  userDetails= useSelector(state=> state?.user?.userData)
 const token = localStorage.getItem('token')
  const dispatch = useDispatch();

 const [bankNameState, setBankName] = useState(data?.bankName || '');
  const [cityState, setCity] = useState(data?.city || '');
  const [branchState, setBranch] = useState(data?.branch || '');
  const [accountNameState, setAccountName] = useState(data?.accountName || '');
  const [accountNumberState, setAccountNumber] = useState(data?.accountNumber || '');
  const [ifscCodeState, setIFSCcode] = useState(data?.IFSCcode || '');
  const [pincodeState, setPincode] = useState(data?.pincode || '');
  const [editDetails , setEditDetails] = useState(false)
  const [editDetailsLoading, setEditDetailsLoading] = useState(false)
  

  const handleDetailsChange = async () =>{
    setEditDetails(false)
    setEditDetailsLoading(true)
    let otherData = {...userDetails.otherData}
    let id = userDetails.id
    console.log("otherData")
    console.log(otherData)
    let bankDetails = {
      "IFSCcode" : ifscCodeState,
      "accountName" : accountNameState,
      "accountNumber" : accountNumberState,
      "bankName" : bankNameState,
      "branch" : branchState,
      "city" : cityState,
      "pincode" : pincodeState
    }
    otherData.bankDetails = bankDetails
    console.log("updated otherData")
    console.log(otherData)
    try{
      let {data} = await axios.post(`${apiURL}/api/user/update`,{otherData , id},{
        headers : {
          Authorization : `Bearer ${token}`
        },
      })
      console.log("data")
      console.log(data)
      dispatch(userData(data.data));
      setEditDetailsLoading(false)
    }catch(err){
      alert("something went wrong")
      console.log(err)
      setEditDetailsLoading(false)
    }
  } 

 
 return (
  <>
  {editDetailsLoading ? <Loader/> : 
  <>
  <div className="bills-header d-flex justify-content-between m-3">
    <div>
     <h4>Firm Bank Account Details <LuBadgeHelp   data-bs-toggle="tooltip" data-bs-placement="right" title="These Bank Details will be used on invoice " /></h4>
    </div>

    <div className='d-flex me-3'>
     <div className='me-2'><button onClick={() => {setEditDetails(true)}}>Edit Details</button></div>
     {editDetails ? <div><button onClick={()=>{handleDetailsChange()}}>Save Details</button></div> : <></>}
    </div>
    

    </div>

    <div className='details m-4 mx-5'>
     <div className='d-flex details-input justify-content-between m-3'>
       <h5>Bank Name : </h5>
       <input className=' text-capitalize ' type='text' value={bankNameState.toLowerCase()} onChange={(e)=>{setBankName(e.target.value)}} disabled={editDetails ? false : true} />
     </div>

     <div className="d-flex details-input justify-content-between m-3">
       <h5>IFSC Code :</h5>
       <input className=' text-capitalize' type='text' value={ifscCodeState.toUpperCase()} onChange={(e)=>{setIFSCcode(e.target.value)}} disabled={editDetails ? false : true}/>
     </div>

     <div className="d-flex details-input justify-content-between m-3">
        <h5>Account Number : </h5>
       <input className=' text-capitalize' type='text' value={accountNumberState.toLowerCase()} onChange={(e)=>{setAccountNumber(e.target.value)}} disabled={editDetails ? false : true}/>
     </div>

     <div className="d-flex details-input justify-content-between m-3">
       <h5>Account Name : </h5>
       <input className=' text-capitalize' type='text' value={accountNameState.toLowerCase()} onChange={(e)=>{setAccountName(e.target.value)}} disabled={editDetails ? false : true}/>
     </div>

     <div className="d-flex details-input justify-content-between m-3">
       <h5>Bank Branch : </h5>
       <input className=' text-capitalize' type='text' value={branchState.toUpperCase()} onChange={(e)=>{setBranch(e.target.value)}} disabled={editDetails ? false : true}/>
     </div>

     <div className="d-flex details-input justify-content-between m-3">
       <h5>City : </h5>
       <input className=' text-capitalize' type='text' value={cityState.toUpperCase()} onChange={(e)=>{setCity(e.target.value)}} disabled={editDetails ? false : true}/>
     </div>
     
     <div className="d-flex details-input justify-content-between m-3">
       <h5>Pincode : </h5>
       <input className=' text-capitalize' type='text' value={pincodeState.toUpperCase()} onChange={(e)=>{setPincode(e.target.value)}} disabled={editDetails ? false : true}/>
     </div>

   </div>
  </>
  }
  </>
 )
}

export default Accountdetails