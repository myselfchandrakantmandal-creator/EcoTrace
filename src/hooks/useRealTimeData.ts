import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export interface SensorValues {
  [key: string]: number;
}

export interface SensorData {
  mq135: {
    co2: number;
    nh3: number;
    benzene: number;
    alcohol: number;
    smoke: number;
    toluene: number;
    acetone: number;
    ch4: number;
  };
  mq2: {
    lpg: number;
    propane: number;
    h2: number;
  };
  dht22: {
    temp: number;
    humidity: number;
  };
  timestamp: number;
  status: 'Safe' | 'Alert';
}

export interface Factory {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
}

export function useRealTimeData() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<SensorData[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('sensor_data', (data: SensorData) => {
      setSensorData(data);
      setHistory(prev => [...prev.slice(-30), data]);
    });

    newSocket.on('factories_init', (data: Factory[]) => {
      setFactories(data);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return { sensorData, history, factories };
}
