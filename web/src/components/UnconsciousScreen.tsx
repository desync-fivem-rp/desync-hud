import React, { useState, useEffect } from 'react';
import { fetchNui } from '../utils/fetchNui';

const UnconsciousScreen: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [canTransport, setCanTransport] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanTransport(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTransport = () => {
    if (canTransport) {
      // Trigger event to transport player
      fetchNui('transportToHospital');
    }
  };

  return (
    <div className="unconscious-screen">
      <h1>Unconscious</h1>
      <p>{timeLeft} seconds until you can be transported</p>
      <button onClick={handleTransport} disabled={!canTransport}>
        Transport to Hospital
      </button>
    </div>
  );
};

export default UnconsciousScreen; 