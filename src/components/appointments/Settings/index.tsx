import React from 'react'


const AppointmentSettings = ({children}:{
    children: React.ReactNode
}) => {
  return (
    <>
        <div className=' pb-6 text-2xl font-semibold'>Settings</div>
        {children}
    </>
  )
}

export default AppointmentSettings