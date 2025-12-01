import React, { useContext, useState } from 'react'
import SideBar from '../components/SideBar'
import ChatContainer from '../components/ChatContainer'
import RightSideBar from '../components/RightSideBar'
import ImagePreviewModal from '../components/ImagePreviewModal'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext);

  const [previewImages, setPreviewImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // ⭐ FIXED openPreview function
  const openPreview = (imagesArray, index) => {
    setPreviewImages(imagesArray);
    setCurrentIndex(index);      // ✅ Correct setter
    setIsPreviewOpen(true);
  };

  return (
    <>
      <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
        <div
          className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden
          h-[100%] grid grid-cols-1 relative 
          ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}
          `}
        >
          <SideBar />

          <ChatContainer />

          <RightSideBar openPreview = {openPreview} />
        </div>
      </div>

      {/* ⭐ Image Preview Modal */}
      {isPreviewOpen && (
        <ImagePreviewModal
          image={previewImages[currentIndex]}
          onClose={() => setIsPreviewOpen(false)}
          onNext={() => setCurrentIndex(i => i + 1)}
          onPrev={() => setCurrentIndex(i => i - 1)}
          hasNext={currentIndex < previewImages.length - 1}
          hasPrev={currentIndex > 0}
        />
      )}
    </>
  );
};

export default HomePage;
