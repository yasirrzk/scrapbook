import React from 'react';
import type { ReceiptCategory } from '../../types';

interface NeoBadgeProps {
  category?: ReceiptCategory | string;
  variant?: 'yellow' | 'pink' | 'purple' | 'green' | 'blue' | 'white' | 'dark';
  className?: string;
  children?: React.ReactNode;
}

export const NeoBadge: React.FC<NeoBadgeProps> = ({
  category,
  variant,
  className = '',
  children,
}) => {
  // Category default aesthetic color mapping
  const categoryColorMap: Record<string, string> = {
    Kuliner: 'bg-neoOrange text-white',
    Transport: 'bg-neoBlue text-white',
    Bioskop: 'bg-neoPink text-white',
    Liburan: 'bg-neoGreen text-white',
    Lainnya: 'bg-neoPurple text-white',
  };

  const variantStyles = {
    yellow: 'bg-neoYellow text-neoDark',
    pink: 'bg-neoPink text-white',
    purple: 'bg-neoPurple text-white',
    green: 'bg-neoGreen text-white',
    blue: 'bg-neoBlue text-white',
    white: 'bg-white text-neoDark',
    dark: 'bg-neoDark text-white',
  };

  const colorClass =
    variant
      ? variantStyles[variant]
      : category && categoryColorMap[category]
      ? categoryColorMap[category]
      : 'bg-neoYellow text-neoDark';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-grotesk font-black uppercase border-2 border-neoDark shadow-neo-sm ${colorClass} ${className}`}
    >
      {children || category}
    </span>
  );
};
