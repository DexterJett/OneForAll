import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ScrollView, Image, View, ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import { getAccessToken } from '../services/mangaDexApi';
import { saveBookmark } from '../services/bookmarkService';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ChapterImages = ({ route }) => {
  const { mangaId, chapterId, chapterNumber, coverUrl } = route.params;
  const [images, setImages] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [hash, setHash] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const [mode, setMode] = useState('scroll');
  const [swipeDirection, setSwipeDirection] = useState('horizontal');
  const [imageHeights, setImageHeights] = useState({});
  const [currentPage, setCurrentPage] = useState(0); // Aktuelle Seite
  const navigation = useNavigation();

  useEffect(() => {
    const fetchChapterImages = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setBaseUrl(response.data.baseUrl);
        setHash(response.data.chapter.hash);
        setImages(response.data.chapter.data);
        setLoading(false);
        setLoadingImages(true);
        await saveBookmark(mangaId, chapterId, chapterNumber, 0, coverUrl); // Setze Lesezeichen auf Seite 0
      } catch (error) {
        console.error('Fehler beim Laden der Kapitelbilder:', error.response ? error.response.data : error.message);
        setLoading(false);
      }
    };
    fetchChapterImages();
  }, [chapterId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu>
          <MenuTrigger style={styles.menuTrigger}>
            <Ionicons name="menu" size={24} color="red" />
          </MenuTrigger>
          <MenuOptions customStyles={optionsStyles}>
            <MenuOption onSelect={() => setMode('scroll')}>
              <Text style={styles.menuOptionText}>Scroll Mode↕️</Text>
            </MenuOption>
            <MenuOption onSelect={() => setMode('swipe')}>
              <Text style={styles.menuOptionText}>Swipe Mode↔️</Text>
            </MenuOption>
            {mode === 'swipe' && (
              <>
                <MenuOption onSelect={() => setSwipeDirection('horizontal')}>
                  <Text style={styles.menuOptionText}>Swipe Right to Left⬅️</Text>
                </MenuOption>
                <MenuOption onSelect={() => setSwipeDirection('reverse-horizontal')}>
                  <Text style={styles.menuOptionText}>Swipe Left to Right➡️</Text>
                </MenuOption>
              </>
            )}
            <MenuOption onSelect={() => saveBookmark(mangaId, chapterId, chapterNumber, currentPage, coverUrl)}>
              <Text style={styles.menuOptionText}>Lesezeichen setzen📑</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      ),
    });
  }, [navigation, mode, swipeDirection, currentPage]);

  const onImageLoad = (index, width, height) => {
    const aspectRatio = width / height;
    const newHeight = Dimensions.get('window').width / aspectRatio;
    setImageHeights((prevHeights) => ({
      ...prevHeights,
      [index]: newHeight,
    }));

    if (Object.keys(imageHeights).length + 1 === images.length) {
      setLoadingImages(false);
    }
  };

  const renderImage = (img, index) => {
    const imageUrl = `${baseUrl}/data/${hash}/${img}`;
    return (
      <View key={index} style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { height: imageHeights[index] || width }]}
          resizeMode="contain"
          onLoad={({ nativeEvent }) => {
            const { width: imgWidth, height: imgHeight } = nativeEvent.source;
            onImageLoad(index, imgWidth, imgHeight);
          }}
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loadingImages && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}
      {mode === 'scroll' ? (
        <ScrollView 
          contentContainerStyle={styles.scrollView}
          onScroll={(e) => setCurrentPage(Math.floor(e.nativeEvent.contentOffset.y / height))}
          scrollEventThrottle={16}
        >
          {images.map((img, index) => renderImage(img, index))}
        </ScrollView>
      ) : (
        <Swiper
          style={styles.wrapper}
          showsPagination={false}
          loop={false}
          index={swipeDirection === 'reverse-horizontal' ? images.length - 1 : 0}
          horizontal={true}
          onIndexChanged={(index) => setCurrentPage(index)}
        >
          {(swipeDirection === 'reverse-horizontal' ? images.slice().reverse() : images).map((img, index) => (
            <View key={index} style={styles.swipeImageContainer}>
              <Image
                source={{ uri: `${baseUrl}/data/${hash}/${img}` }}
                style={[styles.swipeImage, { height: imageHeights[index] || width }]}
                resizeMode="contain"
                onLoad={({ nativeEvent }) => {
                  const { width: imgWidth, height: imgHeight } = nativeEvent.source;
                  onImageLoad(index, imgWidth, imgHeight);
                }}
              />
            </View>
          ))}
        </Swiper>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTrigger: {
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  menuTriggerText: {
    color: '#fff',
    fontSize: 18,
  },
  menuOptionText: {
    padding: 10,
    fontSize: 16,
    color: 'red',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  switchButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#555',
    borderRadius: 5,
  },
  switchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  scrollView: {
    alignItems: 'center',
  },
  wrapper: {},
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
  },
  swipeImage: {
    width: width,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

const optionsStyles = {
  optionsContainer: {
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 5,
    borderColor: 'blue',
    borderWidth: 1,
    marginTop: 40,
  },
  optionWrapper: {
    padding: 5,
  },
  optionText: {
    color: 'red',
  },
};

export default ChapterImages;
