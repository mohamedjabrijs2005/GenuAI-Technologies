import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[2500] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]">
      <div className={`glass p-6 rounded-2xl w-full ${maxWidth} max-h-[85vh] overflow-y-auto relative shadow-2xl border border-surface-container`}>
        <div className="flex justify-between items-center mb-4 border-b border-surface-container/50 pb-3">
          <h3 className="text-lg font-bold text-on-surface m-0">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-bright border border-surface-container flex items-center justify-center text-on-surface-variant font-bold hover:bg-surface-container transition-colors"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
