import { Picker } from '@react-native-picker/picker';
import type { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Image, ListItem } from 'react-native-elements';
import { useSelector } from 'react-redux';

import collapsedIcon from '../assets/arrow-down.png';
import expandedIcon from '../assets/arrow-up.png';
import type { HomeStackParamList } from '../navigation/StackNavigator';
import type { RootState } from '../reducers';
import type { PSGame } from '../types/app';
import { loadExpandedCategories, saveExpandedCategories } from '../utils/localStorage';

type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const games = useSelector((state: RootState) => state.gameStash.games);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    const [filterPlatform, setFilterPlatform] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [sortOption, setSortOption] = useState('name');
    const [filtersCollapsed, setFiltersCollapsed] = useState(true);

    function filterAndSortGames(games: PSGame[]) {
        let filteredGames = games;

        if (filterPlatform) {
            filteredGames = filteredGames.filter(game => game.platform === filterPlatform);
        }

        if (filterCategory) {
            filteredGames = filteredGames.filter(game => game.category === filterCategory);
        }

        switch (sortOption) {
            case 'name':
                return filteredGames.sort((a, b) => a.name.localeCompare(b.name));
            // case 'releaseDate':
            //     return filteredGames.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
            // Add more sorting options here
            default:
                return filteredGames;
        }
    }

    const groupGamesByCategory = (games: PSGame[]) => {
        if (!games) {
            return;
        }
        const groupedGames: { [key: string]: PSGame[] } = {};

        const filteredGames = filterAndSortGames(games);

        filteredGames.forEach(game => {
            if (!groupedGames[game.category]) {
                groupedGames[game.category] = [];
            }
            groupedGames[game.category].push(game);
        });

        return Object.keys(groupedGames).map(category => ({
            title: category,
            data: groupedGames[category],
        }));
    };

    useEffect(() => {
        loadExpandedCategories().then(loadedExpandedCategories => {
            setExpandedCategories(loadedExpandedCategories);
        });
    }, []);

    useEffect(() => {
        void fetchGames();
    }, []);

    const toggleCategory = (category: string) => {
        let updatedExpandedCategories;

        if (expandedCategories.includes(category)) {
            updatedExpandedCategories = expandedCategories.filter(cat => cat !== category);
        } else {
            updatedExpandedCategories = [...expandedCategories, category];
        }

        setExpandedCategories(updatedExpandedCategories);
        void saveExpandedCategories(updatedExpandedCategories);
    };

    const fetchGames = async () => {
        try {
            // const response = await axios.get('https://your-api-url.com/games');
            // setGames(response.data);
        } catch (error) {
            // console.error(error);
        }
    };

    const renderItem = ({ item }: { item: PSGame }, category: string) => {
        if (!expandedCategories.includes(category)) return null;

        return (
            <ListItem
                bottomDivider
                onPress={() => navigation.navigate('GameDetails', { game: item })}
            >
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
                    <ListItem.Subtitle>
                        {item.platform ? `Platform: ${item.platform}` : 'Platform not selected'}
                    </ListItem.Subtitle>
                    <Text style={{ fontStyle: 'italic', marginTop: 5 }}>{item.category}</Text>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        );
    };

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => {
        const isExpanded = expandedCategories.includes(title);
        const stateIcon = isExpanded ? expandedIcon : collapsedIcon;

        return (
            <TouchableOpacity onPress={() => toggleCategory(title)} style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{title}</Text>
                <Image source={stateIcon} style={styles.stateIcon} />
            </TouchableOpacity>
        );
    };

    const sections = groupGamesByCategory(games);

    return (
        <View>
            <TouchableOpacity
                onPress={() => setFiltersCollapsed(!filtersCollapsed)}
                style={styles.categoryHeader}
            >
                <Text style={{ fontWeight: 'bold' }}>Filter and Sort</Text>
                <Image
                    source={filtersCollapsed ? collapsedIcon : expandedIcon}
                    style={styles.stateIcon}
                />
            </TouchableOpacity>
            <Collapsible collapsed={filtersCollapsed}>
                <Text>Filter by Platform:</Text>
                <Picker
                    onValueChange={value => setFilterPlatform(value)}
                    selectedValue={filterPlatform}
                >
                    <Picker.Item label="All" value="" />
                    <Picker.Item label="PC" value="pc" />
                    <Picker.Item label="PlayStation" value="playstation" />
                    <Picker.Item label="Xbox" value="xbox" />
                </Picker>

                <Text>Filter by Category:</Text>
                <Picker
                    onValueChange={value => setFilterCategory(value)}
                    selectedValue={filterCategory}
                >
                    <Picker.Item label="All" value="" />
                    <Picker.Item label="To Play" value="toPlay" />
                    <Picker.Item label="In Progress" value="inProgress" />
                    <Picker.Item label="Finished" value="finished" />
                </Picker>

                <Text>Sort by:</Text>
                <Picker onValueChange={value => setSortOption(value)} selectedValue={sortOption}>
                    <Picker.Item label="Name" value="name" />
                    <Picker.Item label="Release Date" value="releaseDate" />
                </Picker>
            </Collapsible>
            <SectionList
                keyExtractor={item => item.id.toString()}
                renderItem={data => renderItem(data, data.item.category)}
                renderSectionHeader={renderSectionHeader}
                sections={sections ?? []}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    gameImage: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stateIcon: {
        width: 20,
        height: 20,
    },
});

export default HomeScreen;
