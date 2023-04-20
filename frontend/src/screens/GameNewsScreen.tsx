import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import { fetchGameNews } from '../api/news'; // Import the fetchGameNews function

function GameNewsScreen({ route }: { route: any }) {
    const { gameName } = route.params;
    const [news, setNews] = useState([]);

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
}

export default GameNewsScreen;
