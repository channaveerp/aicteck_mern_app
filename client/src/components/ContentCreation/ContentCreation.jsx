// import React, { useState } from 'react';
// import { GrNext, GrPrevious } from 'react-icons/gr';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const ContentCreation = ({ onClose, onUpload }) => {
//   const [mediaFiles, setMediaFiles] = useState([]);
//   const [mediaTags, setMediaTags] = useState('');
//   const [contentDescription, setContentDescription] = useState('');
//   const [orientation, setOrientation] = useState('Fit to screen');
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [uploadStatus, setUploadStatus] = useState('');
//   const [loading, setLoading] = useState(false);

//   const MAX_FILES = 5;
//   const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300MB
//   const ALLOWED_TYPES = [
//     'image/jpeg',
//     'image/png',
//     'image/jpg',
//     'video/mp4',
//     'video/mpeg',
//   ];

//   const handleFileUpload = (e) => {
//     const files = Array.from(e.target.files);

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
//         'http://localhost:4000/api/v1/content',
//         formData,
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         }
//       );

//       // Handle success response
//       setUploadStatus('Upload successful!');
//       onUpload(response.data); // Close the modal after successful upload
//     } catch (error) {
//       // Log the error to console
//       console.error('Error uploading data:', error);
//       // Check for specific error response
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

//   return (
//     <div className='bg-white p-6 rounded-lg w-[500px] md:w-[600px] lg:w-[700px] max-h-[500px] overflow-y-auto'>
//       <h2 className='text-xl font-semibold mb-4'>Add Content</h2>
//       {/* Upload Status */}
//       {uploadStatus && (
//         <div className='mb-4 text-center text-green-600'>{uploadStatus}</div>
//       )}

//       {/* Media Preview */}
//       <div className='mb-4'>
//         <p className='text-sm font-semibold mb-2'>Content Preview</p>
//         {mediaFiles.length > 0 ? (
//           <div className='relative'>
//             {mediaFiles[currentImageIndex].type.startsWith('video/') ? (
//               <video
//                 controls
//                 className='w-full h-[250px] object-cover rounded-[12px]'
//                 src={URL.createObjectURL(mediaFiles[currentImageIndex])}
//               />
//             ) : (
//               <img
//                 src={URL.createObjectURL(mediaFiles[currentImageIndex])}
//                 alt='Preview'
//                 className='w-full h-[250px] object-cover rounded-[12px]'
//               />
//             )}
//             <div className='absolute top-1/2 left-0 right-0 flex justify-between'>
//               <button
//                 onClick={handlePrevImage}
//                 className='bg-gray-200 rounded-full p-1'>
//                 <GrPrevious />
//               </button>
//               <button
//                 onClick={handleNextImage}
//                 className='bg-gray-200 rounded-full p-1'>
//                 <GrNext />
//               </button>
//             </div>
//           </div>
//         ) : (
//           <input type='file' multiple onChange={handleFileUpload} />
//         )}
//       </div>

//       {/* Media Tags */}
//       <div className='mb-4'>
//         <label className='block text-sm font-medium mb-1'>Media Tags</label>
//         <input
//           type='text'
//           placeholder='Enter tags separated by commas'
//           value={mediaTags}
//           onChange={(e) => setMediaTags(e.target.value)}
//           className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500'
//         />
//       </div>

//       {/* Content Description */}
//       <div className='mb-4'>
//         <label className='block text-sm font-medium mb-1'>
//           Content Description
//         </label>
//         <input
//           type='text'
//           placeholder='Enter Content Description'
//           value={contentDescription}
//           maxLength={200}
//           onChange={(e) => setContentDescription(e.target.value)}
//           className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500'
//         />
//       </div>

//       {/* Orientation */}
//       <div className='mb-4'>
//         <label className='block text-sm font-medium mb-1'>Orientation</label>
//         <select
//           value={orientation}
//           onChange={(e) => setOrientation(e.target.value)}
//           className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500'>
//           <option>Fit to screen</option>
//           <option>Landscape</option>
//           <option>Portrait</option>
//         </select>
//       </div>

//       {/* Action Buttons */}
//       <div className='flex justify-end space-x-2'>
//         <button
//           onClick={onClose}
//           className='bg-gray-200 text-gray-700 px-4 py-2 rounded-lg'>
//           Back
//         </button>
//         <button
//           onClick={handleUpload}
//           className={`bg-green-600 text-white px-4 py-2 rounded-lg h-[40px] ${
//             loading ? 'cursor-not-allowed opacity-70' : ''
//           }`}
//           disabled={loading}>
//           {loading ? 'Loading...' : 'Upload'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ContentCreation;

import React, { useEffect, useState } from 'react';
import { GrNext, GrPrevious } from 'react-icons/gr';
import axios from 'axios';
import { toast } from 'react-toastify';

const ContentCreation = ({ onClose, onUpload, initialData }) => {
  const [mediaFiles, setMediaFiles] = useState(initialData?.mediaFiles || []);
  const [mediaTags, setMediaTags] = useState(initialData?.mediaTags || '');
  const [contentDescription, setContentDescription] = useState(
    initialData?.description || ''
  );
  const [orientation, setOrientation] = useState(
    initialData?.orientation || 'Fit to screen'
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Effect to reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      setMediaFiles(initialData.mediaFiles || []);
      setMediaTags(initialData.mediaTags || '');
      setContentDescription(initialData.description || '');
      setOrientation(initialData.orientation || 'Fit to screen');
    } else {
      // Reset to defaults when creating new content
      setMediaFiles([]);
      setMediaTags('');
      setContentDescription('');
      setOrientation('Fit to screen');
    }
  }, [initialData]);

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

    // Check if the number of files exceeds the max limit
    if (files.length + mediaFiles.length > MAX_FILES) {
      toast.error(`You can upload a maximum of ${MAX_FILES} files.`);
      return;
    }

    let totalSize = 0;
    const validFiles = [];

    for (const file of files) {
      // Check allowed file types
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(
          `Invalid type: ${file.name}. Only JPG, PNG, MP4, and MPEG are allowed.`
        );
        return;
      }

      // Check individual file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File too large: ${file.name}. Max size is 300MB.`);
        return;
      }

      validFiles.push(file);
      totalSize += file.size;
    }

    // Check total size
    if (totalSize > MAX_FILE_SIZE) {
      toast.error('Total file size must not exceed 300MB.');
      return;
    }

    setMediaFiles((prev) => [...prev, ...validFiles]);
    setCurrentImageIndex(0); // Reset index after new upload
  };

  const handleUpload = async () => {
    // Validate form
    if (
      mediaFiles.length === 0 ||
      !mediaTags ||
      !contentDescription ||
      !orientation
    ) {
      toast.info('Please fill all fields');
      setLoading(false);
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // Append each file as 'images'
    mediaFiles.forEach((file) => {
      formData.append('images', file);
    });

    // Process media tags
    const tagsArray = mediaTags.split(',').map((tag) => tag.trim());
    if (tagsArray.length > 10) {
      toast.warning('Tags should be less than 10.');
      setLoading(false);
      return;
    }
    if (contentDescription.length > 200) {
      toast.warning('Content description should be less than 200 characters.');
      setLoading(false);
      return;
    }

    formData.append('mediaTags', JSON.stringify(tagsArray));
    formData.append('description', contentDescription);
    formData.append('orientation', orientation);

    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/content',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      // Handle success response
      setUploadStatus('Upload successful!');
      onUpload(response.data); // Close the modal after successful upload
    } catch (error) {
      console.error('Error uploading data:', error);
      if (error.response) {
        toast.error(
          `Error: ${error.response.data.message || 'Something went wrong.'}`
        );
      } else {
        toast.error('Something went wrong uploading data');
      }
      setUploadStatus('Error uploading data. Please try again.');
    } finally {
      setLoading(false); // Ensure loading is reset
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mediaFiles.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? mediaFiles.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className='bg-white p-6 rounded-lg w-[500px] md:w-[600px] lg:w-[700px] max-h-[500px] overflow-y-auto'>
      <h2 className='text-xl font-semibold mb-4'>
        {initialData ? 'Edit Content' : 'Add Content'}
      </h2>
      {/* Upload Status */}
      {uploadStatus && (
        <div className='mb-4 text-center text-green-600'>{uploadStatus}</div>
      )}

      {/* Media Preview */}
      <div className='mb-4'>
        <p className='text-sm font-semibold mb-2'>Content Preview</p>
        {mediaFiles.length > 0 ? (
          <div className='relative'>
            {mediaFiles[currentImageIndex].type.startsWith('video/') ? (
              <video
                controls
                className='w-full h-[250px] object-cover rounded-[12px]'
                src={URL.createObjectURL(mediaFiles[currentImageIndex])}
              />
            ) : (
              <img
                src={URL.createObjectURL(mediaFiles[currentImageIndex])}
                alt='Preview'
                className='w-full h-[250px] object-cover rounded-[12px]'
              />
            )}
            <div className='absolute top-1/2 left-0 right-0 flex justify-between'>
              <button
                onClick={handlePrevImage}
                className='bg-gray-200 rounded-full p-1'>
                <GrPrevious />
              </button>
              <button
                onClick={handleNextImage}
                className='bg-gray-200 rounded-full p-1'>
                <GrNext />
              </button>
            </div>
          </div>
        ) : (
          <input type='file' multiple onChange={handleFileUpload} />
        )}
      </div>

      {/* Media Tags */}
      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>Media Tags</label>
        <input
          type='text'
          placeholder='Enter tags separated by commas'
          value={mediaTags}
          onChange={(e) => setMediaTags(e.target.value)}
          className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500'
        />
      </div>

      {/* Content Description */}
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
          className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500'
        />
      </div>

      {/* Orientation */}
      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>Orientation</label>
        <select
          value={orientation}
          onChange={(e) => setOrientation(e.target.value)}
          className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500'>
          <option>Fit to screen</option>
          <option>Landscape</option>
          <option>Portrait</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className='flex justify-end space-x-2'>
        <button
          onClick={onClose}
          className='bg-gray-200 text-gray-700 px-4 py-2 rounded-lg'>
          Back
        </button>
        <button
          onClick={handleUpload}
          className={`bg-green-600 text-white px-4 py-2 rounded-lg h-[40px] ${
            loading ? 'cursor-not-allowed opacity-70' : ''
          }`}
          disabled={loading}>
          {loading ? 'Loading...' : initialData ? 'Update' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default ContentCreation;
