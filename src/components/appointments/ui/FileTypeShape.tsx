import Image from 'next/image'
import React from 'react'

const FileTypeShape = () => {
  return (
    <div className='h-24 relative '>
        <Image src={`/icons/filetype.png`} alt='' width={150} height={150} className='h-full w-24'/>
        <div className="px-2 py-1 bg-blue-500 text-white rounded-full absolute -left-4 top-1/2">.DOCX</div>
    </div>
  )
}

export default FileTypeShape