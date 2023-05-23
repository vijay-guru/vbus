import React from 'react'
import { useNavigate } from "react-router-dom";

function Bus({bus}) {
    const navigate = useNavigate();
  return (
    <div className='card p-2'>
      <h3 className='text-lg'>{bus.name}</h3>
      <hr/>
      <div className='d-flex justify-content-between'>
        <div>
            <p className='text-sm'>From</p>
            <p className='text-sm'>{bus.from}</p>
        </div>
        <div>
            <p className='text-sm'>To</p>
            <p className='text-sm'>{bus.to}</p>
        </div>
        <div>
            <p className='text-sm'>Fare</p>
            <p className='text-sm'>&#x20a8; {bus.fare} /-</p>
        </div>
      </div>
      <div className=' mt-3 d-flex justify-content-between align-items-end'>
      <div>
            <p className='text-sm'>Journey Date</p>
            <p className='text-sm'>{bus.journeyDate}</p>
        </div>
        <h3 className='text-lg underline' onClick={()=>{
            navigate(`/book-now/${bus._id}`)
        }}>Book Now</h3>
      </div>
    </div>
  )
}

export default Bus
