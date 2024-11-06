import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className='flex items-center justify-center '>
      <div className=' w-[25px] h-[25px] border-4 border-black border-t-transparent border-solid rounded-full animate-spin'></div>
    </div>
  );
};

export default LoadingSpinner;
