import { View, Text, ScrollView, TouchableOpacity, Image, Platform, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from "../../components/FormField"
import icons from "../../constants/icons"
import CustomButton from "../../components/CustomButton"
import * as ImagePicker from "expo-image-picker"
import axios from "axios"
import {useGlobalContext} from "../../context/GlobalProvider"
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'




const Create = () => {
  const[isSubmiting, setIsSubmiting]= useState(false)
    // const {token} = useGlobalContext()
  
  const [form, setForm]= useState({
    title:"",
    image:null,
    rating:3,
    caption:""
  })

  //create api 
  const handleBookCreate = async()=>{
    setIsSubmiting(true)
    try {
      const token = await AsyncStorage.getItem("token")
      const formData = new FormData();
      formData.append("image",{
        uri: form.image.uri,
        name: `book.${Date.now()}`,
        type: "image/jpeg",
      })
      formData.append("title",form.title);
      formData.append("rating", form.rating);
      formData.append("caption", form.caption);

      const {data} = await axios.post(`${process.env.EXPO_PUBLIC_MONGODB_URL}/book/create`,formData,{
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      })
      router.push("/home")
      Alert.alert("Success","Book successfully created, please refresh page")
    } catch (error) {
      Alert.alert("Error", error.response.data.message)
    }finally{
      setIsSubmiting(false)
      setForm({
        title:'',
        rating:3,
        image: null,
        caption:""
      })
    }
  }

// image picker
const openPicker =async()=>{
let result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: "images",
  aspect:[4, 3],
  quality: 1,
  allowsEditing: true
})
if(!result.canceled){
  setForm({...form, image:result.assets[0]})
}
}

  //rating functionallity
  const handleRating = ()=>{
    let stars =[];
    for (let i = 1; i <= 5; i++) {
     stars.push(<TouchableOpacity key={i} onPress={()=>setForm({...form, rating:i})} >
        <Image
        source={i <= form.rating? icons.star : icons.starOutline}
        resizeMode='contain'
        className="size-10"
        />
      </TouchableOpacity>
      
    )}
    return <View className="flex flex-row w-full h-16 border border-gray-200 justify-around items-center  rounded-xl">{stars}</View>
    }

  return (
    <SafeAreaView className="h-full bg-white pb-14">
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
      >
      <ScrollView
      showsVerticalScrollIndicator={false}
      className="px-4 mt-6"
      >
          <Text className="text-3xl font-rubik-bold">Create a New Book</Text>
          
          <FormField
          title="Title"
          value={form.title}
          placeholder="Give your title"
          handleChangerText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />
        <View className="mt-7">
          <Text className="text-base text-black font-rubik-medium" >Rating</Text>
          {handleRating()}
        </View>
        <View className="mt-7 space-y-2">
          <Text className=" text-base text-black font-rubik-medium">
            Image
          </Text>
        <TouchableOpacity
        onPress={openPicker}
        >
        {
          form.image?(
            <Image
                source={{ uri: form.image.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
              />
          ):(
            <View className="w-full h-64 px-4  rounded-2xl justify-center items-center border border-gray-200  flex-col gap-2 space-x-2 ">
              <Image
                  source={icons.image}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-600 font-rubik-medium">
                  Choose a file
                </Text>
            </View>
          )
        }
        </TouchableOpacity>
        </View>
        <FormField
          title="Title"
          value={form.caption}
          placeholder="Give your caption"
          handleChangerText={(e) => setForm({ ...form, caption: e })}
          otherStyles="mt-10"
          inputStyle="h-32"
          multiline
          textAlignVertical="top"
          textAlign="left"
        />
        <CustomButton
        title="Upload Store Book"
        containerStyle="mt-7 mb-2"
         loading={isSubmiting}
         handlePress={handleBookCreate}
        />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Create