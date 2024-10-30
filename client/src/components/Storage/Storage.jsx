import React from 'react';

const StorageComponent = ({ usedStorage, totalStorage }) => {
  const percentageUsed = Math.round((usedStorage / totalStorage) * 100);
  const circleRadius = 18; // Smaller radius for better alignment (matching UI)
  const circleCircumference = 2 * Math.PI * circleRadius; // Full circle circumference

  return (
    <div className="flex items-center space-x-3">
      {/* Circular Progress */}
      <div className="relative w-12 h-12 z-0">
        <svg className="w-full h-full">
          {/* Outer Light Gray Circle */}
          <circle
            cx="24"
            cy="24"
            r={circleRadius}
            strokeWidth="10"
            stroke="#E2E8F0" /* Light gray circle */
            fill="none"
          />
          {/* Blue Progress Arc */}
          <circle
            cx="24"
            cy="24"
            r={circleRadius}
            strokeWidth="8"
            stroke="#3B82F6" /* Blue arc */
            fill="none"
            strokeDasharray={circleCircumference}
            strokeDashoffset={
              circleCircumference - (circleCircumference * percentageUsed) / 100
            }
            strokeLinecap="round" /* Rounded arc ends */
            transform="rotate(-90 24 24)" /* Start from top */
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Centered Percentage Label */}
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
          {percentageUsed}%
        </div>
      </div>

      {/* Storage Info */}
      <div>
        <p className="text-gray-700 font-medium">Storage</p>
        <p className="text-sm text-gray-500">
          {usedStorage} MB / {totalStorage / 1024} GB
        </p>
      </div>
    </div>
  );
};

export default StorageComponent;
