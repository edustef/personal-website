import React from 'react'

const SkillBlock: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <div className='mb-4 w-full md:w-64'>
      <h2 className='mb-4 text-center text-2xl font-semibold'>{title}</h2>
      {children}
    </div>
  )
}

export default SkillBlock
