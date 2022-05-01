import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { buttonStyle, buttonText } from './CustomButton.style'

export type Props = {
  onClick: () => void,
  name: string,
  backgroundColor: string,
}

const CustomButton: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity style={buttonStyle(props.backgroundColor).ButtonStyle} onPress={props.onClick}>
      <Text style={buttonText().ButtonText}>{props.name}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton
