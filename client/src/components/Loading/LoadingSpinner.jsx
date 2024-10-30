import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className='flex items-center justify-center min-h-screen '>
      <div className='w-5 h-5 border-4 border-red-500 border-t-transparent border-solid rounded-full animate-spin'></div>
    </div>
  );
};

export default LoadingSpinner;
