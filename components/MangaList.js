import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const MangaList = ({ mangas, onSelectManga }) => {
  const renderItem = ({ item }) => {
    const coverFileName = item.relationships.find(rel => rel.type === 'cover_art')?.attributes?.fileName;
    const coverUrl = coverFileName ? `https://uploads.mangadex.org/covers/${item.id}/${coverFileName}` : null;

    return (
      <TouchableOpacity onPress={() => onSelectManga(item)}>
        <View style={styles.itemContainer}>
          {coverUrl && <Image source={{ uri: coverUrl }} style={styles.cover} />}
          <Text style={styles.title}>{item.attributes.title.en}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={mangas}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
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

export default MangaList;
