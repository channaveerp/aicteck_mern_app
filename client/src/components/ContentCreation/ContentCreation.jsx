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
        `https://aicteck-mern-app.onrender.com/api/v1/content`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      // toast.success('Upload successful!');
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
    <div
      className='bg-[#FFFFFF] p-6 rounded-lg w-[500px] 
    md:w-[600px] lg:w-[700px] max-h-[500px] overflow-y-auto'>
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
                    className='flex items-center mb-2 
                   rounded-sm px-2 py-2 justify-between'
                    style={{
                      border: '0.5px solid #CED0D3',
                      borderRadius: '6px',
                    }}>
                    <div className='flex'>
                      {file.type.startsWith('video/') ? (
                        <video
                          src={URL.createObjectURL(file)}
                          className='w-[42px] h-[42px] object-contain mr-4'
                          // controls
                          style={{ borderRadius: '5px' }}
                        />
                      ) : (
                        <img
                          style={{ borderRadius: '5px' }}
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
                    style={{
                      border: '0.5px solid #CED0D3',
                      borderRadius: '6px',
                    }}
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
                        className='mr-4'
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
                  className='bg-red-100 w-[50px] h-[50px] rounded-[50%] text-center flex items-center justify-center'
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? mediaFiles.length - 1 : prev - 1
                    )
                  }>
                  <GrPrevious />
                </button>
                <button
                  className='bg-red-100 w-[50px] h-[50px] rounded-[50%] text-center flex items-center justify-center'
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
