import React from 'react'
import { clsx } from '../../lib/clsx'
import { BaseComponent } from '../../types/index'

type UiButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  BaseComponent

const baseClasses = 'px-4 py-2 rounded font-medium transition-colors'
const variantClasses = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
}
const disabledClasses = 'opacity-50 cursor-not-allowed'

export function UiButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className,
  testId,
  ...restProps
}: UiButtonProps) {
  const mergedClasses = clsx(
    baseClasses,
    variantClasses[variant],
    disabled && disabledClasses,
    className,
  )

  return (
    <button
      data-testid={testId}
      className={mergedClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  )
}
