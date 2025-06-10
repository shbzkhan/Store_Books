import { View, Text } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'
import { Button } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useGlobalContext} from "../../context/GlobalProvider"
import { SafeAreaView } from 'react-native-safe-area-context'
const Profile = () => {
  const {user, setUser} = useGlobalContext()
  
  const handleLogout = async()=>{
    await AsyncStorage.removeItem("token")
    setUser(null)
    router.replace("/")
  }
  return (
    <SafeAreaView>
      <Text>Profile</Text>
      <Button onPress={handleLogout} title='Logout'/>
    </SafeAreaView>
  )
}

export default Profile