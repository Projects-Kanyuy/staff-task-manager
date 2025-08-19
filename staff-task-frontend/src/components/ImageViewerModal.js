// src/components/ImageViewerModal.js
import React from 'react';

const ImageViewerModal = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose} // Close modal on overlay click
    >
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white text-3xl font-bold z-50"
      >
        &times;
      </button>
      <div className="relative max-w-4xl max-h-[90vh] p-4">
        <img 
          src={src} 
          alt="Screenshot Preview" 
          className="max-w-full max-h-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
        />
      </div>
    </div>
  );
};

export default ImageViewerModal;