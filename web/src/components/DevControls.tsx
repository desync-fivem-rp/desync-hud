import React, { useState } from 'react';
import { fetchNui } from '../utils/fetchNui';

const DevControls: React.FC = () => {
  const [healthValue, setHealthValue] = useState(200);
  const [hungerValue, setHungerValue] = useState(0);
  const [thirstValue, setThirstValue] = useState(0);

  const handleHealthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setHealthValue(value);
  };

  const handleHungerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setHungerValue(value);
  };

  const handleThirstChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setThirstValue(value);
  };

  const applyHealth = () => {
    fetchNui('setHealth', { health: healthValue });
  };

  const applyHunger = () => {
    fetchNui('setHunger', { hunger: hungerValue });
  };

  const applyThirst = () => {
    fetchNui('setThirst', { thirst: thirstValue });
  };

  const handleClose = () => {
    fetchNui('hideDevControls', {});
  };

  return (
    <>
      <div className="dev-controls-overlay" onClick={handleClose}></div>
      <div className="dev-controls">
        <div className="dev-controls-header">
          <h2>Development Controls</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        <div className="control-group">
          <label>Health Value:</label>
          <input 
            type="range" 
            min="100" 
            max="200" 
            value={healthValue} 
            onChange={handleHealthChange}
          />
          <span>{healthValue}</span>
          <button onClick={applyHealth}>Apply Health</button>
        </div>
        <div className="control-group">
          <label>Hunger Value:</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={hungerValue} 
            onChange={handleHungerChange}
          />
          <span>{hungerValue}</span>
          <button onClick={applyHunger}>Apply Hunger</button>
        </div>
        <div className="control-group">
          <label>Thirst Value:</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={thirstValue} 
            onChange={handleThirstChange}
          />
          <span>{thirstValue}</span>
          <button onClick={applyThirst}>Apply Thirst</button>
        </div>
      </div>
    </>
  );
};

export default DevControls;