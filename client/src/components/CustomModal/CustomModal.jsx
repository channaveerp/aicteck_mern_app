import closecircle from '../../assets/closecircle.png';
const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className=' fixed inset-0 z-30 bg-black bg-opacity-50 flex items-center  justify-center'>
      <div className='bg-white  rounded-lg shadow-lg p-10'>
        <button onClick={onClose} className='text-gray-500 float-right'>
          <img src={closecircle} alt='closecircle' />
        </button>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
