import React, { useEffect, useState } from 'react'
import { apiURL } from '../env';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../resources/dashboard.css'
import image from '../Assets/construction.jpeg'
import { Pagination } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import EditModal from '../components/EditModal';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BillModal from '../components/billModal';


const Ledger = () => {

  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [bills, setBills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState([]);
  const [updatedStatus, setUpdatedStatus] = useState('');
  
  
  const handlePaginationChange = async (event, value) => {
    event.preventDefault()
    setCurrentPage(value);
    getAllCustomers(value);
  };

  const handleClick= async () =>{

  }

  const getAllCustomers = async (page) => {
    let { data } = await axios.get(`${apiURL}/api/customer/get-all-customers`,{params :{
      page : page || currentPage
  }});
  
    setPageCount(data.pageCount)
    setCustomersList(Array(...data.response));
  };

  useEffect(()=>{
    getAllCustomers()
  },[])
  
  return (
//     <div className="w-100 p-4 mx-3 mb-3 rounded" style={{ height: '88vh' }}>
//       <div className="bills-header d-flex justify-content-between">
//           <div>
//             <h4>Ledger</h4>
//           </div>
//         </div>
//         <div>
//           <hr className="mb-3 mt-1" />
//         </div>
    
//     <div>
// <table className="table table-hover">
//             <thead>
//               <tr>
//                 <th scope="col">S.No.</th>
//                 <th scope="col">Name</th>
//                 <th scope="col">Gst No</th>
//                 <th scope="col">Phone</th>
//                 <th scope="col">Email</th>
//                 <th scope="col">Address</th>
//                 <th scope="col">State</th>
//                 <th scope="col">Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {customersList.map((item, index) => (
//                 <tr key={item.id} onClick={() => handleClick(item)}>
//                   <th>{((currentPage - 1) * 8) + (index + 1)}</th>
//                   <td className="text-capitalize">
//                     {item.name.toLowerCase()}
//                   </td>
//                   <td className="text-capitalize">{item.gst.toUpperCase()}</td>
//                   <td className="text-capitalize">
//                     {item.phone}
//                   </td>
//                   <td className="text-capitalize">
//                     {item.email}
//                   </td>
//                   <td className="text-capitalize">
//                     {`${item?.address[0]?.houseno} ${item?.address[0]?.locality} ${item?.address[0]?.city}`}
//                   </td>
//                   <td className="text-capitalize">
//                     {item?.address[0]?.state}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           </div>

// <Pagination
//           count={pageCount}
//           size="small"
//           page={currentPage}
//           onChange={handlePaginationChange}
//         />
//     </div>
<div className='dashboard'>
    <img src={image} height={400} alt='Background' className='background-image' />
  </div>
  )
}

export default Ledger