import { Link, router } from "expo-router";
import { Alert, Image, ScrollView, Text, View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/logo.png"
import FormField from "../components/FormField"
import CustomButton from "../components/CustomButton"
import { useState } from "react";
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUp() {
  // const [loading, setLoading] = useState(false)
  const [isSubmiting, setIsSubmiting]= useState(false)
  const [form, setForm]= useState({
    username:"",
    email:"",
    password:""
  })
  const handleRegister = async()=>{
    setIsSubmiting(true)
        try {
            const signUp={
              username: form.username,
              email: form.email,
              password: form.password
            }
            const {data} = await axios.post(`${process.env.EXPO_PUBLIC_MONGODB_URL}/auth/register`, signUp)
            await AsyncStorage.setItem("token", data.token);
            console.log("Token", data.token)
            router.replace("/home")
            return Alert.alert("Success", data.message)
          } catch (error) {
            Alert.alert("Error", error.response.data.message)
          } finally{
            setIsSubmiting(false)
          }
  }
  return (
    <SafeAreaView className="h-full">
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
            > 
      <ScrollView
       contentContainerClassName="h-full w-full flex justify-center px-4">

        {/* <Image
        source={logo}
        resizeMode="contain"
         className="w-full"
        /> */}
      <Text className="text-3xl font-rubik-extrabold text-center">Welcome to Store Book</Text>
      <Text className="text-xl font-rubik-bold mt-4">Register Store Book</Text>
      <FormField
        title="Username"
        placeholder="Enter username "
         value = {form.username}
         handleChangerText={(e)=>setForm({...form, username: e})}
        otherStyles="mt-7"
        />
      <FormField
        title="Email"
        placeholder="Enter email "
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
        title="Register Store Book"
        containerStyle="mt-7"
        loading={isSubmiting}
        handlePress={handleRegister}
        />
        <View className="flex flex-row gap-2 mt-4 justify-center">
          <Text className="font-rubik-semibold text-lg ">Have an Account?</Text>
      <Link href="/" className="font-rubik-semibold text-lg text-blue-600">Login</Link>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
