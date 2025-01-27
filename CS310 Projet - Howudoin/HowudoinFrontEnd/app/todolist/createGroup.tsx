import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSearchParams } from "expo-router/build/hooks";
import { useFocusEffect } from "@react-navigation/native";
import {API_URL} from "@/config";

// Nihat Ömer Karaca 30626
// Tuna Solakoğlu 32121
export default function CreateGroupPage() {
    const router = useRouter();
    const jwt = useSearchParams().get('jwt');
    const usr = useSearchParams().get('usr');
    const [groupName, setGroupName] = useState('');
    const [friends, setFriends] = useState([]); // Available friends
    const [selectedFriends, setSelectedFriends] = useState([]); // Selected friends

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
            setFriends(data);
        } catch (error) {
            console.error("Error fetching available friends:", error);
        }
    };

    // These two for the use of friend selection list on the screen
    // If the user has selected a friend, it will be removed from the available friends list and added to the selected friends list
    const handleFriendSelect = (friend) => {
        setFriends((prevFriends) => prevFriends.filter((f) => f !== friend));
        setSelectedFriends((prevSelected) => [...prevSelected, friend]);
    };
    const handleFriendDeselect = (friend) => {
        setSelectedFriends((prevSelected) => prevSelected.filter((f) => f !== friend));
        setFriends((prevFriends) => [...prevFriends, friend]);
    };

    const groupCreate = async ({ groupName }: { groupName: any }) => {
        const requestOptions = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify({
                groupName: groupName,
                groupAdmin: usr,
                groupMembers: [...selectedFriends],
                messages: [],
            }),
        };

        const url = `${API_URL}/create`;

        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                console.error("Response status:", response.status);
                throw new Error(`Failed to create group: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                Alert.alert("Success", data.message || `Group created with name ${groupName} successfully!`);
            } else {
                const text = await response.text();
                Alert.alert("Success", text || `Group created with name ${groupName} successfully!`);
            }
        } catch (error) {
            console.error("Error creating group:", error);
            Alert.alert("Error", "Failed to create group. Please try again.");
        }
    };

    // Fetch friends every 5 seconds only when the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            fetchAvailableFriends(); // Fetch immediately when the screen is focused

            const interval = setInterval(() => {
                fetchAvailableFriends();
            }, 30000);

            return () => clearInterval(interval); // Clear interval when the screen is unfocused
        }, [jwt, usr])
    );

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: '/Users/nihatomerkaraca/Desktop/CS310/FrontEnd/HowudoinFrontEnd/assets/images/matrix.png' }}
                style={styles.background}
                imageStyle={{ resizeMode: 'stretch' }}
            >
                <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.title}>Create a New Group</Text>

                    {/* Available Friends */}
                    <Text style={styles.subtitle}>Available Friends:</Text>
                    {friends.length > 0 ? (
                        friends.map((friend, index) => (
                            <Pressable
                                key={index}
                                style={styles.friendButton}
                                onPress={() => handleFriendSelect(friend)}
                            >
                                <Text style={styles.friendButtonText}>{friend}</Text>
                            </Pressable>
                        ))) :
                        (<Text style={styles.noMembersText}>No available friends</Text>
                    )}

                    {/* Selected Friends */}
                    <Text style={styles.subtitle}>Selected Friends:</Text>
                    {selectedFriends.length > 0 ? (
                        selectedFriends.map((friend, index) => (
                            <Pressable
                                key={index}
                                style={[styles.friendButton, styles.selectedFriendButton]}
                                onPress={() => handleFriendDeselect(friend)}
                            >
                                <Text style={styles.friendButtonText}>{friend}</Text>
                            </Pressable>
                        ))) :
                        (<Text style={styles.noMembersText}>No friends selected</Text>
                    )}
                </ScrollView>
            </ImageBackground>

            <Pressable
                style={styles.sendingbutton}
                onPress={() => {
                    groupCreate({ groupName });
                    setSelectedFriends([]);
                    setFriends([]);
                    setGroupName('');
                    router.push({ pathname: "/todolist/groupsMainPage", params: { jwt: jwt, usr: usr } });
                }}
            >
                <Text style={styles.buttonText}>Create</Text>
            </Pressable>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Group's name"
                    onChangeText={(text) => setGroupName(text)}
                    autoCapitalize={'none'}
                    placeholderTextColor={'green'}
                />
            </View>

            <Pressable
                style={styles.topLeftButton}
                onPress={() => router.push({ pathname: '/todolist/groupsMainPage', params: { jwt: jwt, usr: usr } })}
            >
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
        paddingBottom: 100,
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
        marginLeft: 20,
        marginBottom: 20,
        marginTop: 70,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
        marginVertical: 10,
        marginBottom: 10,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
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
    selectedFriendButton: {
        backgroundColor: 'green',
    },
    sendingbutton: {
        position: 'absolute',
        bottom: 50,
        right: 20,
        backgroundColor: 'green',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginHorizontal: 5,
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
    input: {
        width: '80%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 5,
        color: 'green',
        fontFamily: 'monospace',
    },
    inputContainer: {
        position: 'absolute',
        bottom: 40,
        marginTop: 20,
        width: '80%',
        left: 20,
    },
});