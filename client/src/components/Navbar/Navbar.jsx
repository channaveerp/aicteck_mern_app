import React from 'react';
import Logo from '../../assets/Logo.svg';
import ProfileLogo from '../../assets/ProfileLogo.svg';
import arrowright from '../../assets/arrowright.svg';

import English from '../../assets/English.svg';
import notification from '../../assets/notification.svg';

const Navbar = () => {
  return (
    <div className=' nav flex justify-between items-center'>
      {/* logo */}
      <div className=' pl-4 cursor-pointer'>
        <img src={Logo} alt='Logo' />
      </div>
      {/* profie content */}
      <div className='flex gap-8 pr-8 items-center'>
        <div>
          <img src={English} alt='English' />
        </div>
        <div>
          <img src={notification} alt='notification' />{' '}
        </div>
        <div className='flex gap-3 cursor-pointer'>
          {/* profile */}
          <div className='w-[45px] h-[45px] rounded-[50%]'>
            <img
              src={ProfileLogo}
              alt='logo'
              className='w-[100%] h-[100%] object-fill '
            />
          </div>
          {/* name designation */}
          <div className='flex flex-col cursor-pointer'>
            <span className='font-bold text-[13px] leading-19.5 text-[#212B36]'>
              AbiShek
            </span>
            <span className='font-normal text-[11px] leading-19.5 text-[#5C646D]'>
              Admin
            </span>
          </div>
          <img src={arrowright} alt='arrowright' className='rotate-90' />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
