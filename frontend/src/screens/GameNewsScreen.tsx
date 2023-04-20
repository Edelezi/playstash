import type { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import { fetchGameNews } from '../api/news';
import type { AddGameStackParamList, HomeStackParamList } from '../navigation/StackNavigator';
import type { NewsArticle } from '../types/news'; // Import the fetchGameNews function

type GameNewsScreenProps = StackScreenProps<HomeStackParamList | AddGameStackParamList, 'GameNews'>;

const GameNewsScreen: React.FC<GameNewsScreenProps> = ({ route }: { route: any }) => {
    const { gameName } = route.params;
    const [news, setNews] = useState<NewsArticle[]>([]);

    useEffect(() => {
        async function fetchNews() {
            try {
                const newsData = await fetchGameNews(gameName);
                setNews(newsData);
            } catch (error) {
                console.error('Failed to fetch game news:', error);
            }
        }

        void fetchNews();
    }, [gameName]);

    return (
        <View>
            <Text>Game News for {gameName}</Text>
            <FlatList
                data={news}
                keyExtractor={item => item.url}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.title}</Text>
                        <Text>{item.description}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default GameNewsScreen;
