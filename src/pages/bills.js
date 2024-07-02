import React from 'react'
import Createbill from '../components/createbill'
const Bills = () => {
  return (
   <>
   <div className=" w-100 p-4 mx-3 mb-3 rounded" style={{ height: "88vh" }} > 
     <div className='bills-header d-flex justify-content-between'>
       <div><h4>Bills</h4></div>
       <div><button >Create Bill</button></div>
     </div>
     <div>
      <hr className='mb-3 mt-1'/>
     </div>
     <div>
     <table class="table table-hover ">
                <thead>
                  <tr>
                    <th scope="col">S.No.</th>
                    <th scope="col">Bill No.</th>
                    <th scope="col">GST No.</th>
                    <th scope="col">Customer Name</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                
              </table>
     </div>
     
   </div>
   </>
  )
}

export default Bills