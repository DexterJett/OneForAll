import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { getAccessToken } from '../services/mangaDexApi';

const PopularScreen = ({ navigation }) => {
  const [popularNewMangas, setPopularNewMangas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularNewMangas = async () => {
      try {
        const token = await getAccessToken();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const formattedDate = thirtyDaysAgo.toISOString().split('.')[0]; // ISO-Format ohne Millisekunden

        const response = await axios.get('https://api.mangadex.org/manga', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            'includes[]': 'cover_art',
            'order[followedCount]': 'desc',
            'createdAtSince': formattedDate,
            'limit': 10
          }
        });
        
        setPopularNewMangas(response.data.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
        setIsLoading(false);
      }
    };

    fetchPopularNewMangas();
  }, []);

  const handleSelectManga = (manga) => {
    navigation.navigate('SearchScreen', { selectedManga: manga });
  };

  const renderItem = ({ item }) => {
    const coverFileName = item.relationships.find(rel => rel.type === 'cover_art')?.attributes?.fileName;
    const coverUrl = coverFileName ? `https://uploads.mangadex.org/covers/${item.id}/${coverFileName}` : null;

    return (
      <TouchableOpacity onPress={() => handleSelectManga(item)}>
        <View style={styles.itemContainer}>
          {coverUrl ? (
            <Image source={{ uri: coverUrl }} style={styles.cover} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Text style={styles.coverPlaceholderText}>No Cover</Text>
            </View>
          )}
          <Text style={styles.title}>{item.attributes.title.en || item.attributes.title.jp || "No Title"}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ff4500" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Fehler beim Laden der beliebten neuen Manga: {error.detail || error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={popularNewMangas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  listContainer: {
    paddingBottom: 150,
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
  coverPlaceholder: {
    width: 50,
    height: 75,
    marginRight: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholderText: {
    color: '#fff',
    fontSize: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4500',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default PopularScreen;
