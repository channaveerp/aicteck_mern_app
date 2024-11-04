// import React, { useEffect, useState } from 'react';
// import { GrNext, GrPrevious } from 'react-icons/gr';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import delete1 from '../../assets/delete.svg';
// import { handleDeliveryType } from '@cloudinary/url-gen/internal/url/cloudinaryURL';

// const ContentCreation = ({ onClose, onUpload, initialData }) => {
//   const [step, setStep] = useState(1);
//   const [mediaFiles, setMediaFiles] = useState(initialData?.mediaFiles || []);
//   const [mediaTags, setMediaTags] = useState(initialData?.mediaTags || '');
//   const [contentDescription, setContentDescription] = useState(
//     initialData?.description || ''
//   );
//   const [orientation, setOrientation] = useState(
//     initialData?.orientation || 'Fit to screen'
//   );
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [uploadStatus, setUploadStatus] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Effect to reset form when initialData changes
//   useEffect(() => {
//     if (initialData) {
//       setMediaFiles(initialData.mediaFiles || []);
//       setMediaTags(initialData.mediaTags || '');
//       setContentDescription(initialData.description || '');
//       setOrientation(initialData.orientation || 'Fit to screen');
//     } else {
//       // Reset to defaults when creating new content
//       setMediaFiles([]);
//       setMediaTags('');
//       setContentDescription('');
//       setOrientation('Fit to screen');
//     }
//   }, [initialData]);

//   const handleFileUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const MAX_FILES = 5;
//     const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300MB
//     const ALLOWED_TYPES = [
//       'image/jpeg',
//       'image/png',
//       'image/jpg',
//       'video/mp4',
//       'video/mpeg',
//     ];

//     // Check if the number of files exceeds the max limit
//     if (files.length + mediaFiles.length > MAX_FILES) {
//       toast.error(`You can upload a maximum of ${MAX_FILES} files.`);
//       return;
//     }

//     let totalSize = 0;
//     const validFiles = [];

//     for (const file of files) {
//       // Check allowed file types
//       if (!ALLOWED_TYPES.includes(file.type)) {
//         toast.error(
//           `Invalid type: ${file.name}. Only JPG, PNG, MP4, and MPEG are allowed.`
//         );
//         return;
//       }

//       // Check individual file size
//       if (file.size > MAX_FILE_SIZE) {
//         toast.error(`File too large: ${file.name}. Max size is 300MB.`);
//         return;
//       }

//       validFiles.push(file);
//       totalSize += file.size;
//     }

//     // Check total size
//     if (totalSize > MAX_FILE_SIZE) {
//       toast.error('Total file size must not exceed 300MB.');
//       return;
//     }

//     setMediaFiles((prev) => [...prev, ...validFiles]);
//     setCurrentImageIndex(0); // Reset index after new upload
//   };

//   const handleUpload = async () => {
//     // Validate form
//     if (
//       mediaFiles.length === 0 ||
//       !mediaTags ||
//       !contentDescription ||
//       !orientation
//     ) {
//       toast.info('Please fill all fields');
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();

//     // Append each file as 'images'
//     mediaFiles.forEach((file) => {
//       formData.append('images', file);
//     });

//     // Process media tags
//     const tagsArray = mediaTags.split(',').map((tag) => tag.trim());
//     if (tagsArray.length > 10) {
//       toast.warning('Tags should be less than 10.');
//       setLoading(false);
//       return;
//     }
//     if (contentDescription.length > 200) {
//       toast.warning('Content description should be less than 200 characters.');
//       setLoading(false);
//       return;
//     }

//     formData.append('mediaTags', JSON.stringify(tagsArray));
//     formData.append('description', contentDescription);
//     formData.append('orientation', orientation);

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_LOCAL_BASE_URL}content`,
//         formData,
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         }
//       );

//       // Handle success response
//       setUploadStatus('Upload successful!');
//       onUpload(response.data); // Close the modal after successful upload
//     } catch (error) {
//       console.error('Error uploading data:', error);
//       if (error.response) {
//         toast.error(
//           `Error: ${error.response.data.message || 'Something went wrong.'}`
//         );
//       } else {
//         toast.error('Something went wrong uploading data');
//       }
//       setUploadStatus('Error uploading data. Please try again.');
//     } finally {
//       setLoading(false); // Ensure loading is reset
//     }
//   };

//   const handleNextImage = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mediaFiles.length);
//   };

//   const handlePrevImage = () => {
//     setCurrentImageIndex((prevIndex) =>
//       prevIndex === 0 ? mediaFiles.length - 1 : prevIndex - 1
//     );
//   };
//   const handleDeleteMediaFile = (index) => {
//     // Create a new array excluding the file at the specified index
//     const updatedMediaFiles = mediaFiles.filter((_, i) => i !== index);
//     setMediaFiles(updatedMediaFiles);

//     // Adjust the current index if necessary
//     if (currentImageIndex >= updatedMediaFiles.length) {
//       setCurrentImageIndex(updatedMediaFiles.length - 1);
//     }
//   };
//   return (
//     <div className='bg-white p-6 rounded-lg w-[500px] md:w-[600px] lg:w-[700px] max-h-[500px] overflow-y-auto'>
//       <h2 className='text-xl font-semibold mb-4'>
//         {initialData ? 'Edit Content' : 'Add Content'}
//       </h2>
//       {/* Upload Status */}
//       {uploadStatus && (
//         <div className='mb-4 text-center text-green-600'>{uploadStatus}</div>
//       )}
//       {step == 1 && (
//         <>
//           {/* Media Preview */}
//           <div className='mb-4'>
//             <p className='text-sm font-semibold mb-2'>Content Preview</p>
//             {mediaFiles.length > 0 ? (
//               <div className='relative'>
//                 {mediaFiles[currentImageIndex].type.startsWith('video/') ? (
//                   <div className='relative'>
//                     <video
//                       controls
//                       className='w-full h-[250px] object-cover rounded-[12px]'
//                       src={URL.createObjectURL(mediaFiles[currentImageIndex])}
//                     />
//                     <div className='absolute right-5 top-2 bg-slate-400 h-[44px] w-[44px] rounded-[50%] p-3'>
//                       <button
//                         onClick={() =>
//                           handleDeleteMediaFile(currentImageIndex)
//                         }>
//                         <img src={delete1} alt='delete1' />
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className='relative'>
//                     <img
//                       src={URL.createObjectURL(mediaFiles[currentImageIndex])}
//                       alt='Preview'
//                       className='w-full h-[250px] object-cover rounded-[12px]'
//                     />
//                     <div className='absolute right-5 top-2 bg-slate-400 h-[44px] w-[44px] rounded-[50%] p-3'>
//                       <button
//                         onClick={() =>
//                           handleDeleteMediaFile(currentImageIndex)
//                         }>
//                         <img src={delete1} alt='delete1' />
//                       </button>
//                     </div>
//                   </div>
//                 )}
//                 {mediaFiles?.length > 1 && (
//                   <div className='absolute top-1/2 left-0 right-0 flex justify-between'>
//                     <button
//                       onClick={handlePrevImage}
//                       className='bg-gray-200 rounded-full p-1'>
//                       <GrPrevious />
//                     </button>
//                     <button
//                       onClick={handleNextImage}
//                       className='bg-gray-200 rounded-full p-1'>
//                       <GrNext />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <input type='file' multiple onChange={handleFileUpload} />
//             )}
//           </div>
//         </>
//       )}
//       {step == 2 && (
//         <>
//           <div className='mb-4'>
//             <label className='block text-sm font-medium mb-1'>Media Tags</label>
//             <input
//               type='text'
//               placeholder='Enter tags separated by commas'
//               value={mediaTags}
//               onChange={(e) => setMediaTags(e.target.value)}
//               className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500'
//             />
//           </div>

//           {/* Content Description */}
//           <div className='mb-4'>
//             <label className='block text-sm font-medium mb-1'>
//               Content Description
//             </label>
//             <input
//               type='text'
//               placeholder='Enter Content Description'
//               value={contentDescription}
//               maxLength={200}
//               onChange={(e) => setContentDescription(e.target.value)}
//               className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500'
//             />
//           </div>

//           {/* Orientation */}
//           <div className='mb-4'>
//             <label className='block text-sm font-medium mb-1'>
//               Orientation
//             </label>
//             <select
//               value={orientation}
//               onChange={(e) => setOrientation(e.target.value)}
//               className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500'>
//               <option>Fit to screen</option>
//               <option>Landscape</option>
//               <option>Portrait</option>
//             </select>
//           </div>

//           {/* Action Buttons */}
//           <div className='flex justify-end space-x-2'>
//             <button
//               onClick={onClose}
//               className='bg-gray-200 text-gray-700 px-4 py-2 rounded-lg'>
//               Back
//             </button>
//             <button
//               onClick={handleUpload}
//               className={`bg-green-600 text-white px-4 py-2 rounded-lg h-[40px] ${
//                 loading ? 'cursor-not-allowed opacity-70' : ''
//               }`}
//               disabled={loading}>
//               {loading ? 'Loading...' : initialData ? 'Update' : 'Upload'}
//             </button>
//           </div>
//         </>
//       )}

//       {/* Media Tags */}
//     </div>
//   );
// };

// export default ContentCreation;

import React, { useEffect, useState } from 'react';
import { GrNext, GrPrevious } from 'react-icons/gr';
import axios from 'axios';
import { toast } from 'react-toastify';
import delete1 from '../../assets/delete.svg';
import editIcon from '../../assets/editIcon.svg';

const ContentCreation = ({ onClose, onUpload, initialData }) => {
  const [step, setStep] = useState(1);
  const [mediaFiles, setMediaFiles] = useState(initialData?.mediaFiles || []);
  const [mediaTags, setMediaTags] = useState(initialData?.mediaTags || '');
  const [contentDescription, setContentDescription] = useState(
    initialData?.description || ''
  );
  const [orientation, setOrientation] = useState(
    initialData?.orientation || 'Fit to screen'
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const MAX_FILES = 5;
    const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300MB
    const ALLOWED_TYPES = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'video/mp4',
      'video/mpeg',
    ];

    if (files.length + mediaFiles.length > MAX_FILES) {
      toast.error(`You can upload a maximum of ${MAX_FILES} files.`);
      return;
    }

    const validFiles = files.filter(
      (file) => ALLOWED_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
    );
    setMediaFiles((prev) => [...prev, ...validFiles]);
    setCurrentImageIndex(0);
  };

  const handleNextStep = () => {
    if (mediaFiles?.length === 0) {
      toast.warning('Please select a file to upload');
      return;
    }
    setStep(step + 1);
  };

  const handleUpload = async () => {
    if (
      mediaFiles.length === 0 ||
      !mediaTags ||
      !contentDescription ||
      !orientation
    ) {
      toast.info('Please fill all fields');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    mediaFiles.forEach((file) => formData.append('images', file));

    formData.append(
      'mediaTags',
      JSON.stringify(mediaTags.split(',').map((tag) => tag.trim()))
    );
    formData.append('description', contentDescription);
    formData.append('orientation', orientation);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LOCAL_BASE_URL}content`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      toast.success('Upload successful!');
      onUpload(response.data);
    } catch (error) {
      toast.error('Error uploading data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMediaFile = (index) => {
    const updatedMediaFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedMediaFiles);
    if (currentImageIndex >= updatedMediaFiles.length) {
      setCurrentImageIndex(updatedMediaFiles.length - 1);
    }
  };

  const handleEditFileName = (index, newFileName) => {
    const updatedMediaFiles = [...mediaFiles];
    updatedMediaFiles[index] = new File(
      [updatedMediaFiles[index]],
      newFileName,
      {
        type: updatedMediaFiles[index].type,
      }
    );
    setMediaFiles(updatedMediaFiles);
  };

  return (
    <div className='bg-white p-6 rounded-lg w-[500px] md:w-[600px] lg:w-[700px] max-h-[500px] overflow-y-auto'>
      <h2 className='text-xl font-semibold mb-4'>
        {initialData ? 'Edit Content' : 'Add Content'}
      </h2>
      {/* step -1 */}
      {step === 1 && (
        <>
          <div className='mb-4'>
            <p className='text-sm font-semibold mb-2'>Content Preview</p>
            {mediaFiles.length > 0 ? (
              <div>
                {mediaFiles.map((file, index) => (
                  <div
                    key={index}
                    className='flex items-center mb-2 border-2 rounded-sm px-2 py-2 justify-between'>
                    <div className='flex'>
                      {file.type.startsWith('video/') ? (
                        <video
                          src={URL.createObjectURL(file)}
                          className='w-[42px] h-[42px] rounded-[3px] object-contain mr-4'
                          // controls
                        />
                      ) : (
                        <img
                          src={URL.createObjectURL(file)}
                          alt='Preview'
                          className='w-[42px] h-[42px] object-contain rounded-[3px] mr-4 outline-none border-none'
                        />
                      )}
                      <div className='flex flex-col items-start '>
                        <input
                          type='text'
                          value={file.name}
                          // onChange={(e) =>
                          //   handleEditFileName(index, e.target.value)
                          // }
                          className='flex-1 border-none outline-none border-gray-300 rounded py-1'
                        />
                        {/* Display file extension and size */}
                        <div className='text-sm text-gray-500'>
                          <span className='bg-[#ECFDF3] text-[#118D57] text-[10px] '>
                            {file.type.split('/')[1].toUpperCase()}{' '}
                            &nbsp;&nbsp;&nbsp;
                          </span>
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      </div>
                    </div>

                    <div>
                      <button>-</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <input type='file' multiple onChange={handleFileUpload} />
            )}
          </div>
          <div className='flex justify-end'>
            <button
              style={{ cursor: step == 1 ? 'not-allowed' : '' }}
              disabled
              onClick={() => setStep(step - 1)}
              className='bg-gray-200 px-4 py-2 rounded-lg mr-2'>
              Back
            </button>
            <button
              onClick={handleNextStep}
              className='bg-green-600 text-white px-4 py-2 rounded-lg'>
              Continue
            </button>
          </div>
        </>
      )}

      {/* step-2 */}

      {step === 2 && (
        <>
          <div className='mb-4'>
            <p className='text-sm font-semibold mb-2'>Content Preview</p>
            {mediaFiles.length > 0 ? (
              <div>
                {mediaFiles.map((file, index) => (
                  <div
                    key={index}
                    className='flex items-center mb-2 border-2 rounded-sm px-2 py-2 justify-between'>
                    <div className='flex'>
                      {file.type.startsWith('video/') ? (
                        <video
                          src={URL.createObjectURL(file)}
                          className='w-[42px] h-[42px] rounded-[3px] object-contain mr-4'
                          // controls
                        />
                      ) : (
                        <img
                          src={URL.createObjectURL(file)}
                          alt='Preview'
                          className='w-[42px] h-[42px] object-contain rounded-[3px] mr-4 outline-none border-none'
                        />
                      )}
                      <div className='flex flex-col items-start '>
                        <input
                          type='text'
                          value={file.name}
                          // onChange={(e) =>
                          //   handleEditFileName(index, e.target.value)
                          // }
                          className='flex-1 border-none outline-none border-gray-300 rounded py-1'
                        />
                        {/* Display file extension and size */}
                        <div className='text-sm text-gray-500'>
                          <span className='bg-[#ECFDF3] text-[#118D57] text-[10px] '>
                            {file.type.split('/')[1].toUpperCase()}{' '}
                            &nbsp;&nbsp;&nbsp;
                          </span>
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        className='mr-2'
                        onClick={() =>
                          handleEditFileName(
                            index,
                            prompt('Edit filename:', file.name)
                          )
                        }>
                        <img src={editIcon} alt='editIcon' />
                      </button>
                      <button onClick={() => handleDeleteMediaFile(index)}>
                        <img src={delete1} alt='Delete' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <input type='file' multiple onChange={handleFileUpload} />
            )}
          </div>
          <div className='flex justify-end'>
            <button
              onClick={() => setStep(step - 1)}
              className='bg-gray-200 px-4 py-2 rounded-lg mr-2'>
              Back
            </button>
            <button
              onClick={handleNextStep}
              className='bg-green-600 text-white px-4 py-2 rounded-lg'>
              Continue
            </button>
          </div>
        </>
      )}
      {/* step-3 */}
      {step === 3 && (
        <>
          <div className='mb-4'>
            <div className='relative'>
              {mediaFiles[currentImageIndex].type.startsWith('video/') ? (
                <video
                  src={URL.createObjectURL(mediaFiles[currentImageIndex])}
                  className='w-full h-64 rounded-[12px]'
                  controls
                />
              ) : (
                <img
                  src={URL.createObjectURL(mediaFiles[currentImageIndex])}
                  alt='Preview'
                  className='w-full h-64 object-cover rounded-[12px]'
                />
              )}
              <div className='absolute top-1/2 left-0 right-0 flex justify-between'>
                <button
                  className='bg-red-300 w-[50px] h-[50px] rounded-[50%] text-center flex items-center justify-center'
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? mediaFiles.length - 1 : prev - 1
                    )
                  }>
                  <GrPrevious />
                </button>
                <button
                  className='bg-red-300 w-[50px] h-[50px] rounded-[50%] text-center flex items-center justify-center'
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev + 1) % mediaFiles.length
                    )
                  }>
                  <GrNext />
                </button>
              </div>
            </div>
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>Media Tags</label>
            <input
              type='text'
              placeholder='Enter tags separated by commas'
              value={mediaTags}
              onChange={(e) => setMediaTags(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-3 py-2'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>
              Content Description
            </label>
            <input
              type='text'
              placeholder='Enter Content Description'
              value={contentDescription}
              maxLength={200}
              onChange={(e) => setContentDescription(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-3 py-2'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>
              Orientation
            </label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-3 py-2'>
              <option>Fit to screen</option>
              <option>Landscape</option>
              <option>Portrait</option>
            </select>
          </div>

          <div className='flex justify-end'>
            <button
              onClick={() => setStep(step - 1)}
              className='bg-gray-200 px-4 py-2 rounded-lg mr-2'>
              Back
            </button>
            <button
              onClick={handleUpload}
              className={`bg-green-600 text-white px-4 py-2 rounded-lg ${
                loading ? 'cursor-not-allowed opacity-70' : ''
              }`}
              disabled={loading}>
              {loading ? 'Loading...' : 'Upload'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ContentCreation;
