import { useEffect, useState } from 'react';
import CustomModal from '../components/CustomModal/CustomModal';
import { headers } from '../components/CustomTable/dummyData';
import CustomTable from '../components/CustomTable/CustomTable';
import img1 from '../assets/img1.png';
import delete1 from '../assets/delete.svg';
import edit from '../assets/editIcon.svg';
import bitcoin from '../assets/bitcoin.svg';
import ic_baseline from '../assets/ic_baseline-density-large.svg';
import tabler_columns from '../assets/tabler_columns-3.svg';
import Vector from '../assets/Vector.svg';
import fluent_filter from '../assets/fluent_filter-24-filled.svg';
import export1 from '../assets/export.svg';
import list from '../assets/list.svg';
import StorageComponent from '../components/Storage/Storage';
import ContentCreation from '../components/ContentCreation/ContentCreation';
import axios from 'axios';
import { toast } from 'react-toastify';

const Mycontent = () => {
  const [listContent, setListContent] = useState([]);
  const totalStorage = 5120; // 5GB in MB
  const [usedStorage, setUsedStorage] = useState(90); // Initial storage usage in MB

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [contentModal, setContentModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // For edit modal

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const openEditModal = (event) => {
    event.stopPropagation(); // Prevent modal close
    setIsModalOpen(false);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const updateContent = async (updatedRow) => {
    debugger;
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/content/${updatedRow._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: updatedRow.description,
            orientation: updatedRow.orientation,
            mediaTags: updatedRow.mediaTags, // Ensure this is the correct format (as an array)
          }),
        }
      );
      const data = await response.json();
      if (data.content) {
        getContentData();
        setEditModalOpen(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedRow) return;

    const confirmation = window.confirm(
      `Are you sure you want to delete the content "${selectedRow.description}"?`
    );

    if (!confirmation) return;

    try {
      const res = await axios.delete(
        `http://localhost:4000/api/v1/content/${selectedRow._id}`
      );
      if (res.status === 200) {
        toast.success('Content deleted successfully!', { autoClose: 3000 });
        getContentData(); // Refresh content list
        setIsModalOpen(false);
        setSelectedRow(null);
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content. Please try again.', {
        autoClose: 3000,
      });
    }
  };

  const handleCreateNewContent = () => {
    setContentModal(true);
  };

  const handleUpload = (contentData) => {
    console.log('Uploaded Content:', contentData);
    setContentModal(false);
    getContentData();
  };

  const getContentData = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/content/list');
      setListContent(res.data); // Corrected the state update to use setListContent
    } catch (error) {
      console.error('Error fetching content data:', error);
    }
  };

  useEffect(() => {
    getContentData();
  }, []);
  const parseMediaTags = (tags) => {
    // Join the tags into a single string and remove extra brackets and quotes
    const cleanedString = tags?.join(', ').replace(/(\[|\]|\"|\s)/g, '');
    return cleanedString.split(','); // Split by commas to create an array
  };

  const cleanMediaTags = (mediaTags) => {
    return mediaTags?.map((tag) => tag?.replace(/["\[\]]/g, '').trim());
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = selectedRow?.mediaTags?.filter((tag) => {
      const cleanedTag = tag?.replace(/["\[\]]/g, '').trim(); // Clean tag for comparison
      return cleanedTag !== tagToRemove; // Keep tags that don't match
    });

    setSelectedRow((prev) => ({
      ...prev,
      mediaTags: updatedTags,
    }));
  };

  // Assuming selectedRow contains your data
  const tagsToDisplay = cleanMediaTags(selectedRow?.mediaTags);

  console.log('selected content', selectedRow);

  return (
    <>
      {/* Content Creation Modal */}
      {contentModal && (
        <CustomModal
          isOpen={contentModal}
          onClose={() => setContentModal(false)}>
          <ContentCreation
            onClose={() => setContentModal(false)}
            onUpload={handleUpload}
          />
        </CustomModal>
      )}

      {/* Edit Modal */}
      {/* {editModalOpen && (
        <CustomModal isOpen={editModalOpen} onClose={closeEditModal}>
          <div className='min-w-[720px]'>
            <h2 className='text-xl font-semibold'>Edit Content</h2>
            <textarea
              className='border p-2 w-full rounded'
              defaultValue={selectedRow?.description}
              onChange={(e) =>
                setSelectedRow((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            <button
              type='button'
              onClick={() =>
                updateContent(selectedRow._id, selectedRow.description)
              }
              className='bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 mt-4'>
              Update
            </button>
          </div>
        </CustomModal>
      )} */}
      {/* {editModalOpen && (
        <CustomModal isOpen={editModalOpen} onClose={closeEditModal}>
          <div className='min-w-[720px]'>
            <h2 className='text-xl font-semibold'>Edit Content</h2>

            <textarea
              className='border p-2 w-full rounded mb-4'
              value={selectedRow?.description || ''} // Use value instead of defaultValue
              onChange={(e) =>
                setSelectedRow((prev) => ({
                  ...prev,
                  description: e.target.value, // Directly set the value from the textarea
                }))
              }
              placeholder='Description'
            />

            <input
              type='text'
              className='border p-2 w-full rounded mb-4'
              value={selectedRow?.orientation || ''} // Use value instead of defaultValue
              onChange={(e) =>
                setSelectedRow((prev) => ({
                  ...prev,
                  orientation: e.target.value,
                }))
              }
              placeholder='Orientation'
            />

            <input
              type='text'
              className='border p-2 w-full rounded mb-4'
              value={selectedRow?.mediaTags.join(', ') || ''} // Use value instead of defaultValue
              onChange={(e) =>
                setSelectedRow((prev) => ({
                  ...prev,
                  mediaTags: e.target.value.split(',').map((tag) => tag.trim()),
                }))
              }
              placeholder='Tags (comma separated)'
            />

            <button
              type='button'
              onClick={() => updateContent(selectedRow)} // Pass the entire selectedRow object
              className='bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 mt-4'>
              Update
            </button>
          </div>
        </CustomModal>
      )} */}
      {editModalOpen && (
        <CustomModal isOpen={editModalOpen} onClose={closeEditModal}>
          <div className='min-w-[720px]'>
            <h2 className='text-xl font-semibold'>Edit Content</h2>
            <strong>Description</strong>
            <textarea
              className='border p-2 w-full rounded'
              value={selectedRow?.description} // Use value instead of defaultValue
              onChange={(e) =>
                setSelectedRow((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />

            {/* Select for Orientation */}
            <strong>Orientation</strong>
            <select
              value={selectedRow?.orientation} // Bind the select value to the selectedRow's orientation
              onChange={(e) =>
                setSelectedRow((prev) => ({
                  ...prev,
                  orientation: e.target.value, // Update the orientation in state
                }))
              }
              className='border p-2 w-full rounded mt-4'>
              <option value='Portrait'>Portrait</option>
              <option value='Landscape'>Landscape</option>
              <option value='Fit to Screen'>Fit to Screen</option>
            </select>

            {/* Display Tags with Delete Button */}
            <strong>Media-Tags</strong>
            <div className='flex flex-wrap mt-4 border rounded-sm p-2 max-w-[720px]'>
              {tagsToDisplay?.map((tag, index) => (
                <span
                  key={index}
                  className='tag bg-gray-200 rounded-lg px-2 py-1 mr-2 flex items-center'>
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className='cross-button ml-2 text-red-500 hover:text-red-700'>
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <button
              type='button'
              onClick={() => updateContent(selectedRow)} // Pass the entire selectedRow object
              className='bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 mt-4'>
              Update
            </button>
          </div>
        </CustomModal>
      )}

      <div className='bg-[#F9FAFB]'>
        <div className='flex justify-between'>
          <h1 className='text-2xl font-semibold mb-4'>My Content</h1>
          <button
            onClick={handleCreateNewContent}
            type='button'
            className='mr-[50px] focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5'>
            New Content
          </button>
        </div>

        <div className='flex justify-between w-[95%]'>
          <div className='flex gap-4 mb-4 pl-5 items-center'>
            <img src={list} alt='list' className='w-[24px] h-[24px]' />
            <img src={bitcoin} alt='bitcoin' className='w-[24px] h-[24px]' />
            <StorageComponent
              usedStorage={usedStorage}
              totalStorage={totalStorage}
            />
          </div>
          <div className='flex gap-4 items-center justify-center'>
            <button
              type='button'
              className='inline-flex gap-2 focus:outline-none text-[#212B36]  px-4 py-2 border-2 rounded-[50px] text-[12px] font-[400]'>
              <img src={export1} alt='export' />
              Export CSV
            </button>
            <img
              src={fluent_filter}
              alt='fluent_filter'
              className='w-[20px] h-[20px]'
            />
            <img
              src={tabler_columns}
              alt='tabler_columns'
              className='w-[20px] h-[20px]'
            />
            <img
              src={ic_baseline}
              alt='ic_baseline'
              className='w-[20px] h-[20px]'
            />
            <img src={Vector} alt='vector' className='w-[20px] h-[20px]' />
            <img src={list} alt='list' className='w-[30px] h-[30px]' />
          </div>
        </div>

        <CustomTable
          headers={headers}
          rows={listContent}
          handleClick={handleOpenModal}
        />

        {/* Details Modal */}
        {isModalOpen && (
          <CustomModal isOpen={isModalOpen} onClose={handleCloseModal}>
            {selectedRow ? (
              <div className='min-w-[720px]'>
                <h2 className='text-xl font-semibold'>Content Details</h2>
                <div className='border-2 p-4 rounded-lg flex items-start justify-between'>
                  <div className='flex flex-col'>
                    <div className='inline'>
                      <strong>Description:</strong> {selectedRow.description}
                    </div>
                    <div className='inline'>
                      <strong>Orientation:</strong> {selectedRow.orientation}
                    </div>
                    <div className='inline'>
                      <strong>Size:</strong>{' '}
                      {(
                        selectedRow.images.reduce(
                          (total, img) => total + img.size,
                          0
                        ) / 1024
                      ).toFixed(2)}{' '}
                      KB
                    </div>
                    <div className='inline'>
                      <strong>Tags:</strong>{' '}
                      {parseMediaTags(selectedRow.mediaTags).join(', ')}
                    </div>
                  </div>
                  <div className='flex space-x-4'>
                    <button
                      onClick={openEditModal}
                      className='text-blue-500 hover:text-blue-700'>
                      <img src={edit} alt='edit' />
                    </button>
                    <button
                      onClick={handleDelete}
                      className='text-red-500 hover:text-red-700'>
                      <img src={delete1} alt='delete' />
                    </button>
                  </div>
                </div>
                <div className='mt-4'>
                  <div className='flex gap-2 max-w-[720px] flex-wrap overflow-scroll max-h-[350px]'>
                    {selectedRow.images?.map((mediaObj, index) => {
                      const mediaPath = `http://localhost:4000${mediaObj.path}`;
                      const isVideo = mediaObj.path.endsWith('.mp4');

                      return (
                        <div key={index} className='mb-4'>
                          {isVideo ? (
                            <video
                              src={mediaPath}
                              controls
                              className='w-100 h-[150px] object-cover rounded-md'>
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <img
                              src={mediaPath}
                              alt={`Media Content ${index + 1}`}
                              className='w-100 h-[150px] object-cover rounded-md'
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </CustomModal>
        )}
      </div>
    </>
  );
};

export default Mycontent;

// import { useEffect, useState } from 'react';
// import CustomModal from '../components/CustomModal/CustomModal';
// import { headers } from '../components/CustomTable/dummyData';
// import CustomTable from '../components/CustomTable/CustomTable';
// import img1 from '../assets/img1.png';
// import delete1 from '../assets/delete.svg';
// import edit from '../assets/editIcon.svg';
// import bitcoin from '../assets/bitcoin.svg';
// import ic_baseline from '../assets/ic_baseline-density-large.svg';
// import tabler_columns from '../assets/tabler_columns-3.svg';
// import Vector from '../assets/Vector.svg';
// import fluent_filter from '../assets/fluent_filter-24-filled.svg';
// import export1 from '../assets/export.svg';
// import list from '../assets/list.svg';
// import StorageComponent from '../components/Storage/Storage';
// import ContentCreation from '../components/ContentCreation/ContentCreation';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const Mycontent = () => {
//   const [listContent, setListContent] = useState([]);
//   const totalStorage = 5120; // 5GB in MB
//   const [usedStorage, setUsedStorage] = useState(90); // Initial storage usage in MB

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [contentModal, setContentModal] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false); // For edit modal

//   const handleOpenModal = (row) => {
//     setSelectedRow(row);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedRow(null);
//   };

//   const openEditModal = (event) => {
//     event.stopPropagation(); // Prevent modal close
//     setIsModalOpen(false);
//     setEditModalOpen(true);
//   };

//   const closeEditModal = () => {
//     setEditModalOpen(false);
//   };

//   const updateContent = async (id, updatedDescription, updatedOrientation) => {
//     try {
//       const response = await fetch(
//         `http://localhost:4000/api/v1/content/${id}`,
//         {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             description: updatedDescription,
//             orientation: updatedOrientation,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data.content) {
//         getContentData();
//         setEditModalOpen(false);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedRow) return;

//     const confirmation = window.confirm(
//       `Are you sure you want to delete the content "${selectedRow.description}"?`
//     );

//     if (!confirmation) return;

//     try {
//       const res = await axios.delete(
//         `http://localhost:4000/api/v1/content/${selectedRow._id}`
//       );
//       if (res.status === 200) {
//         toast.success('Content deleted successfully!', { autoClose: 3000 });
//         getContentData(); // Refresh content list
//         setIsModalOpen(false);
//         setSelectedRow(null);
//       }
//     } catch (error) {
//       console.error('Error deleting content:', error);
//       toast.error('Failed to delete content. Please try again.', {
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCreateNewContent = () => {
//     setContentModal(true);
//   };

//   const handleUpload = (contentData) => {
//     console.log('Uploaded Content:', contentData);
//     setContentModal(false);
//     getContentData();
//   };

//   const getContentData = async () => {
//     try {
//       const res = await axios.get('http://localhost:4000/api/v1/content/list');
//       setListContent(res.data); // Corrected the state update to use setListContent
//     } catch (error) {
//       console.error('Error fetching content data:', error);
//     }
//   };

//   useEffect(() => {
//     getContentData();
//   }, []);

//   console.log('selected content', selectedRow);

//   return (
//     <>
//       {/* Content Creation Modal */}
//       {contentModal && (
//         <CustomModal
//           isOpen={contentModal}
//           onClose={() => setContentModal(false)}>
//           <ContentCreation
//             onClose={() => setContentModal(false)}
//             onUpload={handleUpload}
//           />
//         </CustomModal>
//       )}

//       {/* Edit Modal */}
//       {/* {editModalOpen && (
//         <CustomModal isOpen={editModalOpen} onClose={closeEditModal}>
//           <div className='min-w-[720px]'>
//             <h2 className='text-xl font-semibold'>Edit Content</h2>
//             <textarea
//               className='border p-2 w-full rounded'
//               defaultValue={selectedRow?.description}
//               onChange={(e) =>
//                 setSelectedRow((prev) => ({
//                   ...prev,
//                   description: e.target.value,
//                 }))
//               }
//             />
//             <label className='font-medium'>Orientation:</label>
//             <select
//               value={selectedRow?.orientation}
//               onChange={(e) =>
//                 setSelectedRow((prev) => ({
//                   ...prev,
//                   orientation: e.target.value,
//                 }))
//               }
//               className='border p-2 w-full rounded mb-4'>
//               <option value='Landscape'>Landscape</option>
//               <option value='Portrait'>Portrait</option>
//               <option value='Fit to Screen'>Fit to Screen</option>
//             </select>

//             <button
//               type='button'
//               onClick={() =>
//                 updateContent(
//                   selectedRow._id,
//                   selectedRow.description,
//                   selectedRow.orientation
//                 )
//               }
//               className='bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 mt-4'>
//               Update
//             </button>
//           </div>
//         </CustomModal>
//       )} */}
//       {editModalOpen && (
//         <CustomModal isOpen={editModalOpen} onClose={closeEditModal}>
//           <div className='min-w-[720px]'>
//             <h2 className='text-xl font-semibold'>Edit Content</h2>

//             {/* Editable Description */}
//             <textarea
//               className='border p-2 w-full rounded'
//               defaultValue={selectedRow?.description}
//               onChange={(e) =>
//                 setSelectedRow((prev) => ({
//                   ...prev,
//                   description: e.target.value,
//                 }))
//               }
//             />

//             {/* Editable Orientation */}
//             <label className='font-medium'>Orientation:</label>
//             <select
//               value={selectedRow?.orientation}
//               onChange={(e) =>
//                 setSelectedRow((prev) => ({
//                   ...prev,
//                   orientation: e.target.value,
//                 }))
//               }
//               className='border p-2 w-full rounded mb-4'>
//               <option value='Landscape'>Landscape</option>
//               <option value='Portrait'>Portrait</option>
//               <option value='Fit to Screen'>Fit to Screen</option>
//             </select>

//             {/* Editable Media Tags */}
//             <label className='font-medium'>
//               Media Tags (separate by commas):
//             </label>
//             <div className='flex gap-2 mb-4'>
//               {selectedRow?.mediaTags.map((tag, index) => (
//                 <div key={index} className='flex items-center'>
//                   <input
//                     type='text'
//                     className='border p-1 rounded'
//                     value={tag}
//                     onChange={(e) => {
//                       const updatedTags = [...selectedRow.mediaTags];
//                       updatedTags[index] = e.target.value;
//                       setSelectedRow((prev) => ({
//                         ...prev,
//                         mediaTags: updatedTags,
//                       }));
//                     }}
//                   />
//                   <button
//                     type='button'
//                     className='ml-2 text-red-500'
//                     onClick={() => {
//                       const updatedTags = selectedRow.mediaTags.filter(
//                         (_, i) => i !== index
//                       );
//                       setSelectedRow((prev) => ({
//                         ...prev,
//                         mediaTags: updatedTags,
//                       }));
//                     }}>
//                     x
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type='button'
//                 className='bg-blue-500 text-white rounded px-2'
//                 onClick={() => {
//                   setSelectedRow((prev) => ({
//                     ...prev,
//                     mediaTags: [...prev.mediaTags, ''], // Add an empty tag input
//                   }));
//                 }}>
//                 + Add Tag
//               </button>
//             </div>

//             {/* Update Button */}
//             <button
//               type='button'
//               onClick={() =>
//                 updateContent(
//                   selectedRow._id,
//                   selectedRow.description,
//                   selectedRow.orientation,
//                   selectedRow.mediaTags // Pass mediaTags to update
//                 )
//               }
//               className='bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 mt-4'>
//               Update
//             </button>
//           </div>
//         </CustomModal>
//       )}

//       <div className='bg-[#F9FAFB]'>
//         <div className='flex justify-between'>
//           <h1 className='text-2xl font-semibold mb-4'>My Content</h1>
//           <button
//             onClick={handleCreateNewContent}
//             type='button'
//             className='mr-[50px] focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5'>
//             New Content
//           </button>
//         </div>

//         <div className='flex justify-between w-[95%]'>
//           <div className='flex gap-4 mb-4 pl-5 items-center'>
//             <img src={list} alt='list' className='w-[24px] h-[24px]' />
//             <img src={bitcoin} alt='bitcoin' className='w-[24px] h-[24px]' />
//             <StorageComponent
//               usedStorage={usedStorage}
//               totalStorage={totalStorage}
//             />
//           </div>
//           <div className='flex gap-4 items-center justify-center'>
//             <button
//               type='button'
//               className='inline-flex gap-2 focus:outline-none text-[#212B36]  px-4 py-2 border-2 rounded-[50px] text-[12px] font-[400]'>
//               <img src={export1} alt='export' />
//               Export CSV
//             </button>
//             <img
//               src={fluent_filter}
//               alt='fluent_filter'
//               className='w-[20px] h-[20px]'
//             />
//             <img
//               src={tabler_columns}
//               alt='tabler_columns'
//               className='w-[20px] h-[20px]'
//             />
//             <img
//               src={ic_baseline}
//               alt='ic_baseline'
//               className='w-[20px] h-[20px]'
//             />
//             <img src={Vector} alt='vector' className='w-[20px] h-[20px]' />
//             <img src={list} alt='list' className='w-[30px] h-[30px]' />
//           </div>
//         </div>

//         <CustomTable
//           headers={headers}
//           rows={listContent}
//           handleClick={handleOpenModal}
//         />

//         {/* Details Modal */}
//         {isModalOpen && (
//           <CustomModal isOpen={isModalOpen} onClose={handleCloseModal}>
//             {selectedRow ? (
//               <div className='min-w-[720px]'>
//                 <h2 className='text-xl font-semibold'>Content Details</h2>
//                 <div className='border-2 p-4 rounded-lg flex items-start justify-between'>
//                   <div className='flex flex-col'>
//                     <div className='inline'>
//                       <strong>Description:</strong> {selectedRow.description}
//                     </div>
//                     <div className='inline'>
//                       <strong>Orientation:</strong> {selectedRow.orientation}
//                     </div>
//                     <div className='inline'>
//                       <strong>Size:</strong>{' '}
//                       {(
//                         selectedRow.images.reduce(
//                           (total, img) => total + img.size,
//                           0
//                         ) / 1024
//                       ).toFixed(2)}{' '}
//                       KB
//                     </div>
//                     <div className='flex flex-wrap gap-2 mt-2 max-w-[700px] h-[300px] overflow-y-scroll '>
//                       {selectedRow.images.map((img) => (
//                         <img
//                           key={img._id}
//                           src={`http://localhost:4000${img.path}`}
//                           alt='Content'
//                           className='max-w-[300px] max-h-[200px] object-cover rounded-lg'
//                         />
//                       ))}
//                     </div>
//                   </div>
//                   <div className='flex  gap-4 items-center'>
//                     <img
//                       src={edit}
//                       alt='edit'
//                       className='w-6 h-6 mb-2 cursor-pointer'
//                       onClick={openEditModal}
//                     />
//                     <img
//                       src={delete1}
//                       alt='delete'
//                       className='w-6 h-6 cursor-pointer'
//                       onClick={handleDelete}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div>No content selected</div>
//             )}
//           </CustomModal>
//         )}
//       </div>
//     </>
//   );
// };

// export default Mycontent;
