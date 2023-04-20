import type { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { FlatList, Image, ScrollView, View } from 'react-native';
import { Button, Input, ListItem } from 'react-native-elements';

import { getGameSearchResults } from '../api';
import type { AddGameStackParamList } from '../navigation/StackNavigator';
import type { IGDBGame, IGDBGameList } from '../types/igdb';

type AddGameScreenProps = StackScreenProps<AddGameStackParamList, 'AddGame'>;

const AddGameScreen: React.FC<AddGameScreenProps> = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<IGDBGameList>([]);

    const searchGames = async () => {
        try {
            const gameList = await getGameSearchResults(search);

            if (!gameList) {
                return;
            }

            setSearchResults(
                gameList.map(game => ({
                    label: `${game.name} (${game.platforms?.map(p => p.name).join(', ')})`,
                    value: game.id,
                    ...game,
                })),
            );
        } catch (error) {
            console.error(error);
        }
    };

    const renderItem = ({ item }: { item: IGDBGame }) => (
        <ListItem bottomDivider onPress={() => navigation.navigate('GameDetails', { game: item })}>
            {item.cover && (
                <ListItem.Content>
                    <Image
                        resizeMode="cover"
                        source={{ uri: `https:${item.cover.url}` }}
                        style={{ width: 50, height: 50 }}
                    />
                </ListItem.Content>
            )}
            <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.platforms?.map(p => p.name).join(', ')}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    );

    return (
        <ScrollView>
            <View>
                <Input
                    label="Search Games"
                    onChangeText={text => setSearch(text)}
                    onSubmitEditing={searchGames}
                    value={search}
                />
                <Button disabled={!search} onPress={searchGames} title="Search" />
                {searchResults.length > 0 && (
                    <FlatList
                        data={searchResults}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderItem}
                    />
                )}
            </View>
        </ScrollView>
    );
};

export default AddGameScreen;
