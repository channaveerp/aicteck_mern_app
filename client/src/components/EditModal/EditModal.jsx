import { useEffect, useState } from 'react';
import closecircle from '../../assets/closecircle.png';

const EditModal = ({ isOpen, onClose, children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-20 flex items-center justify-center mr-11 ${className} float-end `}
      style={{
        backgroundColor: isVisible ? 'rgba(0, 0,' : 'rgba(0, 0, 0, 0)',
        transition: 'background-color 0.3s ease',
        position: 'absolute',
        top: 0,
        // right: '-680px',
      }}>
      <div
        className={`bg-green-100 rounded-lg p-5   transform transition-transform duration-300 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}>
        <button onClick={handleClose} className='text-gray-500 float-right'>
          <img src={closecircle} alt='closecircle' />
        </button>
        {children}
      </div>
    </div>
  );
};

export default EditModal;
