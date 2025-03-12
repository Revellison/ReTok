import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from './components/Card';
import './index.css';

function App() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set([0, 1]));
  const [lastScrollTime, setLastScrollTime] = useState(0);
  const scrollLockRef = useRef(false);
  const wheelEventsQueue = useRef([]);
  const processingWheel = useRef(false);

  const cards = [
    {
      video: "public/content/video3.mp4",
      title: "Revellison",
      description: "#chinesesuperman"
    },
    {
      video: "public/content/video2.mp4",
      title: "Revellison",
      description: "#chinesesuperman"
    },
    {
      video: "public/content/video1.mp4",
      title: "Revellison",
      description: "#chinesesuperman"
    }
  ];

  const changeCardIndex = useCallback((direction) => {
    if (scrollLockRef.current) return false;
    

    scrollLockRef.current = true;
    setIsScrolling(true);
    

    const normalizedDirection = direction > 0 ? 1 : -1;
    
    let didChange = false;
    
    if (normalizedDirection > 0 && currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => {
        const nextIndex = prev + 1;

        if (nextIndex + 1 < cards.length) {
          setVisibleCards(prevCards => new Set([...prevCards, nextIndex + 1]));
        }
        return nextIndex;
      });
      didChange = true;
    } else if (normalizedDirection < 0 && currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      didChange = true;
    }

    setTimeout(() => {
      scrollLockRef.current = false;
      setIsScrolling(false);

      processNextWheelEvent();
    }, 400);
    
    return didChange;
  }, [currentCardIndex, cards.length]);
  
  const processNextWheelEvent = useCallback(() => {
    if (processingWheel.current || wheelEventsQueue.current.length === 0) {
      processingWheel.current = false;
      return;
    }
    
    processingWheel.current = true;
    
    const nextDirection = wheelEventsQueue.current.shift();
    changeCardIndex(nextDirection);
  }, [changeCardIndex]);

  const handleScroll = useCallback((direction) => {
    wheelEventsQueue.current.push(direction);

    if (!processingWheel.current) {
      processNextWheelEvent();
    }
  }, [processNextWheelEvent]);

  useEffect(() => {
    const initialVisible = new Set([0]);
    if (cards.length > 1) initialVisible.add(1);
    setVisibleCards(initialVisible);
  }, [cards.length]);

  useEffect(() => {
    let touchStartY = 0;
    let lastWheelTime = 0;
    const wheelThrottleDelay = 200; 

    const handleWheel = (e) => {
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastWheelTime < wheelThrottleDelay) return;
      
      lastWheelTime = now;
      handleScroll(e.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      
      const touchEndY = e.touches[0].clientY;
      const direction = touchStartY - touchEndY;

      if (Math.abs(direction) > 70 && !scrollLockRef.current) {
        handleScroll(direction > 0 ? 1 : -1);
        touchStartY = touchEndY; 
      }
    };

    const container = document.querySelector('.container');
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [handleScroll]);

  const shouldRenderCard = (index) => {
    return visibleCards.has(index) || Math.abs(index - currentCardIndex) <= 1;
  };

  return (
    <div className="container">
      {cards.map((card, index) => (
        shouldRenderCard(index) ? (
          <Card
            key={index}
            className={`card ${
              index === currentCardIndex ? 'card-enter-active' :
              index < currentCardIndex ? 'card-exit' : 'card-enter'
            }`}
            {...card}
            isVisible={index === currentCardIndex}
          />
        ) : null
      ))}
    </div>
  );
}

export default App;

