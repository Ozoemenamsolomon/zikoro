import { redirect } from 'next/navigation'
 
import React from 'react'

const ShopFrontPage = ({children}:{children:React.ReactNode})=> {
  redirect('/appointments/store-front/booking')
}

export default ShopFrontPage