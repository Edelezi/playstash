import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Provider } from 'react-redux';

import { AddGameStackNavigator, HomeStackNavigator } from './src/navigation/StackNavigator';
import UserProfileScreen from './src/screens/UserProfileScreen';
import initializeStore, { getStore } from './src/store';

const Tab = createBottomTabNavigator();

export default function App() {
    const [storeReady, setStoreReady] = React.useState(false);

    React.useEffect(() => {
        const initStore = async () => {
            await initializeStore();
            setStoreReady(true);
        };

        void initStore();
    }, []);

    if (!storeReady) {
        return <ActivityIndicator size="large" />; // Or any loading indicator you prefer
    }

    return (
        <Provider store={getStore()}>
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen
                        component={HomeStackNavigator}
                        name="Home"
                        options={({ navigation }) => ({
                            headerRight: () => (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Add Game')}
                                    style={{ marginRight: 10 }}
                                >
                                    <Text>Add a Game</Text>
                                </TouchableOpacity>
                            ),
                        })}
                    />
                    <Tab.Screen component={AddGameStackNavigator} name="Add Game" />
                    <Tab.Screen
                        component={UserProfileScreen}
                        name="UserProfile"
                        options={{ tabBarLabel: 'Profile' }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
