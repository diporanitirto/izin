'use client';

import { useState } from 'react';

interface ChangeNISModalProps {
  isOpen: boolean;
  currentNIS: string;
  currentName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ChangeNISModal({
  isOpen,
  currentNIS,
  currentName,
  onConfirm,
  onCancel
}: ChangeNISModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-scoutBrown-900/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in relative">
        <div className="h-1.5 w-full pattern-hasduk relative z-10"></div>
        <div className="p-8">
          {/* Icon Warning */}
          <div className="mb-6 flex justify-center">
            <div className="bg-amber-100 p-4 rounded-full">
              <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-scoutBrown-900 text-center mb-3">
            Ganti NIS?
          </h2>

          {/* Current Info */}
          <div className="bg-scoutKhaki-50 border border-scoutBrown-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-scoutBrown-700 mb-1">
              <span className="font-semibold">Saat ini:</span>
            </p>
            <p className="text-base font-bold text-scoutBrown-900">{currentName}</p>
            <p className="text-sm text-scoutBrown-600">NIS: {currentNIS}</p>
          </div>

          {/* Warning Message */}
          <p className="text-sm text-scoutBrown-700 text-center mb-6 leading-relaxed">
            Data sesi saat ini akan dihapus dan Anda akan diminta memasukkan NIS baru.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-scoutBrown-700 to-scoutBrown-900 hover:from-scoutBrown-800 hover:to-scoutBrown-950 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Ya, Ganti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
