import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[16px] font-bold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-violet-300/25 disabled:cursor-not-allowed disabled:opacity-50";
  
  const variants = {
    primary: "border border-violet-300/45 bg-[#1a1426] text-violet-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_30px_rgba(0,0,0,0.24),0_0_0_1px_rgba(124,58,237,0.20)] hover:-translate-y-0.5 hover:border-violet-200/70 hover:bg-[#211830]",
    outline: "border border-violet-300/30 bg-white/5 text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 hover:border-violet-300/55 hover:bg-violet-100/10 hover:text-white",
    ghost: "border border-transparent bg-transparent text-gray-600 hover:border-violet-300/30 hover:bg-violet-100/10 hover:text-primary",
    gradient: "border border-violet-300/45 bg-[#1a1426] text-violet-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_30px_rgba(0,0,0,0.24),0_0_0_1px_rgba(124,58,237,0.20)] hover:-translate-y-0.5 hover:border-violet-200/70 hover:bg-[#211830]",
  };

  const sizes = {
    sm: "min-h-9 px-4 text-xs",
    md: "min-h-11 px-6 text-sm",
    lg: "min-h-[54px] px-8 text-base",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
