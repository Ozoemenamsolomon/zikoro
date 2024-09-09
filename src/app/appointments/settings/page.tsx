import { redirect } from 'next/navigation'
import React from 'react'

const SettingsPage = ({children}:{
  children: React.ReactNode
}) => {
  redirect('/appointments/settings/profile')
}

export default SettingsPage