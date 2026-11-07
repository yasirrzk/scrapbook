import React from 'react';

interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const NeoInput: React.FC<NeoInputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="font-grotesk font-bold text-xs uppercase tracking-wider text-neoDark">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3.5 py-2.5 font-grotesk font-medium text-sm bg-white border-3 border-neoDark shadow-neo-sm focus:shadow-neo focus:outline-none focus:bg-yellow-50 transition-all ${className}`}
        {...props}
      />
      {error && <span className="text-neoPink font-grotesk font-bold text-xs mt-0.5">{error}</span>}
    </div>
  );
};

interface NeoTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const NeoTextArea: React.FC<NeoTextAreaProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="font-grotesk font-bold text-xs uppercase tracking-wider text-neoDark">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full px-3.5 py-2.5 font-grotesk font-medium text-sm bg-white border-3 border-neoDark shadow-neo-sm focus:shadow-neo focus:outline-none focus:bg-yellow-50 transition-all resize-y min-h-[80px] ${className}`}
        {...props}
      />
      {error && <span className="text-neoPink font-grotesk font-bold text-xs mt-0.5">{error}</span>}
    </div>
  );
};
