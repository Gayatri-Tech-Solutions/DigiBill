import React, { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import Loader from "./loader";
import { useSelector } from "react-redux";

const OtherDataModal = ({ open,userdata, handleClose }) => {
  const apiURL = process.env.REACT_APP_API_URL
  const [showLoading, setShowLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    IFSCcode: "",
    bankName: "",
    branch: "",
    city: "",
    pincode: ""
  });
  const [firmDetails, setFirmDetails] = useState({
    firmName: "",
    firmAddress: "",
    gst: "",
    phone: "",
    SAScode: "",
    stamp: ""
  });

  const handleBankDetailsChange = (e) => {
    const { id, value } = e.target;
    setBankDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value.toLowerCase()
    }));
  };

  const handleFirmDetailsChange = (e) => {
    const { id, value } = e.target;
    setFirmDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value.toLowerCase()
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setShowLoading(true);

    let data = {
      name : userdata.name ,
      otherData:{
        bankDetails : bankDetails,
        firmDetails : firmDetails
      },
      id : userdata.id,
    };

    try {
      // Uncomment this line and add your actual API endpoint
      let response = await axios.post(`${apiURL}/api/user/update`, data ,{
        headers:{
          Authorization : `Bearer ${userdata.token}`
        }
      });
      if (response.status === 200) {
        alert("Details Added Successfully");
      }
      console.log("response")
      console.log(response.data.data)
      setShowLoading(false);
      closeModal();
      
    } catch (error) {
      console.log(error);
      setShowLoading(false);
    }
  };

  const closeModal = () => {
    setBankDetails({
      accountName: "",
      accountNumber: "",
      IFSCcode: "",
      bankName: "",
      branch: "",
      city: "",
      pincode: ""
    });
    setFirmDetails({
      firmName: "",
      firmAddress: "",
      gst: "",
      phone: "",
      SAScode: "",
      stamp: ""
    });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          closeModal();
        },
      }}
    >
      {showLoading ? (
        <Loader />
      ) : (
        <>
          <DialogTitle>Other Details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div>To continue further we need to know something more about your business.</div>
              <div>Don't worry this is just to make software align properly with you business</div>
            </DialogContentText>
            <form>
              <div>
                <h6>Firm Details to be added on invoice</h6>
                <div className="firmDetails">
                  <div className="name">
                    <label htmlFor="firmName">Firm Name</label>
                    <input type="text" id="firmName" value={firmDetails.firmName} onChange={handleFirmDetailsChange} />
                  </div>
                  <div className="address">
                    <label htmlFor="firmAddress">Firm Address</label>
                    <input type="text" id="firmAddress" value={firmDetails.firmAddress} onChange={handleFirmDetailsChange} />
                  </div>
                  <div className="gst">
                    <label htmlFor="gst">GST Number</label>
                    <input type="text" id="gst" value={firmDetails.gst} onChange={handleFirmDetailsChange} />
                  </div>
                  <div className="phonenumber">
                    <label htmlFor="phone">Phone Number</label>
                    <input type="text" id="phone" value={firmDetails.phone} onChange={handleFirmDetailsChange} />
                  </div>
                  <div className="sascode">
                    <label htmlFor="SAScode">SAS Code</label>
                    <input type="text" id="SAScode" value={firmDetails.SAScode} onChange={handleFirmDetailsChange} />
                  </div>
                  <div className="stamp">
                    <label htmlFor="stamp">Stamp & Signature (This image will be directly applied to the invoice stamp & signature option)</label>
                    <input type="file" id="stamp" onChange={(e) => setFirmDetails((prevDetails) => ({ ...prevDetails, stamp: e.target.files[0] }))} />
                  </div>
                </div>

                <h6>Bank Details so that it can be added at the bottom of your Invoice</h6>
                <div className="BankDetails">
                  <div className="accountName">
                    <label htmlFor="accountName">Account Name</label>
                    <input type="text" id="accountName" value={bankDetails.accountName} onChange={handleBankDetailsChange} />
                  </div>
                  <div className="accountNumber">
                    <label htmlFor="accountNumber">Account Number</label>
                    <input type="text" id="accountNumber" value={bankDetails.accountNumber} onChange={handleBankDetailsChange} />
                  </div>
                  <div className="IFSCcode">
                    <label htmlFor="IFSCcode">IFSC Code</label>
                    <input type="text" id="IFSCcode" value={bankDetails.IFSCcode} onChange={handleBankDetailsChange} />
                  </div>
                  <div className="bankName">
                    <label htmlFor="bankName">Bank Name</label>
                    <input type="text" id="bankName" value={bankDetails.bankName} onChange={handleBankDetailsChange} />
                  </div>
                  <div className="branch">
                    <label htmlFor="branch">Branch</label>
                    <input type="text" id="branch" value={bankDetails.branch} onChange={handleBankDetailsChange} />
                  </div>
                  <div className="city">
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" value={bankDetails.city} onChange={handleBankDetailsChange} />
                  </div>
                  <div className="pincode">
                    <label htmlFor="pincode">Pincode</label>
                    <input type="text" id="pincode" value={bankDetails.pincode} onChange={handleBankDetailsChange} />
                  </div>
                </div>
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <button
              onClick={closeModal}
              className="bg-danger text-light border-0 rounded-1"
            >
              Cancel
            </button>
            <button
              onClick={(e) => submit(e)}
              className="button-custom text-light border-0 rounded-1"
            >
              Save Details
            </button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default OtherDataModal;
