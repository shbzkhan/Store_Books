import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import icons from "@/constants/icons"

const FormField = ({title, value, placeholder, handleChangerText, otherStyles, inputStyle, ...props}) => {
    const [showPassword, setShowPassword] = useState(false)

    //text-gray-100 to text-black
    //focus:border-secondary to gray-600
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-black font-rubik-medium ">{title}</Text>
      <View className={`border border-gray-200 w-full h-16 px-4  rounded-xl focus:border-gray-600 items-center flex-row ${inputStyle}`}>
    <TextInput
    className="flex-1 text-black-200 font-rubik-semibold text-base text-black h-full"
    value={value}
    placeholder={placeholder}
    placeholderTextColor="#9E9E9E"
    onChangeText={handleChangerText}
    secureTextEntry={title === "Password" && !showPassword}
    {...props}
    />
    {title === "Password" && 
    <TouchableOpacity onPress ={()=> setShowPassword(!showPassword)}>
        <Image
        source={!showPassword ? icons.eye : icons.eyeHide}
        className="w-6 h-6"
        tintColor="black"
        resizeMode='contain'
        />
    </TouchableOpacity>
    }
      </View>
    </View>
  )
}

export default FormField