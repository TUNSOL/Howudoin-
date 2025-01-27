import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, Pressable, Alert, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSearchParams } from "expo-router/build/hooks";
import {useFocusEffect} from "@react-navigation/native";
import {API_URL} from "@/config";
// Nihat Ömer Karaca 30626
// Tuna Solakoğlu 32121
export default function MessageConversation() {
    const router = useRouter();
    const jwt = useSearchParams().get('jwt');
    const usr = useSearchParams().get('usr');
    const usrReciever = useSearchParams().get('usrReciever');

    const [messages, setMessages] = useState([]); //  to store messages
    const [messageText, setMessageText] = useState(''); // to store the new message text

    // Function to fetch messages
    const fetchMessages = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
        };
        const url = `${API_URL}/messages/${usr}/${usrReciever}`;
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                console.error("Response status:", response.status);
                throw new Error(`Failed to get messages: ${response.status}`);
            }
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error("Error getting messages:", error);
        }
    };

    // Function to send a message
    const messageSend = async ({ message }: { message: any }) => {
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify({
                message: message,
                senderUserName: usr,
                receiverUserName: usrReciever,
            }),
        };

        const url = `${API_URL}/messages/send`;
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                console.error("Response status:", response.status);
                throw new Error(`Failed to send message: ${response.status}`);
            }

            fetchMessages();
            setMessageText('');
        } catch (error) {
            console.error("Error messaging friend:", error);
            Alert.alert("Error", "Failed to send message. Please try again.");
        }
    };

// Used focus effect so when we are not in the page the api calls won't be made but when we are in the page it will be called every 5 seconds can be changed
    useFocusEffect(
        React.useCallback(() => {
            fetchMessages();

            const interval = setInterval(() => {
                fetchMessages();
            }, 1000);
            // to check constantly is there a message or not

            return () => {
                clearInterval(interval);
                setMessages([]);
            }
        }, [jwt, usrReciever])
    );
    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: '/Users/nihatomerkaraca/Desktop/CS310/FrontEnd/HowudoinFrontEnd/assets/images/matrix.png' }}
                style={styles.background}
                imageStyle={{ resizeMode: 'stretch' }}>

                <Pressable
                    style={styles.topLeftButton}
                    onPress={() => router.push({ pathname: '/todolist/friendsMainPage', params: { jwt: jwt, usr: usr } })}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </Pressable>

                {/* Scrollable Messages List */}
                <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.messageBubble,
                                    message.receiverUserName === usr
                                        ? styles.messageRight // Receiver's message
                                        : styles.messageLeft, // Sender's message
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
                        onChangeText={setMessageText}
                        value={messageText}
                        placeholder="Enter your message"
                        placeholderTextColor="green"
                        autoCapitalize="none"
                    />
                    <Pressable style={styles.sendingButton} onPress={() => messageSend({ message: messageText })}>
                        <Text style={styles.buttonText}>Send</Text>
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
    scrollContainer: {
        flex: 1,
        marginTop: 100,
        marginBottom : 100,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    messagesContainer: {
        flex: 1,
        marginTop: 100,
        paddingHorizontal: 20,
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
    sendingButton: {
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
});