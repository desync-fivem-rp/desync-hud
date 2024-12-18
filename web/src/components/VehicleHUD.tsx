import React, { useState } from 'react';
import './VehicleHUD.css';
import GaugeComponent from 'react-gauge-component';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import { TbEngine } from "react-icons/tb";
import { GiFlatTire } from "react-icons/gi";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { useNuiEvent } from '../hooks/useNuiEvent';

interface VehicleHUDProps {
  visible: boolean;
}

const VehicleHUD: React.FC<VehicleHUDProps> = ({ visible }) => {
  const [show, setShow] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [gear, setGear] = useState(0);
  const [maxGear, setMaxGear] = useState(6);
  const [gearArray, setGearArray] = useState([-1, 0, 1, 2, 3, 4, 5, 6]);
  const [fuel, setFuel] = useState(0);
  const [engineHealth, setEngineHealth] = useState(1000);
  const [tiresBurst, setTiresBurst] = useState(false);
  const [seatbeltOn, setSeatbeltOn] = useState(false);

  useNuiEvent('updateVehicleHUD', (data: { 
    show: boolean; 
    speed: number; 
    gear: number; 
    rpm: number; 
    maxGear: number; 
    gearArray: number[]; 
    fuel?: number;
    engineHealth?: number;
    tiresBurst?: boolean;
    seatbeltOn?: boolean;
  }) => {
    setShow(data.show);
    // Only update non-fuel values if they're not -1
    if (data.speed !== -1) {
      setSpeed(data.speed);
      setRpm(data.rpm);
      setGear(data.gear);
      setMaxGear(data.maxGear);
      setGearArray(data.gearArray);
    }
    if (data.fuel !== undefined) setFuel(data.fuel);
    if (data.engineHealth !== undefined) setEngineHealth(data.engineHealth);
    if (data.tiresBurst !== undefined) setTiresBurst(data.tiresBurst);
    if (data.seatbeltOn !== undefined) setSeatbeltOn(data.seatbeltOn);
  });

  if (!visible || !show) return null;

  const speedInMph = Math.round(speed);
  const radius = 40;
  const strokeWidth = 4;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // const quarterCircle = circumference * 0.25;
  
  // RPM calculations
  const arcLength = normalizedRadius * 2 * Math.PI * (315 / 360);
  const strokeDashoffset = rpm === 0 ? arcLength : arcLength - (rpm * arcLength);
  
  // Fuel gauge calculations - adjusted to fix alignment
  // const fuelArcLength = circumference * (90 / 360); // Exactly 1/4 circle (90 degrees)
  // const fuelOffset = fuelArcLength * Math.max(0, Math.min(1, 1 - (fuel / 100)));
  
  // Calculate color based on RPM
  const getColor = (rpm: number) => {
    if (rpm > 0.85) {
      return 'rgb(255, 0, 0)'; // Red at high RPM
    } else if (rpm > 0.7) {
      return 'rgb(255, 136, 0)'; // Orange at medium-high RPM
    }
    return 'rgb(0, 255, 255)'; // Cyan at low RPM
  };

  const getEngineHealthColor = (health: number) => {
    // console.log('Engine Health:', health);
    
    if (health >= 800) return 'transparent';
    if (health >= 300) return 'rgb(255, 136, 0)';
    return 'rgb(255, 0, 0)';
  };

  const currentColor = getColor(rpm);
  const engineColor = getEngineHealthColor(engineHealth);

  // Add this function to get fuel color based on level
  const getFuelColor = (fuelLevel: number) => {
    return fuelLevel <= 20 ? 'rgba(255, 0, 0, 0.7)' : 'rgba(0, 255, 255, 0.7)';
  };

  return (
    <div className="vehicle-hud">
      <div className="hud-container">
        <div className="fuel-gauge-container">
          <GaugeComponent
            value={fuel}
            type="semicircle"
            arc={{
              colorArray: [getFuelColor(fuel)], // Use dynamic color based on fuel level
              padding: 0.02,
              width: 0.2
            }}
            labels={{
              valueLabel: { hide: true },
              tickLabels: { hideMinMax: true }
            }}
            pointer={{
              elastic: true,
              color: getFuelColor(fuel), // Also update pointer color
              animationDelay: 0
            }}
            style={{ width: '60px', height: '60px' }}
          />
          <div className="fuel-icon">
            <LocalGasStationIcon 
              className="gas-icon" 
              style={{ color: getFuelColor(fuel) }} // Update icon color as well
            />
          </div>
        </div>
        <div className="speed-group">
          <div className="engine-health-indicator" style={{ color: engineColor }}>
            <TbEngine className="engine-icon" />
          </div>
          <div className="tire-status-indicator" style={{ color: tiresBurst ? 'rgb(255, 0, 0)' : 'transparent' }}>
            <GiFlatTire className="tire-icon" />
          </div>
          <div className={`seatbelt-indicator ${seatbeltOn ? 'active' : 'warning'}`}>
            <MdAirlineSeatReclineNormal className="seatbelt-icon" />
          </div>
          <svg
            className="rpm-gauge"
            height={radius * 2}
            width={radius * 2}
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            style={{ '--glow-color': currentColor } as React.CSSProperties}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Background circle */}
            <circle
              className="rpm-gauge-bg"
              stroke="rgba(255, 255, 255, 0.1)"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              transform={`rotate(25 ${radius} ${radius})`}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeLinecap="butt"
            />
            {/* RPM Ticks */}
            {Array.from({ length: 36 }, (_, i) => {
              const angle = (i * 8.75 + 25) * (Math.PI / 180); // 8.75 degrees per tick, starting at 25 degrees
              const tickLength = i >= 31 ? 6 : 4; // Longer ticks for red zone
              const tickColor = i >= 31 ? 'rgb(255, 0, 0)' : 'rgba(255, 255, 255, 0.4)';
              const outerRadius = normalizedRadius + 9; // Increased the outer radius
              const x1 = radius + outerRadius * Math.cos(angle);
              const y1 = radius + outerRadius * Math.sin(angle);
              const x2 = radius + (outerRadius - tickLength) * Math.cos(angle);
              const y2 = radius + (outerRadius - tickLength) * Math.sin(angle);
              
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={tickColor}
                  strokeWidth={1}
                  className="rpm-tick"
                />
              );
            })}
            {/* Foreground circle */}
            <circle
              className="rpm-gauge-fg"
              stroke={currentColor}
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              transform={`rotate(25 ${radius} ${radius})`}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="butt"
              filter="url(#glow)"
            />
          </svg>
          <div className="speed-container">
            <div className="speed-display">
              <span className="speed-value">{speedInMph}</span>
              <span className="speed-unit">MPH</span>
            </div>
          </div>
        </div>
      </div>
      <div className="gear-display">
        {gearArray.map((gearNum) => (
          <div
            key={gearNum}
            className={`gear-number ${gear === gearNum ? 'active' : ''}`}
          >
            {gearNum === -1 ? 'R' : gearNum === 0 ? 'N' : gearNum}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleHUD;
