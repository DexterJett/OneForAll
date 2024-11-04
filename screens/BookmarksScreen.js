import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { getBookmarks, deleteBookmark, updateBookmarkNotes } from '../services/bookmarkService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const BookmarksScreen = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const navigation = useNavigation();

  const fetchBookmarks = useCallback(async () => {
    const savedBookmarks = await getBookmarks();
    const bookmarksArray = Object.entries(savedBookmarks).map(([mangaId, data]) => ({
      mangaId,
      ...data
    }));
    setBookmarks(bookmarksArray);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, [fetchBookmarks])
  );

  const handleDeleteBookmark = async (mangaId) => {
    const success = await deleteBookmark(mangaId);
    if (success) {
      fetchBookmarks();
    } else {
      Alert.alert('Fehler', 'Das Lesezeichen konnte nicht gelöscht werden.');
    }
  };

  const handleUpdateNotes = async (mangaId, notes) => {
    const success = await updateBookmarkNotes(mangaId, notes);
    if (success) {
      fetchBookmarks();
    } else {
      Alert.alert('Fehler', 'Die Notizen konnten nicht aktualisiert werden.');
    }
  };

  const handleOpenBookmark = (bookmark) => {
    navigation.navigate('ChapterReading', {
      screen: 'ChapterImages',
      params: {
        mangaId: bookmark.mangaId,
        chapterId: bookmark.chapterId,
        chapterNumber: bookmark.chapterNumber,
        coverUrl: bookmark.coverUrl,
        initialPage: bookmark.page, // Hinzufügen der initialen Seite
      },
    });
  };

  const renderBookmark = ({ item }) => {
    return (
      <View style={styles.bookmarkContainer}>
        {item.coverUrl ? (
          <Image source={{ uri: item.coverUrl }} style={styles.coverImage} />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text style={styles.coverPlaceholderText}>No Cover</Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <TouchableOpacity onPress={() => handleOpenBookmark(item)}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.chapterText}>{`Kapitel: ${item.chapterNumber}, Seite: ${item.page + 1}`}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.notesInput}
            placeholder="Notizen hinzufügen..."
            value={item.notes}
            onChangeText={(text) => handleUpdateNotes(item.mangaId, text)}
          />
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              'Lesezeichen löschen',
              'Möchten Sie dieses Lesezeichen wirklich löschen?',
              [
                { text: 'Abbrechen', style: 'cancel' },
                {
                  text: 'Löschen',
                  style: 'destructive',
                  onPress: () => handleDeleteBookmark(item.mangaId),
                },
              ]
            );
          }}
        >
          <Text style={styles.deleteButtonText}>Löschen</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.mangaId}
        renderItem={renderBookmark}
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
  bookmarkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  coverImage: {
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
  textContainer: {
    flex: 1,
  },
  titleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chapterText: {
    color: '#cccccc',
    fontSize: 14,
  },
  notesInput: {
    color: '#ffffff',
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: '#ff4500',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#ffffff',
  },
});

export default BookmarksScreen;
