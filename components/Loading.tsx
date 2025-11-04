'use client';

import { useState, useEffect } from 'react';

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate realistic loading progress
    const intervals = [
      { time: 100, progress: 25 },
      { time: 150, progress: 50 },
      { time: 200, progress: 75 },
      { time: 150, progress: 90 },
      { time: 100, progress: 100 },
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
    <div className="fixed inset-0 bg-gradient-to-br from-scoutKhaki-50 to-scoutBrown-100 flex items-center justify-center z-50">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8 animate-scale-in">
          <h2 className="text-xl sm:text-2xl font-bold text-scoutBrown-900 mb-2">
            Memuat Data
          </h2>
          <p className="text-scoutBrown-600 text-sm">
            Mohon tunggu sebentar...
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="relative">
          {/* Background track */}
          <div className="w-full h-3 bg-scoutBrown-200/50 rounded-full overflow-hidden shadow-inner">
            {/* Progress fill */}
            <div 
              className="h-full bg-gradient-to-r from-scoutBrown-700 via-scoutBrown-800 to-scoutBrown-900 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
            </div>
          </div>

          {/* Percentage text */}
          <div className="mt-3 text-center">
            <span className="text-sm font-bold text-scoutBrown-800">
              {progress}%
            </span>
          </div>
        </div>

        {/* Loading messages based on progress */}
        <div className="mt-6 text-center animate-fade-in">
          <p className="text-xs text-scoutBrown-500 font-medium">
            {progress < 40 && "Memuat data..."}
            {progress >= 40 && progress < 80 && "Memproses..."}
            {progress >= 80 && "Hampir selesai..."}
          </p>
        </div>
      </div>
    </div>
  );
}
