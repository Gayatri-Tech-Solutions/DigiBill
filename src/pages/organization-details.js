import React, { useState } from 'react'
import '../resources/organization-details.css'
import { useSelector } from 'react-redux'
import { Tab, Tabs } from "react-bootstrap";
import Userdetails from '../components/user-details';
import Firmdetails from '../components/firm-details';
import Accountdetails from '../components/account-details';

const OrganizationDetails = () => {

 const userData = useSelector(state => state.user.userData)
 const firmDetails = {firmDetails : userData.otherData.firmDetails , address : userData.address}
 const bankDetails = userData.otherData.bankDetails

 const [key, setKey] = useState("UserDetails");

  
 
 return (
    <div className='w-100'>
     
     <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) =>{ console.log("key is k",k); setKey(k)}}
        >
           <Tab eventKey={"UserDetails"} title={"User Details"}>
          {key === "UserDetails" && <Userdetails data={userData} />}
        </Tab>
        <Tab eventKey={"FirmDetails"} title={"Firm Details"}>
          {key === "FirmDetails" && <Firmdetails data={firmDetails} />}
        </Tab>
        <Tab eventKey={"AccountDetails"} title={"Account Details"}>
          {key === "AccountDetails" && <Accountdetails data={bankDetails}  />}
        </Tab>
        </Tabs>
    </div>
  )
}

export default OrganizationDetails