import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert, Pressable } from 'react-native';
import { Link } from "expo-router";
import { API_URL } from "../config";
// Nihat Ömer Karaca 30626
// Tuna Solakoğlu 32121
export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    function submit() {
        function afterResponse({ result }: { result: any }) {
            Alert.alert(result);
        }
        const requestOptions = {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: username,
                password: password,
                name: name,
                surname: surname
            }),
        };
        fetch(`${API_URL}/register`, requestOptions)
            .then((response) => response.text())
            .then((result) => afterResponse({ result: result }))
            .catch((error) => console.error(error));
    }

    return (
        <View style={styles.container}>
            {/* Background Photo */}
            <ImageBackground
                source={{ uri: '/Users/nihatomerkaraca/Desktop/CS310/FrontEnd/HowudoinFrontEnd/assets/images/morpheus.png' }}
                style={styles.background}
                imageStyle={styles.image}
            >
                {/* Title at the Top */}
                <Text style={styles.title}>WELCOME TO REGISTRATION PROCESS</Text>

                {/* Register Button */}
                <Pressable style={styles.registerButton} onPress={() => {
                    submit();
                    setUsername("");
                    setPassword("");
                    setName("");
                    setSurname("");
                }}>
                    <Text style={styles.buttonText}>Register</Text>
                </Pressable>

                {/* Navigation to Main Page */}
                <Link href={"/"} style={styles.loginButton}>
                    <Text style={styles.buttonText}>Main Page</Text>
                </Link>
            </ImageBackground>

            {/* Input Fields at the Bottom */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setName(text)}
                    placeholder="Name"
                    placeholderTextColor="green"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setSurname(text)}
                    placeholder="Surname"
                    placeholderTextColor="green"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setUsername(text)}
                    placeholder="Username"
                    placeholderTextColor="green"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setPassword(text)}
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
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'green',
        marginTop: 100,
        textAlign: 'center',
        fontFamily: 'monospace',
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
    loginButton: {
        position: 'absolute',
        top: 500,
        left: 50,
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
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