import React from 'react'

const Description: React.FC<{ about: string }> = ({ about }) => {
  return (
    <p className='mx-auto max-w-3xl rounded-md border border-gray-300 bg-gray-50 p-6 text-center leading-relaxed tracking-wide'>
      {about}
    </p>
  )
}

export default Description
