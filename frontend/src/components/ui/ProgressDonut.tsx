import React from "react";
import { cn } from "@/lib/utils";

interface ProgressDonutProps {
  progress: number; // A value from 0 to 100
  size?: number;
  strokeWidth?: number;
  subtext?: string;
}

const CompletionIcon = ({ size }: { size: number }) => (
  <svg
    width={size * 0.5}
    height={size * 0.5}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-white [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.2))]"
  >
    <path
      d="M20 6L9 17L4 12"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="path-check"
      style={{
        strokeDasharray: 25,
        strokeDashoffset: 25,
        animation: "dash 0.5s ease-out forwards 0.2s",
      }}
    />
    <style>{`
      @keyframes dash { to { stroke-dashoffset: 0; } }
    `}</style>
  </svg>
);

export const ProgressDonut: React.FC<ProgressDonutProps> = ({
  progress,
  size = 120,
  strokeWidth = 14,
  subtext,
}) => {
  const isComplete = progress >= 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  // Gradient definitions
  const blueGradient = { from: "#3b82f6", to: "#818cf8" }; // Blue to Indigo
  const tealGradient = { from: "#14b8a6", to: "#2dd4bf" }; // Teal-500 to Teal-400

  if (isComplete) {
    return (
      <div
        className="relative rounded-full bg-gradient-to-br from-teal-400 to-teal-600 shadow-lg shadow-teal-500/40 flex items-center justify-center transition-all duration-300 ease-in-out"
        style={{ width: size, height: size }}
      >
        <CompletionIcon size={size} />
      </div>
    );
  }

  return (
    <div
      className="group relative rounded-full bg-white shadow-lg shadow-blue-500/10 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg className="absolute top-0 left-0" width={size} height={size} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={blueGradient.from} />
            <stop offset="100%" stopColor={blueGradient.to} />
          </linearGradient>
          <filter id="glow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={blueGradient.from} floodOpacity="0.5" />
          </filter>
        </defs>
        {/* Track Ring */}
        <circle
          className="text-blue-100"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Ring */}
        <circle
          stroke="url(#blueGradient)"
          filter="url(#glow)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
      </svg>
      <div className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center text-center">
        <span
          className={cn(
            "text-2xl font-bold text-blue-900 transition-all duration-300 ease-in-out",
            subtext ? "group-hover:opacity-0 group-hover:scale-75" : "group-hover:scale-110"
          )}
        >
          {`${Math.round(progress)}%`}
        </span>
        {subtext && (
          <span className="absolute text-sm font-semibold text-blue-800 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};