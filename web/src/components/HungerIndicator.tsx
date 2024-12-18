import { useState, useEffect, useRef } from 'react';
import { fetchNui } from '../utils/fetchNui';
import { useNuiEvent } from '../hooks/useNuiEvent';
import Lottie from 'lottie-react';

import ICON from './assets/wired-outline-567-french-fries-chips-hover-pinch.json';

interface HungerState {
  hunger: number;
}

const ANIMATION_CONFIG = {
  LOW_HUNGER_SPEED: 2, // Faster animation when hungry
  HIGH_HUNGER_SPEED: 0.1, // Slower animation when fed
  HUNGER_THRESHOLD: 30, // Below this value is considered "hungry"
};

const HungerIndicator: React.FC = () => {
  const [hunger, setHunger] = useState(100);
  const baseLottieRef = useRef<any>(null);
  const glowLottieRef = useRef<any>(null);

  // Listen for hunger updates from the client
  useNuiEvent<HungerState>('updateHunger', (data) => {
    if (data?.hunger !== undefined) {
      setHunger(100 - data.hunger);
    }
  });

  // Update animation speed based on hunger level
  useEffect(() => {
    if (baseLottieRef.current && glowLottieRef.current) {
      const speed = hunger > ANIMATION_CONFIG.HUNGER_THRESHOLD 
        ? ANIMATION_CONFIG.HIGH_HUNGER_SPEED 
        : ANIMATION_CONFIG.LOW_HUNGER_SPEED;
      baseLottieRef.current.setSpeed(speed);
      glowLottieRef.current.setSpeed(speed);
    }
  }, [hunger]);

  // Initial hunger fetch
  useEffect(() => {
    const getInitialHunger = async () => {
      try {
        const response = await fetchNui<HungerState>('getPlayerHunger');
        if (response?.hunger !== undefined) {
          setHunger(100 - response.hunger);
        }
      } catch (error) {
        console.error('Failed to fetch initial hunger:', error);
      }
    };

    getInitialHunger();
  }, []);

  return (
    <div className='hunger-indicator'>
      {/* Base faded icon layer */}
      <div style={{ 
        position: 'absolute',
        height: 'var(--thirst-icon-size)', 
        width: 'var(--thirst-icon-size)',
      }}>
        <Lottie 
          lottieRef={baseLottieRef}
          animationData={ICON}
          loop={true}
          style={{ 
            width: 'var(--thirst-icon-size)', 
            height: 'var(--thirst-icon-size)'
          }}
        />
      </div>
      
      {/* Glowing overlay layer with clip-path */}
      <div style={{ 
        position: 'absolute',
        height: 'var(--thirst-icon-size)', 
        width: 'var(--thirst-icon-size)',
        clipPath: `inset(${100 - hunger}% 0 0 0)`
      }}>
        <Lottie 
          lottieRef={glowLottieRef}
          animationData={ICON}
          loop={true}
          style={{ 
            width: 'var(--thirst-icon-size)', 
            height: 'var(--thirst-icon-size)'
          }}
        />
      </div>
    </div>
  );
};

export default HungerIndicator;