import React from 'react'

const Description: React.FC<{ about: string }> = ({ about }) => {
  return (
    <p className='max-w-3xl p-6 mx-auto leading-relaxed tracking-wide text-center border border-gray-300 rounded-md bg-gray-50'>
      {about}
    </p>
  )
}

export default Description
