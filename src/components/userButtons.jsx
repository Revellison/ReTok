import React, { useState } from 'react';

const UserButtons = () => {
  const [isFirstButtonActive, setIsFirstButtonActive] = useState(false);
  const [likesCount, setLikesCount] = useState(1234);
  const [commentsCount, setCommentsCount] = useState(88);
  const [sharesCount, setSharesCount] = useState(123);

  const handleFirstButtonClick = () => {
    setIsFirstButtonActive(!isFirstButtonActive);
    setLikesCount(prev => isFirstButtonActive ? prev - 1 : prev + 1);
  };

  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="user-buttons">
      <div className="user-button">
        <button 
          className={isFirstButtonActive ? 'active' : ''} 
          onClick={handleFirstButtonClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="icon">
            <path fill="currentColor" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"></path>
          </svg>
        </button>
        <span className="button-count">{formatCount(likesCount)}</span>
      </div>
      <div className="user-button">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="icon">
            <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 14H6l-2 2V4h16z"></path>
          </svg>
        </button>
        <span className="button-count">{formatCount(commentsCount)}</span>
      </div>
      <div className="user-button">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="icon">
            <path fill="currentColor" d="M7 7h10v3l4-4l-4-4v3H5v6h2zm10 10H7v-3l-4 4l4 4v-3h12v-6h-2z"></path>
          </svg>
        </button>
        <span className="button-count">{formatCount(sharesCount)}</span>
      </div>
    </div>
  );
};

export default UserButtons;