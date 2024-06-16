import React from 'react'
import LinksCard from './LinksCard'

const LinksPage = () => {
  return (
    <main>
        <h4 className='text-2xl font-semibold'>My Links</h4>
        <div className="mt-20 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
            {
                [1,2,3,4,5,6,7,8]?.map((items,idx)=>{
                    return (
                        <LinksCard key={idx}/>
                    )
                })
            }

        </div>
    </main>
  )
}

export default LinksPage