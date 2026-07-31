import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyle = 'font-bold rounded-xl transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-2';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  const variantStyles = {
    primary: 'bg-indigo-brand text-white hover:shadow-lg hover:shadow-indigo-brand/30 hover:scale-[1.01]',
    secondary: 'bg-surface-bright text-on-surface border border-surface-container hover:bg-surface-container/50',
    success: 'bg-success text-white hover:shadow-lg hover:shadow-success/30 hover:scale-[1.01]',
    danger: 'bg-error text-white hover:shadow-lg hover:shadow-error/30',
    outline: 'bg-transparent border border-indigo-brand text-indigo-brand hover:bg-indigo-brand/10',
  };

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
