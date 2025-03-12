import React, { useState, useEffect, useCallback } from 'react';
import Card from './components/Card';
import './index.css';

function App() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set([0]));

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

  const handleScroll = useCallback((direction) => {
    if (isScrolling) return;

    setIsScrolling(true);
    if (direction > 0 && currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => {
        setVisibleCards(cards => new Set([...cards, prev + 1]));
        return prev + 1;
      });
    } else if (direction < 0 && currentCardIndex > 0) {
      setCurrentCardIndex(prev => {
        setVisibleCards(cards => new Set([...cards, prev - 1]));
        return prev - 1;
      });
    }

    setTimeout(() => setIsScrolling(false), 300);
  }, [currentCardIndex, cards.length, isScrolling]);

  useEffect(() => {
    // При первой загрузке добавляем соседние карточки в видимые
    setVisibleCards(new Set([0, 1]));
  }, []);

  useEffect(() => {
    let touchStartY = 0;
    let lastTouchTime = 0;
    
    const handleWheel = (e) => {
      e.preventDefault();
      handleScroll(e.deltaY);
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      lastTouchTime = Date.now();
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touchEndY = e.touches[0].clientY;
      const direction = touchStartY - touchEndY;
      const currentTime = Date.now();
      
      if (Math.abs(direction) > 50 && currentTime - lastTouchTime < 300) {
        handleScroll(direction);
        touchStartY = touchEndY;
        lastTouchTime = currentTime;
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

