'use client';

import { useState, useEffect } from 'react';

export default function LoadingMini() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Faster loading for mini version
    const intervals = [
      { time: 80, progress: 30 },
      { time: 100, progress: 60 },
      { time: 120, progress: 90 },
      { time: 80, progress: 100 },
    ];

    let currentStep = 0;
    const runProgress = () => {
      if (currentStep < intervals.length) {
        const { time, progress: prog } = intervals[currentStep];
        setTimeout(() => {
          setProgress(prog);
          currentStep++;
          runProgress();
        }, time);
      }
    };

    runProgress();
  }, []);

  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-full max-w-xs">
        {/* Progress Bar Container */}
        <div className="relative">
          {/* Background track */}
          <div className="w-full h-2 bg-scoutBrown-200/50 rounded-full overflow-hidden shadow-inner">
            {/* Progress fill */}
            <div 
              className="h-full bg-gradient-to-r from-scoutBrown-700 via-scoutBrown-800 to-scoutBrown-900 rounded-full transition-all duration-200 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.2s_ease-in-out_infinite]"></div>
            </div>
          </div>

          {/* Percentage text */}
          <div className="mt-2 text-center">
            <span className="text-xs font-semibold text-scoutBrown-700">
              {progress}%
            </span>
          </div>
        </div>

        {/* Loading text */}
        <div className="mt-3 text-center">
          <p className="text-xs text-scoutBrown-500 font-medium">
            Memuat...
          </p>
        </div>
      </div>
    </div>
  );
}
