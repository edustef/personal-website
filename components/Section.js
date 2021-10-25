import React from 'react'
import Title from './Title'

export default function Section({ title, children, twMaxWidth }) {
  return (
    <div className={`flex flex-col items-center mt-16 mx-auto ${twMaxWidth}`}>
      <Title name={title} />
      {children}
    </div>
  )
}
