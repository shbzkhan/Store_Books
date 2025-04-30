import { View, Text } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'
import { Button } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useGlobalContext} from "../../context/GlobalProvider"
const Profile = () => {
  const {setToken} = useGlobalContext()
  
  const handleLogout = async()=>{
    await AsyncStorage.removeItem("token")
    setToken(null)
    router.replace("/")
  }
  return (
    <View>
      <Text>Profile</Text>
      <Button onPress={handleLogout} title='Logout'/>
    </View>
  )
}

export default Profile