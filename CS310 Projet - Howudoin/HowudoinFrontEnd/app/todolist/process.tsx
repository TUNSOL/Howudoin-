import React from 'react';
import { View, StyleSheet, ImageBackground, Text, Pressable } from 'react-native';
import { useSearchParams } from 'expo-router/build/hooks';
import {Link} from "expo-router";
// Nihat Ömer Karaca 30626
// Tuna Solakoğlu 32121
export default function LoginPage() {
    const usr = useSearchParams().get('usr') || "Guest";
    const jwt = useSearchParams().get('jwt') || "";

    return (
        <View style={styles.container}>

            <ImageBackground
                source={{ uri: '/Users/nihatomerkaraca/Desktop/CS310/FrontEnd/HowudoinFrontEnd/assets/images/matrix.png' }}
                style={styles.background}
                imageStyle={{ resizeMode: 'stretch' }}>

                {/*
                    Friends main page
                    It will go to the friends main page, and its process
                    Now it has been commented out because they are added to tab screen but this is another way to do it
                    */}
                <View style={styles.textBox}>
                    <Text style={styles.textBoxText}>{`User: ${usr}`}</Text>
                </View>

                {/*
                <View style={styles.buttonContainer}>
                    <Link href={{pathname: "/todolist/friendsMainPage", params: { usr: usr, jwt: jwt }}}
                          style={styles.button}><Text style={styles.buttonText}>Friends Main Page</Text></Link>


                    {
                    Groups main page
                    It will go to the groups main page, and its process

                    <Link href={{pathname:"/todolist/groupsMainPage",params:{usr:usr,jwt:jwt}}} style={styles.button}>
                        <Text style={styles.buttonText}>Groups Main Page</Text></Link></View>*/}
                <View style={styles.textBoxExp}>
                    <Text style={styles.textBoxexplaining}>Hello welcome to our matrix</Text>
                    <Text style={styles.textBoxexplaining}>Current available functionalities are;</Text>
                    <Text style={styles.textBoxexplaining}>Friends Main Page : Add Friend, Chat, Accept Friend Request.</Text>
                    <Text style={styles.textBoxexplaining}>Groups Main Page : Create Group, Add Member, Chat in Group, Details.</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    textBox: {
        position: 'absolute',
        top: 60,
        right: 15,
        backgroundColor: 'black',
        borderColor: 'green',
        borderWidth: 2,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        minWidth: 120,
    },
    textBoxExp: {
        position: 'absolute',
        backgroundColor: 'black',
        borderColor: 'green',
        borderWidth: 2,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        minWidth: 120,
    },
    textBoxText: {
        color: 'green',
        fontSize: 12,
        fontFamily: 'monospace',
        textAlign: 'center',
    },
    textBoxexplaining: {
        color: 'powderblue',
        fontSize: 20,
        fontFamily: 'times new roman',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    button: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 20,
        minWidth: 150,
        alignItems: 'center',
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },

});