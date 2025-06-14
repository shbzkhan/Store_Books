import { View, Text, Image, FlatList, Alert, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useGlobalContext} from "../../context/GlobalProvider"
import { SafeAreaView } from 'react-native-safe-area-context'
import { formatMemberSince, formatPublicSince } from '../../constants/date'
import CustomButton from '../../components/CustomButton'
import axios from "axios"
import icons from '../../constants/icons'
const Profile = () => {
  const {user, setUser} = useGlobalContext()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const getUserBooks = async()=>{
    const token = await AsyncStorage.getItem("token")
    setLoading(true)
    try {
      const {data} = await axios.get(`${process.env.EXPO_PUBLIC_MONGODB_URL}/book/user`,{
            headers:{
              Authorization: `Bearer ${token}`
            }
          })
      setBooks(data.book)
    } catch (error) {
      Alert.alert("Error",error.response.data.message)
    } finally{
      setLoading(false)
    }
  }
  const handleLogout = async()=>{
    setLoading(true)
    await AsyncStorage.removeItem("token")
    setUser(null)
    router.replace("/")
    setLoading(false)
  }


  const handleRating = (rating)=>{
      let stars =[];
      for (let i = 1; i <= 5; i++) {
      stars.push(<TouchableOpacity key={i} >
          <Image
          source={i <= rating? icons.star : icons.starOutline}
          resizeMode='contain'
          className="size-4"
          />
        </TouchableOpacity>
        
      )}
      return <View className="flex flex-row gap-1 items-center ">{stars}</View>
      }

  const handleRefresh = ()=>{
    setRefreshing(true)
    getUserBooks()
    setRefreshing(false)
  }

  const deleteBooks = async(bookId)=>{
    const token = await AsyncStorage.getItem("token")
    setDeleteLoading(bookId)
    console.log("BookId: ", bookId)
    try {
      await axios.delete(`${process.env.EXPO_PUBLIC_MONGODB_URL}/book/${bookId}`,{
            headers:{
              Authorization: `Bearer ${token}`
            }
          })
      setBooks(books.filter(book => book._id !== bookId))
    } catch (error) {
      Alert.alert("Error",error.response.data.message)
    } finally{
      setDeleteLoading(null)
    }
  }
  
  useEffect(()=>{
    getUserBooks()
  },[])

   if(loading || !user)
        return (<ActivityIndicator
        size="large"
        className="flex justify-center items-center h-full"
        />)

  return (
    <SafeAreaView className="px-4 pb-14 pt-4 bg-gray-200 h-full flex">
     
      {/* <Button onPress={handleLogout} title='Logout'/> */}
     

          <FlatList
              data={books}
              keyExtractor={(item)=>item._id}
              showsVerticalScrollIndicator = {false} 
              renderItem={({item})=>(
              <View className="h-36 bg-white p-2 rounded-xl flex flex-row justify-between mb-3">
                <View className="flex flex-row gap-3 w-2/3 pr-4">
                <View className="h-full w-24 border rounded-xl border-gray-200">
                  <Image
                  source={{uri: item.image}}
                  resizeMode='cover'
                  className="h-full w-full rounded-xl"
                  />
                </View>
                <View className="justify-between">
                  <View className="gap-1">
                    <Text className="font-rubik-semibold text-xl"
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >{item.title}</Text>
                    <View >
                    {handleRating(item.rating)}
                    </View>
                    <Text className="font-rubik text-md text-gray-600"
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >{item.caption}</Text>
                  </View>
                  <Text className='font-rubik-semibold text-md text-gray-300'>{formatPublicSince(item.createdAt)}</Text>
                </View>
                </View>
                {
                  deleteLoading === item._id ?
                  ( <ActivityIndicator
                     size="small"
                     className="pr-2"
                    />)
                  :
                  (<TouchableOpacity
                  onPress={()=>deleteBooks(item._id)}

                className="h-full w-10 justify-center items-center"
                >
                  <Image
                  source={icons.deleteIcon}
                  resizeMode='contain'
                  className="w-6 h-6"
                  tintColor="red"
                  />
                  </TouchableOpacity>
               )}
              </View>
            )}
          ListHeaderComponent={
              <View className="flex gap-3">
              <View className="bg-white px-4 py-6 flex flex-row gap-5 rounded-2xl">
                <View className="justify-center items-center">
                  <Image
                  source={{uri: user.avatar}}
                  resizeMode="cover"
                  className="w-16 h-16 rounded-full"
                  />
                </View>
                <View >
                  <Text className="font-rubik-semibold text-2xl">{user.username}</Text>
                  <Text className="font-rubik-medium text-gray-500">{user.email}</Text>
                  <Text className="font-rubik-medium text-gray-500">Joined Since {formatMemberSince(user.createdAt)}</Text>
                </View>
              </View>
              <CustomButton
                  title="Logout"
                  containerStyle="bg-red-500 min-h-[55px]"
                  handlePress={handleLogout}
                />
              <View className="flex flex-row justify-between items-center mb-4">
                <Text className="font-rubik-semibold text-xl">Your Books</Text>
                <Text className="font-rubik-medium text-gray-500">{books.length} books</Text>
              </View> 
            </View>
          }

          refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            />
          }

          ListEmptyComponent={
                // <View className="h-full w-full justify-center">
                  <View className='flex  items-center justify-center px-4 h-60 bg-white rounded-2xl gap-2'>
                    <Text className="text-xl font-rubik-semibold">No recommended yet</Text>
                    <Text className="text-md font-rubik-medium color-gray-700 mb-4">Be the first to share a book!</Text>
                    <CustomButton
                        title="Create a Store Book"
                        handlePress={()=>router.push("/create")}
                    />
                    </View>
                  // </View>
                }
          />
    </SafeAreaView>
  )
}

export default Profile