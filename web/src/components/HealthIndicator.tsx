import { useState, useEffect } from 'react';
import {ProgressBar} from "react-progressbar-fancy";
import { fetchNui } from '../utils/fetchNui';
import { useNuiEvent } from '../hooks/useNuiEvent';


interface HealthState {
  health: number;
}

// interface HealthIndicatorProps {
//   health: number;
// }

// const HealthIndicator: React.FC<HealthIndicatorProps> = ({
//   health,
// }) => {

const HealthIndicator: React.FC = () => {

  // Uncomment for fivem ////////////////////////////////
  const [health, setHealth] = useState(200); // Start with full health (200)

  // Listen for health updates from the client
  useNuiEvent<HealthState>('updateHealth', (data) => {
    if (data?.health !== undefined) {
      // Ensure health stays within valid range (100-200)
      // const validHealth = Math.max(100, Math.min(200, data.health));
      setHealth(data.health);
    }
  });

  // Initial health fetch
  useEffect(() => {
    const getInitialHealth = async () => {
      try {
        const response = await fetchNui<HealthState>('getPlayerHealth');
        if (response?.health !== undefined) {
          console.log(response.health)
          setHealth(response.health);
        }
      } catch (error) {
        console.error('Failed to fetch initial health:', error);
      }
    };
    getInitialHealth();
  }, []);
  /////////////////////////////////////////////////// 

  // Calculate particle color based on health value
  const getParticleColor = (health: number) => {
    if (health > 50) return '#00ff00'; // green for high health
    if (health >= 25) return '#ff9100'; // yellow for medium health
    return '#ff0000'; // red for low health
  };

  return (
    <div className="health-indicator">
      {
      <ProgressBar
        className="health-progress-bar"
        progressWidth={270}
        hideText = {true}
        score = {health}
        primaryColor='red'
        secondaryColor={getParticleColor(health)}
        />
      }
    </div>
  );
};

export default HealthIndicator;
