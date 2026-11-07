import React from 'react';

export interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'yellow' | 'pink' | 'purple' | 'green' | 'blue' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  shadow?: 'normal' | 'lg' | 'none';
  children: React.ReactNode;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  variant = 'yellow',
  size = 'md',
  shadow = 'normal',
  className = '',
  children,
  disabled,
  ...props
}) => {
  const variantStyles = {
    yellow: 'bg-neoYellow text-neoDark hover:bg-[#ffe01b]',
    pink: 'bg-neoPink text-white hover:bg-[#f05072]',
    purple: 'bg-neoPurple text-white hover:bg-[#9172e2]',
    green: 'bg-neoGreen text-neoDark hover:bg-[#00cf8a]',
    blue: 'bg-neoBlue text-neoDark hover:bg-[#47b5ce]',
    white: 'bg-white text-neoDark hover:bg-neoBase',
    dark: 'bg-neoDark text-neoBase hover:bg-black',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-bold gap-1.5',
    md: 'px-4 py-2 text-sm font-bold gap-2',
    lg: 'px-6 py-3 text-base font-bold gap-2.5',
    icon: 'p-2.5 text-sm font-bold',
  };

  const shadowStyles = {
    normal: 'shadow-neo active:shadow-neo-active active:translate-x-[2px] active:translate-y-[2px]',
    lg: 'shadow-neo-lg active:shadow-neo-active active:translate-x-[3px] active:translate-y-[3px]',
    none: 'shadow-none',
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-grotesk tracking-wide rounded-none border-3 border-neoDark transition-all duration-100 uppercase select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${variantStyles[variant]} ${sizeStyles[size]} ${shadowStyles[shadow]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
