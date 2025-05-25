import React from 'react'
import styles from './Select.module.scss'

interface SelectProps {
  options: { value: string; label: string }[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  className,
  ...props
}: SelectProps) => {
  return (
    <select
      className={`${styles['select']} ${className || ''}`}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      {...props}
    >
      {placeholder && (
        <option value="" disabled={value === undefined}>
          {placeholder}
        </option>
      )}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export default Select
