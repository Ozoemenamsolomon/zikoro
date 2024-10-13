import { cn } from '@/lib'
import React, { InputHTMLAttributes, FC } from 'react'

interface InputCustomProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  name: string
  value: string | number | undefined
  error?: string | null
  className?: string
  type?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CustomInput: FC<InputCustomProps> = ({
  label,
  name,
  value,
  error,
  className,
  type = 'text',
  placeholder,
  onChange,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-mediu text-gray-600 mb-1">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        className={cn(`px-4 py-3 w-full border rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-200 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`, className)}
        onChange={onChange}
        {...props} // Spread any additional props like disabled, maxLength, etc.
      />
      {error && <small className="mt-1 text-sm text-red-500">{error}</small>}
    </div>
  )
}

export default CustomInput
