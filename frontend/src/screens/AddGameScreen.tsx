import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, ScrollView, View } from 'react-native';
import { Button, Input, ListItem } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { PSGame } from '../types/app';
import { IGDBGame, IGDBGameList } from '../types/igdb';
import { Image } from 'react-native';

const clientId = 'qqlv6juxtdx29n2x1w1lh5bxs0h6pv';
const appSecret = '2cclv68wevphfbo1aiovcw56ie5msh';

const AddGameScreen = ({ navigation }) => {
    const isWeb = Platform.OS === 'web';

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<IGDBGameList>([]);
    const [selectedGame, setSelectedGame] = useState<IGDBGame | null>(null);
    const [token, setToken] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (!search) {
            setSearchResults([]);
            setSelectedGame(null);
        }
    }, [search]);

    useEffect(() => {
        axios.post(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${appSecret}&grant_type=client_credentials`)
            .then((response) => {
                setToken(response.data.access_token);
            });
    }, []);

    const searchGames = async () => {
        try {
            let gameList: IGDBGameList;
            if (isWeb) {
                const response = await axios.post<IGDBGameList>(
                    'http://localhost:3001/api/games',
                    `search "${search}"; fields name,platforms.name,cover.url; limit 10;`,
                    {
                        headers: {
                            'x-access-token': token,
                        },
                    },
                ).catch((error) => {
                    console.log(error);
                });
                if (!response) {
                    return;
                }
                gameList = response.data;
            } else {
                const response = await axios.post<IGDBGameList>(
                    'https://api.igdb.com/v4/games',
                    `search "${search}"; fields name,platforms.name,cover.url; limit 10;`,
                    {
                        headers: {
                            'Client-ID': 'qqlv6juxtdx29n2x1w1lh5bxs0h6pv', // Replace with your actual Client ID
                            'Authorization': `Bearer ${token}`, // Replace with your actual access token
                        },
                    },
                );
                if (!response) {
                    return;
                }
                gameList = response.data;
            }
            
            console.log('response', gameList);
            
            setSearchResults(
                gameList.map((game) => ({
                    label: `${game.name} (${game.platforms?.map((p) => p.name).join(', ')})`,
                    value: game.id,
                    ...game,
                })),
            );
        } catch (error) {
            console.error(error);
        }
    };

    const renderItem = ({ item }: { item: PSGame }) => (
        <ListItem
            onPress={() => navigation.navigate('GameDetails', { game: item })}
            bottomDivider
        >
            {item.cover && (
                <ListItem.Content>
                    <Image
                        source={{ uri: `https:${item.cover.url}` }}
                        style={{ width: 50, height: 50 }}
                        resizeMode="cover"
                    />
                </ListItem.Content>
            )}
            <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>
                    {item.platforms?.map((p) => p.name).join(', ')}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron/>
        </ListItem>
    );

    return (
        <ScrollView>
            <View>
                <Input
                    label="Search Games"
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                    onSubmitEditing={searchGames}
                />
                <Button title="Search" onPress={searchGames} disabled={!search}/>
                {searchResults.length > 0 && (
                    <FlatList
                        data={searchResults}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                )}
            </View>
        </ScrollView>
    );
};

export default AddGameScreen;