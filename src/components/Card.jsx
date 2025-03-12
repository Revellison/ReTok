import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player'
import Footer from './Footer';

const Card = ({ title, description, video, className, isVisible }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);
  const playerRef = useRef(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    if (isVisible) {
      setShouldLoad(true);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isVisible]);

  useEffect(() => {
    setShouldLoad(true);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted.current) {
        setIsMuted(false);
        hasInteracted.current = true;
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      }
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReady = () => {
    if (isVisible && playerRef.current) {
      playerRef.current.seekTo(0);
    }
  };

  return (
    <div className={className || "card"}>
      <div className="video-container">
        {shouldLoad && (
          <ReactPlayer 
            ref={playerRef}
            className='player' 
            url={video}
            playing={isPlaying}
            muted={isMuted}
            volume={1}
            width="100%"
            height="100%"
            playsinline={true}
            loop={true}
            controls={false}
            onClick={handlePlayPause}
            onReady={handleReady}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                  disablePictureInPicture: true,
                  preload: 'auto'
                }
              }
            }}
          />
        )}
        {!isPlaying && shouldLoad && (
          <div className="play-pause-overlay" onClick={handlePlayPause}>
            <label className="play-pause-container">
              <svg
                className="play"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path
                  d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                />
              </svg>
              <svg
                className="pause"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"
                />
              </svg>
            </label>
          </div>
        )}
      </div>
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
      </div>
      <Footer />
    </div>
  );
};

export default Card;
