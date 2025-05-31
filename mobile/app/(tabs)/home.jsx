import { View, Text, Alert, FlatList, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import {useGlobalContext} from "../../context/GlobalProvider"
import axios from "axios"
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import icons from '../../constants/icons'
import { formatPublicSince } from '../../constants/date'

const Home = () => {
  // const {token} = useGlobalContext()
  const [books, setBooks] = useState([])
  const [loading, setLodaing] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchBooks = async(pageNum = 1, refresh = false)=>{
    const token = await AsyncStorage.getItem("token")
    try {
      if(refresh) setRefreshing(true)
        else if(pageNum === 1) setLodaing(true)

        const {data} = await axios.get(`${process.env.EXPO_PUBLIC_MONGODB_URL}/book?page=${pageNum}&limit=2`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        const combinedBooks = refresh || pageNum === 1 ? data.books : [...books, ...data.books];
        const uniqueBooks = Array.from(new Map(combinedBooks.map(book => [book._id, book])).values());
        setBooks(uniqueBooks)
        setHasMore(pageNum < data.totalPages);
        setPage(pageNum)
        
      } catch (error) {

        Alert.alert("Error",error.response.data.message)
      } finally{
        if(refresh) setRefreshing(false);
        else setLodaing(false)
      }
    }
    
    useEffect(()=>{
      fetchBooks()
    },[])

    const handleLoadMore = async()=>{
      if(hasMore && !loading && !refreshing){
        await fetchBooks(page + 1)
      }
    }

const handleRating = (rating)=>{
    let stars =[];
    for (let i = 1; i <= 5; i++) {
    stars.push(<TouchableOpacity key={i} >
        <Image
        source={i <= rating? icons.star : icons.starOutline}
        resizeMode='contain'
        className="size-5"
        />
      </TouchableOpacity>
      
    )}
    return <View className="flex flex-row gap-2 items-center ">{stars}</View>
    }

  if(loading)
      return (<ActivityIndicator
      size="large"
      className="flex justify-center items-center h-full"
      />)
  

  return (
    <SafeAreaView className ="h-full bg-gray-200 pb-14">
      <FlatList
      data={books}
      keyExtractor={(item)=>item._id}
      showsVerticalScrollIndicator = {false} 
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      renderItem={({item})=>(
        <View className="bg-white m-4 rounded-2xl px-3 py-4 flex flex-col gap-2">
          <View className="flex flex-row gap-2 items-center">
            <Image
            source={{uri: item.user.avatar}}
            resizeMode='cover'
            className="w-10 h-10 rounded-full"
            />
            <Text className="font-rubik-semibold text-lg">{item.user.username}</Text>
          </View>
          <Image
          source={{uri: item.image}}
          resizeMode='cover'
          className="w-full h-60 rounded-2xl"
          />
          <View className="flex gap-2 px-2">
          <Text className="font-rubik-semibold text-lg" >{item.title}</Text>
          <View>
          {handleRating(item.rating)}
          </View>
          <Text className="font-rubik-medium text-md text-gray-600">{item.caption}</Text>
          <Text className='font-rubik-semibold text-md text-gray-300'>Shared on {formatPublicSince(item.createdAt)}</Text>
        </View>
        </View>
      )}

      ListHeaderComponent={
        <View className="flex justify-center pt-4 ">
          <Text className="font-rubik-bold text-3xl text-center">Store Book</Text>
        </View>
      }

      ListEmptyComponent={
        <View>
          <Text>No recommended yet</Text>
          <Text>Be the first to share a book!</Text>
        </View>
      }
      ListFooterComponent={
         hasMore && books.length > 0 ? (
          <ActivityIndicator
          className="flex justify-center items-center pb-4"
          size="small"

          />
         ):null
      }

      refreshControl={
        <RefreshControl
        refreshing= {refreshing}
        onRefresh={()=>fetchBooks(1, true)}
        />
      }
      />
    </SafeAreaView>
  )
}

export default Home