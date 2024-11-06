import React from 'react'
import Articleone from './Articleone'
import ArticleTwo from './ArticleTwo'

const ContactInfo = ( ) => {
  return (
    <div className="flex flex-col md:flex-row w-full h-full md:divide-x  ">
        <Articleone  />
        <ArticleTwo  />
    </div>
  )
}

export default ContactInfo