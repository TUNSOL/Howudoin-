import React, { useEffect, useState } from 'react';
import {View, StyleSheet, ImageBackground, Text, Pressable, Alert, TextInput} from 'react-native';
import { useRouter } from 'expo-router';
import { useSearchParams } from "expo-router/build/hooks";
import {param} from "ts-interface-checker";
import { useFocusEffect } from '@react-navigation/native';
import {API_URL} from "../../config";
// Nihat Ömer Karaca 30626
// Tuna Solakoğlu 32121

export default function FriendsAdd() {
    const router = useRouter();
    const jwt = useSearchParams().get('jwt');
    const usr = useSearchParams().get('usr');

    const [friendspending, setFriendsPending] = useState([]);
    // Function to fetch pending friends
    const fetchPendingFriends = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
        };

        const url = `${API_URL}/friends/pending/${usr}`;
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                console.error("Response status:", response.status);
                throw new Error(`Failed to fetch pending friends: ${response.status}`);
            }
            const data = await response.json();
            setFriendsPending(data); // Update pending friends state
        }
        catch (error) {
            console.error("Error fetching pending friends:", error);
        }
    };

    // Function to add a friend
    const addFriend = async ({ friendId }: { friendId: string }) => {
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify({
                user1: { id: usr },
                user2: { id: friendId },
            }),
        };
        const url = `${API_URL}/friends/add`;
        try {
            const response = await fetch(url, requestOptions);
            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                console.error("Response status:", response.status);
                throw new Error(`Failed to add friend: ${response.status}`);
            }

            // Handle JSON response
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                // Update the list to remove the added friend
                // just to ensure if the api doesn't works for some reason
                // it still get deleted
                setFriendsPending((prev) => prev.filter((friend) => friend !== friendId));
                Alert.alert("Success", data.message || `Friend request sent to ${friendId} successfully!`);
            }
            // Handle plain text response
            else {
                const text = await response.text();
                console.log("Friend added successfully (Text):", text);

                // Update the list to remove the added friend
                setFriendsPending((prev) => prev.filter((friend) => friend !== friendId));
                Alert.alert("Success", text || `Friend request sent to ${friendId} successfully!`);
            }
        }
        catch (error) {
            console.error("Error adding friend:", error);
            Alert.alert("Error", "Failed to add friend. Please try again.");
        }
        setAddFriendText("");
    };
    const acceptFriend = async ({ friendId }: { friendId: any }) => {
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`, // Authorization header with Bearer token
            },
            body: JSON.stringify({
                user1: { id: usr },
                user2: { id: friendId },
            }),
        };

        const url = `${API_URL}/friends/accept`;
        try {
            const response = await fetch(url, requestOptions);
            const contentType = response.headers.get("content-type");
            console.log("Content-Type:", contentType);

            if (!response.ok) {
                console.error("Response status:", response.status);
                throw new Error(`Failed to accept friend: ${response.status}`);
            }
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                console.log("Friend accepted successfully (JSON):", data);
                setFriendsPending((prev) => prev.filter((friend) => friend !== friendId));
                Alert.alert("Success", data.message || `Friend request from ${friendId} accepted successfully!`);
            }
            else {
                const text = await response.text();
                console.log("Friend accepted successfully (Text):", text);

                // Update the list to remove the accepted friend
                setFriendsPending((prev) => prev.filter((friend) => friend !== friendId));
                Alert.alert("Success", text || `Friend request from ${friendId} accepted successfully!`);
            }
        } catch (error) {
            console.error("Error accepting friend:", error);
            Alert.alert("Error", "Failed to accept friend. Please try again.");
        }
    };

    // We used focus effect to fetch pending friends every 5 seconds
    // The page won't be reloaded when the user navigates back to another page, otherwise we
    // had the all pages reloaded even if we were not there
    useFocusEffect(
        React.useCallback(() => {
            fetchPendingFriends(); // Fetch immediately on focus
            const interval = setInterval(() => {
                fetchPendingFriends(); // Fetch every 5 seconds
            }, 5000);

            return () => clearInterval(interval); // Cleanup interval when the page loses focus
        }, [jwt, usr])
    );

    const [addFriendText, setAddFriendText] = useState('');
    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: '/Users/nihatomerkaraca/Desktop/CS310/FrontEnd/HowudoinFrontEnd/assets/images/matrix.png' }}
                style={styles.background}
                imageStyle={{ resizeMode: 'stretch' }}>

                {/* Go Back Button */}
                <Pressable style={styles.topLeftButton} onPress={() => router.push({pathname:'/todolist/friendsMainPage', params: { jwt: jwt, usr: usr }})}>
                    <Text style={styles.buttonContainer}>Go Back</Text>
                </Pressable>


                {/* Pending Friends List */}
                <View style={styles.friendsListContainer}>
                    <View style={styles.inputContainer}>
                    <TextInput style={styles.input}
                               placeholder="Enter friend's username"
                               onChangeText={(text) => setAddFriendText(text)}
                               autoCapitalize={'none'}
                               placeholderTextColor={'green'}/>

                    </View>

                    <Pressable style={styles.sendingbutton} onPress={() => addFriend({ friendId: addFriendText })}>
                        <Text style={styles.buttonContainer}>Add Friend</Text>
                    </Pressable>


                    {/* If there are pending friends we display them using this map
                    and that friend is clickable so that the user can accept the friend request
                    when the user accepts it that clickable button will be gone
                    */}
                    {friendspending.length > 0 ? (
                        friendspending.map((friend, index) => (
                            <View key={index} style={styles.buttonContainer}>
                                <Pressable
                                    style={styles.friendButton}
                                    onPress={() => acceptFriend({ friendId: friend })}>
                                    <Text style={styles.friendText}>{friend}</Text>
                                </Pressable>
                            </View>))) :
                        (<Text style={styles.noFriendsText}>No pending friends.</Text>)}
                </View>
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
    friendsListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    buttonContainer: {
        marginVertical: 10,
        alignItems: 'center',
        width: '100%',
    },
    friendButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
    },
    friendText: {
        color: 'black',
        fontSize: 18,
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
    },
    noFriendsText: {
        color: 'red',
        fontSize: 16,
        marginTop: 20,
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
        bottom: 50,
        width: '80%',
        left :20,

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
    }
});