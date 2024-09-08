import React, { useState } from 'react'
import { LuBadgeHelp } from "react-icons/lu";
import '../resources/accountdetailspage.css'
import Loader from "./loader.js"
import axios from 'axios';

import { useDispatch, useSelector } from "react-redux";
import { userData} from "../store/slice/userSlice";

const Firmdetails = ({ data }) => {
  const apiURL = process.env.REACT_APP_API_URL
  console.log("FIRM DETAILS")

  const  userDetails= useSelector(state=> state.user.userData)
  const token = localStorage.getItem('token')
  const dispatch = useDispatch();

  const [SAScode, setSAScode] = useState(data?.firmDetails?.SAScode || "");
  const [firmName, setFirmName] = useState(data?.firmDetails?.firmName || "");
  const [gst, setGst] = useState(data?.firmDetails?.gst || "");
  const [phone, setPhone] = useState(data?.firmDetails?.phone || "");
  const [stamp, setStamp] = useState(data?.firmDetails?.stamp || "");
  const [editDetails, setEditDetails] = useState(false)
  const [editDetailsLoading, setEditDetailsLoading] = useState(false)
  const [editAddress, setEditAddress] = useState(false)
  const [editAddressLoading, setEditAddressLoading] = useState(false)

  const [houseno, setHouseno] = useState(userDetails?.otherData?.address?.houseno || "");
  const [locality, setLocality] = useState(userDetails?.otherData?.address?.locality || "");
  const [city, setCity] = useState(userDetails?.otherData?.address?.city || "");
  const [state, setState] = useState(userDetails?.otherData?.address?.state || "");
  const [country, setCountry] = useState(userDetails?.otherData?.address?.country || "");
  const [pin, setPin] = useState(userDetails?.otherData?.address?.pin || "");
 

  const handleDetailsChange = async () =>{
    setEditDetails(false)
    setEditDetailsLoading(true)

    let otherData = {...userDetails.otherData}
    let id = userDetails.id
    console.log("otherData")
    console.log(otherData)
    let firmDetails ={
      SAScode : SAScode,
      phone : phone,
      firmName : firmName,
      gst : gst,
      stamp : otherData.firmDetails.stamp
    }
    otherData.firmDetails = firmDetails
    console.log("otherData")
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

  const handleAddressChange = async () =>{
    setEditAddress(false)
    setEditAddressLoading(true)
    let otherData = {...userDetails.otherData}
    let id = userDetails.id
    otherData.address={
      "houseno" : houseno,
      "locality" : locality,
      "city" : city,
      "state" : state,
      "country" : country,
      "pin" : pin
    }

    try{
      let {data} = await axios.post(`${apiURL}/api/user/update`,{otherData , id},{
        headers : {
          Authorization : `Bearer ${token}`
        },
      })
      dispatch(userData(data.data));
      setEditAddressLoading(false)
    }catch(err){
      alert("something went wrong")
      console.log(err)
      setEditAddressLoading(false)
    }
  } 

  return (
    <>
    {
      editDetailsLoading ?
      <Loader/> :
      <div className='firmdetails'>

        <div className="bills-header d-flex justify-content-between m-3">
          <div>
            <h4>Firm Details <LuBadgeHelp data-bs-toggle="tooltip" data-bs-placement="right" title="To make this software aligned with your needs this info is required" /></h4>
          </div>

          <div className='d-flex me-3'>
            <div className='me-2'><button onClick={() => { setEditDetails(true) }}>Edit Details</button></div>
            {editDetails ? <div><button onClick={()=>{handleDetailsChange()}}>Save Details</button></div> : <></>}
          </div>


        </div>

        <div className='details m-4 mx-5'>
          <div className='d-flex details-input justify-content-between m-3'>
            <h5>Firm Name : </h5>
            <input className=' text-capitalize ' type='text' value={firmName.toLowerCase()} onChange={(e) => { setFirmName(e.target.value) }} disabled={editDetails ? false : true} />
          </div>


          <div className="d-flex details-input justify-content-between m-3">
            <h5>Phone Number : </h5>
            <input className=' text-capitalize' type='text' value={phone.toLowerCase()} onChange={(e) => { setPhone(e.target.value) }} disabled={editDetails ? false : true} />
          </div>

          <div className="d-flex details-input justify-content-between m-3">
            <h5>GST Number : </h5>
            <input className=' text-capitalize' type='text' value={gst.toLowerCase()} onChange={(e) => { setGst(e.target.value) }} disabled={editDetails ? false : true} />
          </div>

          <div className="d-flex details-input justify-content-between m-3">
            <h5>SAS Code : </h5>
            <input className=' text-capitalize' type='text' value={SAScode.toUpperCase()} onChange={(e) => { setSAScode(e.target.value) }} disabled={editDetails ? false : true} />
          </div>

          {/* <div className="d-flex details-input justify-content-between m-3">
       <h5>Signature : </h5>
       <input className=' text-capitalize' type='file' value={stamp.toUpperCase()} onChange={(e)=>{setCity(e.target.value)}} disabled={editDetails ? false : true}/>
     </div> */}


        </div>

      </div>
    }
      
      {/* firm details div end here */}

      {
        editAddressLoading ?
        <Loader/>
            :
            <div className='firm-address'>

        <div className="bills-header d-flex justify-content-between m-3">
          <div>
            <h4>Firm Address </h4>
          </div>

          <div className='d-flex me-3'>
            <div className='me-2'><button onClick={() => { setEditAddress(true) }}>Edit Address</button></div>
            {editAddress ? <div><button onClick={()=>{handleAddressChange()}}>Save Address</button></div> : <></>}
          </div>


        </div>

        <div className='details m-4 mx-5'>
          
          <div className='d-flex details-input justify-content-between m-3'>
            <h5>House No./Plot No. : </h5>
            <input className=' text-capitalize ' type='text' value={houseno.toUpperCase()} onChange={(e) => { setHouseno(e.target.value) }} disabled={editAddress ? false : true} />
          </div>
          
          
          <div className='d-flex details-input justify-content-between m-3'>
            <h5>Locality : </h5>
            <input className=' text-capitalize ' type='text' value={locality.toLowerCase()} onChange={(e) => { setLocality(e.target.value) }} disabled={editAddress ? false : true} />
          </div>
          
          <div className='d-flex details-input justify-content-between m-3'>
            <h5>Country : </h5>
            <input className=' text-capitalize ' type='text' value={country.toLowerCase()} onChange={(e) => { setCountry(e.target.value) }} disabled={editAddress ? false : true} />
          </div>
          
          <div className='d-flex details-input justify-content-between m-3'>
            <h5>State : </h5>
            <input className=' text-capitalize ' type='text' value={state.toLowerCase()} onChange={(e) => { setState(e.target.value) }} disabled={editAddress ? false : true} />
          </div>

          <div className='d-flex details-input justify-content-between m-3'>
            <h5>City : </h5>
            <input className=' text-capitalize ' type='text' value={city.toLowerCase()} onChange={(e) => { setCity(e.target.value) }} disabled={editAddress ? false : true} />
          </div>
          
          <div className='d-flex details-input justify-content-between m-3'>
            <h5>Pincode : </h5>
            <input className=' text-capitalize ' type='text' value={pin} onChange={(e) => { setPin(e.target.value) }} disabled={editAddress ? false : true} />
          </div>
        </div>
      </div>

}
    </>
  )
}

export default Firmdetails