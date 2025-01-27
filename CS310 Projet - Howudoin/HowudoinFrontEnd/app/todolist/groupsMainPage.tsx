import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSearchParams } from "expo-router/build/hooks";
import {useFocusEffect} from "@react-navigation/native";
import {API_URL} from "../../config";
// Nihat Ömer Karaca 30626
// Tuna Solakoğlu 32121
export default function GroupMainPage() {
    const router = useRouter();
    const jwt = useSearchParams().get('jwt'); // JWT token from query params
    const usr = useSearchParams().get('usr'); // Username from query params
    const [groups, setGroups] = useState([]); // State to store groups as { id, name }

    // Function to fetch group IDs
    const fetchGroupIds = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`, // Authorization header with Bearer token
            },
        };
        const url = `${API_URL}/groups/${usr}`;

        try {
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                console.error("[FETCH_GROUP_IDS] Error response:", response);
                throw new Error(`Failed to fetch group IDs: ${response.status}`);
            }

            const ids = await response.json(); // IDs returned as an array of integers

            // Fetch group names for each ID
            fetchGroupNames(ids);
        } catch (error) {
            console.error("[FETCH_GROUP_IDS] Error:", error);
        }
    };

    // Function to fetch group names by ID
    const fetchGroupNames = async (ids) => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`, // Authorization header with Bearer token
            },
        };

        try {
            const groupsWithNames = await Promise.all(
                ids.map(async (id) => {
                    const url = `${API_URL}/${id}`;
                    const response = await fetch(url, requestOptions);

                    if (!response.ok) {
                        console.error(`[FETCH_GROUP_NAMES] Failed to fetch name for group ID ${id}. Status: ${response.status}`);
                        return { id, name: `Unknown (ID: ${id})` }; //Fallback if name fetch fails.
                    }

                    const name = await response.text();
                    return { id, name };
                })
            );

            setGroups(groupsWithNames);
        } catch (error) {
            console.error("[FETCH_GROUP_NAMES] Error:", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchGroupIds(); // Fetch immediately when page is in focus
            const interval = setInterval(() => {
                fetchGroupIds(); //Refreshes every 5 seconds.
            }, 3000);

            return () => clearInterval(interval); //Clear the interval when page loses focus
        }, [jwt, usr])
    );
    //Fetch group IDs on component mount.


    return (
        <View style={styles.container}>
            {/* Background Photo */}
            <ImageBackground
                source={{ uri: '/Users/nihatomerkaraca/Desktop/CS310/FrontEnd/HowudoinFrontEnd/assets/images/matrix.png' }}
                style={styles.background}
                imageStyle={{ resizeMode: 'stretch' }}
            >
                {/* Add Group Button - (Top-Right). The button will navigate us to a page where the user will see their friends and enter a name for the group.*/}
                <Pressable
                    style={styles.addGroupButton}
                    onPress={() => router.push({ pathname: "/todolist/createGroup", params: { jwt: jwt, usr: usr } })}
                >
                    <Text style={styles.addGroupText}>+</Text>
                </Pressable>

                <Pressable style={styles.topLeftButton} onPress={() => router.push({ pathname: '/todolist/process', params: { jwt: jwt, usr: usr } })}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </Pressable>

                {/* Groups List */}
                {/* We planned the group main page to have a layout such that the groups will immediately be shown as pressable buttons. When pressed, we'll access to the group's respective chat page.*/}
                {/* The groups are listed in a scrollable menu which is ordered by their creation time (The earliest group in first, for instance.) */}
                <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                    {groups.length > 0 ? (
                            groups.map((group) => (
                                <Pressable
                                    key={group.id}
                                    style={styles.groupButton}
                                    onPress={() => router.push({
                                        pathname: '/todolist/groupConversation',
                                        params: { jwt: jwt, usr: usr, groupId: group.id, groupName: group.name }
                                    })}
                                >
                                    <Text style={styles.groupText}>{group.name}</Text>
                                </Pressable>
                            ))) :
                        (<Text style={styles.noGroupsText}></Text>)
                    }
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
    addGroupButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'crimson',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 50,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addGroupText: {
        color: 'white',
        fontSize: 24,
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
    groupButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10,
        minWidth: 200,
        alignItems: 'center',
    },
    groupText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noGroupsText: {
        color: 'red',
        fontSize: 16,
        marginTop: 20,
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