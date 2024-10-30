import React from 'react';

const CustomTable = ({ headers, rows, handleClick }) => {
  const getMediaType = (media) => {
    if (!media || media?.length === 0) {
      return 'Video'; // Default if no media
    }
    console.log('rows', rows);
    const firstMediaPath = media[0]?.path; // Access the 'path' property
    const extension = firstMediaPath?.split('.')?.pop()?.toLowerCase();

    // Determine media type based on the extension
    if (['jpg', 'jpeg', 'png', 'gif']?.includes(extension)) {
      return 'Image';
    } else if (['mp4', 'avi', 'mov']?.includes(extension)) {
      return 'Video';
    }
    return 'Unknown';
  };

  return (
    <div className='overflow-x-auto max-h-[400px] overflow-y-scroll'>
      <table className='min-w-full bg-white'>
        <thead>
          <tr className='w-full bg-gray-100 text-gray-700'>
            {headers.map((header, index) => (
              <th
                key={index}
                className='px-6 py-3 text-left text-sm font-medium'>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.length > 0 ? (
            <>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className='border-b border-gray-200'>
                  <td className='px-6 py-4 text-sm text-gray-700'>
                    {rowIndex + 1}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-700'>
                    <div className='flex items-center'>
                      <div className='flex items-center'>
                        {row.images && row?.images?.length > 0 ? (
                          <>
                            {getMediaType(row.images) === 'Image' ? (
                              <img
                                src={`${import.meta.env.VITE_BACKEND_URL}${
                                  row?.images?.[0]?.path || ''
                                }`}
                                alt={row.description}
                                className='w-8 h-8 mr-2 r ounded'
                              />
                            ) : (
                              <video className='w-8 h-8 mr-2 rounded' controls>
                                <source
                                  src={`${import.meta.env.VITE_BACKEND_URL}${
                                    row?.images?.[0]?.path || ''
                                  }`}
                                  type='video/mp4'
                                />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </>
                        ) : (
                          <div className='w-8 h-8 mr-2 rounded bg-gray-200'></div> // Placeholder for no image
                        )}
                        {row.description}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-700'>
                    {getMediaType(row.images)} {/* Display media type */}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-700'>N/A</td>
                  {/* <td className='px-6 py-4 text-sm text-gray-700'>
                    {row?.images && row?.images?.length > 0
                      ? `${(row?.images[0]?.size / 1024).toFixed(2)} KB` // Access 'size'
                      : 'N/A'}
                  </td> */}
                  <td className='px-6 py-4 text-sm text-gray-700'>
                    {row.createdAt
                      ? new Date(row?.createdAt).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-700'>
                    {row?.images && row?.images?.length > 0
                      ? `${(row?.images[0]?.size / 1024).toFixed(2)} KB`
                      : 'N/A'}
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <button
                      onClick={() => handleClick(row)}
                      className='text-gray-500 hover:text-gray-700'>
                      ⋮
                    </button>
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <div className='absolute top-[70%] left-[60%] translate-x-[-50%] translate-y-[-50%]'>
              No data found
            </div>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
