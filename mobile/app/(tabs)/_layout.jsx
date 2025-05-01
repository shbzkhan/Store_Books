import icons from "@/constants/icons"
import { Tabs } from "expo-router"
import {View, Image,Text} from "react-native"

const TabIcon = ({icon, focused, title}) =>{
    return(
    <View className="flex-1 mt-3 flex flex-col items-center">
        <Image source={icon} tintColor={focused? "#0061ff":"#666876"}
        resizeMode="contain"
        className="size-6"
        />
        <Text className = {`${focused ? "text-primary-300 font-rubik-medium" : "text-black-200 font-rubik"} text-xs w-full text-center mt-1`}>
        {title}
        </Text>
    </View>
    )
}


const TabLayout = () => {
    return (
        <Tabs
            screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            headerShadowVisible: false,
            tabBarStyle:{
                backgroundColor:"white",
                position: "absolute",
                borderTopColor: "#0061FF1A",
                borderTopWidth: 1,
                minHeight: 70
            }
        }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title:"Home",
                    tabBarIcon:({focused})=>(
                        <TabIcon icon={icons.home} 
                        focused={focused}
                        title="Home"
                        />
                    )
                }}
            />
            
            <Tabs.Screen
                name="create"
                options={{
                    title:"Create",
                    tabBarIcon:({focused})=>(
                        <TabIcon icon={icons.create} 
                        focused={focused}
                        title="Create"
                        />
                    )
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title:"Profile",
                    tabBarIcon:({focused})=>(
                        <TabIcon icon={icons.profile} 
                        focused={focused}
                        title="Profile"
                        />
                    )
                }}
            />
        </Tabs>
    )
}

export default TabLayout