// styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  text: {
    color: '#ff4500',
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#ff4500',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  mangaListContainer: {
    width: '100%',
  },
  scrollView: {
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  chapterGroupContainer: {
    marginBottom: 20,
  },
  groupHeader: {
    fontSize: 18,
    color: '#ff4500',
    marginVertical: 10,
  },
  chapterContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chapterTitle: {
    color: '#fff',
    fontSize: 16,
  },
  chapterLanguage: {
    color: '#888',
    fontSize: 14,
  },
});
