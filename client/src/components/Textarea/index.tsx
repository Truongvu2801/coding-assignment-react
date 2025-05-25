import React from 'react'
import styles from './Textarea.module.scss'

interface TextareaProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder = 'Add Ticket',
  className
}) => {
  return (
    <div className={`${styles['textareaContainer']} ${className || ''}`}>
      <textarea
        className={styles['textarea']}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default Textarea
