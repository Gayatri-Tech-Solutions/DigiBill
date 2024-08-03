import React from 'react'
import '../resources/dashboard.css'
import image from '../Assets/construction.jpeg'

const Dashboard = () => {
  return (
    <div className='dashboard'>
    <img src={image} height={400} alt='Background' className='background-image' />
  </div>
  )
}

export default Dashboard