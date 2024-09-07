import ShopfrontLayout from '@/components/appointments/Shopfront'
 
import React from 'react'

const ShopFrontLayout = ({children}:{children:React.ReactNode})=> {
  return (
    <ShopfrontLayout>
        {children}
    </ShopfrontLayout>
  )
}

export default ShopFrontLayout