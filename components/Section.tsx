import React from 'react'
import Title from './Title'

const Section: React.FC<{ title: string; twMaxWidth: string }> = ({
  title,
  children,
  twMaxWidth
}) => {
  return (
    <div className={`mx-auto mt-16 flex flex-col items-center ${twMaxWidth}`}>
      <Title name={title} />
      {children}
    </div>
  )
}

export default Section
