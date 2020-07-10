import React, { ChangeEvent, FC, FocusEvent, useEffect, useState } from 'react'

import { Input, Props as InputProps } from './Input'

type Props = Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'ref'> & {
  value?: string
  defaultValue?: string
}

export const CurrencyInput: FC<Props> = ({
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  ...props
}) => {
  const [controlledValue, setControlledValue] = useState(convertCurrency(value || defaultValue))
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setControlledValue(e.target.value)
    onChange && onChange(e)
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    const commaExcluded = controlledValue.replace(/,/g, '')
    setControlledValue(commaExcluded)
    onFocus && onFocus(e)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    setControlledValue(convertCurrency(controlledValue))
    onBlur && onBlur(e)
  }

  useEffect(() => {
    if (!isFocused) {
      setControlledValue(convertCurrency(value))
    }
  }, [value, isFocused])

  return (
    <Input
      type="text"
      value={controlledValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  )
}

function convertCurrency(value?: string) {
  if (!value) {
    return ''
  }
  const shaped = value
    .replace(/[０-９．]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0)) // convert number and dot to half-width
    .replace(/[−ー]/, '-') // replace full-width minus
    .replace(/[^0-9.-]|(?!^)-|^\.+|\.+$/g, '') // exclude non-numeric characters
  const splited = shaped.split('.')
  const integerPart = splited[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') // add comma to integer every 3 digits
  const formattedArray = Object.assign(splited, [integerPart])
  return formattedArray.join('.')
}
