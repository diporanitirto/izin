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
    <div className="fixed inset-0 bg-scoutBrown-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-scale-in">
        <div className="p-6">
          <div className="mb-5 flex justify-center">
            <div className="bg-scoutKhaki-100 p-3 rounded-full">
              <svg className="w-10 h-10 text-scoutBrown-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-scoutBrown-900 text-center mb-2">
            Ganti NIS?
          </h2>

          <div className="bg-scoutKhaki-50 border border-scoutKhaki-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-scoutBrown-500 mb-1">Saat ini:</p>
            <p className="text-sm font-bold text-scoutBrown-900">{currentName}</p>
            <p className="text-xs text-scoutBrown-500">NIS: {currentNIS}</p>
          </div>

          <p className="text-sm text-scoutBrown-600 text-center mb-5 leading-relaxed">
            Sesi akan dihapus dan Anda diminta memasukkan NIS baru.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-5 py-2.5 bg-scoutKhaki-100 hover:bg-scoutKhaki-200 text-scoutBrown-700 font-medium rounded-lg transition-colors text-sm"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-5 py-2.5 bg-scoutBrown-700 hover:bg-scoutBrown-800 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Ya, Ganti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
