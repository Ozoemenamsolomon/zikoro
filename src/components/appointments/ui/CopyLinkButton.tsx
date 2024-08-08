import React, { useState } from 'react';

const CopyLinkButton = ({ link, text, children }:{ link:string, text?:string, children?: React.ReactNode }) => {
  const [showPopup, setShowPopup] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000); // Hide after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div onClick={copyToClipboard} className="relative inline-block">
      {
        children ? children :
      <button
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 active:bg-blue-700"
      >
        {text?text:'Copy Link'}
      </button>
      }
      {showPopup && (
        <div className="absolute top-[-2rem] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded animate-fade-in-out">
          Copied!
        </div>
      )}
    </div>
  );
};

export default CopyLinkButton;
