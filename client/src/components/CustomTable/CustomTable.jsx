import React from 'react';

const CustomTable = ({ headers, rows, handleClick }) => {
  const getMediaType = (media) => {
    if (!media || media.length === 0) {
      return 'Video'; // Default if no media
    }

    const firstMediaPath = media[0]?.path;
    const extension = firstMediaPath
      ?.split('?')[0]
      ?.split('.')
      .pop()
      ?.toLowerCase(); // Splits at '?' to handle URLs with tokens

    // Determine media type based on the extension
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return 'Image';
    } else if (['mp4', 'avi', 'mov'].includes(extension)) {
      return 'Video';
    }
    return 'Unknown';
  };

  return (
    <div
      className='overflow-x-auto max-h-[400px] overflow-y-scroll relative border-[]'
      style={{
        border: '0.25px solid #9EA3A9',
        borderRadius: '5px',
        maxWidth: '97%',
      }}>
      <table className='min-w-full bg-[#FFFFFF] '>
        <thead className='sticky top-0 z-20 '>
          <tr className='w-full  text-[#212B36]'>
            {headers.map((header, index) => (
              <th
                key={index}
                className='px-6 py-3 text-left text-[13px] font-[500]'>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.length > 0 ? (
            <>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className='border-b '>
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
                                src={`${row?.images[0]?.path}`}
                                alt={row.description}
                                className='w-8 h-8 mr-2 rounded'
                              />
                            ) : (
                              <video className='w-8 h-8 mr-2 rounded' controls>
                                <source
                                  src={`${row.images[0].path}`}
                                  type='video/mp4'
                                />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </>
                        ) : (
                          <div className='w-8 h-8 mr-2 rounded text-[#212B36]'></div>
                        )}
                        {row.description}
                      </div>
                    </div>
                  </td>
                  {/* Display media type */}
                  <td className='px-6 py-4 text-sm text-[#212B36]'>
                    {getMediaType(row.images)}
                  </td>
                  <td className='px-6 py-4 text-sm text-[#212B36]'>N/A</td>
                  {/* <td className='px-6 py-4 text-sm text-gray-700'>
                      {row?.images && row?.images?.length > 0
                        ? `${(row?.images[0]?.size / 1024).toFixed(2)} KB` // Access 'size'
                        : 'N/A'}
                    </td> */}
                  <td className='px-6 py-4 text-sm text-[#212B36]'>
                    {row.createdAt
                      ? new Date(row?.createdAt).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td className='px-6 py-4 text-sm text-[#212B36]'>
                    {row?.images && row?.images?.length > 0
                      ? `${(row?.images[0]?.size / 1024).toFixed(2)} KB`
                      : 'N/A'}
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <button
                      className='text-gray-500 w-[20px] hover:text-gray-700  '
                      onClick={() => handleClick(row)}>
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
