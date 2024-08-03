import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { apiURL } from "../env";
import axios from "axios";
import '../resources/modal.css'

import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import Loader from "./loader";

const EditModal = ({ open, handleClose, customer }) => {
  const [name, setName] = useState("");
  const [gst, setGst] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [stateId, setStateId] = useState("");
  const [pin, setPin] = useState("");
  const [country, setCountry] = useState("");
  const [countryId, setCountryId] = useState("");
  const [showLoading , setShowLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setShowLoading(true);
        setName(customer.name);
        setGst(customer.gst);
        setPhone(customer.phone);
        setEmail(customer.email);
        setHouseNo(customer.address[0].houseno);
        setLocality(customer.address[0].locality);
        setCity(customer.address[0].city);
        setState(customer.address[0].state);
        setPin(customer.address[0].pin);
        setCountry(customer.address[0].country);
        setCountryId(customer.address[0].countryId); // Ensure you set countryId as well
        setStateId(customer.address[0].stateId); // Ensure you set stateId as well
        setShowLoading(false);
      }
  }, [customer]);


  const submit = async (e) => {
    e.preventDefault();
    setShowLoading(true)


    let data = {
      name,
      gst,
      phone,
      email,
      houseNo,
      locality,
      city,
      state,
      pin,
      country,
    };

    

    try {

      if(customer){
        
        let response = await axios.post(`${apiURL}/api/customer/update`, data);
        if (response.status === 200) {
          alert("Customer Updated Successfully");
        }
        setShowLoading(false)
        closeModal()
      }else{
        let response = await axios.post(`${apiURL}/api/customer/addnew`, data);
        if (response.status === 200) {
          alert("Customer Added Successfully");
        }
        setShowLoading(false)
        closeModal()
      }
    } catch (error) {
      console.log(error);
      setShowLoading(false)
    }
  };

  const closeModal = () =>{
    setName("");
      setGst("");
      setPhone("");
      setEmail("");
      setHouseNo("");
      setLocality("");
      setCity("");
      setState("");
      setPin("");
      setCountry("");
      handleClose()
  }
  return (
    <Dialog
      open={open}
      onClose={closeModal}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          // const formData = new FormData(event.currentTarget);
          // const formJson = Object.fromEntries(formData.entries());
          // const email = formJson.email;
          
          closeModal()
        },
      }}
    >
      {
        showLoading ?
        <Loader />
        : <>
              <DialogTitle>{customer ? "Edit Customer Details" : "Add New Customer"}</DialogTitle>
      <DialogContent>
        <form >
          <div className="w-100 m-3 ">
            <div>
              <label><strong>Firm Name</strong></label>
            </div>
            <div>
              <input
className = "input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={customer ? true : false}
              />
            </div>
          </div>

          <div className="w-100 m-3  ">
            <div>
              <label><strong>GST NO.</strong></label>
            </div>
            <div>
              <input
className = "input"
disabled={customer ? true : false}
                type="text"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
              />
            </div>
          </div>

          <div className="w-100 m-3  ">
            <div>
              <label><strong>Contact No.</strong></label>
            </div>
            <div>
              <input
className = "input"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="w-100 m-3  ">
            <div>
              <label><strong>Email Id</strong></label>
            </div>
            <div>
              <input
className = "input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="w-100 m-3  ">
            <div>
              <label><strong>Country</strong></label>
            </div>
            <div className="custom-select-container">
              <CountrySelect
                onChange={(e) => {
                  setCountryId(e.id);
                  setCountry(e.name);
                 }}
                 defaultValue={customer ? { name: country } : ""}
                placeHolder="Select Country"
              />
            </div>
          </div>

          <div className="w-100 m-3   position-sticky ">
            <div>
              <label><strong>State</strong></label>
            </div>
            <div className="custom-select-container">
              <StateSelect
                countryid={countryId}
                onChange={(e) => {
                  setStateId(e.id);
                  setState(e.name);
                }}
                placeHolder="Select State"
                defaultValue={customer ? { name: state } : "" }
              />
            </div>
          </div>

          <div className="w-100 m-3  ">
            <div>
              <label><strong>City</strong></label>
            </div>
            <div className="custom-select-container ">
              <CitySelect
                countryid={countryId}
                stateid={stateId}
                onChange={(e) => setCity(e.name)}
                placeHolder="Select City"
                defaultValue={customer ? { name: city } : ""}
              />
            </div>
          </div>

          <div className="w-100 m-3  ">
            <div>
              <label><strong>Locality/Area</strong></label>
            </div>
            <div>
              <input
className = "input"
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
              />
            </div>
          </div>

          <div className="w-100 m-3  ">
            <div>
              <label><strong>House No./Plot No.</strong></label>
            </div>
            <div>
              <input
className = "input"
                type="text"
                value={houseNo}
                onChange={(e) => setHouseNo(e.target.value)}
              />
            </div>
          </div>

          <div className="w-100 m-3  ">
            <div>
              <label><strong>Pincode</strong></label>
            </div>
            <div>
              <input
className = "input"
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
      <button
              onClick={closeModal}
              className=" bg-danger text-light border-0 rounded-1"
            >
              Cancel
            </button>
            <button
              onClick={(e) => submit(e)}
              className="button-custom text-light border-0 rounded-1"
            >
              {customer ? "Save Changes" : "Add Customer"}
            </button>
        
      </DialogActions>
      </>
      }


    </Dialog>
  );
};

export default EditModal;
