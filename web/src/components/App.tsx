import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import Lottie from 'lottie-react';

import AMMOICON from './assets/wired-outline-1892-bullets-hover-pinch.json';

// Utilities
import { debugData } from "../utils/debugData";
import { useNuiEvent } from '../hooks/useNuiEvent';

// Components
import HealthIndicator from "./HealthIndicator";
import HungerIndicator from "./HungerIndicator";
import ThirstIndicator from "./ThirstIndicator";
import StaminaIndicator from "./StaminaIndicator";
import VehicleHUD from "./VehicleHUD";
import Notifications from "./Notification/Notifications";
import UnconsciousScreen from "./UnconsciousScreen";
import StressIndicator from "./StressIndicator";

// This will set the NUI to visible if we are developing in browser
debugData([
  {
    action: "setVisible",
    data: true,
  },
]);

const App: React.FC = () => {
  // UI visibility states
  const [visible, setVisible] = useState(false);
  const [unconscious, setUnconscious] = useState(false);
  const [ammo, setAmmo] = useState({ ammoInClip: 0, totalAmmo: 0, isArmed: 0 });

  // const baseLottieRef = useRef<any>(null);

  const playerRef = useRef<any>(null);
  
  useEffect(() => {
      playerRef.current?.playFromBeginning();
  }, [])

  useEffect(() => {
    console.log('isArmed:', ammo.isArmed);
  }, [ammo.isArmed]);

  // NUI Event handlers
  useNuiEvent('setVisible', (data: boolean) => {
    setVisible(data)
  });


  useNuiEvent('setUnconscious', (data: boolean) => {
    setUnconscious(data);
  });

  useNuiEvent('updateAmmo', (data: { ammoInClip: number, totalAmmo: number, isArmed: number }) => {
    setAmmo(data);
  });

  if (unconscious) {
    return <UnconsciousScreen />;
  }

  if (!visible) return null;

  return (
    <div style={{ visibility: visible ? 'visible' : 'hidden', height: '100%' }}>
      <Notifications />
      <div className="nui-wrapper">
        <div className="status-section">
          <HealthIndicator />
          <div className="status-indicators-container">
            <ThirstIndicator />
            <HungerIndicator />
            <StaminaIndicator />
            <StressIndicator />
          </div>
        </div>
        
        <VehicleHUD visible={visible} />
        {ammo.isArmed === 1 && (
        
          <div className="ammo-indicator" style={{ visibility:  ammo.isArmed > 0 ? 'visible' : 'hidden' }}>
            <Lottie 
              lottieRef={playerRef}
              animationData={AMMOICON}
              loop={true}
              style={{ 
                width: 'var(--thirst-icon-size)', 
                height: 'var(--thirst-icon-size)',
                marginRight: '10px'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
              <div>{ammo.ammoInClip}</div>
              <div>{ammo.totalAmmo}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
