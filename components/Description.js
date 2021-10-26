import React from 'react'

export default function Description({ profile }) {
  return (
    <p className='max-w-3xl p-6 mx-auto leading-relaxed tracking-wide text-center border border-gray-300 rounded-md bg-gray-50'>
      {profile.aboutMe}
    </p>
  )
}
