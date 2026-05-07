import { MapContainer, TileLayer, Marker, Popup, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'motion/react';
import { ShieldCheck, Wind, Thermometer, Droplets, Flame, Factory as FactoryIcon, Mountain } from 'lucide-react';
import { SensorData, Factory } from '../hooks/useRealTimeData';

// Fix for default markers in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const factoryIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 bg-red-500 rounded-full animate-ping opacity-20"></div>
      <div class="absolute w-6 h-6 bg-red-500 rounded-full animate-pulse opacity-40"></div>
      <div class="w-3 h-3 bg-red-600 rounded-full border border-white shadow-[0_0_10px_rgba(220,38,38,0.8)] z-20"></div>
    </div>
  `,
  className: 'factory-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

interface SensorNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'MQ-135' | 'MQ-2' | 'DHT-22';
  valueKey: string;
  unit: string;
}

const NODES: SensorNode[] = [
  { id: '1', name: 'Sector VII - MQ135', lat: 23.7957, lng: 86.4304, type: 'MQ-135', valueKey: 'mq135.co2', unit: 'ppm' },
  { id: '2', name: 'Mining Zone - MQ2', lat: 23.7437, lng: 86.4111, type: 'MQ-2', valueKey: 'mq2.lpg', unit: 'ppm' },
  { id: '3', name: 'Refinery Core - DHT22', lat: 23.6693, lng: 86.1511, type: 'DHT-22', valueKey: 'dht22.temp', unit: '°C' },
  { id: '4', name: 'Industrial Hub - MQ135', lat: 22.7937, lng: 86.1775, type: 'MQ-135', valueKey: 'mq135.nh3', unit: 'ppm' },
];

function getIcon(type: string) {
  switch (type) {
    case 'MQ-135': return <Wind size={14} />;
    case 'MQ-2': return <Flame size={14} />;
    case 'DHT-22': return <Thermometer size={14} />;
    default: return <ShieldCheck size={14} />;
  }
}

function getValue(data: SensorData, path: string) {
  const parts = path.split('.');
  let current: any = data;
  for (const part of parts) {
    if (current[part] === undefined) return 0;
    current = current[part];
  }
  return typeof current === 'number' ? current.toFixed(1) : current;
}

export default function SensorMap({ sensorData, factories }: { sensorData: SensorData, factories: Factory[] }) {
  const jharkhandCenter: [number, number] = [23.6102, 85.5];

  return (
    <div className="h-[calc(100vh-140px)] w-full rounded-[2rem] overflow-hidden border border-white/5 relative group">
      <MapContainer 
        center={jharkhandCenter} 
        zoom={9} 
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community"
        />
        
        <LayerGroup>
          {NODES.map((node) => (
            <Marker 
              key={node.id} 
              position={[node.lat, node.lng]}
            >
              <Popup className="sensor-popup bg-black">
                <div className="p-3 font-mono">
                  <div className="text-[10px] text-emerald-500 uppercase tracking-widest font-black mb-2 flex items-center gap-2">
                    {getIcon(node.type)}
                    {node.name}
                  </div>
                  <div className="text-xl font-bold italic text-white tracking-tighter">
                    {getValue(sensorData, node.valueKey)} <span className="text-[10px] not-italic opacity-40 uppercase ml-1">{node.unit}</span>
                  </div>
                  <div className="mt-2 text-[8px] text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    Live Stream Active
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </LayerGroup>

        <LayerGroup>
          {factories.map((factory) => (
            <Marker 
              key={factory.id} 
              position={[factory.lat, factory.lng]} 
              icon={factoryIcon}
            >
              <Popup className="factory-popup bg-black">
                <div className="p-3 font-mono border-l-2 border-red-500">
                  <div className="text-[9px] text-red-500 uppercase tracking-widest font-black mb-1 flex items-center gap-2">
                    {factory.category === 'Mining' ? <Mountain size={12} /> : <FactoryIcon size={12} />}
                    {factory.category} FACILITY
                  </div>
                  <div className="text-sm font-bold text-white tracking-tight uppercase">
                    {factory.name}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[7px] text-neutral-500 uppercase tracking-tighter font-mono">Status: MONITORING</span>
                    <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </LayerGroup>
      </MapContainer>

      {/* Map Overlay Brackets */}
      <div className="absolute top-8 left-8 flex flex-col gap-4 z-[1001] pointer-events-none">
        <div className="p-4 bg-black/60 backdrop-blur-xl border border-white/5 rounded-2xl">
          <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-[0.3em] mb-1">Geospatial Grid</div>
          <div className="text-lg font-black font-sans text-white tracking-tighter uppercase italic">JK-Industrial.Arc.04</div>
        </div>
        
        <div className="p-3 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl flex flex-col gap-2">
           <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">Active Sensors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">Industrial Nodes</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none border border-emerald-500/10 rounded-[2rem] z-[1001]" />
    </div>
  );
}
