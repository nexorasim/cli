import React from 'react';

const NexoraLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <radialGradient id="nexora-glow-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00ffff" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
      </radialGradient>
      <filter id="nexora-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="nexora-n-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00ffff" />
        <stop offset="100%" stopColor="#00c0c0" />
      </linearGradient>
    </defs>

    <g transform="translate(100,100)">
      {/* Background Pulse */}
      <circle r="90" fill="url(#nexora-glow-gradient)" filter="url(#nexora-glow-filter)">
        <animate
          attributeName="r"
          values="85;95;85"
          dur="4s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
        />
      </circle>

      {/* Orbiting Rings */}
      <g stroke="#00ffff">
        <circle r="70" fill="none" strokeWidth="0.5" strokeOpacity="0.5" strokeDasharray="3 7">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 0"
            to="360 0 0"
            dur="20s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="80" fill="none" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="10 5">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360 0 0"
            to="0 0 0"
            dur="30s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
      
      {/* Central 'N' element - Redesigned */}
      <g stroke="url(#nexora-n-gradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M -40 -40 V 40" />
        <path d="M 0 -40 V 40" />
        <path d="M 40 -40 V 40" />
        <path d="M -40 0 L 0 -40" />
        <path d="M 0 40 L 40 0" />
      </g>

      {/* Nodes on the 'N' */}
      <g fill="#ffffff">
          <circle cx="-40" cy="-40" r="4"><animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" begin="0s"/></circle>
          <circle cx="-40" cy="0" r="4"><animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" begin="0.2s"/></circle>
          <circle cx="-40" cy="40" r="4"><animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" begin="0.4s"/></circle>
          <circle cx="0" cy="-40" r="4"><animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" begin="0.6s"/></circle>
          <circle cx="0" cy="40" r="4"><animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" begin="0.8s"/></circle>
          <circle cx="40" cy="-40" r="4"><animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" begin="1s"/></circle>
          <circle cx="40" cy="0" r="4"><animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" begin="1.2s"/></circle>
          <circle cx="40" cy="40" r="4"><animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" begin="1.4s"/></circle>
      </g>
    </g>
  </svg>
);

export default NexoraLogo;