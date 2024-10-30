// Sidebar.js
import React, { useState } from 'react';
import { sidebarData } from './SideBarData';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [collapsedItems, setCollapsedItems] = useState({});
  const location = useLocation();
  console.log('location', location);

  // Toggle function for collapsing and expanding items
  const handleCollapse = (index) => {
    setCollapsedItems((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the state of the clicked item
    }));
  };

  return (
    <div className={`flex  bg-gray-100 h-[80vh] transition-all`}>
      <div className='flex flex-col w-full'>
        {/* <button
          className='p-3 focus:outline-none'
          onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '<' : '>'}
        </button> */}

        {/* Map through the sidebarData */}
        {sidebarData?.map((item, index) => (
          <div key={index} className='mt-4'>
            <div
              className='p-3 flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-200'
              onClick={() => handleCollapse(index)}>
              <div className='flex items-center gap-2'>
                <img
                  src={item.icon}
                  alt='icons'
                  className='w-[20px] h-[20px]'
                />
                {isOpen && (
                  <span className='text-[13px] text-[#5C646D] line font-normal leading-19.5'>
                    {item.title}
                  </span>
                )}
              </div>
              <div>
                {/* Change the icon based on collapse state */}
                <img
                  src={item.arrowright} // Ensure this is a horizontal arrow image
                  alt='arrow'
                  className={`transition-transform duration-300 ${
                    collapsedItems[index] ? 'rotate-90' : 'rotate-0'
                  }`}
                />
              </div>
            </div>

            {/* Render child items if the item is expanded */}
            {isOpen && collapsedItems[index] && (
              <ul className='ml-8 mt-2 space-y-2'>
                {item.children?.map((child, childIndex) => (
                  <li
                    key={childIndex}
                    className={`cursor-pointer ${
                      location.pathname == child.path ? 'text-green-600' : ''
                    }`}>
                    <Link to={child.path}>• {child.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
