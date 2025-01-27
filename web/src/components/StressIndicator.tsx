import { useState, useEffect, useRef } from 'react';
import { fetchNui } from '../utils/fetchNui';
import { useNuiEvent } from '../hooks/useNuiEvent';
import Lottie from 'lottie-react';

// Placeholder for the stress icon animation data
import ICON from './assets/wired-outline-426-brain-hover-pinch.json'; // Update this path once you have the SVG

interface StressState {
  stress: number;
}

const ANIMATION_CONFIG = {
  LOW_STRESS_SPEED: 2, // Faster animation when stressed
  HIGH_STRESS_SPEED: 0.1, // Slower animation when relaxed
  STRESS_THRESHOLD: 30, // Below this value is considered "stressed"
};

const StressIndicator: React.FC = () => {
  const [stress, setStress] = useState(100);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const baseLottieRef = useRef<any>(null);
  const glowLottieRef = useRef<any>(null);

  // Listen for stress updates from the client
  useNuiEvent<StressState>('updateStress', (data) => {
    if (data?.stress !== undefined) {
      setStress(100 - data.stress);
    }
  });

  // Update animation speed based on stress level
  useEffect(() => {
    if (baseLottieRef.current && glowLottieRef.current) {
      const speed = stress > ANIMATION_CONFIG.STRESS_THRESHOLD 
        ? ANIMATION_CONFIG.HIGH_STRESS_SPEED 
        : ANIMATION_CONFIG.LOW_STRESS_SPEED;
      baseLottieRef.current.setSpeed(speed);
      glowLottieRef.current.setSpeed(speed);
    }
  }, [stress]);

  // Initial stress fetch
  useEffect(() => {
    const getInitialStress = async () => {
      try {
        const response = await fetchNui<StressState>('getPlayerStress');
        if (response?.stress !== undefined) {
          setStress(100 - response.stress);
        }
      } catch (error) {
        console.error('Failed to fetch initial stress:', error);
      }
    };

    getInitialStress();
  }, []);

  useEffect(() => {
    if (stress < 100) {
      setVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      timeoutRef.current = setTimeout(() => setVisible(false), 5000);
    }
  }, [stress]);

  return visible ? (
    <div className={`stress-indicator fade-in`}>
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
        clipPath: `inset(${100 - stress}% 0 0 0)`
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
  ) : null;
};

export default StressIndicator; 