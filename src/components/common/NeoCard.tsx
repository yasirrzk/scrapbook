import React from 'react';

export interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  shadow?: 'normal' | 'lg' | 'none';
  bg?: string;
  className?: string;
}

export const NeoCard: React.FC<NeoCardProps> = ({
  children,
  shadow = 'normal',
  bg = 'bg-white',
  className = '',
  ...props
}) => {
  const shadowStyles = {
    normal: 'shadow-neo',
    lg: 'shadow-neo-lg',
    none: 'shadow-none',
  };

  return (
    <div
      className={`border-3 border-neoDark ${bg} ${shadowStyles[shadow]} p-4 sm:p-5 relative ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
