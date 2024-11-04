import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARKS_KEY = '@bookmarks';

export const saveBookmark = async (mangaId, chapterId, chapterNumber, page, coverUrl, title) => {
  try {
    const existingBookmarks = await getBookmarks();
    existingBookmarks[mangaId] = { 
      chapterId, 
      chapterNumber, 
      page,
      coverUrl, 
      title,
      dateAdded: new Date().toISOString(),
      notes: ''
    };
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(existingBookmarks));
    return true;
  } catch (error) {
    console.error('Fehler beim Speichern des Lesezeichens:', error);
    return false;
  }
};

export const getBookmarks = async () => {
  try {
    const bookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return bookmarks ? JSON.parse(bookmarks) : {};
  } catch (error) {
    console.error('Fehler beim Laden der Lesezeichen:', error);
    return {};
  }
};

export const deleteBookmark = async (mangaId) => {
  try {
    const existingBookmarks = await getBookmarks();
    delete existingBookmarks[mangaId];
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(existingBookmarks));
    return true;
  } catch (error) {
    console.error('Fehler beim Löschen des Lesezeichens:', error);
    return false;
  }
};

export const updateBookmarkNotes = async (mangaId, notes) => {
  try {
    const existingBookmarks = await getBookmarks();
    if (existingBookmarks[mangaId]) {
      existingBookmarks[mangaId].notes = notes;
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(existingBookmarks));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Notizen:', error);
    return false;
  }
};
