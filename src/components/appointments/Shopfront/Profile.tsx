import { MoreVertical } from 'lucide-react'
import React from 'react'
import { FaRegEnvelope } from 'react-icons/fa6'

const Profile = () => {
  return (
    <div className='w-full h-full flex justify-center items-center  '>

        <div className="bg-white border min-h-full flex flex-col gap-6 max-w-6xl w-full p-6">
            <div className="flex flex-col items-center gap-2">
                <div className="bg-zikoroBlue rounded-full h-32 w-32"></div>
                <h6 className="text lg font-medium text-center">Ifunanya Nwuzor</h6>
            </div>
            <p className="text-center max-w-2xl mx-auto">
                {'A dedicated Nigerian barber with over a decade of experience in crafting impeccable haircuts and styles for Nigerian men. I specialize in a variety of barbering techniques, from classic cuts to modern styles, ensuring that every client leaves my shop looking sharp and confident.'}
            </p>

            <div className="max-w-sm w-full mx-auto space-y-2">
                {
                    [...Array(3)].map((_,idx)=>{
                        return (
                        <div key={idx} className="bg-white border rounded p-3 flex items-center justify-between gap-4 hover:ring-2 hover:ring-gray-400 duration-200">
                            <div className="flex items-center gap-4">
                                <FaRegEnvelope/>
                                <p className="">Ifynwuzor@gmail.com</p>
                            </div>
                            <button className=""><MoreVertical size={18}/></button>
                        </div>
                    )})
                }
            </div>

        </div>
    </div>
  )
}

export default Profile