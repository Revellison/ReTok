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

  // Обрабатывает одиночное изменение индекса карточки
  const changeCardIndex = useCallback((direction) => {
    if (scrollLockRef.current) return false;
    
    // Блокируем скролл на время переключения
    scrollLockRef.current = true;
    setIsScrolling(true);
    
    // Всегда используем только направление (1 или -1)
    const normalizedDirection = direction > 0 ? 1 : -1;
    
    let didChange = false;
    
    if (normalizedDirection > 0 && currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => {
        const nextIndex = prev + 1;
        // Предзагружаем следующую карточку для плавности
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

    // Разблокируем скролл после анимации
    setTimeout(() => {
      scrollLockRef.current = false;
      setIsScrolling(false);
      
      // Обработка следующего события в очереди, если они есть
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

  // Основной обработчик события скролла
  const handleScroll = useCallback((direction) => {
    // Добавляем событие в очередь
    wheelEventsQueue.current.push(direction);
    
    // Если не обрабатываем сейчас событие, начинаем обработку
    if (!processingWheel.current) {
      processNextWheelEvent();
    }
  }, [processNextWheelEvent]);

  // Инициализация видимых карточек
  useEffect(() => {
    const initialVisible = new Set([0]);
    if (cards.length > 1) initialVisible.add(1);
    setVisibleCards(initialVisible);
  }, [cards.length]);

  // Обработка событий скролла и свайпа
  useEffect(() => {
    let touchStartY = 0;
    let lastWheelTime = 0;
    const wheelThrottleDelay = 200; // мс между событиями колеса
    
    // Обработчик прокрутки колесиком мыши
    const handleWheel = (e) => {
      e.preventDefault();
      
      const now = Date.now();
      // Игнорируем частые события колеса, чтобы избежать перескакивания видео
      if (now - lastWheelTime < wheelThrottleDelay) return;
      
      lastWheelTime = now;
      handleScroll(e.deltaY > 0 ? 1 : -1);
    };

    // Обработчик начала касания (для мобильных устройств)
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    // Обработчик движения пальца по экрану
    const handleTouchMove = (e) => {
      e.preventDefault();
      
      const touchEndY = e.touches[0].clientY;
      const direction = touchStartY - touchEndY;
      
      // Только если было достаточно длинное движение и не заблокировано
      if (Math.abs(direction) > 70 && !scrollLockRef.current) {
        handleScroll(direction > 0 ? 1 : -1);
        touchStartY = touchEndY; // Обновляем начальную точку для следующего движения
      }
    };

    // Добавляем слушатели событий
    const container = document.querySelector('.container');
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    // Очистка при размонтировании
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [handleScroll]);

  // Определяем, нужно ли рендерить карточку
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

