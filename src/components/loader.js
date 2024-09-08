import React, { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Set a timeout to show the message after 10 seconds (10000 milliseconds)
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 10000); // 10000 milliseconds = 10 seconds

    // Clear the timeout if the component unmounts before the timeout completes
    return () => clearTimeout(timer);
  }, []);


  return (
   <div className='main-loader-div d-flex justify-content-center align-items-center' style={{height: "500px", width: "-webkit-fill-available"}}>
   <Stack className='main-loader' sx={{ color: 'grey.500' }} spacing={2} direction="row">
     <div className=' text-center'>
     <CircularProgress color="success" />
     {showMessage && <p>Sometime it takes longer time so, please wait </p>}
     </div>
   </Stack>
</div>
  )
}

export default Loader