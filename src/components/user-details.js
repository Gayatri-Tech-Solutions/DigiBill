import React, { useState } from 'react'
import '../resources/accountdetailspage.css'
import Loader from "./loader";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { userData} from "../store/slice/userSlice";

const Userdetails = ({data}) => {
  const apiURL = process.env.REACT_APP_API_URL
  let token = localStorage.getItem('token')

  const dispatch = useDispatch();


 const [name, setName] = useState(data?.name || "") 
 const [email, setEmail] = useState(data?.email || "")
 const [phone, setPhone] = useState(data?.phone || "8744929960") 
 const [editDetails, setEditDetails] = useState(false)
 const [showLoading , setShowLoading] = useState(false);
 
 const handleDetailsChange = async () =>{
  setShowLoading(true)
  setEditDetails(false)
  let apiData = {
    id : data.id,
    name ,
    email,
    phone,
  }
  console.log("apidata user")
  console.log(apiData)
  try{
    let {data} = await axios.post(`${apiURL}/api/user/update`,apiData,{
      headers : {
        Authorization : `Bearer ${token}`
      },
    })
    console.log("DATA")
    console.log(data)
    dispatch(userData(data.data));
    // window.location.reload()
    setShowLoading(false)
  }catch(err){
    alert("something went wrong")
    console.log(err)
    setShowLoading(false)
  }
} 

 return (
   <>
   {  showLoading ?
    <Loader/>:
    <>
    <div className="bills-header d-flex justify-content-between m-3">
            <div>
              <h4>User Details </h4>
            </div>
  
            <div className='d-flex me-3'>
              <div className='me-2'><button onClick={() => { setEditDetails(true) }}>Edit Details</button></div>
              {editDetails ? <div><button onClick={()=>{handleDetailsChange()}}>Save Details</button></div> : <></>}
            </div>
  
  
          </div>
      <div className='d-flex'>
        <div className='w-50 profile-image-section '>
          <div className='text-center profile-image-div'>
            <img className='profile-image' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuGFjsxZCvbMuKnsJHFywAKXzJh6SsPWVsifY_z36wVT9p38WQ3IQPDPDjhFPDyxv6YQY&usqp=CAU' alt='profile' />
          </div>
          <div className='d-flex flex-column profile-section-buttons'>
            <button>Update Profile Image</button>
            <button>Remove Profile Image</button>
          </div>
        </div>
        <div className='w-50 m-3'>
          <div className='user-details my-4'>
            <h5>User Name :-</h5>
            <input className='w-75 p-2 fs-5 text-capitalize' type='text' value={name.toLowerCase()} onChange={(e)=>setName(e.target.value)} disabled={editDetails ? false : true}/>
          </div>
          
          <div className='user-details my-4'>
            <h5>Email :-</h5>
            <input className='w-75 p-2 fs-5' type='email' value={email} onChange={(e)=>setEmail(e.target.value)} disabled={editDetails ? false : true}/>
  
          </div>
          
          <div className='user-details my-4'>
            <h5>User Phone No. :-</h5>
            <input className='w-75 p-2 fs-5 text-capitalize' type='text' value={phone} onChange={(e)=>setPhone(e.target.value)} disabled={editDetails ? false : true}/>
          </div>
        
        </div>
      </div>
    </>
  }
  </>
  )
}

export default Userdetails