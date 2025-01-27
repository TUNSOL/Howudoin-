
import {useEffect, useState} from "react";
import {Pressable, StyleSheet, Text, View, Alert, Button, ImageBackground} from "react-native";
import {Link, router} from "expo-router";
// Nihat Ömer Karaca 30626
// Tuna Solakoğlu 32121
export default function Done() {
        useEffect(() => {
                router.push('/');
        }, []);
        return (
            <View style={styles.container}>
                    <ImageBackground
                        source={{uri: '/Users/nihatomerkaraca/Desktop/CS310/FrontEnd/HowudoinFrontEnd/assets/images/matrix.png'}}
                        style={styles.background}
                        imageStyle={{resizeMode: 'stretch'}}>
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
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
            },
        });
