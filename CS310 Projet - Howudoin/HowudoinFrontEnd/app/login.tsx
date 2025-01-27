import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { API_URL } from "../config";
// Nihat Ömer Karaca 30626
// Tuna Solakoğlu 32121
export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [jwt, setJwt] = useState("");
    const router = useRouter();

    useEffect(() => {
        setUsername("");
        setPassword("");
    }, []);

    function submit() {
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        };

        fetch(`${API_URL}/login`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Login failed");
                }
                return response.json();
            })
            .then((data) => {
                const tempUsername = username; // Save the current username
                setJwt(data.token);
                setUsername(""); // Clear username input
                setPassword(""); // Clear password input
                router.push({ pathname: "/todolist/process", params: { jwt: data.token, usr: tempUsername } });
            })
            .catch((error) => {
                console.error(error);
                Alert.alert("Login Error", "Invalid username or password.");
            });
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: '/Users/nihatomerkaraca/Desktop/CS310/FrontEnd/HowudoinFrontEnd/assets/images/morpheus.png' }}
                style={styles.background}
                imageStyle={styles.image}
            >
                <Text style={styles.title}>PLEASE LOGIN WITH YOUR CREDENTIALS</Text>

                <Pressable style={styles.loginButton} onPress={() => submit()}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
                <Link href={"/"} style={styles.registerButton}>
                    <Text style={styles.buttonText}>Main Page</Text>
                </Link>
            </ImageBackground>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setUsername(text)}
                    value={username}
                    placeholder="Username"
                    placeholderTextColor="green"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    placeholder="Password"
                    placeholderTextColor="green"
                    secureTextEntry={true}
                    autoCapitalize="none"
                />
            </View>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    image: {
        resizeMode: 'contain',
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    registerButton: {
        position: 'absolute',
        top: 500,
        right: 50,
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'green',
        marginTop: 100,
        textAlign: 'center',
        fontFamily: 'monospace',
    },
    loginButton: {
        position: 'absolute',
        top: 500,
        left: 50,
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputContainer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        alignItems: 'center',
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
});