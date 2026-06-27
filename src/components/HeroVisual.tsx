import { motion } from 'motion/react';
import { Zap, Wrench, Hammer, Sparkles, CheckCircle2, Shield, Wifi } from 'lucide-react';

const workers = [
  { icon: Zap, name: 'Electrician', x: 60, y: 80, color: '#818cf8', cx: 60, cy: 80, hx: 210, hy: 230 },
  { icon: Wrench, name: 'Plumber', x: 440, y: 80, color: '#38bdf8', cx: 440, cy: 80, hx: 290, hy: 230 },
  { icon: Hammer, name: 'Carpenter', x: 60, y: 420, color: '#fbbf24', cx: 60, cy: 420, hx: 210, hy: 320 },
  { icon: Sparkles, name: 'Cleaner', x: 440, y: 420, color: '#34d399', cx: 440, cy: 420, hx: 290, hy: 320 },
];

const badges = [
  { text: 'Job Posted', x: 195, y: 375, color: '#38bdf8' },
  { text: 'Smart Door Install', x: 15, y: 345, sub: '– Completed', color: '#34d399' },
  { text: 'Secure', x: 395, y: 240, icon: Shield, color: '#818cf8' },
  { text: 'Connected', x: 205, y: 50, icon: Wifi, color: '#38bdf8' },
];

function linePath(x1: number, y1: number, x2: number, y2: number) {
  const cx1 = x1 + (x2 - x1) * 0.4;
  const cy1 = y1;
  const cx2 = x1 + (x2 - x1) * 0.6;
  const cy2 = y2;
  return `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
}

export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="hidden lg:block"
    >
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="relative"
      >
        <div className="absolute inset-0 bg-blue-500/5 blur-[60px] rounded-3xl" />
        <div className="relative bg-gradient-to-b from-navy-800/80 to-navy-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-blue-500/5">
          <div className="relative w-full aspect-[4/3]">
            <svg viewBox="0 0 500 450" className="w-full h-full" fill="none">
              <defs>
                <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0b1120" />
                </linearGradient>
                <linearGradient id="windowGlow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {workers.map((w) => (
                <motion.path
                  key={w.name}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1.2, ease: 'easeInOut' }}
                  d={linePath(w.cx, w.cy, w.hx, w.hy)}
                  stroke={w.color}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  opacity="0.6"
                  filter="url(#glow)"
                />
              ))}

              {workers.map((w) => (
                <motion.circle
                  key={`pulse-${w.name}`}
                  animate={{ r: [4, 10, 4], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2.5, delay: 0.6, ease: 'easeInOut' }}
                  cx={w.hx}
                  cy={w.hy}
                  r="4"
                  fill={w.color}
                  opacity="0.6"
                />
              ))}

              <g>
                <motion.path
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  d="M172,190 L172,310 L328,310 L328,190 L250,145 Z"
                  fill="url(#roofGrad)"
                  stroke="#0ea5e9"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <motion.rect
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  x="180"
                  y="195"
                  width="140"
                  height="110"
                  rx="4"
                  fill="url(#wallGrad)"
                  stroke="#0ea5e9"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  style={{ transformOrigin: '250px 250px' }}
                />
                <motion.rect
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.4 }}
                  x="195"
                  y="212"
                  width="38"
                  height="42"
                  rx="3"
                  fill="url(#windowGlow)"
                  stroke="#0ea5e9"
                  strokeWidth="0.8"
                  strokeOpacity="0.6"
                />
                <motion.line
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.3 }}
                  x1="214"
                  y1="212"
                  x2="214"
                  y2="254"
                  stroke="#0ea5e9"
                  strokeWidth="0.5"
                  strokeOpacity="0.4"
                />
                <motion.line
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.3 }}
                  x1="195"
                  y1="233"
                  x2="233"
                  y2="233"
                  stroke="#0ea5e9"
                  strokeWidth="0.5"
                  strokeOpacity="0.4"
                />
                <motion.rect
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.4 }}
                  x="267"
                  y="212"
                  width="38"
                  height="42"
                  rx="3"
                  fill="url(#windowGlow)"
                  stroke="#0ea5e9"
                  strokeWidth="0.8"
                  strokeOpacity="0.6"
                />
                <motion.line
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.3 }}
                  x1="286"
                  y1="212"
                  x2="286"
                  y2="254"
                  stroke="#0ea5e9"
                  strokeWidth="0.5"
                  strokeOpacity="0.4"
                />
                <motion.line
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.3 }}
                  x1="267"
                  y1="233"
                  x2="305"
                  y2="233"
                  stroke="#0ea5e9"
                  strokeWidth="0.5"
                  strokeOpacity="0.4"
                />
                <motion.rect
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.4 }}
                  x="231"
                  y="270"
                  width="38"
                  height="40"
                  rx="2"
                  fill="#0b1120"
                  stroke="#0ea5e9"
                  strokeWidth="1"
                  strokeOpacity="0.7"
                />
                <motion.circle
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.3 }}
                  cx="250"
                  cy="290"
                  r="3"
                  fill="#0ea5e9"
                  opacity="0.6"
                />
                <motion.rect
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.4 }}
                  x="180"
                  y="300"
                  width="140"
                  height="6"
                  rx="2"
                  fill="#0ea5e9"
                  fillOpacity="0.08"
                  stroke="#0ea5e9"
                  strokeWidth="0.5"
                  strokeOpacity="0.3"
                />
                <motion.line
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1.5 }}
                  x1="320"
                  y1="200"
                  x2="340"
                  y2="190"
                  stroke="#0ea5e9"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
                <motion.line
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1.7 }}
                  x1="325"
                  y1="208"
                  x2="348"
                  y2="200"
                  stroke="#0ea5e9"
                  strokeWidth="1"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
              </g>
            </svg>

            {workers.map((w, i) => (
              <motion.div
                key={w.name}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.15, duration: 0.5, ease: 'backOut' }}
                className="absolute flex items-center gap-1.5"
                style={{ left: w.x - 20, top: w.y - 14 }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: w.color + '20', border: '1px solid ' + w.color + '40' }}
                >
                  <w.icon className="w-3.5 h-3.5" style={{ color: w.color }} />
                </div>
                <span className="text-[10px] font-semibold text-white/80">{w.name}</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </motion.div>
            ))}

            {badges.map((b, i) => (
              <motion.div
                key={b.text}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.2, duration: 0.4 }}
                className="absolute flex items-center gap-1 px-2 py-1 rounded-md backdrop-blur-sm"
                style={{
                  left: b.x,
                  top: b.y,
                  backgroundColor: b.color + '15',
                  border: '1px solid ' + b.color + '30',
                }}
              >
                {b.icon && (
                  <b.icon className="w-2.5 h-2.5" style={{ color: b.color }} />
                )}
                <span className="text-[9px] font-semibold whitespace-nowrap" style={{ color: b.color }}>
                  {b.sub ? (
                    <>{b.text}<br />{b.sub}</>
                  ) : (
                    b.text
                  )}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
