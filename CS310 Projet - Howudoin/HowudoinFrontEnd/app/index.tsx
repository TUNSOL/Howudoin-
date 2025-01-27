import React, {useState} from 'react';
import { View, TextInput, StyleSheet, ImageBackground, Text, Alert, Pressable,} from 'react-native';
import {Link} from "expo-router";
import { LogBox } from 'react-native';
// Nihat Ömer Karaca 30626
// Tuna Solakoğlu 32121
export default function LoginPage() {

    return (
        <View style={styles.container}>
            {/* Background Photo */}
            <ImageBackground
                source={{ uri: '/Users/nihatomerkaraca/Desktop/CS310/FrontEnd/HowudoinFrontEnd/assets/images/morpheus.png' }}
                style={styles.background}
                imageStyle={styles.image}
            >
                {/* Title at the Top */}
                <Text style={styles.title}>HOWUDOIN</Text>
                <Text style={[styles.title, { fontSize: 24 }, {marginTop: 50}]}>WELCOME TO MATRIX</Text>
            </ImageBackground>

            {/* Login Button */}
            <Link href={"./register"} style={styles.registerButton}>
                <Text style={styles.buttonText}>Register</Text>
            </Link>

            {/* Register Button */}
            <Link href={"./login"} style={styles.loginButton}>
                <Text style={styles.buttonText}>Login</Text>
            </Link>
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
    loginButton: {
        position: 'absolute',
        top: 500,
        left: 50,
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
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
});