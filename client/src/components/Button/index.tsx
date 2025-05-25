import React from 'react'
import styles from './Button.module.scss'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'large'
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'large',
  ...props
}) => {
  const buttonClass = `${styles['button']} ${styles[variant]} ${
    styles[`button--${size}`]
  }`
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  )
}

export default Button
