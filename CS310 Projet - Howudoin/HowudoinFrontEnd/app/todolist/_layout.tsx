import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import {useSearchParams} from "expo-router/build/hooks";

export default function RootLayout() {
    const usr = useSearchParams().get('usr') || "Guest"; // Default to "Guest" if not provided
    const jwt = useSearchParams().get('jwt') || ""; // Default to empty string if not provided
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: { backgroundColor: 'black' }, // Set the background color to black
                tabBarActiveTintColor: 'lightgreen', // Set the active tab text color to light green
                tabBarInactiveTintColor: 'lightgreen', // Set the inactive tab text color to light green
            }}
        >
            {/* Process Tab */}
            <Tabs.Screen
                name="process"
                options={{
                    title: 'Process',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="friendsMainPage"
                options={{
                    title: 'Friends',
                    tabBarIcon: ({ color }) => <Entypo name="user" size={24} color={color} />,
                    headerShown: false,
                }}
                initialParams={{ usr, jwt }}

            />
            <Tabs.Screen
                name="groupsMainPage"
                options={{
                    title : 'Groups',
                    tabBarIcon: ({ color }) => <Entypo name="users" size={24} color={color} />,
                    headerShown: false,
                }}
                initialParams={{ usr, jwt }}
            />

            {/* Log Out Tab */}
            <Tabs.Screen
                name="logout"
                options={{
                    title: 'Log Out',
                    tabBarIcon: ({ color }) => <Entypo name="log-out" size={24} color={color} />,
                    headerShown: false,
                }}
            />

            {/* Hide all other screens */}
            <Tabs.Screen
                name="addFriend"
                options={{
                    href: null, // This hides it from the tabs
                    headerShown: false,

                }}
            />
            <Tabs.Screen
                name="createGroup"
                options={{
                    href: null, // This hides it from the tabs
                    headerShown: false,

                }}
            />
            <Tabs.Screen
                name="details"
                options={{
                    href: null, // This hides it from the tabs
                    headerShown: false,

                }}
            />
            <Tabs.Screen
                name="friendsConversation"
                options={{
                    href: null, // This hides it from the tabs
                    headerShown: false,

                }}
            />

            <Tabs.Screen
                name="groupaddMember"
                options={{
                    href: null, // This hides it from the tabs
                    headerShown: false,

                }}
            />
            <Tabs.Screen
                name="groupConversation"
                options={{
                    href: null, // This hides it from the tabs
                    headerShown: false,

                }}
            />

        </Tabs>
    );
}