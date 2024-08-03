import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import { CiFilter } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import { apiURL } from '../env';
import EditModal from '../components/EditModal';
import Loader from '../components/loader';

const Customers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showFiltersLoading, setShowFiltersLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [fetchedResult, setFetchedResult] = useState(false);

  const [filters, setFilters] = useState({
    phone: '',
    customerName: '',
    gst: '',
    email: '',
    state: ''
  });

  const navigate = useNavigate();

  const handlePaginationChange = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
    fetchedResult ? applyFilters(value) : getAllCustomers(value);
  };

  const GenerateBill = (customer) => {
    navigate('/create-bill', { state: { customer } });
  };

  const editCustomer = (customer) => {
    setEditModalOpen(true);
    setSelectedCustomer(customer);
  };

  const getAllCustomers = async (page) => {
    setShowLoading(true);
    try {
      const { data } = await axios.get(`${apiURL}/api/customer/get-all-customers`, {
        params: { page: page || currentPage }
      });
      setPageCount(data.pageCount);
      setCustomersList(data.response);
    } catch (error) {
      console.error("Error occurred while getting customer data", error);
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    getAllCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = async (page) => {
    setShowFiltersLoading(true);
    const hasFilters = Object.values(filters).some(filter => filter !== '');

    if (!hasFilters) {
      alert('Please select at least one filter to filter results');
      setShowFiltersLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${apiURL}/api/customer/filters`, {
        params: { ...filters, page: page || currentPage }
      });
      setCustomersList(data.data);
      setPageCount(data.pageCount);
      setFetchedResult(true);
    } catch (error) {
      console.error("Error occurred while fetching filtered results", error);
    } finally {
      setShowFiltersLoading(false);
    }
  };

  return (
    showLoading ? <Loader /> :
      <div className="w-100 p-4 mx-3 mb-3 rounded" style={{ height: '88vh' }}>
        <div className="bills-header d-flex justify-content-between">
          <h4>Customers</h4>
          <div className='d-flex'>
            <button onClick={() => editCustomer(null)}>Add Customer</button>
            <button className='filter-button mx-3' onClick={() => setShowFilters(!showFilters)}>
              <CiFilter />Filters<RiArrowDropDownLine />
            </button>
          </div>
        </div>
        <hr className="mb-3 mt-1" />
        {showFilters && (
          <>
            <div className='d-flex justify-content-between'>
              <h5>Search Customer By:</h5>
              <div className='mb-2 me-5 d-flex'>
                <button className='apply-filter-button me-2' onClick={applyFilters}>Apply Filters</button>
                {showFiltersLoading ? (
                  <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
                    <CircularProgress color="success" />
                  </Stack>
                ) : (
                  fetchedResult && (
                    <button className='apply-filter-button text-danger' onClick={() => {
                      setFilters({ phone: '', customerName: '', gst: '', email: '', state: '' });
                      setFetchedResult(false);
                      getAllCustomers();
                    }}>Clear Result</button>
                  )
                )}
              </div>
            </div>
            <div className='d-flex justify-content-between mx-3'>
              {['customerName', 'phone', 'email', 'gst', 'state'].map((filter, index) => (
                <div className='d-flex flex-column' key={index}>
                  <label className='filters-label'>{filter.charAt(0).toUpperCase() + filter.slice(1)}</label>
                  <input
                    type='text'
                    name={filter}
                    value={filters[filter]}
                    onChange={(e) => setFilters(prevFilters => ({ ...prevFilters, [e.target.name]: e.target.value }))}
                    placeholder={`Enter ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
                  />
                </div>
              ))}
            </div>
            <hr className='mb-3 mt-1' />
          </>
        )}
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
            {customersList.length > 0 ? customersList.map((item, index) => (
              <tr key={item.id} onClick={() => { }}>
                <th>{((currentPage - 1) * 8) + (index + 1)}</th>
                <td className="text-capitalize">{item.name.toLowerCase()}</td>
                <td className="text-capitalize">{item.gst.toUpperCase()}</td>
                <td className="text-capitalize">{item.phone}</td>
                <td className="text-capitalize">{item.email}</td>
                <td className="text-capitalize">
                  {`${item?.address[0]?.houseno} ${item?.address[0]?.locality} ${item?.address[0]?.city}`}
                </td>
                <td className="text-capitalize">{item?.address[0]?.state}</td>
                <td>
                  <div className="d-flex justify-content-around">
                    <button className="border-0" onClick={() => editCustomer(item)}><EditIcon /></button>
                    <button className="border-0" onClick={() => GenerateBill(item)}><DescriptionIcon /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className='d-flex justify-content-center fw-light'>No Data Found</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          count={pageCount}
          size="small"
          page={currentPage}
          onChange={handlePaginationChange}
        />
        <EditModal open={editModalOpen} customer={selectedCustomer} handleClose={() => {
          setEditModalOpen(false);
          getAllCustomers();
        }} />
      </div>
  );
};

export default Customers;
