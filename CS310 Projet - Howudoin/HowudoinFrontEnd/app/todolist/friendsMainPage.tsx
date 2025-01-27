import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSearchParams } from "expo-router/build/hooks";
import { useFocusEffect } from "@react-navigation/native";
import {API_URL} from "@/config";
// Nihat Ömer Karaca 30626
// Tuna Solakoğlu 32121
export default function FriendsMainPage() {
    const router = useRouter();
    const jwt = useSearchParams().get('jwt');
    const usr = useSearchParams().get('usr');

    const [friends, setFriends] = useState([]);

    const fetchFriends = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`, // Authorization header
            },
        };

        const url = `${API_URL}/friends/${usr}`;

        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                console.error("Response status:", response.status);
                throw new Error(`Failed to fetch friends: ${response.status}`);
            }
            const data = await response.json();
            setFriends(data);
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchFriends(); // Fetch friends on focus

            const interval = setInterval(() => {
                fetchFriends(); // Fetch every 5 seconds
            }, 5000);

            return () => clearInterval(interval); // Clear interval on unfocus
        }, [jwt, usr])
    );

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: '/Users/nihatomerkaraca/Desktop/CS310/FrontEnd/HowudoinFrontEnd/assets/images/matrix.png' }}
                style={styles.background}
                imageStyle={{ resizeMode: 'stretch' }}
            >
                <Pressable
                    style={styles.addFriendButton}
                    onPress={() => router.push({ pathname: "/todolist/addFriend", params: { jwt, usr } })}>
                    <Text style={styles.addFriendText}>Add Friend</Text>
                </Pressable>

                <Pressable
                    style={styles.topLeftButton}
                    onPress={() => router.push({ pathname: '/todolist/process', params: { jwt, usr } })}>
                    <Text style={styles.addFriendText}>Go Back</Text>
                </Pressable>

                <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                    {friends.length > 0 ? (
                        friends.map((friend, index) => (
                            <Pressable
                                key={index}
                                style={styles.friendButton}
                                onPress={() => router.push({
                                    pathname: '/todolist/friendsConversation',
                                    params: { jwt, usr, usrReciever: friend }
                                })}>
                                <Text style={styles.friendText}>{friend}</Text>
                            </Pressable>
                        ))) :
                        (<Text style={styles.noFriendsText}>No friends found.</Text>)}
                </ScrollView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    addFriendButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'crimson',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        zIndex: 1,
    },
    addFriendText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    topLeftButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        zIndex: 1,
    },
    friendButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10,
        minWidth: 200,
        alignItems: 'center',
    },
    friendText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    noFriendsText: {
        color: 'red',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
    scrollContainer: {
        flex: 1,
        marginTop: 150,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingBottom: 50,
    },
});