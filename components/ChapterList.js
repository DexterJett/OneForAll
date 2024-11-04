import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Animated } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccessToken } from '../services/mangaDexApi';

const HEADER_HEIGHT = 300;

const ChapterList = ({ mangaId, onSelectChapter, setSelectedManga }) => {
  const [chapters, setChapters] = useState([]);
  const [coverUrl, setCoverUrl] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en'); // Standardsprache Englisch
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('@language');
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    };
    fetchLanguage();
  }, []);

  useEffect(() => {
    const fetchAllChapters = async () => {
      let allChapters = [];
      let offset = 0;
      const limit = 500;
      let hasMore = true;
      let loadedChapterIds = new Set();

      try {
        const token = await getAccessToken();

        while (hasMore) {
          const response = await axios.get(`https://api.mangadex.org/manga/${mangaId}/feed`, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: {
              limit,
              offset,
              translatedLanguage: [language],
              order: {
                chapter: 'asc'
              }
            }
          });

          const chapters = response.data.data;
          const newChapters = chapters.filter(chapter => !loadedChapterIds.has(chapter.id));
          newChapters.forEach(chapter => loadedChapterIds.add(chapter.id));

          allChapters = [...allChapters, ...newChapters];
          hasMore = chapters.length === limit;
          offset += limit;
        }

        setChapters(allChapters);
        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Laden der Kapitel:', error.response ? error.response.data : error.message);
        setLoading(false);
      }
    };

    const fetchCover = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get(`https://api.mangadex.org/manga/${mangaId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const coverArtId = response.data.data.relationships.find(rel => rel.type === 'cover_art').id;
        const coverArtResponse = await axios.get(`https://api.mangadex.org/cover/${coverArtId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const coverFileName = coverArtResponse.data.data.attributes.fileName;
        const coverBaseUrl = 'https://uploads.mangadex.org/covers/';
        setCoverUrl(`${coverBaseUrl}${mangaId}/${coverFileName}`);
      } catch (error) {
        console.error('Fehler beim Laden des Covers:', error.response ? error.response.data : error.message);
      }
    };

    fetchAllChapters();
    fetchCover();
  }, [mangaId, language]);

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;

  const renderChapter = ({ item: chapter }) => {
    const chapterNumber = chapter.attributes.chapter;
    return (
      <TouchableOpacity onPress={() => onSelectChapter(chapter.id)}>
        <View style={styles.chapterContainer}>
          <Text style={styles.chapterTitle}>{`Chapter ${chapterNumber}: ${chapter.attributes.title || ''}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedManga(null)} style={styles.button}>
          <Text style={styles.buttonText}>Zurück</Text>
        </TouchableOpacity>
      </View>
      <Animated.FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        renderItem={renderChapter}
        contentContainerStyle={{ paddingBottom: 150, paddingTop: HEADER_HEIGHT + 60 }} // Fügt Padding am unteren Rand hinzu und Platz für das Coverbild
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      />
      <Animated.View style={[styles.coverContainer, {
        transform: [{
          translateY: scrollY.interpolate({
            inputRange: [0, HEADER_HEIGHT],
            outputRange: [0, -HEADER_HEIGHT],
            extrapolate: 'clamp'
          })
        }]
      }]}>
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} style={styles.coverImage} resizeMode="contain" />
        ) : (
          <Text style={styles.loadingText}>Lade Cover...</Text>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
    backgroundColor: '#121212',
    padding: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#ff4500',
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  coverContainer: {
    position: 'absolute',
    top: 50, // Adjust to leave space for the header
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: '#121212',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  chapterContainer: {
    padding: 10,
    backgroundColor: '#333333',
    borderRadius: 5,
    marginBottom: 10,
  },
  chapterTitle: {
    color: '#ffffff',
    fontSize: 16,
  },
  loadingText: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ChapterList;
