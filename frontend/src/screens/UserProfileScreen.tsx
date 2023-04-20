// src/screens/UserProfileScreen.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const UserProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Profile</Text>
            {/* Add your user profile content here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default UserProfileScreen;
