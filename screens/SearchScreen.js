import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import ChapterList from '../components/ChapterList'; // Sicherstellen, dass ChapterList importiert ist
import { getAccessToken } from '../services/mangaDexApi';

function SearchScreen({ route, navigation }) {
  const [mangas, setMangas] = useState([]);
  const [selectedManga, setSelectedManga] = useState(route.params?.selectedManga || null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (searchText.length > 2) {
      handleSearch();
    } else if (!selectedManga) {
      fetchLatestUpdates();
    }
  }, [searchText]);

  const fetchLatestUpdates = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessToken();
      const response = await axios.get('https://api.mangadex.org/manga?includes[]=cover_art', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMangas(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Manga-Liste:', error);
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessToken();
      const response = await axios.get(`https://api.mangadex.org/manga?title=${encodeURIComponent(searchText)}&includes[]=cover_art`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMangas(response.data.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Fehler beim Suchen von Manga:', error);
      setIsLoading(false);
    }
  };

  const handleSearchInput = (text) => {
    setSearchText(text);
  };

  const handleSelectManga = (manga) => {
    setSelectedManga(manga);
    setSelectedChapter(null);
  };

  const handleSelectChapter = (chapterId) => {
    navigation.navigate('ChapterReading', { screen: 'ChapterImages', params: { chapterId } });
  };

  const renderItem = ({ item }) => {
    const coverFileName = item.relationships.find(rel => rel.type === 'cover_art')?.attributes?.fileName;
    const coverUrl = coverFileName ? `https://uploads.mangadex.org/covers/${item.id}/${coverFileName}` : null;

    return (
      <TouchableOpacity onPress={() => handleSelectManga(item)}>
        <View style={styles.itemContainer}>
          {coverUrl && <Image source={{ uri: coverUrl }} style={styles.cover} />}
          <Text style={styles.title}>{item.attributes.title.en}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {!selectedManga && (
        <TextInput
          style={styles.input}
          placeholder="Gib den Titel des Manga ein"
          value={searchText}
          onChangeText={handleSearchInput}
        />
      )}
      <View style={styles.mangaListContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#ff4500" />
        ) : selectedManga ? (
          <ChapterList mangaId={selectedManga.id} onSelectChapter={handleSelectChapter} setSelectedManga={setSelectedManga} />
        ) : (
          <FlatList
            data={mangas}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  mangaListContainer: {
    flex: 1,
    width: '100%',
  },
  listContainer: {
    paddingBottom: 150, // Fügt Padding am unteren Rand hinzu
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  cover: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default SearchScreen;
