import React, { useState, useEffect, useRef } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import ArtworkItem from "../../components/artWork"
import { useFonts, OpenSans_400Regular_Italic } from '@expo-google-fonts/open-sans';
import { Pressable, useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
}

interface ArtworkApi {
  id: string;
  title: string;
  image_id: string;
}

const baseUrl = 'https://api.artic.edu/api/v1/artworks';
const itemsPerPage = 15;

const renderItem = ({ item }: { item: Artwork }) => {
  return <ArtworkItem item={item} />;
};

const generateUniqueId = (item: Artwork, index: number) => {
  return item.id + '-' + index;
};

export default function App() {
  const flatListRef = useRef<FlatList<Artwork>>(null);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ? colorScheme : 'light'];
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(y > 10); // Show button when scrolled more than 200px
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    setShowScrollToTop(false);
  };

  const styles = StyleSheet.create({
    listContainer: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      padding: 20,
      backgroundColor: themeColors.background,
    },
    scrollToTopButton: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      backgroundColor: themeColors.background, 
      borderRadius: 25,
      padding: 10,
      elevation: 3, 
      shadowOpacity: 0.3,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
    },
  });

  let [fontsLoaded] = useFonts({ OpenSans_400Regular_Italic })
  const fallbackImage = require('../../assets/images/photo.png');

  const [data, setData] = useState<Artwork[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    if (isLoading) return;

    setIsLoading(true);
    fetch(`${baseUrl}?limit=${itemsPerPage}&page=${page}`)
      .then((response) => response.json())
      .then((responseJson) => {
        const newArtworks = responseJson.data.map((artwork: ArtworkApi) => {
          return {
            id: `${artwork.id}`,
            title: artwork.title,
            imageUrl: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/200,/0/default.jpg`
          };
        });

        setData([...data, ...newArtworks]);
        setIsEndReached(newArtworks.length < itemsPerPage);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const loadMoreItems = () => {
    if (!isEndReached) {
      setPage(page + 1);
      fetchImages();
    }
  };

  return (
    <>

      <FlatList
        data={data}
        renderItem={renderItem}
        ref={flatListRef}
        keyExtractor={generateUniqueId}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading ? <ActivityIndicator size="large" /> : null}
        contentContainerStyle={styles.listContainer}
        onScroll={handleScroll}
      />
      {showScrollToTop && (
        <TouchableOpacity
          onPress={scrollToTop}
          style={styles.scrollToTopButton}
        >
          <FontAwesome name="arrow-up" size={24} color="black" />
        </TouchableOpacity>
      )}
    </>
  );
}

