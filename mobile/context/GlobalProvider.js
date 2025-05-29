import { createContext, useContext, useState, useEffect, Children } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router } from "expo-router";
import { Alert } from "react-native";
import axios from "axios";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider =({children})=>{
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)

    const currentUser = async ()=>{
        setIsLoading(true)
        try {
            const token = await AsyncStorage.getItem("token")
            const {data} = await axios.get(`${process.env.EXPO_PUBLIC_MONGODB_URL}/auth/profile`,{
                headers:{
                  Authorization: `Bearer ${token}`
                }
              })
            setUser(data.user)
            
            if(data.user){
                router.replace("/home")
            }
        } catch (error) {
            setUser(null)
            router.replace("/")
        }
        finally{
            setIsLoading(false)
        }
    } 
    console.log("Current user: ", user)

    useEffect(()=>{
        currentUser()
    },[])

    return (
        <GlobalContext.Provider
        value={{
            isLoading,
            user,
            setUser
        }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider