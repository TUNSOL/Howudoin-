import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSearchParams } from "expo-router/build/hooks";
import {useFocusEffect} from "@react-navigation/native";
import {API_URL} from "../../config";
// Nihat Ömer Karaca 30626
// Tuna Solakoğlu 32121
export default function groupConversation() {
    const router = useRouter();
    const jwt = useSearchParams().get('jwt');
    const usr = useSearchParams().get('usr');
    const groupId = useSearchParams().get('groupId');
    const groupName = useSearchParams().get('groupName');

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const fetchMessages = async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
        };

        const url = `${API_URL}/${groupId}/messages`;
        try {
            const response = await fetch(url, requestOptions);
            const contentType = response.headers.get('Content-Type');
            if (!response.ok) {
                throw new Error(`Failed to fetch messages: ${response.status}`);
            }

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                setMessages(data);
            } else {
                const text = await response.text();
                console.error("Unexpected response format:", text);
                Alert.alert("Error", "Failed to fetch messages. Please check the server.");
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            Alert.alert("Error", "Failed to fetch messages. Please try again.");
        }
    };

    // Send a new message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            Alert.alert('Warning', 'Message cannot be empty.');
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify({
                message: newMessage,
                senderUserName: usr,
                recieverUserName: groupId,
            }),
        };

        const url = `${API_URL}/${groupId}/send`;
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error('Failed to send message.');
            }
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'Failed to send message. Please try again.');
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchMessages();
            const interval = setInterval(() => {
                fetchMessages();
            }, 1000);

            return () => {
                clearInterval(interval);
                setMessages([]);
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
                {/* Go Back Button */}
                <Pressable
                    style={styles.topLeftButton}
                    onPress={() => router.push({ pathname: '/todolist/groupsMainPage', params: { jwt, usr } })}
                >
                    <Text style={styles.buttonText}>Go Back</Text>
                </Pressable>

                {/* Group Name Header */}
                <Text style={styles.groupTitle}>{groupName}</Text>

                {/* Messages List */}
                <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                    {messages.length > 0 ? (
                            messages.map((message, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.messageBubble,
                                        message.senderUserName === usr
                                            ? styles.messageLeft
                                            : styles.messageRight,
                                    ]}
                                >
                                    <Text style={styles.messageText}>{message.message}</Text>
                                    <Text style={styles.messageSender}>{message.senderUserName}</Text>
                                </View>))) :
                        (<Text style={styles.noMessagesText}></Text>)}
                </ScrollView>

                {/* Input Field and Send Button */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setNewMessage}
                        value={newMessage}
                        placeholder="Enter your message"
                        placeholderTextColor="green"
                        autoCapitalize="none"/>
                    <Pressable style={styles.sendButton} onPress={handleSendMessage}>
                        <Text style={styles.buttonText}>Send</Text>
                    </Pressable>
                    <Pressable style={styles.toprightbutton} onPress={() => router.push({ pathname: '/todolist/details', params: { jwt: jwt, usr: usr, groupId:groupId, groupName :groupName } })}>
                        <Text style={styles.buttonText}>Details</Text>
                    </Pressable>
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
    groupTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginTop: 80,
        marginBottom: 20,
    },
    scrollContainer: {
        flex: 1,
        marginTop: 10,
        marginBottom : 100,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    messageBubble: {
        maxWidth: '70%',
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    messageLeft: {
        alignSelf: 'flex-start',
        backgroundColor: 'lightblue',
    },
    messageRight: {
        alignSelf: 'flex-end',
        backgroundColor: 'lightgreen',
    },
    messageText: {
        color: 'black',
        fontSize: 16,
    },
    messageSender: {
        color: 'gray',
        fontSize: 12,
        marginTop: 5,
    },
    noMessagesText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 50,
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 5,
        color: 'green',
        fontFamily: 'monospace',
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    toprightbutton: {
        position: 'absolute',
        bottom: 650,
        right: 20,
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        zIndex: 1,
    },
});