import { useGetBookingsAnalytics } from '@/hooks'
import React, { Dispatch, SetStateAction } from 'react'
import SimpleSelect from '../ui/SimpleSelect'

const SelectDuration = ({type,setType}:{
  type:string, setType:Dispatch<SetStateAction<string>>
}) => {
  const options = ['weekly','monthly','yearly']

  return (
    <SimpleSelect
      options={options}
      value={type}
      setValue={setType}
    />
  )
}

export default SelectDuration