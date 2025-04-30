import { createContext, useContext, useState, useEffect, Children } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router } from "expo-router";
import { Alert } from "react-native";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider =({children})=>{
    const [isLoading, setIsLoading] = useState(true)
    const [token, setToken] = useState(null)

    const currentUser = async ()=>{
        setIsLoading(true)
        try {
            const token = await AsyncStorage.getItem("token")
            
            setToken(token)
        } catch (error) {
            Alert.alert("Error", "somthing went wrong")
        }
        finally{
            setIsLoading(false)
        }
    } 

    useEffect(()=>{
        currentUser()
    },[])

    return (
        <GlobalContext.Provider
        value={{
            isLoading,
            token,
            setToken
        }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider