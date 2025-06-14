import { Link, Redirect, router } from "expo-router";
import { ActivityIndicator, Alert, Image, ScrollView, Text, View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../components/FormField"
import CustomButton from "../components/CustomButton"
import { useEffect, useState } from "react";
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "../context/GlobalProvider";

export default function Index() {
  const {isLoading, token, user, setUser} = useGlobalContext()
  const [isSubmitting, setIsSubmitting]= useState(false)
  const [form, setForm]= useState({
    email:"",
    password:""
  })

  const handleLogin = async()=>{
    setIsSubmitting(true)
    try {
      const login={
        email: form.email,
        password: form.password
      }
      const {data} = await axios.post(`${process.env.EXPO_PUBLIC_MONGODB_URL}/auth/login`, login)
      await AsyncStorage.setItem("token", data.token);
      router.replace("/home")
      setUser(data.user)
      
    } catch (error) {
      Alert.alert("Error", error.response.data.message)
      setUser(null)
    }finally{
      setIsSubmitting(false)
    }
  }

if(isLoading){
  return <ActivityIndicator size={"large"}/>
}
  if(!isLoading && user){
    return <Redirect href="/home"/>
  }
  return (
    <SafeAreaView className="h-full">
      <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
            >
      <ScrollView
       contentContainerClassName="h-full w-full flex justify-center  px-4">

        {/* <Image
        source={logo}
        resizeMode="contain"
         className="w-full h-12"
        /> */}
      <Text className="text-3xl font-rubik-extrabold text-center">Welcome to Store Book</Text>
      <Text className="text-xl font-rubik-bold mt-4">Login Store Book</Text>
      <FormField
        title="Email"
        placeholder="Enter email"
        value = {form.email}
        handleChangerText={(e)=>setForm({...form, email: e})}

        otherStyles="mt-7"
        keyboardType="email-address"
        />

        <FormField
        title="Password"
        placeholder="Enter Password"
        value = {form.password}
        handleChangerText={(e)=>setForm({...form, password: e})}
        otherStyles="mt-7"
        />
      
        <CustomButton
        title="Login Store Book"
        containerStyle="mt-7"
        loading={isSubmitting}
        handlePress={handleLogin}
        />
        <View className="flex flex-row gap-2 mt-4 justify-center">
          <Text className="font-rubik-semibold text-lg ">Don't have Account?</Text>
      <Link href="/sign-up" className="font-rubik-semibold text-lg text-blue-600">Register</Link>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
