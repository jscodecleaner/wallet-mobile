import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { HelperText } from 'react-native-paper'

import { validatePassword } from '../../services/validators'

interface PasswordWarningProps {
  password: string
}

export const PasswordValidationWarning: React.FC<PasswordWarningProps> = ({ password }) => {
  const [condition, setCondition] = useState([] as string[])

  useEffect(() => {
    setCondition(validatePassword(password))
  }, [password])

  return (
    <View>
      { condition.includes('min') && <HelperText type="error">Minimum length 8 characters.</HelperText> }
      { condition.includes('uppercase') && <HelperText type="error">At least 1 uppercase letter</HelperText> }
      { condition.includes('lowercase') && <HelperText type="error">At least 1 lower letter</HelperText> }
      { condition.includes('digits') && <HelperText type="error">At least 1 digit</HelperText> }
      { condition.includes('symbols') && <HelperText type="error">At least 1 special character</HelperText> }
      { condition.includes('spaces') && <HelperText type="error">No space allowed.</HelperText> }
    </View>
  )
}
