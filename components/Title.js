import React from 'react';

export default function Title({ name }) {
  return (
    <div className='p-4 border border-gray-300 rounded-md bg-gray-50'>
      <h1 className='text-3xl font-semibold'>{name}</h1>
    </div>
  );
}
