import { Picker } from '@react-native-picker/picker';
import { StackScreenProps } from '@react-navigation/stack';
import { HowLongToBeatEntry, HowLongToBeatService } from 'howlongtobeat';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button, Image } from 'react-native-elements';
import { fetchGameDetails } from '../api/rawg';
import { AddGameStackParamList, HomeStackParamList } from '../navigation/StackNavigator';
import { useTypedDispatch, useTypedSelector } from '../reducers';
import { addGameThunk, removeGameThunk } from '../reducers/games/thunks';

type GameDetailsScreenProps = StackScreenProps<
    HomeStackParamList | AddGameStackParamList,
    'GameDetails'
>;

const GameDetailsScreen: React.FC<GameDetailsScreenProps> = ({ navigation, route }) => {
    const { game } = route.params;
    const [gameDetails, setGameDetails] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState<'toPlay' | 'inProgress' | 'finished'>(
        'toPlay',
    );
    const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);
    const [howLongToBeatData, setHowLongToBeatData] = useState<HowLongToBeatEntry | null>(null);
    const [categoryPickerModalVisible, setCategoryPickerModalVisible] = useState<boolean>(false);
    const [platformPickerModalVisible, setPlatformPickerModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const wishlist = useTypedSelector(state => state.games.games);
    const inWishlist = wishlist.some(g => g.id === game.id);

    const dispatch = useTypedDispatch();

    const addGameToWishlist = () => {
        if (selectedPlatform) {
            const platformName = game.platforms?.find(
                platform => platform.id === selectedPlatform,
            )?.name;
            dispatch(
                addGameThunk({ ...game, category: selectedCategory, platform: platformName ?? '' }),
            );
            navigation.goBack();
        } else {
            alert('Please select a platform');
        }
    };

    useEffect(() => {
        async function fetchDetails() {
            try {
                const details = await fetchGameDetails(game.name);
                setGameDetails(details);
            } catch (error) {
                console.error('Failed to fetch game details:', error);
            }
        }

        void fetchDetails();
    }, [game]);

    const fetchHowLongToBeatData = async () => {
        setLoading(true);
        const hltbService = new HowLongToBeatService();
        const results = await hltbService.search(game.name);
        setHowLongToBeatData(results[0] || null);
        setLoading(false);
    };

    const removeGameFromWishlist = () => {
        dispatch(removeGameThunk(game.id));
        navigation.goBack();
    };

    useEffect(() => {
        void fetchHowLongToBeatData();
    }, []);

    return (
        <ScrollView>
            <View style={styles.container}>
                {game.cover && (
                    <Image
                        source={{ uri: `https:${game.cover.url}` }}
                        style={styles.coverImage}
                        resizeMode="cover"
                    />
                )}
                <Text style={styles.title}>{game.name}</Text>
                <Text style={styles.subtitle}>
                    Platforms: {game.platforms?.map(p => p.name).join(', ')}
                </Text>
                {gameDetails && (
                    <View>
                        <Text>User Rating: {gameDetails.rating.toFixed(1)}</Text>
                        <Text>Number of Ratings: {gameDetails.ratings_count}</Text>
                    </View>
                )}
                {loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    howLongToBeatData && (
                        <View style={styles.hltbContainer}>
                            <Text style={styles.hltbTitle}>How Long to Beat:</Text>
                            <Text>Main Story: {howLongToBeatData.gameplayMain} hours</Text>
                            <Text>Main + Extras: {howLongToBeatData.gameplayMainExtra} hours</Text>
                            <Text>
                                Completionist: {howLongToBeatData.gameplayCompletionist} hours
                            </Text>
                        </View>
                    )
                )}
                <Button
                    title="View Game News"
                    onPress={() => navigation.navigate('GameNews', { gameName: game.name })}
                />
                <Button
                    title={selectedCategory}
                    onPress={() => setCategoryPickerModalVisible(true)}
                    style={styles.togglePickerButton}
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={categoryPickerModalVisible}
                    onRequestClose={() => setCategoryPickerModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setCategoryPickerModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                            <Picker
                                selectedValue={selectedPlatform}
                                onValueChange={itemValue => setSelectedPlatform(itemValue)}
                                style={
                                    Platform.OS === 'ios' ? styles.iosPicker : styles.androidPicker
                                }
                            >
                                <Picker.Item label="Select Platform" value={null} />
                                {game.platforms?.map(platform => (
                                    <Picker.Item
                                        key={platform.id}
                                        label={platform.name}
                                        value={platform.id}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </Modal>
                <Button
                    title={
                        selectedPlatform
                            ? game.platforms?.find(platform => platform.id === selectedPlatform)
                                  ?.name
                            : 'Select Platform'
                    }
                    onPress={() => setPlatformPickerModalVisible(true)}
                    style={styles.togglePickerButton}
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={platformPickerModalVisible}
                    onRequestClose={() => setPlatformPickerModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setPlatformPickerModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                            <Picker
                                selectedValue={selectedCategory}
                                onValueChange={itemValue => setSelectedCategory(itemValue)}
                                style={
                                    Platform.OS === 'ios' ? styles.iosPicker : styles.androidPicker
                                }
                            >
                                <Picker.Item label="To Play" value="toPlay" />
                                <Picker.Item label="In Progress" value="inProgress" />
                                <Picker.Item label="Finished" value="finished" />
                            </Picker>
                        </View>
                    </View>
                </Modal>
                {inWishlist ? (
                    <Button
                        title="Remove from Wishlist"
                        onPress={removeGameFromWishlist}
                        buttonStyle={{ backgroundColor: 'red' }}
                    />
                ) : (
                    <Button title="Add to Wishlist" onPress={addGameToWishlist} />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
    },
    coverImage: {
        width: '100%',
        height: 300,
        marginBottom: 20,
    },
    pickerContainer: {
        marginBottom: 20,
    },
    iosPicker: {
        height: 200,
        width: '100%',
    },
    androidPicker: {
        height: 50,
        width: '100%',
    },
    hltbContainer: {
        marginBottom: 20,
    },
    hltbTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    togglePickerButton: {
        marginBottom: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '100%',
        backgroundColor: 'white',
        paddingBottom: Platform.OS === 'ios' ? 200 : 50,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default GameDetailsScreen;