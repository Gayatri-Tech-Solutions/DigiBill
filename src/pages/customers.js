// Customers.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiURL } from '../env';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import EditModal from '../components/EditModal';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BillModal from '../components/billModal';
import Loader from '../components/loader';
import { CiFilter } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const Customers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [billModalOpen, setBillModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showFiltersLoading, setShowFiltersLoading] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [fetchedResult, setFetchedResult] = useState(false)

  // const [filters , setFilters] = useState([])
  const [filters, setFilters] = useState({
    phone: '',
    customerName: '',
    gst: '',
    email: '',
    state: ''
  });
  const navigate = useNavigate();

  const handlePaginationChange = async (event, value) => {
    event.preventDefault()
    setCurrentPage(value);
    if(fetchedResult){
      applyFilters(value)
    }else{
      getAllCustomers(value);
    }
  };

  const handleClick = () => { };



  const GenerateBill = async (customer) => {

    // setBillModalOpen(true)
    navigate('/create-bill', { state: { customer } })
    setSelectedCustomer(customer);
  };


  const deleteCustomer = async (customer) => {

  }

  const editCustomer = async (customer) => {

    setEditModalOpen(true);
    setSelectedCustomer(customer);
  };

  const getAllCustomers = async (page) => {
    setShowLoading(true)
    try {

      let { data } = await axios.get(`${apiURL}/api/customer/get-all-customers`, {
        params: {
          page: page || currentPage
        }
      });
      setPageCount(data.pageCount)
      setCustomersList(data.response);
      setShowLoading(false)
    } catch (error) {
      console.log("Error occured while geting customer data", error)
      setShowLoading(false)
    }
  };

  useEffect(() => {
    getAllCustomers();
  }, []);

  const applyFilters = async (page) => {
    setShowFiltersLoading(true)
    console.log("filters")
    console.log(filters)
    let changes = false
    for (const key in filters) {
      if (filters[key] !== '') {
        changes = true
      }
    }
    // changes = true
    if (changes) {
      try {
        let {data} = await axios.get(`${apiURL}/api/customer/filters`,{
          params:{
            ...filters,
            page: page || currentPage
          }
        })
        setCustomersList(data.data)
        setPageCount(data.pageCount)
        setShowFiltersLoading(false)
        setFetchedResult(true)
      } catch (error) {
        console.log("error occcured while fetching filtered result")
        console.log(error)
        setShowFiltersLoading(false)
      }
    } else {
      alert('please select atleast one filter to filter result')
      setShowFiltersLoading(false)
    }
  }
  return (
    showLoading ?
      <Loader />
      :
      <>

        <div className="w-100 p-4 mx-3 mb-3 rounded" style={{ height: '88vh' }}>

          <div className="bills-header d-flex justify-content-between">

            <div>
              <h4>Customers</h4>
            </div>

            <div className='d-flex '>
              <div><button onClick={() => { editCustomer() }}>Add Customer</button></div>
              <div className='mx-3'><button className='filter-button' onClick={() => setShowFilters(!showFilters)}><CiFilter />Filters<RiArrowDropDownLine /></button></div>
            </div>

          </div>

          <div>
            <hr className="mb-3 mt-1" />
          </div>

          {showFilters ? <div>

            <div className='d-flex justify-content-between'>
              <div><h5>Search Customer By :-</h5></div>
              <div className='mb-2 me-5  d-flex'>
                <button className='apply-filter-button me-2' onClick={() => applyFilters()}>Apply Filters</button>
                {
                  showFiltersLoading ?
                    <>
                      <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
                        <CircularProgress color="success" />
                      </Stack>
                    </>
                    :
                    fetchedResult ?
                      <button className='apply-filter-button text-danger' onClick={() => {
                        setFilters({
                          phone: '',
                          customerName: '',
                          gst: '',
                          email: '',
                          state: ''
                        }); setFetchedResult(false); getAllCustomers()
                      }}>Clear Result</button>
                      :
                      <></>

                }
              </div>
            </div>
            <div className='d-flex justify-content-between mx-3'>

              <div className='d-flex flex-column'>
                <label className='filters-label'>Name</label>
                <input type='text' name='customerName' value={filters.customerName} onChange={(e) => setFilters((prevFilters) => ({ ...prevFilters, [e.target.name]: e.target.value }))} placeholder='Enter Customer Name' />
              </div>

              <div className='d-flex flex-column'>
                <label className='filters-label'>Phone No.</label>
                <input type='text' name='phone' value={filters.phone} onChange={(e) => setFilters((prevFilters) => ({ ...prevFilters, [e.target.name]: e.target.value }))} placeholder='Enter Phone No.' />
              </div>


              <div className='d-flex flex-column'>
                <label className='filters-label'>Email</label>
                <input type='email' name='email' value={filters.email} onChange={(e) => setFilters((prevFilters) => ({ ...prevFilters, [e.target.name]: e.target.value }))} placeholder='Enter Email' />        
              </div>
     
              <div className='d-flex flex-column'>
                <label className='filters-label'>Gst No.</label>
                <input type='text' name='gst' value={filters.gst} onChange={(e) => setFilters((prevFilters) => ({ ...prevFilters, [e.target.name]: e.target.value }))} placeholder='Enter Gst No.' />  
              </div>


              <div className='d-flex flex-column'>
                <label className='filters-label'>State</label>
                <input type='text' name='state' value={filters.state} onChange={(e) => setFilters((prevFilters) => ({ ...prevFilters, [e.target.name]: e.target.value }))} placeholder='Enter State' />  
                
              </div>

            </div>

            <div>
              <hr className='mb-3 mt-1' />
            </div>
          </div> : <></>}



          <div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">S.No.</th>
                  <th scope="col">Name</th>
                  <th scope="col">Gst No</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Email</th>
                  <th scope="col">Address</th>
                  <th scope="col">State</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              
              <tbody>
                {customersList.map((item, index) => (
                  <tr key={item.id} onClick={() => handleClick(item)}>
                    <th>{((currentPage - 1) * 8) + (index + 1)}</th>
                    <td className="text-capitalize">
                      {item.name.toLowerCase()}
                    </td>
                    <td className="text-capitalize">{item.gst.toUpperCase()}</td>
                    <td className="text-capitalize">
                      {item.phone}
                    </td>
                    <td className="text-capitalize">
                      {item.email}
                    </td>
                    <td className="text-capitalize">
                      {`${item?.address[0]?.houseno} ${item?.address[0]?.locality} ${item?.address[0]?.city}`}
                    </td>
                    <td className="text-capitalize">
                      {item?.address[0]?.state}
                    </td>
                    <td>
                      <div className="d-flex justify-content-around">
                        <button className="border-0" onClick={() => editCustomer(item)}><EditIcon /></button>
                        <button className="border-0" onClick={() => GenerateBill(item)}><DescriptionIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {
            customersList.length<=0 ?
            <div className='d-flex  justify-content-center fw-light'>No Data Found</div>
            :
            <></>
            }
          </div>
          <Pagination
            count={pageCount}
            size="small"
            page={currentPage}
            onChange={handlePaginationChange}
          />
        </div>
        <EditModal open={editModalOpen} customer={selectedCustomer} handleClose={() => { setEditModalOpen(false); getAllCustomers() }} />

      </>
  );
};

export default Customers;
