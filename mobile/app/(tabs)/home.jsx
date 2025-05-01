import { View, Text, Alert, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import {useGlobalContext} from "../../context/GlobalProvider"
import axios from "axios"
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  const {token} = useGlobalContext()
  const [books, setBooks] = useState([])
  const [loading, setLodaing] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchBooks = async(pageNum = 1, refresh = false)=>{
    try {
      if(refresh) setRefreshing(true)
        else if(pageNum === 1) setLodaing(true)

        const {data} = await axios.get(`${process.env.EXPO_PUBLIC_MONGODB_URL}/book?page=$${pageNum}&limit=5`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        })

        setBooks((preBook)=> [...preBook, ...data.books])
        setHasMore(pageNum< data.totalPages);
        setPage(pageNum)
        console.log("Error",data.message)
        
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
    console.log("BOOKS!!!", books)
  return (
    <SafeAreaView className ="h-full bg-white">
      <FlatList
      data={books}
      keyExtractor={(item)=>{item._id}}
      renderItem={({item})=>(
        <View>
          <Text>{item.title}</Text>
          <Image
          source={{uri: item.image}}
          resizeMode='cover'
          className="w-full h-60"
          />
          <Text>{item.caption}</Text>

        </View>
      )}
      />
    </SafeAreaView>
  )
}

export default Home