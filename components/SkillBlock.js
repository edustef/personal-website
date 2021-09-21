import React from 'react';

export default function SkillBlock({ title, children }) {
  return (
    <div className='w-full mb-4 md:w-64'>
      <h2 className='mb-4 text-2xl font-semibold text-center'>{title}</h2>
      {children}
    </div>
  );
}
