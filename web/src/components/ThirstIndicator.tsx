import { useState, useEffect, useRef } from 'react';
import { ProgressBar } from "react-progressbar-fancy";
import { fetchNui } from '../utils/fetchNui';
import { useNuiEvent } from '../hooks/useNuiEvent';
import Lottie from 'lottie-react';

import ICON from './assets/wired-outline-590-glass-water-hover-pinch.json';

interface ThirstState {
  thirst: number;
}

const ANIMATION_CONFIG = {
  LOW_THIRST_SPEED: 2, // Faster animation when thirsty
  HIGH_THIRST_SPEED: 0.1, // Slower animation when hydrated
  THIRST_THRESHOLD: 30, // Below this value is considered "thirsty"
};


const ThirstIndicator: React.FC = () => {
  const [thirst, setThirst] = useState(100); // Start with full thirst (100)
  const baseLottieRef = useRef<any>(null);
  const glowLottieRef = useRef<any>(null);

  // Listen for thirst updates from the client
  useNuiEvent<ThirstState>('updateThirst', (data) => {
    if (data?.thirst !== undefined) {
      // console.log("thirst", data.thirst)
      // Invert the value (100 = empty, 0 = full)
      setThirst(100 - data.thirst);
    }
  });

  // Update animation speed based on thirst level
  useEffect(() => {
    if (baseLottieRef.current && glowLottieRef.current) {
      const speed = thirst > ANIMATION_CONFIG.THIRST_THRESHOLD 
        ? ANIMATION_CONFIG.HIGH_THIRST_SPEED 
        : ANIMATION_CONFIG.LOW_THIRST_SPEED;
      baseLottieRef.current.setSpeed(speed);
      glowLottieRef.current.setSpeed(speed);
    }
  }, [thirst]);

  // Initial thirst fetch
  useEffect(() => {
    const getInitialThirst = async () => {
      try {
        const response = await fetchNui<ThirstState>('getPlayerThirst');
        if (response?.thirst !== undefined) {
          // Invert the value (100 = empty, 0 = full)
          setThirst(100 - response.thirst);
        }
      } catch (error) {
        console.error('Failed to fetch initial thirst:', error);
      }
    };


    getInitialThirst();
  }, []);

  return (
    <div className='thirst-indicator'>
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
        clipPath: `inset(${100 - thirst}% 0 0 0)`
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

export default ThirstIndicator;