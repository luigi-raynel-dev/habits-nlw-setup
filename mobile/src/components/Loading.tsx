import React from 'react'
import { ActivityIndicator, View } from 'react-native'

type Props = {}

export default function Loading({}: Props) {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#09090A'
     }}>
      <ActivityIndicator color="#7C3AED" />
    </View>
  )
}