import { SplashScreen, Stack } from "expo-router";
import "../global.css"
import {useFonts} from "expo-font"
import { useEffect } from "react";
import GlobalProvider from "../context/GlobalProvider"
import { StatusBar } from "expo-status-bar";
export default function RootLayout() {
const [fontsLoaded] = useFonts({
  "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
  "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
  "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
  "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
  "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
  "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf")
})

useEffect(()=>{
  if(fontsLoaded){
    SplashScreen.hideAsync()
  }
},[fontsLoaded])
 if(!fontsLoaded) return null

  return (
    <GlobalProvider>
      <StatusBar style="black" />
  <Stack screenOptions={{headerShown: false}}>
    <Stack.Screen name="(tabs)" />
    <Stack.Screen name="index" />
    <Stack.Screen name="sign-up" />
  </Stack>
  </GlobalProvider>
  );
}
