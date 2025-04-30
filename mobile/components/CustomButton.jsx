import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title, containerStyle, loading, handlePress}) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    disabled={loading}
    className={`w-full min-h-[62px] bg-black rounded-xl justify-center items-center ${containerStyle} ${loading && "opacity-50"}`}
    >
    
        <Text className='text-white font-rubik-bold text-lg'>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton