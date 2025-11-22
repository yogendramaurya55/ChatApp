import React, { useEffect, useState } from "react";
import assets from "../assets/assets";

const ImagePreviewModal = ({
  image,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  const [animate, setAnimate] = useState(false);

  // Start enter animation
  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);

  // Smooth closing animation
  const handleClose = () => {
    setAnimate(false);
    setTimeout(onClose, 200); // wait for animation to finish
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999]
      transition-all duration-200 
      ${animate ? "bg-black/80 backdrop-blur-sm" : "bg-black/0 backdrop-blur-0"}
      `}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className={`absolute top-4 right-4 bg-white/20 hover:bg-white/40 
        p-3 rounded-full flex items-center justify-center
        transition-all duration-200 
        ${animate ? "opacity-100 scale-100" : "opacity-0 scale-90"}
        `}
      >
        <img src={assets.close_icon} className="w-5 h-5" alt="close" />
      </button>

      {/* Previous Button */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className={`absolute left-6 bg-white/20 hover:bg-white/40 
          p-4 rounded-full flex items-center justify-center
          transition-all duration-200
          ${animate ? "opacity-100 scale-100" : "opacity-0 scale-90"}
          `}
        >
          <img src={assets.prev_icon} className="w-6 h-6" alt="prev" />
        </button>
      )}

      {/* Next Button */}
      {hasNext && (
        <button
          onClick={onNext}
          className={`absolute right-6 bg-white/20 hover:bg-white/40 
          p-4 rounded-full flex items-center justify-center
          transition-all duration-200
          ${animate ? "opacity-100 scale-100" : "opacity-0 scale-90"}
          `}
        >
          <img src={assets.next_icon} className="w-6 h-6" alt="next" />
        </button>
      )}

      {/* Main Image */}
      <img
        src={image}
        alt="preview"
        className={`max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-lg
        transition-all duration-200
        ${animate ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      />
    </div>
  );
};

export default ImagePreviewModal;
