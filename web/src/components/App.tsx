import React, { useState } from "react";
import "./App.css";

// Utilities
import { debugData } from "../utils/debugData";
import { useNuiEvent } from '../hooks/useNuiEvent';

// Components
import HealthIndicator from "./HealthIndicator";
import HungerIndicator from "./HungerIndicator";
import ThirstIndicator from "./ThirstIndicator";
import StaminaIndicator from "./StaminaIndicator";
import DevControls from "./DevControls";
import VehicleHUD from "./VehicleHUD";
import Notifications from "./Notification/Notifications";

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
  const [devControlsVisible, setDevControlsVisible] = useState(false);

  // NUI Event handlers
  useNuiEvent('setVisible', (data: boolean) => {
    setVisible(data)
  });

  useNuiEvent('setDevControlsVisible', setDevControlsVisible);


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
          </div>
        </div>
        
        <VehicleHUD visible={visible} />
        
        {devControlsVisible && <DevControls />}
      </div>
    </div>
  );
};

export default App;
