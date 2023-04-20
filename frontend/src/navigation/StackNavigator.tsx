import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import AddGameScreen from '../screens/AddGameScreen';
import GameDetailsScreen from '../screens/GameDetailsScreen';
import GameNewsScreen from '../screens/GameNewsScreen';
import HomeScreen from '../screens/HomeScreen';
import type { IGDBGame } from '../types/igdb';

export type HomeStackParamList = {
    Home: undefined;
    GameDetails: { game: IGDBGame };
    GameNews: { gameName: string };
};

export type AddGameStackParamList = {
    AddGame: undefined;
    GameDetails: { game: IGDBGame };
    GameNews: { gameName: string };
};

const HomeStack = createStackNavigator<HomeStackParamList>();

export const HomeStackNavigator = () => (
    <HomeStack.Navigator
        initialRouteName={'Home'}
        screenOptions={{
            headerShown: false, // Add this line to hide the header
        }}
    >
        <HomeStack.Screen component={HomeScreen} name="Home" />
        <HomeStack.Screen
            component={GameDetailsScreen}
            name="GameDetails"
            options={{ headerShown: true }}
        />
        <HomeStack.Screen
            component={GameNewsScreen}
            name="GameNews"
            options={({ route }) => ({ title: `${route.params.gameName} News`, headerShown: true })}
        />
    </HomeStack.Navigator>
);

const AddGameStack = createStackNavigator<AddGameStackParamList>();

export const AddGameStackNavigator = () => (
    <AddGameStack.Navigator
        initialRouteName={'AddGame'}
        screenOptions={{
            headerShown: false, // Add this line to hide the header
        }}
    >
        <AddGameStack.Screen component={AddGameScreen} name="AddGame" />
        <AddGameStack.Screen
            component={GameDetailsScreen}
            name="GameDetails"
            options={{ headerShown: true }}
        />
        <AddGameStack.Screen
            component={GameNewsScreen}
            name="GameNews"
            options={({ route }) => ({ title: `${route.params.gameName} News`, headerShown: true })}
        />
    </AddGameStack.Navigator>
);
