import React from 'react'

const LinksCard = () => {
  return (
    <div className={` p-4 border-2 space-y-2 rounded-lg `}>
        <div className="flex justify-between gap-6 items-center">
            <h4 className="text-xl font-medium">Link Name</h4>
            <div>icon</div>
        </div>

        <div className="">
            <div className=" flex  gap-4 items-center">
                <div>icon</div>
                <p className="">60 mins</p>
            </div>
            <div className="flex  gap-4 items-center">
                <div>icon</div>
                <p className="">Virtual</p>
            </div>
        </div>

        

        <div className="flex justify-between gap-6 items-center">
            <p className=" font-medium">Status</p>
            <div>ON</div>
        </div>

        <hr className="font-bold border" />

        <div className="flex justify-between gap-6 items-center">
            <button className="underline">Copy link</button>

            <div className="flex  gap-6 items-center">
            <p className="">Share</p>
            <div>if</div>
        </div>
        </div>


        
    </div>
  )
}

export default LinksCard