import React, { useState } from 'react'

const SwitchToggler = () => {
    const [isOn, setIsOn] = useState(false)
  return (
    <div
        className={` flex-shrink-0 ${isOn ? 'bg-blue-600 ring-blue-600 ring-2 ' : 'bg-slate-300 ring-2 ring-slate-300'}  w-12 h-6 p-0.5 relative flex items-center  rounded-full  cursor-pointer `}
        onClick={() => setIsOn(cur=>!cur)}
    >   
        <div className="flex w-full justify-between font-semibold text-[9px]"> <p className='text-white pl-1'>{isOn&&'ON'}</p> <p className='text-gray-50 pr-0.5 text-[px]'>{!isOn&&'OFF'}</p>  </div>
        <div className={`bg-white absolute inset-0 w-6 h-6 flex-shrink-0 rounded-full transition-transform duration-200 transform ${isOn ? 'translate-x-6' : ''}`}></div>
    </div>
  )
}

export default SwitchToggler