import React from 'react'
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = () => {
  return (
   <div className='main-loader-div d-flex justify-content-center align-items-center' style={{height: "500px", width: "-webkit-fill-available"}}>
   <Stack className='main-loader' sx={{ color: 'grey.500' }} spacing={2} direction="row">
     <CircularProgress color="success" />
   </Stack>
</div>
  )
}

export default Loader