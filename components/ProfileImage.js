import React from 'react'
import Image from 'next/image'

export default function ProfileImage() {
  return (
    <div className='flex flex-col items-center justify-center pt-8'>
      <div className='w-24 h-24 mb-4 md:w-48 md:h-48'>
        <Image
          width={264}
          height={264}
          className='object-cover w-24 h-24 rounded-full md:w-48 md:h-48'
          src='/images/profile-pic.jpg'
          alt=''
        />
      </div>
      <p className='text-sm italic text-center text-gray-600'>
        A Web Developer who builds creative and innovative websites.
      </p>
    </div>
  )
}
