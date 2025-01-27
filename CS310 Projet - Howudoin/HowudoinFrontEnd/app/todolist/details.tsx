import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useSearchParams } from "expo-router/build/hooks";
import {useFocusEffect} from "@react-navigation/native";
import {API_URL} from "@/config";
// Nihat Ömer Karaca 30626
// Tuna Solakoğlu 32121
export default function GroupDetailsPage() {
    const router = useRouter();
    const jwt = useSearchParams().get('jwt');
    const groupId = useSearchParams().get('groupId');
    const groupName = useSearchParams().get('groupName');
    const usr = useSearchParams().get('usr');

    const [creationTime, setCreationTime] = useState('');
    const [memo, setMemo] = useState([]);
    const [time, setTime] = useState('');

    const groupTime = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
        };

        const url = `${API_URL}/group/` + groupId +`/time`;

        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                console.error("Response status:", response.status);
                throw new Error(`Failed to send message: ${response.status}`);
            }
            const time =await response.text();
            setTime(time);
            // Fetch updated messages from the server after sending
        } catch (error) {
            console.error("Error getting the time:", error);
            Alert.alert("Error", "Failed to get the time. Please try again.");
        }
    };



    const fetchGroupDetails = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
        };

        const url = `${API_URL}/${groupId}/members`;

        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`Failed to fetch group details: ${response.status}`);
            }
            const data = await response.json();
            setMemo(data);
        } catch (error) {
            console.error('Error fetching group details:', error);
            Alert.alert('Error', 'Failed to fetch group details. Please try again later.');
        }
    };


    useFocusEffect(
        React.useCallback(() => {
            fetchGroupDetails();
            groupTime();
            const interval = setInterval(() => {
                fetchGroupDetails();
                groupTime();
                }, 5000);

            return () => {
                clearInterval(interval);
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
                {/* Header Section */}
                <View style={styles.header}>
                    <Pressable
                        style={styles.goBackButton}
                        onPress={() =>
                            router.push({
                                pathname: '/todolist/groupConversation',
                                params: { jwt : jwt, groupId : groupId, groupName :groupName, usr : usr },
                            })
                        }
                    >
                        <Text style={styles.goBackButtonText}>Go Back</Text>
                    </Pressable>
                </View>

                <Text style={styles.title}>{groupName}</Text>
                <Text style={styles.title}>Creation Time: {time}</Text>
                {/* Add Member Button */}
                <Pressable
                    style={styles.addMemberButton}
                    onPress={() =>{
                        console.log("members", memo);
                        router.push({
                            pathname: '/todolist/groupaddMember',
                            params: { jwt :jwt, groupId : groupId, groupName : groupName, usr : usr, members : memo},
                        })
                    }}
                >
                    <Text style={styles.addMemberButtonText}>Add Member</Text>
                </Pressable>

                {/* Members List */}
                <ScrollView contentContainerStyle={[styles.membersContainer, { paddingBottom: 50 }]}>
                    {memo.length > 0 ? (
                    memo.map((member, index) => (
                        <View key={index} style={styles.memberItem}>
                            <Text style={styles.memberText}>{member}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noMembersText}>No members found.</Text>
                )}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    goBackButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginRight: 10,
        marginTop: 50,
    },
    goBackButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    addMemberButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    addMemberButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    membersContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    memberItem: {
        backgroundColor: 'darkblue',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginVertical: 5,
        width: '90%',
        alignItems: 'center',
    },
    memberText: {
        fontSize: 16,
        color: 'white',
    },
    noMembersText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});