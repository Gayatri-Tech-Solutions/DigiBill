import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { CiFilter } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";
import EditModal from '../components/EditModal';
import moment from "moment";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Navigate, useNavigate } from 'react-router-dom';
import '../resources/bills.css'
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Loader from '../components/loader';
import { useSelector } from 'react-redux';

const Bills = () => {
  const apiURL = process.env.REACT_APP_API_URL
  const navigate = useNavigate();
  const userData = useSelector(state => state.user.userData)
  const token = localStorage.getItem('token')
  const [showDialog, setShowDialog] = useState(false);
  const [bills, setBills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState([]);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false)
  const [showFiltersLoading, setShowFiltersLoading] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [fetchedResult , setFetchedResult] = useState(false)

  // const [filters , setFilters] = useState([])
  const [filters, setFilters] = useState({
    billNo: '',
    customerName: '',
    status: '',
    startDate: '',
    endDate: ''
  });


  const handlePaginationChange = async (event, value) => {
    event.preventDefault()
    setCurrentPage(value);
    if(fetchedResult){
      applyFilters(value)
    }else{
      getBills(value);
    }
  };

  const handleClickOpen = (item) => {
    setCurrentBill(item);
    setOpen(true);
  };

  const handleClose = () => {
    setUpdatedStatus('')
    setOpen(false);
  };

  const getBills = async (page) => {
    setShowLoading(true)
    try{
      let { data } = await axios.get(`${apiURL}/api/invoice/getInvoices`,
        {
          params: {
            page: page || currentPage,
            userid : userData.id
          },
          headers : {
            Authorization : `Bearer ${token}`
          }
        }
      );
      setBills(data.data);
      setPageCount(data.pageCount)
      setShowLoading(false)
    }catch(error){
      console.log("error occured while fetching bills",error)
      console.log("error.response")
      if(error.response.data.message == 'Token expired'){
        localStorage.removeItem('token')
        alert("Token Expired! Please login Again")
        window.location.reload();
      }
      setShowLoading(false)
    }
  };

  useEffect(() => {
    getBills();
  }, []);

  const handleViewBill = (item) => {
    navigate('/create-bill', { state: { billData: item } })
  }

  const handleBillUpdate = async (e) => {
    setShowLoading(true)
    console.log(currentBill)
    e.preventDefault();
    let apiData = {
      id: currentBill.id,
      billNo: currentBill.billNo,
      status: updatedStatus,
      amount: currentBill.amount,
      ledgerDetails: currentBill.customerData.ledgerDetails
    }
    try {
      if (updatedStatus.length > 1 && updatedStatus !== currentBill.status) {
        let { data } = await axios.post(`${apiURL}/api/invoice/update`, apiData ,{
          headers : {
            Authorization : `Bearer ${token}`
          },
          params:{
            userid : userData.id
          }
        } )
        setShowLoading(false)
        getBills()
      }
    } catch (error) {
      console.log("Error occured while updating status")
      console.log(error)
      setShowLoading(false)
      if(error.response.data.message == 'Token expired'){
        localStorage.removeItem('token')
          alert("Token Expired! Please login Again")
          window.location.reload();
      }
    }
    setOpen(false);
  };

  const applyFilters = async (page) => {
    setShowFiltersLoading(true)
    
    let changes = false
    for (const key in filters) {
      if (filters[key] !== '') {
        changes = true
      }
    }
    if (changes) {
      try {
        
        let { data } = await axios.get(`${apiURL}/api/invoice/filters`, {
          params: {
            ...filters,
            page: page || currentPage,
            userid : userData.id
          },
          headers : {
            Authorization : `Bearer ${token}`
          }
        })
        console.log(data.data)
        setBills(data.data)
        setShowFiltersLoading(false)
        setFetchedResult(true)
      } catch (error) {
        console.log("error occcured while fetching filtered result")
        console.log(error)
        setShowFiltersLoading(false)
        if(error.response.data.message == 'Token expired'){
          localStorage.removeItem('token')
          alert("Token Expired! Please login Again")
          window.location.reload();
        }
      }
    } else {
      alert('please select atleast one filter to filter result')
      setShowFiltersLoading(false)
    }
  }
  return (
    <>
    {
      showLoading
      ?
                  <Loader />
                    :
                    <div className="w-100 p-4 mx-3 mb-3 rounded" style={{ height: "88vh" }}>

                    {/* Heading Div */}
                    <div className='bills-header d-flex justify-content-between'>
                      <div><h4>Bills</h4></div>
                      <div className='mx-4'><button className='filter-button' onClick={() => setShowFilters(!showFilters)}><CiFilter />Filters<RiArrowDropDownLine /></button></div>
                    </div>
            
            
                    {/* Div for horizontal line */}
                    <div>
                      <hr className='mb-3 mt-1' />
                    </div>
            
                    {showFilters ? <div>
            
                      <div className='d-flex justify-content-between'>
                        <div><h5>Filter Result By :-</h5></div>
                        <div className='mb-2 me-5  d-flex'>
                          <button className='apply-filter-button me-2' onClick={() => applyFilters()}>Apply Filters</button>
                          {
                            showFiltersLoading ?
                              <>
                                <Stack  sx={{ color: 'grey.500' }} spacing={2} direction="row">
                                  <CircularProgress color="success" />
                                </Stack>
                              </>
                              :
                                fetchedResult ?
                                <button className='apply-filter-button text-danger' onClick={() => { setFilters({
                                  billNo: '',
                                  customerName: '',
                                  status: '',
                                  startDate: '',
                                  endDate: ''
                                });setFetchedResult(false); getBills()}}>Clear Result</button>
                                :
                                <></>
                              
                          }
                        </div>
                      </div>
                      <div className='d-flex justify-content-between mx-3'>
            
                        <div className='d-flex flex-column'>
                          <label className='filters-label'>Bill No</label>
                          <input type='text' name='billNo' value={filters.billNo} onChange={(e) => setFilters((prevFilters) => ({ ...prevFilters, [e.target.name]: e.target.value }))} placeholder='Enter Bill No.' />
                        </div>
            
                        <div className='d-flex flex-column'>
                          <label className='filters-label'>Customer Name</label>
                          <input type='text' name='customerName' value={filters.customerName} onChange={(e) => setFilters((prevFilters) => ({ ...prevFilters, [e.target.name]: e.target.value }))} placeholder='Enter Customer Name' />
                        </div>
            
                        <div className='d-flex flex-column'>
                          <label className='filters-label'>Bill Status</label>
                          <select className='filters-select' name="status" value={filters.status} onChange={(e) => setFilters((prevFilters) => ({ ...prevFilters, [e.target.name]: e.target.value }))}>
                            <option disabled value="">Select Status</option>
                            <option className=' text-danger' value="Cancelled">Cancelled</option>
                            <option className=' text-success' value="Cleared">Cleared</option>
                            <option className=' text-warning' value="Pending">Pending</option>
                            <option value="">Clear Selection</option>
                          </select>
                        </div>
            
                        <div className='d-flex flex-column'>
                          <label className='filters-label'>Bill Date/Start Date</label>
                          <input className='filters-date' type='date' name="startDate" value={filters.startDate} onChange={(e) => {
                            setFilters((prevFilters) => ({ ...prevFilters, [e.target.name]: e.target.value }))
            
                            if (e.target.value == "") {
                              setFilters((prevFilters) => ({ ...prevFilters, endDate: e.target.value }))
                            }
                          }} placeholder='Bill No.' />
                        </div>
            
                        <div className='d-flex flex-column'>
                          <label className='filters-label'>End Date</label>
                          <input className='filters-date' type='date' name="endDate"
                            value={filters.endDate}
                            onChange={(e) => {
                              console.log("filters.startDate , e.target.value")
                              console.log(filters.startDate, e.target.value)
                              e.target.value > filters.startDate || e.target.value == "" ?
                                (setFilters((prevFilters) => ({ ...prevFilters, [e.target.name]: e.target.value })))
                                : alert("End Date should be greater than Start Date")
                            }
                            }
                            placeholder='Bill No.' disabled={filters.startDate == "" ? true : false} />
                        </div>
            
                      </div>
            
                      <div>
                        <hr className='mb-3 mt-1' />
                      </div>
                    </div> : <></>}
            
                    {/*Table Div  */}
                    <div>
                      <table className="table table-hover ">
            
                        {/* Table Head */}
                        <thead>
                          <tr>
                            <th scope="col">S.No.</th>
                            <th scope="col">Bill No.</th>
                            <th scope="col">GST No.</th>
                            <th scope="col">Customer Name</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Status</th>
                            <th scope="col">Created At</th>
                            <th scope="col">Updated At</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
            
                        {/* table body  */}
                        <tbody>
                          {bills.map((item, index) => {
                            const totalAmount = item.item.reduce((total, item) => {
                              const rate = parseFloat(item.rate) || 0;
                              return total + rate;
                            }, 0);
                            return (
                              <tr key={item.id}>
                                <th>{((currentPage - 1) * 8) + (index + 1)}</th>
                                <td className="text-capitalize">{item.billNo}</td>
                                <td className="text-capitalize">{item.gst.toUpperCase()}</td>
                                <td className="text-capitalize">{item.customer.name}</td>
                                <td className="text-capitalize">{item.amount}</td>
                                <td className={`text-capitalize ${item.status === 'Cleared' ? 'text-success' : item.status === 'Pending' ? 'text-warning' : item.status === 'Cancelled' ? 'text-danger' : ''}`}>
                                  {item.status}
                                </td>
            
                                <td>{moment(item.createdAt).format("DD MMM YYYY h:mm a")}</td>
                                <td>{moment(item.updatedAt).format("DD MMM YYYY h:mm a")}</td>
                                <td>
                                  <div className="d-flex justify-content-around">
                                    <button className="border-0" onClick={() => handleClickOpen(item)}><EditIcon /></button>
                                    <button className="border-0" onClick={() => handleViewBill(item)}><VisibilityIcon /></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {
            bills.length<=0 ?
            <div className='d-flex  justify-content-center fw-light'>No Data Found</div>
            :
            <></>
            }
                    </div>
            
                    {/* code for pagination */}
                    <Pagination
                      count={pageCount}
                      size="small"
                      page={currentPage}
                      onChange={handlePaginationChange}
                    />
            
                    {/* Edit Bill dialog code */}
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      PaperProps={{
                        component: 'form',
                        onSubmit: handleBillUpdate,
                        style: { padding: '20px', borderRadius: '8px' }
                      }}
                    >
            
                      {/* Dialog box title */}
                      <DialogTitle><strong>Update Bill</strong></DialogTitle>
            
                      <DialogContent>
                        {/* dialog box form  */}
                        <form>
                          <h5 style={{ marginBottom: '20px' }}>Change status :-</h5>
                          <div className='d-flex align-items-center mx-5' style={{ marginBottom: '10px' }}>
                            <input
                              type='radio'
                              id='Pending'
                              name='status'
                              value='Pending'
                              style={{ marginRight: '10px' }}
                              defaultChecked={currentBill && currentBill.status === 'Pending'}
                              onClick={() => setUpdatedStatus('Pending')}
                            />
                            <label className='text-warning' htmlFor='Pending'>Pending</label>
                          </div>
                          <div className='d-flex align-items-center mx-5' style={{ marginBottom: '10px' }}>
                            <input
                              type='radio'
                              id='Cleared'
                              name='status'
                              value='Cleared'
                              style={{ marginRight: '10px' }}
                              defaultChecked={currentBill && currentBill.status === 'Cleared'}
                              onClick={() => setUpdatedStatus('Cleared')}
                            />
                            <label className='text-success' htmlFor='Cleared'>Cleared</label>
                          </div>
                          <div className='d-flex align-items-center mx-5' style={{ marginBottom: '10px' }}>
                            <input
                              type='radio'
                              id='Cancelled'
                              name='status'
                              value='Cancelled'
                              style={{ marginRight: '10px' }}
                              defaultChecked={currentBill && currentBill.status === 'Cancelled'}
                              onClick={() => setUpdatedStatus('Cancelled')}
                            />
                            <label className='text-danger' htmlFor='Cancelled'>Cancelled</label>
                          </div>
                        </form>
                      </DialogContent>
            
                      {/* dialog box Action button */}
                      <DialogActions>
                        <button
                          className="bg-danger text-light border-0 rounded-1"
                          onClick={handleClose}
                          style={{ padding: '10px 20px' }}
                        >
                          Cancel
                        </button>
                        <button
                          className="button-custom text-light border-0 rounded-1"
                          type="submit"
                          style={{ padding: '10px 20px', backgroundColor: '#007bff' }}
                        >
                          Save
                        </button>
                      </DialogActions>
                    </Dialog>
                  </div>

    }

    </>
  );
};

export default Bills;
