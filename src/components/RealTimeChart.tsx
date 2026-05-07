import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

interface Props {
  data: any[];
  dataKey: string;
  color?: string;
  height?: number;
  type?: 'line' | 'area';
  label?: string;
}

export default function RealTimeChart({ data, dataKey, color = '#f27d26', height = 150, type = 'line', label }: Props) {
  return (
    <div className="w-full h-full flex flex-col">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{label}</span>
          <span className="text-[10px] font-mono text-neutral-400">
            {data[data.length - 1]?.[dataKey.split('.')[1] || dataKey]?.toFixed(2)}
          </span>
        </div>
      )}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          {type === 'line' ? (
            <LineChart data={data}>
              <XAxis hide dataKey="timestamp" />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626' }}
                itemStyle={{ color: color, fontSize: '10px' }}
                labelStyle={{ display: 'none' }}
              />
              <Line
                type="monotone"
                dataKey={(d) => {
                  const keys = dataKey.split('.');
                  return keys.reduce((acc, k) => acc?.[k], d);
                }}
                stroke={color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis hide dataKey="timestamp" />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(5, 5, 5, 0.8)', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(16px)', borderRadius: '12px' }}
                itemStyle={{ color: color, fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }}
                labelStyle={{ display: 'none' }}
              />
              <Area
                type="monotone"
                dataKey={(d) => {
                  const keys = dataKey.split('.');
                  return keys.reduce((acc, k) => acc?.[k], d);
                }}
                stroke={color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${dataKey})`}
                isAnimationActive={false}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
