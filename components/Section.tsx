import React from 'react'
import Title from './Title'

const Section: React.FC<{ title: string; twMaxWidth: string }> = ({
  title,
  children,
  twMaxWidth
}) => {
  return (
    <div className={`flex flex-col items-center mt-16 mx-auto ${twMaxWidth}`}>
      <Title name={title} />
      {children}
    </div>
  )
}

export default Section
