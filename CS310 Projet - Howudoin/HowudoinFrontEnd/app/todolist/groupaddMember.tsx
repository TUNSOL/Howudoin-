import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSearchParams } from "expo-router/build/hooks";
import {useFocusEffect} from "@react-navigation/native";
import {API_URL} from "../../config";
// Nihat Ömer Karaca 30626
// Tuna Solakoğlu 32121
export default function CreateGroupPage() {
    const router = useRouter();
    const jwt = useSearchParams().get('jwt');
    const usr = useSearchParams().get('usr');
    const groupId = useSearchParams().get('groupId');
    const members = useSearchParams().get('members')?.split(',') || [];
    // taking members from previosr page

    const [friends, setFriends] = useState([]); // Available friends

    // Fetch available friends
    const fetchAvailableFriends = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
        };

        const url = `${API_URL}/friends/${usr}`;
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                console.error("Response status:", response.status);
                throw new Error(`Failed to fetch available friends: ${response.status}`);
            }
            const data = await response.json();

            const availableFriends = data.filter((friend) => !members.includes(friend));
            setFriends(availableFriends);
        } catch (error) {
            console.error("Error fetching available friends:", error);
        }
    };

    // Add friend to the group
    const addMember = async (friend) => {
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify({ id: friend }),
        };

        const url = `${API_URL}/${groupId}/add-member`;
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`Failed to add member: ${response.status}`);
            }
            Alert.alert("Success", `${friend} has been added to the group.`);
            setFriends((prevFriends) => prevFriends.filter((f) => f !== friend)); // Remove added friend from available list
        } catch (error) {
            console.error("Error adding member:", error);
            Alert.alert("Error", "Failed to add member. Please try again.");
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchAvailableFriends();
            const interval = setInterval(() => {
                fetchAvailableFriends();
            }, 10000);

            return () => {
                clearInterval(interval);
                setFriends([]);
            }
        }, [jwt, groupId])
    );
    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: '/Users/nihatomerkaraca/Desktop/CS310/FrontEnd/HowudoinFrontEnd/assets/images/matrix.png' }}
                style={styles.background}
                imageStyle={{ resizeMode: 'stretch' }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>Add Friend to Group</Text>

                    {/* Available Friends */}
                    <Text style={styles.subtitle}>Available Friends:</Text>
                    {friends.length > 0 ? (
                        friends.map((friend, index) => (
                            <Pressable
                                key={index}
                                style={styles.friendButton}
                                onPress={() => addMember(friend)}
                            >
                                <Text style={styles.friendButtonText}>{friend}</Text>
                            </Pressable>
                        ))
                    ) : (
                        <Text style={styles.noMembersText}>No available friends</Text>
                    )}
                </ScrollView>
            </ImageBackground>
            <Pressable style={styles.topLeftButton} onPress={() => router.push({ pathname: '/todolist/groupsMainPage', params: { jwt: jwt, usr: usr } })}>
                <Text style={styles.buttonText}>Go Back</Text>
            </Pressable>
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
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    topLeftButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 55,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
        marginVertical: 20,
    },
    friendButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 5,
        width: '75%',
        alignItems: 'center',
    },
    friendButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noMembersText: {
        fontSize: 16,
        color: 'red',
        marginVertical: 10,
    },
});