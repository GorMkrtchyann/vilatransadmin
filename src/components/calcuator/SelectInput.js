import { TextField } from '@mui/material'
import React from 'react'

export const SelectInput = ({ value, handleChange }) => {
  return (
    <>
      <TextField className='w-100 my-3' name='hy' value={value.hy || ''}
        required
        onChange={handleChange} id="outlined-basic" label="Armenia" variant="outlined" />
      <TextField className='w-100 my-3' name='en' value={value.en || ''}
        required
        onChange={handleChange} id="outlined-basic" label="English" variant="outlined" />
      <TextField name='ru' className='w-100 my-3' value={value.ru || ''}
        required
        onChange={handleChange} id="outlined-basic" label="Russian" variant="outlined" />
    </>
  )
}
