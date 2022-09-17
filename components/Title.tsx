import React from 'react'

const Title: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className='rounded-md border border-gray-300 bg-gray-50 p-4'>
      <h1 className='text-3xl font-semibold'>{name}</h1>
    </div>
  )
}

export default Title
