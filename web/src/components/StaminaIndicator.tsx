import { useState, useEffect, useRef } from 'react';
import { fetchNui } from '../utils/fetchNui';
import { useNuiEvent } from '../hooks/useNuiEvent';
import Lottie from 'lottie-react';

import ICON from './assets/wired-outline-646-walking-walkcycle-person-loop-cycle.json';

interface StaminaState {
  stamina: number;
}

const ANIMATION_CONFIG = {
  LOW_STAMINA_SPEED: 2, // Faster animation when stamina is low
  HIGH_STAMINA_SPEED: 1, // Normal animation speed when stamina is high
  STAMINA_THRESHOLD: 30, // Below this value is considered "low stamina"
};

const StaminaIndicator: React.FC = () => {
  const [stamina, setStamina] = useState(100);
  const [isStaminaDecreasing, setIsStaminaDecreasing] = useState(false);
  const previousStamina = useRef(100);
  const baseLottieRef = useRef<any>(null);
  const glowLottieRef = useRef<any>(null);

  // Listen for stamina updates from the client
  useNuiEvent<StaminaState>('updateStamina', (data) => {
    if (data?.stamina !== undefined) {
      const newStamina = Math.floor(data.stamina);
      setIsStaminaDecreasing(newStamina < previousStamina.current);
      previousStamina.current = newStamina;
      setStamina(newStamina);
    }
  });

  // Update animation based on stamina change
  useEffect(() => {
    const updateAnimations = () => {
      if (baseLottieRef.current && glowLottieRef.current) {
        if (isStaminaDecreasing) {
          const speed = stamina > ANIMATION_CONFIG.STAMINA_THRESHOLD 
            ? ANIMATION_CONFIG.HIGH_STAMINA_SPEED 
            : ANIMATION_CONFIG.LOW_STAMINA_SPEED;
          
          baseLottieRef.current.setSpeed(speed);
          glowLottieRef.current.setSpeed(speed);
          
          baseLottieRef.current.play();
          glowLottieRef.current.play();
        } else {
          baseLottieRef.current.pause();
          glowLottieRef.current.pause();
        }
      }
    };

    updateAnimations();
  }, [stamina, isStaminaDecreasing]);

  // Initial stamina fetch
  useEffect(() => {
    const getInitialStamina = async () => {
      try {
        const response = await fetchNui<StaminaState>('getPlayerStamina');
        if (response?.stamina !== undefined) {
          const initialStamina = Math.floor(response.stamina);
          setStamina(initialStamina);
          previousStamina.current = initialStamina;
        }
      } catch (error) {
        console.error('Failed to fetch initial stamina:', error);
      }
    };

    getInitialStamina();
  }, []);

  return (
    <div className='stamina-indicator'>
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
          autoplay={false}
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
        clipPath: `inset(${100 - stamina}% 0 0 0)`
      }}>
        <Lottie 
          lottieRef={glowLottieRef}
          animationData={ICON}
          loop={true}
          autoplay={false}
          style={{ 
            width: 'var(--thirst-icon-size)', 
            height: 'var(--thirst-icon-size)'
          }}
        />
      </div>
    </div>
  );
};

export default StaminaIndicator;
