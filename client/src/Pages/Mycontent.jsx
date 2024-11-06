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
import { GrNext, GrPrevious } from 'react-icons/gr';
import EditModal from '../components/EditModal/EditModal';
import LoadingSpinner from '../components/Loading/LoadingSpinner';

const Mycontent = () => {
  const [listContent, setListContent] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  console.log('current image index: ' + currentImageIndex);

  const totalStorage = 5120; // 5GB in MB
  const [usedStorage, setUsedStorage] = useState(90); // Initial storage usage in MB

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [contentModal, setContentModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // For edit modal
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
    // setEditModalOpen(true);
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
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}content/${updatedRow._id}`,
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
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRow) return;

    const confirmation = window.confirm(
      `Are you sure you want to delete the content "${selectedRow.description}"?`
    );

    if (!confirmation) return;
    setLoading(true);
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}content/${selectedRow._id}`
      );
      if (res.status === 200) {
        toast.success('Content deleted successfully!', { autoClose: 3000 });
        getContentData(); // Refresh content list
        setIsModalOpen(false);
        setLoading(false);
        setSelectedRow(null);
      }
    } catch (error) {
      setLoading(false);
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
    debugger;
    if (contentData?.content) {
      getContentData();
      toast.success('Content created successfully');
      return;
    }
  };

  const getContentData = async () => {
    try {
      // const res = await axios.get(`${process.env.LOCAL_BASE_URL}content/list`);
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}content/list`
      );
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

  const images = selectedRow?.images;

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
      {editModalOpen && (
        <CustomModal isOpen={editModalOpen} onClose={closeEditModal}>
          <div className='min-w-[720px] max-h-[500px] overflow-y-scroll'>
            <h2 className='text-xl font-semibold'>Edit Content</h2>

            <div className='mb-4 p-2'>
              <div className='relative'>
                {images[currentImageIndex] &&
                images[currentImageIndex].path.endsWith('.mp4') ? (
                  <video
                    src={images[currentImageIndex].path}
                    className='w-full h-64 rounded-[12px]'
                    controls
                  />
                ) : (
                  <img
                    src={images[currentImageIndex].path}
                    alt='Preview'
                    className='w-full h-64 object-cover rounded-[12px]'
                  />
                )}

                <div className='absolute top-1/2 left-0 right-0 flex justify-between'>
                  <button
                    className='bg-red-300 w-[50px] h-[50px] rounded-[50%] text-center flex items-center justify-center'
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }>
                    <GrPrevious />
                  </button>

                  <button
                    className='bg-red-300 w-[50px] h-[50px] rounded-[50%] text-center flex items-center justify-center'
                    onClick={() =>
                      setCurrentImageIndex((prev) => (prev + 1) % images.length)
                    }>
                    <GrNext />
                  </button>
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <strong>Description</strong>
            <textarea
              className='border p-2 w-full rounded'
              value={selectedRow?.description}
              onChange={(e) =>
                setSelectedRow((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />

            {/* Orientation Dropdown */}
            <strong>Orientation</strong>
            <select
              value={selectedRow?.orientation}
              onChange={(e) =>
                setSelectedRow((prev) => ({
                  ...prev,
                  orientation: e.target.value,
                }))
              }
              className='border p-2 w-full rounded mt-4'>
              <option value='Portrait'>Portrait</option>
              <option value='Landscape'>Landscape</option>
              <option value='Fit to Screen'>Fit to Screen</option>
            </select>

            {/* Media Tags Display */}
            {tagsToDisplay.length > 0 && (
              <>
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
              </>
            )}

            {/* Image Slider with Delete Button */}
            {/* <strong>Images</strong>
            <div className='flex mt-4 overflow-x-auto space-x-4'>
              {selectedRow?.images?.map((image, index) => (
                <div key={image._id} className='relative'>
                  <video
                    src={image.path}
                    className='w-[200px] h-[150px] object-cover rounded'
                    controls
                  />
                  <button
                    onClick={() => deleteImage(image._id)}
                    className='absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-700'>
                    &times;
                  </button>
                </div>
              ))}
            </div> */}

            {/* Update Button */}
            <div className='flex justify-end mt-4 mb-4'>
              <button
                disabled={loading}
                onClick={() => setEditModalOpen(false)}
                className={`bg-gray-200 px-4 py-2 rounded-lg mr-2 ${
                  loading ? 'cursor-not-allowed opacity-70' : ''
                }`}>
                Back
              </button>
              <button
                onClick={() => updateContent(selectedRow)}
                className={`bg-green-600 text-white px-4 py-2 rounded-lg mr-3 ${
                  loading ? 'cursor-not-allowed opacity-70' : ''
                }`}>
                {loading ? <LoadingSpinner /> : 'Update'}
              </button>
            </div>
          </div>
        </CustomModal>
      )}

      <div className='bg-[#F9FAFB]'>
        <div className='flex justify-between'>
          <h1 className='text-2xl font-semibold mb-4'>My Content</h1>
          <button
            onClick={handleCreateNewContent}
            type='button'
            className='mr-[50px] focus:outline-none text-white bg-[#30A84B] hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5'>
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
        <div className='relative'>
          <CustomTable
            headers={headers}
            rows={listContent}
            handleClick={handleOpenModal}
            loading={loading}
          />{' '}
          {isModalOpen && (
            <EditModal isOpen={isModalOpen} onClose={handleCloseModal}>
              {selectedRow ? (
                <div className='min-w-[720px]'>
                  {/* <h2 className='text-xl font-semibold'>Content Details</h2> */}
                  <div className=' p-4 rounded-lg flex items-start justify-between'>
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
                    <div className='flex  items-center gap-4 justify-center pr-16'>
                      <button
                        onClick={openEditModal}
                        className='text-[black] font-medium'>
                        <img src={edit} alt='edit' />
                        {/* Edit */}
                      </button>
                      <button
                        onClick={handleDelete}
                        className='text-[black]  font-medium'>
                        <img src={delete1} alt='delete' />
                        {/* Delete */}
                      </button>
                    </div>
                  </div>
                  {/* <div className='mt-4'>
                  <div className='flex gap-2 max-w-[720px] flex-wrap overflow-scroll max-h-[350px]'>
                    {selectedRow.images?.map((mediaObj, index) => {
                      const mediaPath = `http://localhost:4000/${mediaObj.path}`;
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
                </div> */}
                </div>
              ) : null}
            </EditModal>
          )}
        </div>

        {/* Details Modal */}
      </div>
    </>
  );
};

export default Mycontent;
