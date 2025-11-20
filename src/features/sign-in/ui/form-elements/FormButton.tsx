import type { ButtonHTMLAttributes, ReactNode } from 'react';

type FormButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const FormButton = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}: FormButtonProps) => {
  const baseClasses = 'cursor-pointer btn w-full';
  const variantClasses =
    variant === 'primary'
      ? 'bg-blue-500 hover:bg-blue-600 text-white'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-800';

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};
